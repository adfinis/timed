"""Admin configuration for the apitoken app."""

from django.contrib import admin

from timed.apitoken import models


@admin.register(models.APIToken)
class APITokenAdmin(admin.ModelAdmin):
    """Admin for API tokens.

    Tokens can not be created through the admin since the raw value would
    not be retrievable; they can only be inspected and revoked.
    """

    list_display = ("name", "user", "created", "last_used_at", "expires_at", "revoked")
    list_filter = ("revoked",)
    search_fields = ("name", "user__username")
    readonly_fields = ("token_hash", "created", "last_used_at")
