
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

export const repeat = (n: number, fn: Function) => Array.from({ length: n }, (_, x) => fn(x));

export function rangeS(length: number, mapFn: Function) {
    const fn = mapFn
        ? (_: any, i: number) => mapFn(i)
        : (_: any, i: number) => i;
    return Array.from({ length }, fn);
}
