
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

export const defaultLocale = 'nl-NL';

export const getMonths = (
  options: Intl.DateTimeFormatOptions = { month: 'long' },
  locale = defaultLocale
) => {
  const format = new Intl.DateTimeFormat(locale, { ...options });

  return Array.from({ length: 12 }).map((_, index) =>
    format.format(new Date(0).setMonth(index)),
  );
};
