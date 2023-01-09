export const parseObjectToQueryString = <T extends Record<string, any>>(
  obj: T,
): string => {
  const querystring = Object.keys(obj)
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join("&");

  return querystring.length > 0 ? "?" + querystring : querystring;
};
