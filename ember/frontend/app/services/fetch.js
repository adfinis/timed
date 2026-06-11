import Service, { service } from "@ember/service";
import { waitForFetch } from "@ember/test-waiters";
import { isEmpty } from "@ember/utils";
import { handleUnauthorized } from "ember-simple-auth-oidc";
import { isUnauthorizedResponse } from "ember-simple-auth-oidc/utils/errors";

const CONTENT_TYPE = "application/vnd.api+json";

const cleanObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => !isEmpty(v)));

const stringifyBodyData = (obj) => {
  if (!obj) {
    return "";
  }

  // assume the body is already stringyfied
  if (typeof obj !== "object") {
    return obj;
  }

  const { body, data } = obj;
  return JSON.stringify({ ...body, data });
};

export default class FetchService extends Service {
  @service session;

  async fetch(resource, init = {}) {
    await this.session.refreshAuthentication.perform();
    init.headers = cleanObject({
      ...this.headers,
      ...(init.headers || {}),
    });

    if (!!init?.method && init?.method !== "GET" && init?.method !== "HEAD") {
      init.body = stringifyBodyData(init);
    }

    const response = await waitForFetch(fetch(resource, init));

    if (!response.ok) {
      if (isUnauthorizedResponse(response)) {
        /* istanbul ignore next */
        return handleUnauthorized(this.session);
      }

      const contentType = response.headers.get("content-type");
      let body = "";

      if (/^application\/(vnd\.api+)?json$/.test(contentType)) {
        body = await response.json();
      } else if (contentType === "text/plain") {
        body = await response.text();
      }

      // throw an error containing a human readable message
      throw {
        response,
        body,
        error: new Error(
          `Fetch request to URL ${response.url} returned ${response.status} ${response.statusText}:\n\n${body}`,
        ),
      };
    }
    // Return early when "No Content" response is given. Trying to parse JSON
    // from that would result in an error.
    if (response.status === 204) {
      /* istanbul ignore next */
      return await response.text();
    }

    return await response.json();
  }

  get headers() {
    return {
      accept: CONTENT_TYPE,
      "content-type": CONTENT_TYPE,
      ...this.session.headers,
    };
  }
}
