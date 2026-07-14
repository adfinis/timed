"""Root URL mapping."""

from django.contrib import admin
from django.urls import include, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
)

from timed.schema import TimedSpectacularSwaggerView, swagger_oauth2_redirect

urlpatterns = [
    re_path(r"^admin/", admin.site.urls),
    re_path(
        r"^api/v1/swagger\.(?P<format>json|yaml)$",
        SpectacularAPIView.as_view(),
        name="schema-json",
    ),
    re_path(
        r"^api/v1/swagger$",
        TimedSpectacularSwaggerView.as_view(url="/api/v1/swagger.json"),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^api/v1/swagger/oauth2-redirect\.html$",
        swagger_oauth2_redirect,
        name="schema-swagger-ui-oauth2-redirect",
    ),
    re_path(
        r"^api/v1/redoc$",
        SpectacularRedocView.as_view(url="/api/v1/swagger.json"),
        name="schema-redoc",
    ),
    re_path(r"^api/v1/", include("timed.employment.urls")),
    re_path(r"^api/v1/", include("timed.projects.urls")),
    re_path(r"^api/v1/", include("timed.tracking.urls")),
    re_path(r"^api/v1/", include("timed.reports.urls")),
    re_path(r"^api/v1/", include("timed.subscription.urls")),
    re_path(r"^oidc/", include("mozilla_django_oidc.urls")),
    re_path(r"^prometheus/", include("django_prometheus.urls")),
]
