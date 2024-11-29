type ExcludeNullOrUndefined<T> = T extends null | undefined ? never : T;

type CleanedObject<T extends object> = {
  [K in keyof T as ExcludeNullOrUndefined<T[K]> extends never
    ? never
    : K]: ExcludeNullOrUndefined<T[K]>;
};

const notNullOrUndefined = <T>(value: T): value is ExcludeNullOrUndefined<T> =>
  value !== null && value !== undefined;

export const cleanParams = <T extends object>(params: T): CleanedObject<T> => {
  const cleanedEntries = Object.entries(params).filter(([, value]) =>
    notNullOrUndefined(value)
  );
  return Object.fromEntries(cleanedEntries) as CleanedObject<T>;
};

export const toQueryString = (params: Record<string, unknown>): string =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
