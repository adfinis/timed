"""Token based authentication for the API."""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, exceptions

from timed.apitoken.models import APIToken, hash_token

if TYPE_CHECKING:
    from rest_framework.request import Request

    from timed.employment.models import User

# a valid ``Authorization`` header consists of the keyword and the token
EXPECTED_TOKEN_PARTS = 2


class APITokenAuthentication(authentication.BaseAuthentication):
    """Authenticate requests via a personal API token.

    Clients pass the token in the ``Authorization`` header using the
    ``Token`` scheme, e.g. ``Authorization: Token <token>``. Requests
    without such a header are left to the other configured authenticators
    (i.e. OIDC). Tokens which are unknown, revoked, expired or belong to an
    inactive user are rejected.
    """

    keyword = "Token"

    def authenticate(self, request: Request) -> tuple[User, APIToken] | None:
        auth = authentication.get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            msg = _("Invalid token header. No credentials provided.")
            raise exceptions.AuthenticationFailed(msg)
        if len(auth) > EXPECTED_TOKEN_PARTS:
            msg = _("Invalid token header. Token string should not contain spaces.")
            raise exceptions.AuthenticationFailed(msg)

        try:
            raw_token = auth[1].decode()
        except UnicodeError as exc:
            msg = _(
                "Invalid token header. "
                "Token string should not contain invalid characters."
            )
            raise exceptions.AuthenticationFailed(msg) from exc

        return self.authenticate_credentials(raw_token)

    def authenticate_credentials(self, raw_token: str) -> tuple[User, APIToken]:
        try:
            token = APIToken.objects.select_related("user").get(
                token_hash=hash_token(raw_token)
            )
        except APIToken.DoesNotExist as exc:
            msg = _("Invalid token.")
            raise exceptions.AuthenticationFailed(msg) from exc

        if not token.is_valid:
            msg = _("Token is expired or revoked.")
            raise exceptions.AuthenticationFailed(msg)

        if not token.user.is_active:
            msg = _("User inactive or deleted.")
            raise exceptions.AuthenticationFailed(msg)

        token.last_used_at = timezone.now()
        token.save(update_fields=["last_used_at"])

        return token.user, token

    def authenticate_header(self, _request: Request) -> str:
        return self.keyword
