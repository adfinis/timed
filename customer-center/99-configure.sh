#!/usr/bin/env sh

set -eu

urlencode() {
    # urlencode <string>
    # blatantly pinched from https://gist.github.com/cdown/1163649

    local length="${#1}"
    for i in $(seq 0 $((length-1))); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done
}

sed -i \
  -e "s/timed-api-host/$(urlencode "$TIMED_API_HOST")/g" \
  -e "s/oidc-client-id/$(urlencode "$OIDC_CLIENT_ID")/g" \
  -e "s/oidc-client-host/$(urlencode "$OIDC_CLIENT_HOST")/g" \
  -e "s/auth-admin-role/$(urlencode "$AUTH_ADMIN_ROLE")/g" \
  -e "s/auth-employee-role/$(urlencode "$AUTH_EMPLOYEE_ROLE")/g" \
  -e "s/auth-customer-role/$(urlencode "$AUTH_CUSTOMER_ROLE")/g" \
  /usr/share/nginx/html/index.html

exec "$@"
