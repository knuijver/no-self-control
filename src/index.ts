export const defaultBody = `
<div id="root">
  <style>
    .spinner:before {
      content:"";
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      height: 80px;
      width: 80px;
      margin-top: -40px;
      margin-left: -40px;
      border-radius: 50%;
      border-top: 2px solid #009688;
      border-right: 2px solid transparent;
      animation: spinner 0.7s linear infinite;
    }
    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
  <span class="spinner"></span>
</div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
.spinner:before {
  content:"";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 80px;
  width: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%;
  border-top: 2px solid #009688;
  border-right: 2px solid transparent;
  animation: spinner 0.7s linear infinite;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
`);

class ReactRoot extends HTMLElement {
  private shadow: ShadowRoot = null!;

	constructor() {		
		super();
    // const cssText = this.style.cssText;
    this.style.cssText = 'display:contents';

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.adoptedStyleSheets = [styles];
    //this.shadow.innerHTML = defaultBody;
	}

	connectedCallback() {	
		this.shadow.innerHTML = `
  <span class="spinner"></span>`;
	}
}
if(!window.customElements.get('px-root')){
	window.customElements.define('px-root', ReactRoot);
}
