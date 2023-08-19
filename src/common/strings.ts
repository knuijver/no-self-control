export const leadingZeros = (
  val: number | string,
  maxLength: number = 2,
  fillString: string = "0"
) => String(val).padStart(maxLength, fillString);

export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
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
