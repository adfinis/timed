"""Models for the apitoken app."""

from __future__ import annotations

import hashlib
import secrets
from typing import TYPE_CHECKING

from django.conf import settings
from django.db import models
from django.utils import timezone

if TYPE_CHECKING:
    from datetime import datetime

    from django.contrib.auth.models import AbstractBaseUser

# number of random bytes used to generate a raw token
TOKEN_BYTES = 32


def hash_token(raw_token: str) -> str:
    """Return the SHA256 hex digest under which a token is stored."""
    return hashlib.sha256(raw_token.encode()).hexdigest()


class APITokenManager(models.Manager["APIToken"]):
    """Manager providing token creation."""

    def create_token(
        self,
        user: AbstractBaseUser,
        name: str,
        expires_at: datetime | None = None,
    ) -> tuple[APIToken, str]:
        """Create a new token and return the instance and its raw value.

        The raw token is only available here and is never stored; only its
        hash is persisted.
        """
        raw_token = secrets.token_urlsafe(TOKEN_BYTES)
        token = self.create(
            user=user,
            name=name,
            token_hash=hash_token(raw_token),
            expires_at=expires_at,
        )
        return token, raw_token


class APIToken(models.Model):
    """A personal API token used to authenticate against the API.

    Tokens are an alternative to the OIDC bearer flow for non-interactive
    clients (scripts, integrations). Only the hash of a token is stored.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="api_tokens",
    )
    name = models.CharField(max_length=255)
    token_hash = models.CharField(max_length=64, unique=True, editable=False)
    created = models.DateTimeField(default=timezone.now, editable=False)
    last_used_at = models.DateTimeField(null=True, blank=True, editable=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)

    objects = APITokenManager()

    def __str__(self) -> str:
        return f"{self.name} ({self.user})"

    @property
    def is_valid(self) -> bool:
        """Return whether the token may still be used for authentication."""
        expired = self.expires_at is not None and self.expires_at <= timezone.now()
        return not (self.revoked or expired)
