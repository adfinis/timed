"""Serializers for the apitoken app."""

from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework_json_api import serializers

from timed.apitoken.models import APIToken

if TYPE_CHECKING:
    from typing import Any, ClassVar


class APITokenSerializer(serializers.ModelSerializer):
    """Serialize API tokens.

    The raw token value is write-once: it is only returned in the response
    to the creation request and never again.
    """

    token = serializers.SerializerMethodField()

    def get_token(self, obj: APIToken) -> str | None:
        """Return the raw token, only available right after creation."""
        return getattr(obj, "_raw_token", None)

    def create(self, validated_data: dict[str, Any]) -> APIToken:
        request = self.context["request"]
        token, raw_token = APIToken.objects.create_token(
            user=request.user,
            name=validated_data["name"],
            expires_at=validated_data.get("expires_at"),
        )
        token._raw_token = raw_token  # noqa: SLF001
        return token

    class Meta:
        model = APIToken
        resource_name = "api-tokens"
        fields: ClassVar = (
            "name",
            "token",
            "created",
            "last_used_at",
            "expires_at",
            "revoked",
        )
        read_only_fields: ClassVar = ("created", "last_used_at", "revoked")
