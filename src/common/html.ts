import { camelToKebabCase, toCamel } from "./strings";

const htmlValue = (value: any) =>
  value instanceof HTMLTemplateElement ? value.innerHTML : value;

/**
 * HTML helper for creating a HTMLTemplateElement
 * @param {any} strings
 * @param {...any} values
 * @returns {HTMLTemplateElement}
 */
export const html = (strings: any, ...values: any[]) => {
  const template = document.createElement("template");
  template.innerHTML = values.reduce(
    (acc, value, index) => acc + htmlValue(value) + strings[index + 1],
    strings[0]
  );
  return template;
};

/**
 * CSS Helper for creating a HTMLStyleElement
 * @param {any} strings
 * @param {...any} values
 * @returns {HTMLStyleElement}
 */
export const css = (strings: any, ...values: any[]) => {
  const element = document.createElement("style");
  element.innerText = values.reduce(
    (acc, value, index) => acc + value + strings[index + 1],
    strings[0]
  );
  return element;
};

const walkPath = (object: any, pathString: string) => {
  var prop,
    names = pathString.split(".");
  while (object && (prop = names.shift())) object = object[prop];
  return object;
};

export const INTERPOLATED_STATE = Symbol.for("interpolated-state");

/**
 *
 * @param {HTMLTemplateElement} templateElement
 */
export const interpolate =
  (templateElement: HTMLTemplateElement) => (obj: object) => {
    const clone = templateElement.cloneNode(true) as HTMLTemplateElement;
    (<any>clone)[INTERPOLATED_STATE] = obj;
    clone.innerHTML = clone.innerHTML.replace(
      /@{([.|\w]+)}/g,
      (_substring, key) => walkPath(obj, key) || ""
    );
    return clone;
  };

export const bindUIEvents = (element: Element, scope: object) =>
  Object.fromEntries(
    Array.from(element.attributes)
      .filter((f) => f.name.startsWith("on-"))
      .map((v) => [v.name.slice(3), new Function(v.value).bind(scope)])
  );

/**
 * create an object of all set attributes on the element
 * @param {HTMLElement} element
 * @param {undefined | (string) => string} rename optional example dashes to camelCase
 * @returns {Record<string,string>}
 */
export const captureProps = (element: HTMLElement, rename = (n: string) => n) =>
  Object.fromEntries(
    Array.from(element.attributes).map((e) => [rename(e.name), e.value])
  );
const fnMas = (e: HTMLElement) =>
  Object.entries(captureProps(e, toCamel)).map(([key, value]) => ({
    path: key.split(":"),
    value,
  }));

function walk(obj: Record<string, any>, value: any, names: string[]) {
  if (!names || names.length === 0) return value;

  const [name, ...rest] = names;
  if (name && rest) {
    const next = obj[name] || {};
    obj[name] = walk(next, value, rest);
  } else {
    return value;
  }

  return obj;
}
/**
 * <x-mas
 *	texts:service-type="Type"
 *  texts:service-server="Server"
 *  texts:service-last-run="Last Run"
 *  texts:service-identifier="Identifier">
 *
 *  No Content
 *
 * </x-mas>
 *
 * is transformed into:
 * {
 * 	texts: {
 * 		serviceIdentifier: "Identifier",
 * 		serviceLastRun: "Last Run",
 * 		serviceServer: "Server",
 * 		serviceType: "Type"
 * 	}
 * }
 * @param {any} element
 */
export const captureComplexProps = (element: HTMLElement) =>
  fnMas(element).reduce((o, c) => walk(o, c.value, c.path), {});

/**
 * @param target - the custom element class
 * @param props - properties that need to be synced with the attributes
 */
export const defineProperties = (target: HTMLElement, props: any) => {
  Object.defineProperties(
    target,
    Object.keys(props).reduce((acc: any, key: string) => {
      acc[key] = {
        enumerable: true,
        configurable: true,
        get: () => {
          const attr = target.getAttribute(camelToKebabCase(key));
          return (attr === "" ? true : attr) ?? props[key];
        },
        set: (val: any) => {
          if (val === "" || val) {
            target.setAttribute(camelToKebabCase(key), val === true ? "" : val);
          } else {
            target.removeAttribute(key);
          }
        },
      };
      return acc;
    }, {})
  );
};

// const htmx = <TSource = any, TParent = any>(
//   strings: TemplateStringsArray,
//   ...values: ((p: TParent) => any)[]
// ) => {
//   return (s:TParent) => '';
// };

// var f = htmx<any, any>`
//   Test ${(x) => x.name}
// `;

// let s = f({ title: ''});

