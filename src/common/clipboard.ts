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
