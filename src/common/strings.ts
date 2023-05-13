
export const leadingZeros = (val: number | string, maxLength: number = 2, fillString: string = '0') =>
    String(val).padStart(maxLength, fillString);

export const toCamel = (s: string) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

export function toKebab(camelCase: string = "") {
    return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}
