# Timed

[![Ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg)](https://github.com/adfinis/timed-backend)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Timed timetracking software.

## Installation

**Requirements**

- podman or docker
- podman compose or docker compose
- pnpm for frontend developement

After installing and configuring those requirements, you should be able to run the following
commands to complete the installation:

When using podman create a `Makefile.local` (ignored by vcs) and add the following lines to it:

```make
ORCHESTRATOR := podman
```

Then just start the compose setup:

```bash
make start
```

This brings up complete local installation.

You can visit it at [https://timed.localhost](https://timed.localhost).

The API can be accessed at [https://timed.localhost/api/v1](https://timed.localhost/api/v1) and the admin interface at [http://timed.localhost/admin/](http://timed.localhost/admin/).

The Keycloak admin interface can be accessed at [https://timed.localhost/auth/admin](https://timed.localhost/auth/admin) with the account `admin` and password `admin`

## Development

To get the application working locally for development, make sure to create a file `.env` with the following content:

```env
DJANGO_OIDC_CREATE_USER=True
```

If you have existing users from the previous LDAP authentication, you want to add this line as well:

```env
DJANGO_OIDC_USERNAME_CLAIM=preferred_username
```

Make sure to set your UID in .env

```bash
echo "UID=$UID" >> .env
```

Import some development fixtures to get started:

```bash
make loaddata
```

The test data includes 3 users: `admin`, `fritzm` and `axels` with which you can log into [https://timed.localhost](https://timed.localhost). Their passwords are identical to the username.

To access the Django admin interface you will have to change the admin password in Django directly:

```console
$ podman compose run --rm -it sh
/app $ ./manage.py changepassword admin
Changing password for user 'admin'
Password:
Password (again):
Password changed successfully for user 'admin'
```

Then you'll be able to login in the Django admin interface [https://timed.localhost/admin/](https://timed.localhost/admin/).

### Frontend

First start the frontend:

```bash
cd frontend
pnpm install
pnpm run start
```

You can now visit your developement server at `http://localhost:4200`
Code Changes will automatically be applied via live reloading.

### Adding a user

If you want to add other users with different roles, add them in the Keycloak interface (as they would be coming from your LDAP directory).
You will also have to correct their employment in the Django admin interface as it is not correctly set for the moment.
Head to [https://timed.localhost/admin/](https://timed.localhost/admin/) after having perform a first login with the user.
You should see that new user in the `Employment -> Users`.
Click on the user and scroll down to the `Employments` section to set a `Location`.
Save the user and you should now see the _Timed_ interface correctly under that account.

### Linting

For linting you can use the makefile targets

- backend-lint (lint just the backend)
- backend-lint-fix (lint and fix just the backend)
- frontend-lint (lint the frontend)
- frontend-lint-fix (lint and fix the frontend)

### Testing

For testing you can use the makefile targets

- backend-test (test just the backend)
- frontend-test (test just the frontend)
- test (test front- and backend)

## Configuration

Following options can be set as environment variables to configure Timed backend in documented [format](https://github.com/joke2k/django-environ#supported-types)
according to type.

| Parameter                                    | Description                                                                                                 | Default                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `DJANGO_ENV_FILE`                            | Path to setup environment vars in a file                                                                    | .env                                                             |
| `DJANGO_DEBUG`                               | Boolean that turns on/off debug mode                                                                        | False                                                            |
| `DJANGO_SECRET_KEY`                          | Secret key for cryptographic signing                                                                        | not set (required)                                               |
| `DJANGO_ALLOWED_HOSTS`                       | List of hosts representing the host/domain names                                                            | not set (required)                                               |
| `DJANGO_HOST_PROTOCOL`                       | Protocol host is running on (http or https)                                                                 | http                                                             |
| `DJANGO_HOST_DOMAIN`                         | Main host name server is reachable on                                                                       | not set (required)                                               |
| `DJANGO_DATABASE_NAME`                       | Database name                                                                                               | timed                                                            |
| `DJANGO_DATABASE_USER`                       | Database username                                                                                           | timed                                                            |
| `DJANGO_DATABASE_HOST`                       | Database hostname                                                                                           | db                                                               |
| `DJANGO_DATABASE_PORT`                       | Database port                                                                                               | 5432                                                             |
| `DJANGO_OIDC_DEFAULT_BASE_URL`               | Base URL of the OIDC provider                                                                               | http://timed.localhost/auth/realms/timed/protocol/openid-connect |
| `DJANGO_OIDC_OP_AUTHORIZATION_ENDPOINT`      | OIDC /auth endpoint                                                                                         | {`DJANGO_OIDC_DEFAULT_BASE_URL`}/auth                            |
| `DJANGO_OIDC_OP_TOKEN_ENDPOINT`              | OIDC /token endpoint                                                                                        | {`DJANGO_OIDC_DEFAULT_BASE_URL`}/token                           |
| `DJANGO_OIDC_OP_USER_ENDPOINT`               | OIDC /userinfo endpoint                                                                                     | {`DJANGO_OIDC_DEFAULT_BASE_URL`}/userinfo                        |
| `DJANGO_OIDC_OP_JWKS_ENDPOINT`               | OIDC /certs endpoint                                                                                        | {`DJANGO_OIDC_DEFAULT_BASE_URL`}/certs                           |
| `DJANGO_OIDC_RP_CLIENT_ID`                   | Client ID by your OIDC provider                                                                             | timed-public                                                     |
| `DJANGO_OIDC_RP_CLIENT_SECRET`               | Client secret by your OIDC provider, should be None (flow start is handled by frontend)                     | not set                                                          |
| `DJANGO_OIDC_RP_SIGN_ALGO`                   | Algorithm the OIDC provider uses to sign ID tokens                                                          | RS256                                                            |
| `DJANGO_OIDC_VERIFY_SSL`                     | Verify SSL on OIDC request                                                                                  | dev: False, prod: True                                           |
| `DJANGO_OIDC_CREATE_USER`                    | Create new user if it doesn't exist in the database                                                         | False                                                            |
| `DJANGO_OIDC_USERNAME_CLAIM`                 | Username token claim for user lookup / creation                                                             | sub                                                              |
| `DJANGO_OIDC_EMAIL_CLAIM`                    | Email token claim for creating new users (if `DJANGO_OIDC_CREATE_USER` is enabled)                          | email                                                            |
| `DJANGO_OIDC_FIRSTNAME_CLAIM`                | First name token claim for creating new users (if `DJANGO_OIDC_CREATE_USER` is enabled)                     | given_name                                                       |
| `DJANGO_OIDC_LASTNAME_CLAIM`                 | Last name token claim for creating new users (if `DJANGO_OIDC_CREATE_USER` is enabled)                      | family_name                                                      |
| `DJANGO_OIDC_BEARER_TOKEN_REVALIDATION_TIME` | Time (in seconds) to cache a bearer token before revalidation is needed                                     | 60                                                               |
| `DJANGO_OIDC_CHECK_INTROSPECT`               | Use token introspection for confidential clients                                                            | True                                                             |
| `DJANGO_OIDC_OP_INTROSPECT_ENDPOINT`         | OIDC token introspection endpoint (if `DJANGO_OIDC_CHECK_INTROSPECT` is enabled)                            | {`DJANGO_OIDC_DEFAULT_BASE_URL`}/token/introspect                |
| `DJANGO_OIDC_RP_INTROSPECT_CLIENT_ID`        | OIDC client id (if `DJANGO_OIDC_CHECK_INTROSPECT` is enabled) of confidential client                        | timed-confidential                                               |
| `DJANGO_OIDC_RP_INTROSPECT_CLIENT_SECRET`    | OIDC client secret (if `DJANGO_OIDC_CHECK_INTROSPECT` is enabled) of confidential client                    | not set                                                          |
| `DJANGO_OIDC_ADMIN_LOGIN_REDIRECT_URL`       | URL of the django-admin, to which the user is redirected after successful admin login                       | dev: http://timed.localhost/admin/, prod: not set                |
| `DJANGO_ALLOW_LOCAL_LOGIN`                   | Enable / Disable login with local user/password (in admin)                                                  | True                                                             |
| `EMAIL_URL`                                  | Uri of email server                                                                                         | smtp://localhost:25                                              |
| `DJANGO_DEFAULT_FROM_EMAIL`                  | Default email address to use for various responses                                                          | webmaster@localhost                                              |
| `DJANGO_SERVER_EMAIL`                        | Email address error messages are sent from                                                                  | root@localhost                                                   |
| `DJANGO_ADMINS`                              | List of people who get error notifications                                                                  | not set                                                          |
| `DJANGO_WORK_REPORT_PATH`                    | Path of custom work report template                                                                         | not set                                                          |
| `DJANGO_SENTRY_DSN`                          | Sentry DSN for error reporting                                                                              | not set, set to enable Sentry integration                        |
| `DJANGO_SENTRY_TRACES_SAMPLE_RATE`           | Sentry trace sample rate, Set 1.0 to capture 100% of transactions                                           | 1.0                                                              |
| `DJANGO_SENTRY_SEND_DEFAULT_PII`             | Associate users to errors in Sentry                                                                         | True                                                             |
| `HURRICANE_REQ_QUEUE_LEN`                    | Django Hurricane's request queue length. When full, the readiness probe toggles                             | 250                                                              |
| `STATIC_ROOT`                                | Path to the static files. In prod, you may want to mount a docker volume here, so it can be served by nginx | `/app/static`                                                    |
| `STATIC_URL`                                 | URL path to the static files on the web server. Configure nginx to point this to `$STATIC_ROOT`             | `/static`                                                        |

## Contributing

Look at our [contributing guidelines](CONTRIBUTING.md) to start with your first contribution.

## License

Code released under the [GNU Affero General Public License v3.0](LICENSE).
