import type Controller from "@ember/controller";
import { get } from "@ember/object";
import { underscore } from "@ember/string";
import {
  serializeMoment,
  deserializeMoment,
} from "timed/utils/serialize-moment";

/**
 * Filter params by key
 */
export const filterQueryParams = <
  T extends Record<string, unknown>,
  K extends string[]
>(
  params: T,
  ...keys: K
) => {
  return Object.fromEntries(
    Object.entries(params).filter(([k]) => !keys.includes(k))
  ) as Omit<T, K[number]>;
};

/**
 * Underscore all object keys
 */
export const underscoreQueryParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).map(([k, v]) => [underscore(k), v])
  );

export const serializeQueryParams = <T extends Record<string, unknown>>(
  params: T,
  queryParamsObject: { [K in keyof T]?: (deserialized: T[K]) => string }
) => {
  return Object.keys(params).reduce((parsed, key) => {
    const serializeFn = queryParamsObject[key as keyof T];
    const value = params[key as keyof T];

    return key === "type"
      ? parsed
      : {
          ...parsed,
          [key]: serializeFn ? serializeFn(value) : value,
        };
  }, {} as Record<keyof T, string>);
};

/**
 * ? in all controllers, the only parameter that have the default value is `ordering`, and the value is "-date"
 */
export function getDefaultQueryParamValue(param: string) {
  if (param === "ordering") return "-date";
  else if (param === "type") return "year";
  return undefined;
}

export function allQueryParams<C extends Controller>(controller: C) {
  const params = {};
  for (const qpKey of controller.queryParams) {
    params[qpKey] = controller[qpKey];
  }
  return params;
}

export function queryParamsState<C extends Controller>(controller: C) {
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
      states[param].serialize = serializeMoment;
      states[param].deserialize = deserializeMoment;
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

export function resetQueryParams<C extends Controller>(
  controller: C,
  ...args: string[]
) {
  if (!args[0]) {
    return;
  }
  const params = [...args[0]];
  for (const param of params) {
    controller[param] = getDefaultQueryParamValue(param);
  }
}
