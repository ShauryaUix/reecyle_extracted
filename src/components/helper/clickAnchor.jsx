import isString from "lodash/isString";
import { stringify as stringifyQuery } from "querystring";

export default function clickAnchor(href, extras = {}) {
  const anchor = document.createElement("a");
  anchor.href = isString(href)
    ? href
    : `${href.url}?${stringifyQuery(href.query || {})}`;
  Object.assign(anchor, extras);
  anchor.click();
}
