from django.urls import reverse
from rest_framework import status


def test_swagger(client):
    url = reverse("schema-swagger-ui")
    r = client.get(url)
    assert r.status_code == status.HTTP_200_OK


def test_swagger_oauth_redirect(client):
    url = reverse("schema-swagger-ui-oauth2-redirect")
    r = client.get(url)
    assert r.status_code == status.HTTP_200_OK
