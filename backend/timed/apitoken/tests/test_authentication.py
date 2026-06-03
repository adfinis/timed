from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from timed.apitoken.authentication import APITokenAuthentication
from timed.apitoken.models import APIToken


def auth_request(authorization=None):
    extra = {"HTTP_AUTHORIZATION": authorization} if authorization is not None else {}
    return APIRequestFactory().get("/", **extra)


def test_authenticate_without_header_returns_none():
    assert APITokenAuthentication().authenticate(auth_request()) is None


def test_authenticate_with_other_scheme_returns_none():
    request = auth_request("Bearer some-oidc-token")
    assert APITokenAuthentication().authenticate(request) is None


def test_authenticate_without_credentials():
    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request("Token"))


def test_authenticate_with_spaces():
    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request("Token foo bar"))


def test_authenticate_with_invalid_characters():
    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request("Token \xff"))


def test_authenticate_header():
    assert APITokenAuthentication().authenticate_header(auth_request()) == "Token"


@pytest.mark.django_db
def test_authenticate_unknown_token():
    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request("Token does-not-exist"))


@pytest.mark.django_db
def test_authenticate_valid_token(user_factory):
    user = user_factory()
    token, raw_token = APIToken.objects.create_token(user=user, name="ci")

    authed_user, authed_token = APITokenAuthentication().authenticate(
        auth_request(f"Token {raw_token}")
    )

    assert authed_user == user
    assert authed_token == token
    token.refresh_from_db()
    assert token.last_used_at is not None


@pytest.mark.django_db
def test_authenticate_revoked_token(user_factory):
    user = user_factory()
    token, raw_token = APIToken.objects.create_token(user=user, name="ci")
    token.revoked = True
    token.save()

    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request(f"Token {raw_token}"))


@pytest.mark.django_db
def test_authenticate_expired_token(user_factory):
    user = user_factory()
    _token, raw_token = APIToken.objects.create_token(
        user=user, name="ci", expires_at=timezone.now() - timedelta(days=1)
    )

    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request(f"Token {raw_token}"))


@pytest.mark.django_db
def test_authenticate_inactive_user(user_factory):
    user = user_factory(is_active=False)
    _token, raw_token = APIToken.objects.create_token(user=user, name="ci")

    with pytest.raises(AuthenticationFailed):
        APITokenAuthentication().authenticate(auth_request(f"Token {raw_token}"))
