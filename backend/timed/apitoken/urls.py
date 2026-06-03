"""URL to view mapping for the apitoken app."""

from django.conf import settings
from rest_framework.routers import SimpleRouter

from timed.apitoken import views

r = SimpleRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r"api-tokens", views.APITokenViewSet, "api-token")

urlpatterns = r.urls
