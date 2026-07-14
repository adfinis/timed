"""Root URL mapping."""

from django.contrib import admin
from django.urls import include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Timed API",
        default_version="v1",
        description="API documentation for Timed.",
    ),
    public=True,
    permission_classes=(AllowAny,),
)

urlpatterns = [
    re_path(r"^admin/", admin.site.urls),
    re_path(
        r"^api/v1/swagger\.(?P<format>json|yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^api/v1/swagger$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^api/v1/redoc$",
        schema_view.with_ui("redoc", cache_timeout=0),
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
