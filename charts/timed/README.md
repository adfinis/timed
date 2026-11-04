# timed

![Version: 0.0.0](https://img.shields.io/badge/Version-0.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: latest](https://img.shields.io/badge/AppVersion-latest-informational?style=flat-square)

Chart for Timed application

**Homepage:** <https://github.com/adfinis/timed>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| adfinis | <support@adfinis.com> | <https://adfinis.com> |

## Source Code

* <https://github.com/adfinis/timed>

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| auth.allowLocalLogin | string | `"False"` | Allow local Django login |
| auth.oidc.adminLoginRedirectUrl | string | `"https://example.com/admin/"` | URL of the django-admin, to which the user is redirected after successful admin login |
| auth.oidc.claims.email | string | `"email"` | OIDC email claim name |
| auth.oidc.claims.firstname | string | `"given_name"` | OIDC firstname claim name |
| auth.oidc.claims.lastname | string | `"family_name"` | OIDC lastname claim name |
| auth.oidc.claims.username | string | `"preferred_username"` | OIDC username claim name |
| auth.oidc.client.id | string | `"timed"` | OIDC client id |
| auth.oidc.createUser | string | `"False"` | OIDC create user in timed db if it does not already exist |
| auth.oidc.endPoints.auth | string | `nil` | OIDC /auth endpoint |
| auth.oidc.endPoints.jwks | string | `nil` | OIDC /certs endpoint |
| auth.oidc.endPoints.token | string | `nil` | OIDC /token endpoint |
| auth.oidc.endPoints.userInfo | string | `nil` | OIDC /userinfo endpoint |
| auth.oidc.introspect.client.id | string | `"timed-confidential"` | OIDC introspect client id |
| auth.oidc.introspect.client.secret | string | `""` | OIDC introspect client secret |
| auth.oidc.introspect.enabled | bool | `true` | Enable OIDC introspect |
| auth.oidc.introspect.endpoint | string | `nil` | OIDC introspect endpoint |
| auth.oidc.signAlgorithm | string | `"RS256"` | Algorithm the OIDC provider uses to sign ID tokens |
| auth.oidc.url | string | `"https://example.com/auth/realms/timed/protocol/openid-connect"` | OIDC host |
| auth.oidc.verifySSL | string | `"True"` | OIDC verify SSL |
| backend.cronjobs.budgetCheck | object | `{"command":["manage.py","budget_check"],"schedule":"0 3 * * *"}` | Budget Check |
| backend.cronjobs.notifyChangedEmployments | object | `{"command":["manage.py","notify_changed_employments"],"schedule":"0 2 * * 1"}` | Notify changed employments |
| backend.cronjobs.notifyReviewersFirst | object | `{"command":["manage.py","notify_reviewers_unverified","--offset","5"],"schedule":"0 8 4 * *"}` | Notify reviewers first stage |
| backend.cronjobs.notifyReviewersFirst.command[3] | string | `"5"` | Period will end today minus given offset |
| backend.cronjobs.notifyReviewersSecond | object | `{"command":["manage.py","notify_reviewers_unverified","--offset","12","--message","'Please verify your reports.'"],"schedule":"0 8 11 * *"}` | Notify reviewers second stage |
| backend.cronjobs.notifyReviewersSecond.command[3] | string | `"12"` | Period will end today minus given offset |
| backend.cronjobs.notifyReviewersSecond.command[5] | string | `"'Please verify your reports.'"` | Additional message to send if there are unverified reports |
| backend.cronjobs.notifyReviewersThird | object | `{"command":["manage.py","notify_reviewers_unverified","--offset","19","--message","'Please verify your reports immediately!'"],"schedule":"0 8 18 * *"}` | Notify reviewers third stage |
| backend.cronjobs.notifyReviewersThird.command[3] | string | `"19"` | Period will end today minus given offset |
| backend.cronjobs.notifyReviewersThird.command[5] | string | `"'Please verify your reports immediately!'"` | Additional message to send if there are unverified reports |
| backend.cronjobs.notifySupervisors | object | `{"command":["manage.py","notify_supervisors_shorttime"],"schedule":"0 8 * * 4"}` | Notify supervisors |
| backend.cronjobs.redmineReport | object | `{"command":["manage.py","redmine_report"],"schedule":"0 1 * * 1"}` | Redmine report |
| backend.cronjobs.updateProjectExpanditureFirst | object | `{"command":["manage.py","update_project_expenditure"],"schedule":"0 8 * * 3"}` | Update project expanditure in redmine first time |
| backend.cronjobs.updateProjectExpanditureSecond | object | `{"command":["manage.py","update_project_expenditure"],"schedule":"0 8 * * 0"}` | Update project expanditure in redmine second time |
| backend.existingSecret | string | `nil` | Specify an existing secret that gets used instead of a Helm managed secret based on several values. |
| backend.image.pullPolicy | string | `"IfNotPresent"` | Backend image pull policy |
| backend.image.repository | string | `"ghcr.io/adfinis/timed/backend"` | Backend image name |
| backend.image.tag | string | `nil` | Backend version. |
| backend.jobs.dbmigrate.enable | bool | `true` | Enable the dbmigrate Job. This is configurable because timed can also run this on startup if so preferred. |
| backend.livenessProbe.enabled | bool | `true` | Enable liveness probe on backend |
| backend.livenessProbe.failureThreshold | int | `6` | Number of tries to perform the probe |
| backend.livenessProbe.initialDelaySeconds | int | `60` | Number of seconds after the container has started before liveness probe is initiated |
| backend.livenessProbe.periodSeconds | int | `10` | How often (in seconds) to perform the probe |
| backend.livenessProbe.successThreshold | int | `1` | Minimum consecutive successes for the probe to be considered successful after having failed |
| backend.livenessProbe.timeoutSeconds | int | `5` | Number of seconds after which the probe times out |
| backend.postgresql.postgresqlDatabase | string | `"timed"` | PostgreSQL database name for existing instance |
| backend.postgresql.postgresqlExistingHost | string | `""` | Enable existing PostgreSQL instance for persistence |
| backend.postgresql.postgresqlExistingSecret | string | `""` | You need to manually create the secret before deploying this (or use vault) kubectl create secret generic --namespace=timed $(CHART-RELEASE-NAME)-postgresql --from-literal=password=$SECRET |
| backend.postgresql.postgresqlPort | int | `5432` | PostgreSQL Port for existing instance |
| backend.postgresql.postgresqlUsername | string | `"timed"` | PostgreSQL user name for existing instance |
| backend.readinessProbe.enabled | bool | `true` | Enable readiness probe on backend |
| backend.readinessProbe.failureThreshold | int | `6` | Number of tries to perform the probe |
| backend.readinessProbe.periodSeconds | int | `10` | How often (in seconds) to perform the probe |
| backend.readinessProbe.successThreshold | int | `1` | Minimum consecutive successes for the probe to be considered successful after having failed |
| backend.readinessProbe.timeoutSeconds | int | `5` | Number of seconds after which the probe times out |
| backend.replicaCount | int | `1` | Number of Backend replicas |
| backend.resources | object | `{}` | Resource limits for backend |
| backend.service.externalPort | int | `80` | External Port of backend service |
| backend.service.internalPort | int | `8080` | Internal Port of backend service |
| backend.service.name | string | `"timed-backend"` | Backend service name |
| backend.service.probesPort | int | `8081` | Internal Port of backend service probes |
| backend.service.type | string | `"ClusterIP"` | Backend service type |
| backend.settings.admins | list | `[]` | Django administrators, example: Jon Doe <jon.doe@example.com> |
| backend.settings.buildProject | string | `" BUILD"` | Define name for build projects |
| backend.settings.corsAllowedOrigins | list | `[]` | Define allowed domains for CORS |
| backend.settings.customerCenterEmail | string | `"webmaster@chart-example.local"` | Email address to use for sending order confirmations from customer center |
| backend.settings.emailFrom | string | `"webmaster@chart-example.local"` | Default email address to use for various responses |
| backend.settings.emailUrl | string | `"smtp://localhost:25"` | Connection string of SMTP server to send mails |
| backend.settings.emailUseTls | string | `"True"` | TLS option for email server |
| backend.settings.hurricane.reqQueueLen | int | `250` | request queue length before hurricane denies requests and toggles readiness |
| backend.settings.maxNumberFields | int | `3000` | For example if a project has too many tasks and assignees. |
| backend.settings.sentry.dsn | string | `nil` | Sentry DSN for error reporting. Set to enable Sentry integration |
| backend.settings.sentry.enabled | bool | `false` | Enable Sentry integration |
| backend.settings.sentry.sendDefaultPii | string | `"True"` | Associate users to errors in Sentry |
| backend.settings.sentry.tracesSampleRate | float | `1` | Sentry trace sample rate, Set 1.0 to capture 100% of transactions |
| backend.settings.serverEmail | string | `"webmaster@chart-example.local"` | Email address error messages are sent from |
| backend.settings.workReportPath | string | `"/etc/workreport"` | Path where the workreport shall be loaded from. The contents of the default path is filled from `configmap-workreport.yaml`. |
| backend.startupProbe.enabled | bool | `true` | Enable startup probe on backend |
| backend.startupProbe.failureThreshold | int | `6` | Number of times to perform the probe |
| frontend.image.pullPolicy | string | `"IfNotPresent"` | Frontend image pull policy |
| frontend.image.repository | string | `"ghcr.io/adfinis/timed/frontend"` | Frontend image name |
| frontend.image.tag | string | `nil` | Frontend version. |
| frontend.livenessProbe.enabled | bool | `true` | Enable liveness probe on frontend |
| frontend.livenessProbe.failureThreshold | int | `6` | Number of tries to perform the probe |
| frontend.livenessProbe.initialDelaySeconds | int | `60` | Number of seconds after the container has started before liveness probe is initiated |
| frontend.livenessProbe.periodSeconds | int | `10` | How often (in seconds) to perform the probe |
| frontend.livenessProbe.successThreshold | int | `1` | Minimum consecutive successes for the probe to be considered successful after having failed |
| frontend.livenessProbe.timeoutSeconds | int | `5` | Number of seconds after which the probe times out |
| frontend.readinessProbe.enabled | bool | `true` | Enable readiness probe on frontend |
| frontend.readinessProbe.failureThreshold | int | `6` | Number of tries to perform the probe |
| frontend.readinessProbe.initialDelaySeconds | int | `30` | Number of seconds after the container has started before readiness probe is initiated |
| frontend.readinessProbe.periodSeconds | int | `10` | How often (in seconds) to perform the probe |
| frontend.readinessProbe.successThreshold | int | `1` | Minimum consecutive successes for the probe to be considered successful after having failed |
| frontend.readinessProbe.timeoutSeconds | int | `5` | Number of seconds after which the probe times out |
| frontend.replicaCount | int | `1` | Number of Backend replicas |
| frontend.resources | object | `{}` | Resource limits for frontend |
| frontend.service.externalPort | int | `80` | External Port of frontend service |
| frontend.service.internalPort | int | `80` | Internal Port of frontend service |
| frontend.service.name | string | `"timed-frontend"` | Frontend service name |
| frontend.service.type | string | `"ClusterIP"` | Frontend service type |
| frontend.settings.sentry.dsn | string | `nil` | Sentry DSN for error reporting. Set to enable Sentry integration |
| frontend.settings.sentry.enabled | bool | `false` | Enable Sentry integration |
| frontend.settings.sentry.sendDefaultPii | bool | `false` | Associate users to errors in Sentry |
| frontend.settings.sentry.tracesSampleRate | float | `1` | Sentry trace sample rate, Set 1.0 to capture 100% of transactions |
| grafana.defaultLabel | bool | `true` | Add a default `grafana_dashboard: 1` label |
| grafana.enabled | bool | `false` | Enable Grafana Dashboards |
| grafana.extraLabels | object | `{}` | Labels to add to all Grafana integration resources |
| httproute.routes | object | `{"main":{"annotations":{},"enabled":false,"hostnames":[],"labels":{},"parentRefs":[]},"redirect":{"annotations":{},"enabled":false,"hostnames":[],"httpsRedirect":true,"labels":{},"parentRefs":[],"statusCode":308}}` | Configure Gateway API HTTPRoutes for timed |
| httproute.routes.main.annotations | object | `{}` | HTTPRoute annotations |
| httproute.routes.main.enabled | bool | `false` | Enable the main HTTPRoute |
| httproute.routes.main.hostnames | list | `[]` | HTTPRoute hostnames |
| httproute.routes.main.labels | object | `{}` | HTTPRoute labels |
| httproute.routes.main.parentRefs | list | `[]` | Gateway parentRefs configuration |
| httproute.routes.redirect.annotations | object | `{}` | HTTPRoute annotations |
| httproute.routes.redirect.enabled | bool | `false` | Enable HTTP to HTTPS redirect HTTPRoute |
| httproute.routes.redirect.hostnames | list | `[]` | HTTPRoute hostnames |
| httproute.routes.redirect.httpsRedirect | bool | `true` | Enable HTTPS redirect filters |
| httproute.routes.redirect.labels | object | `{}` | HTTPRoute labels |
| httproute.routes.redirect.parentRefs | list | `[]` | Gateway parentRefs configuration |
| httproute.routes.redirect.statusCode | int | `308` | HTTP redirect status code |
| ingress.annotations | object | `{}` | Ingress annotations |
| ingress.enabled | bool | `false` | Enable ingress for timed |
| ingress.hosts | list | `[]` | Ingress hostnames |
| ingress.ingressClassName | string | `nil` | Set ingressClassName |
| ingress.tls | list | `[]` | Ingress TLS options |
| kubeVersionOverride | string | `nil` | override what version of Kubernetes to render against |
| postgresql.auth.database | string | `"timed"` | PostgreSQL database name |
| postgresql.auth.password | string | `""` | PostgreSQL password (required when postgresql.enabled is true) |
| postgresql.auth.username | string | `"timed"` | PostgreSQL user name |
| postgresql.enabled | bool | `false` | Enable a PostgreSQL instance for testing/developement. Production use is not supported. |
| postgresql.image.pullPolicy | string | `"IfNotPresent"` | PostgreSQL image pull policy |
| postgresql.image.repository | string | `"postgres"` | PostgreSQL image repository |
| postgresql.image.tag | string | `"17"` | PostgreSQL image tag |
| postgresql.service.port | int | `5432` | PostgreSQL service port |
| prometheus.enabled | bool | `false` | Enable Prometheus integration |
| prometheus.extraLabels | object | `{}` | Labels to add to all Prometheus integration resources |
| prometheus.podMonitor.enabled | bool | `true` | Enable creation of a PodMonitor CRD |
| prometheus.podMonitor.interval | string | `"30s"` | Interval at which metrics should be scraped |
| prometheus.podMonitor.metricRelabelings | list | `[]` | MetricRelabelConfigs to apply to samples before ingestion |
| prometheus.podMonitor.relabelings | list | `[]` | RelabelConfigs to apply to samples before scraping |
| redmine.amountInvoicedField | int | `2` | Amount invoiced field id on Redmine |
| redmine.amountOfferedField | int | `1` | Amount offered field id on Redmine |
| redmine.apiKey | string | `""` | Redmine API Key |
| redmine.buildProject | string | `"build"` | Redmine build project |
| redmine.enabled | bool | `false` | Enable Redmine integration |
| redmine.spenthoursField | int | `0` | Spent hours field id on Redmine |
| redmine.url | string | `"redmine.example.com"` | Redmine URL |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
