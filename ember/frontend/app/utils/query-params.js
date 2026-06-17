import { underscore } from "@ember/string";
import { DateTime } from "luxon";

/**
 * Filter params by key
 */
export const filterQueryParams = (params, ...keys) =>
  Object.fromEntries(
    Object.entries(params).filter(([key]) => !keys.includes(key)),
  );

/**
 * Underscore all object keys
 */
export const underscoreQueryParams = (params) =>
  Object.fromEntries(
    Object.entries(params).map(([key, value]) => [underscore(key), value]),
  );

export const serializeQueryParams = (params, queryParamsObject) => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key]) => key !== "type")
      .map(([key, value]) => {
        const serializeFn = queryParamsObject[key]?.serialize;
        return [key, serializeFn ? serializeFn(value) : value];
      }),
  );
};

/**
 *
 * @param {string} param
 * @returns {string} | {undefined}
 * ? in all controllers, the only parameter that have the default value is `ordering`, and the value is "-date"
 */
export function getDefaultQueryParamValue(param) {
  if (param === "ordering") return "-date";
  else if (param === "type") return "year";
  return undefined;
}

export function allQueryParams(controller) {
  const params = {};
  for (const qpKey of controller.queryParams) {
    params[qpKey] = controller[qpKey];
  }
  return params;
}

export function queryParamsState(controller) {
  const states = {};
  for (const param of controller.queryParams) {
    const defaultValue = getDefaultQueryParamValue(param);
    const currentValue = controller[param];
    states[param] = {
      defaultValue,
      serializedValue: currentValue,
      value: currentValue,
      changed: currentValue !== defaultValue,
    };
    if (["fromDate", "toDate"].includes(param)) {
      states[param].serialize = (v) =>
        DateTime.isDateTime(v) ? v.toISODate() : v;
      states[param].deserialize = DateTime.fromISO;
    }

    if (param === "id") {
      states[param].serialize = (arr) => {
        return (arr && Array.isArray(arr) && arr.join(",")) || null;
      };
      states[param].deserialize = (str) => {
        return (str && str.split(",")) || [];
      };
    }
    if (param === "ordering") {
      states[param].serialize = function (val) {
        if (!val) return;
        if (val.includes(",id")) {
          return val;
        }
        return `${val},id`;
      };
    }
  }
  return states;
}

export function resetQueryParams(controller, ...args) {
  if (!args[0]) {
    return;
  }
  const params = [...args[0]];
  for (const param of params) {
    controller[param] = getDefaultQueryParamValue(param);
  }
}
