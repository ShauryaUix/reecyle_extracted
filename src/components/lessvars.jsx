import isString from "lodash/isString";

import vars from "./lessvars.json";

export function getVars() {
  const styles = window.getComputedStyle(
    window.document.getElementById("__LESSVARS__"),
  );
  return Object.keys(vars).reduce((agr, key) => {
    const name = isString(vars[key])
      ? vars[key]
      : key.replace(/-./g, (value) => value[1].toUpperCase());
    agr[name] = `${styles.getPropertyValue(`--${key}`)}`.trim();
    return agr;
  }, {});
}

const VARS = getVars();

export default VARS;
