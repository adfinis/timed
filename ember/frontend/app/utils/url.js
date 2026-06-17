const notNullOrUndefined = (value) => value !== null && value !== undefined;

export const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => notNullOrUndefined(value)),
  );

export const toQueryString = (params) => new URLSearchParams(params).toString();
