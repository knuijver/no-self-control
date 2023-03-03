/**
 * create an object of all set attributes on the element
 * @param {HTMLElement} element
 * @param {undefined | (string) => string} rename optional example dashes to camelCase
 * @returns {Record<string,string>}
 */
export const captureProps = (element: HTMLElement, rename = (n: string) => n) => Object.fromEntries(
	Array.from(element.attributes).map(e => [rename(e.name), e.value])
);

export const toCamel = (s: string) => {
	return s.replace(/([-_][a-z])/ig, ($1) => {
		return $1.toUpperCase()
			.replace('-', '')
			.replace('_', '');
	});
};

class DateFormat {
	private static formats: { [key: string]: (dt: Date) => any } = {
		['yy']: (dt: Date) => dt.getFullYear() % 100,
		['yyyy']: (dt: Date) => dt.getFullYear(),
		['dd']: (dt: Date) => dt.getDate().toString().padStart(2, '0'),
		['MM']: (dt: Date) => (dt.getMonth() + 1).toString().padStart(2, '0'), // Moths are zero base index
		['HH']: (dt: Date) => dt.getHours().toString().padStart(2, '0'),
		['mm']: (dt: Date) => dt.getMinutes().toString().padStart(2, '0')
	};

	static toString(fmt: string, date: Date) {
		const fn = this.formats[fmt] || function () { return fmt };
		return fn(date) as string;
	}
}

let rx = /([a-zA-Z])\w+/g;
export const formatDate = (date: string | Date | number, fmt: string) => {
	const dt = new Date(date);
	return fmt.replace(rx, (s) => DateFormat.toString(s, dt));
};

const htmlValue = (value: any) => value instanceof HTMLTemplateElement ? value.innerHTML : value;

/**
 * HTML helper for creating a HTMLTemplateElement
 * @param {any} strings
 * @param {...any} values
 * @returns {HTMLTemplateElement}
 */
export const html = (strings: any, ...values: any[]) => {
	const template = document.createElement('template');
	template.innerHTML = values.reduce((acc, value, index) => acc + htmlValue(value) + strings[index + 1], strings[0]);
	return template;
}

/**
 * CSS Helper for creating a HTMLStyleElement
 * @param {any} strings
 * @param {...any} values
 * @returns {HTMLStyleElement}
 */
export const css = (strings: any, ...values: any[]) => {
	const element = document.createElement('style');
	element.innerText = values.reduce((acc, value, index) => acc + value + strings[index + 1], strings[0]);
	return element;
}

const walkPath = (object: any, pathString: string) => {
	var prop, names = pathString.split('.');
	while (object && (prop = names.shift())) object = object[prop];
	return object;
}

export const INTERPOLATED_STATE = Symbol.for('interpolated-state');
/**
 * 
 * @param {HTMLTemplateElement} templateElement
 */
export const interpolate =
	(templateElement: HTMLTemplateElement) =>
		(obj: object) => {
			const clone = templateElement.cloneNode(true) as HTMLTemplateElement;
			(<any>clone)[INTERPOLATED_STATE] = obj;
			clone.innerHTML = clone.innerHTML.replace(
				/@{([.|\w]+)}/g,
				(_substring, key) => walkPath(obj, key) || ''
			);
			return clone;
		};

export const bindUIEvents = (element: Element, scope: object) =>
	Object.fromEntries(Array.from(element.attributes).filter(f => f.name.startsWith('on-'))
		.map(v => [
			v.name.slice(3),
			new Function(v.value).bind(scope)
		]));

/**
 * 
 * @param {Element} element
 * @param {string} str
 */
const copyToClipboard = (element: Element, str: string) => {
	const el = document.createElement('textarea');
	el.value = str;
	el.style.visibility = 'hidden';
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.setAttribute('readonly', '');

	element.appendChild(el);
	el.select();
	document.execCommand('copy');

	element.removeChild(el);
};

/**
 * Send text to the clipboard API (with fallback to textarea and copy command)
 * @param {Element} element is use as temporary parent element
 * @param {string} str has the text to copy on the clipboard
 */
export const sendTextToClipboard = async (element: Element, str: string) => {
	if (navigator.permissions) {
		const permission = await navigator.permissions.query({ name: "clipboard-write" } as any);
		if (permission.state !== "denied") {

			await navigator.clipboard.writeText(str);

			return;
		}
	}
	copyToClipboard(element, str);
}

const fnMas = (e: HTMLElement) =>
	Object.entries(
		captureProps(e, toCamel))
		.map(([key, value]) => ({ path: key.split(':'), value }));

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


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    value => value
  );
  return (...args: T) => piped(fn1(...args));
};

export type FunctionType = (...x: any[]) => any;
export type ComposableOn<F extends FunctionType> = F extends (...x: any[]) => infer U ? (y: U) => any : never;

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

// export const compose = <R, F extends (a: R, ...b: any) => R>(fn1: F, ...fns: Array<(a: R) => R>) =>
//   fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);


export default {
	INTERPOLATED_STATE,
	interpolate,
	captureProps,
	toCamel,
	captureComplexProps,
	formatDate,
	html,
	css,
	sleep,
  pipe,
  compose
}