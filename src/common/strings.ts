/**
 * Make the first char upper case.
 * @param str input string
 * @returns string with at least first char in upper case.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Join strings as a space separated string.
 * @param strings Input strings
 * @returns spaces separated string
 */
export function join(...strings: (string | undefined)[]) {
  return strings.filter(Boolean).join(' ');
}

export const leadingZeros = (
  val: number | string,
  maxLength: number = 2,
  fillString: string = "0"
) => String(val).padStart(maxLength, fillString);

/**
 * Make a camel case string from a sentence.
 * @param s string is a sentence to turn into camelCase
 * @returns camelCase text
 */
export const toCamel = (s: string) => {
  return (
    s.charAt(0).toLowerCase() +
    s.slice(1).replace(/([-_ ][a-zA-Z])/gi, ($1) => {
      return $1.toUpperCase().replace(/[-_ ]/gi, '');
    })
  );
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const camelToKebabCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function* chars(str: string) {
  for (let i = 0; i < str.length; i++) {
    yield str[i];
  }
}

export function getFirstWord(str: string, separator: string = " ") {
  let firstWord = "";
  for (let char of str) {
    if (char === separator) {
      break;
    }
    firstWord += char;
  }
  return firstWord;
}

export const firstWord = (str: string) =>
  str.indexOf(" ") === -1 ? str : str.substring(0, str.indexOf(" "));
