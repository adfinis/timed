"""Gebastel to make the `authorize` button in the swagger work."""

from django.http import HttpResponse
from django.templatetags.static import static
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.settings import spectacular_settings
from drf_spectacular.views import SpectacularSwaggerView

SWAGGER_OAUTH_COOP = (
    "same-origin-allow-popups"  # needed for the `authorize` button to actually work
)


class TimedSpectacularSwaggerView(SpectacularSwaggerView):
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        response.headers["Cross-Origin-Opener-Policy"] = SWAGGER_OAUTH_COOP
        return response


class OIDCAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "mozilla_django_oidc.contrib.drf.OIDCAuthentication"
    name = "OIDC"

    def get_security_requirement(self, auto_schema):  # noqa: ARG002
        return {self.name: ["openid"]}

    def get_security_definition(self, auto_schema):  # noqa: ARG002
        return {
            "type": "oauth2",
            "flows": {
                "authorizationCode": {
                    "authorizationUrl": spectacular_settings.OAUTH2_AUTHORIZATION_URL,
                    "tokenUrl": spectacular_settings.OAUTH2_TOKEN_URL,
                    "scopes": spectacular_settings.OAUTH2_SCOPES,
                }
            },
        }


def swagger_oauth2_redirect(_request):
    response = HttpResponse(
        f"<script src='{static('drf_spectacular_sidecar/swagger-ui-dist/oauth2-redirect.js')}'></script>"
    )
    response.headers["Cross-Origin-Opener-Policy"] = SWAGGER_OAUTH_COOP
    return response
