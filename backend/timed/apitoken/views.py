"""Viewsets for the apitoken app."""

from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework.viewsets import ModelViewSet

from timed.apitoken import models, serializers
from timed.permissions import IsOwner

if TYPE_CHECKING:
    from django.db.models import QuerySet


class APITokenViewSet(ModelViewSet):
    """Manage the personal API tokens of the current user.

    Tokens can be listed, created and deleted but not updated. The raw token
    value is only returned once, in the response to its creation.
    """

    serializer_class = serializers.APITokenSerializer
    permission_classes = (IsOwner,)
    http_method_names = ("get", "post", "delete", "head", "options")

    def get_queryset(self) -> QuerySet[models.APIToken]:
        return models.APIToken.objects.filter(user=self.request.user)
