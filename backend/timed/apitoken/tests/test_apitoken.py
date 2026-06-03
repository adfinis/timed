from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from timed.apitoken.models import APIToken


@pytest.mark.django_db
def test_api_token_list_only_returns_own_tokens(
    auth_client, user_factory, api_token_factory
):
    own = api_token_factory(user=auth_client.user)
    api_token_factory(user=user_factory())

    response = auth_client.get(reverse("api-token-list"))

    assert response.status_code == status.HTTP_200_OK
    data = response.json()["data"]
    assert len(data) == 1
    assert data[0]["id"] == str(own.id)
    # the raw token is never exposed when listing
    assert data[0]["attributes"]["token"] is None


@pytest.mark.django_db
def test_api_token_create_returns_raw_token_once(auth_client):
    data = {"data": {"type": "api-tokens", "attributes": {"name": "ci-pipeline"}}}

    response = auth_client.post(reverse("api-token-list"), data)

    assert response.status_code == status.HTTP_201_CREATED
    attributes = response.json()["data"]["attributes"]
    assert attributes["name"] == "ci-pipeline"
    raw_token = attributes["token"]
    assert raw_token

    token = APIToken.objects.get()
    assert token.user == auth_client.user
    # only the hash is persisted, never the raw token
    assert token.token_hash != raw_token


@pytest.mark.django_db
def test_api_token_create_with_expiry(auth_client):
    expires_at = timezone.now() + timedelta(days=30)
    data = {
        "data": {
            "type": "api-tokens",
            "attributes": {
                "name": "temporary",
                "expires-at": expires_at.isoformat(),
            },
        }
    }

    response = auth_client.post(reverse("api-token-list"), data)

    assert response.status_code == status.HTTP_201_CREATED
    token = APIToken.objects.get()
    assert token.expires_at is not None


@pytest.mark.django_db
def test_api_token_retrieve_own(auth_client, api_token_factory):
    token = api_token_factory(user=auth_client.user)

    response = auth_client.get(reverse("api-token-detail", args=[token.id]))

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_api_token_retrieve_other_user_not_found(
    auth_client, user_factory, api_token_factory
):
    token = api_token_factory(user=user_factory())

    response = auth_client.get(reverse("api-token-detail", args=[token.id]))

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_api_token_delete(auth_client, api_token_factory):
    token = api_token_factory(user=auth_client.user)

    response = auth_client.delete(reverse("api-token-detail", args=[token.id]))

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not APIToken.objects.filter(id=token.id).exists()


@pytest.mark.django_db
def test_api_token_update_not_allowed(auth_client, api_token_factory):
    token = api_token_factory(user=auth_client.user)
    data = {
        "data": {
            "type": "api-tokens",
            "id": str(token.id),
            "attributes": {"name": "renamed"},
        }
    }

    response = auth_client.patch(reverse("api-token-detail", args=[token.id]), data)

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_api_token_list_requires_authentication(client):
    response = client.get(reverse("api-token-list"))

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_token_authenticates_api_request(client, user_factory):
    user = user_factory()
    _token, raw_token = APIToken.objects.create_token(user=user, name="ci")
    client.credentials(HTTP_AUTHORIZATION=f"Token {raw_token}")

    response = client.get(reverse("api-token-list"))

    assert response.status_code == status.HTTP_200_OK
