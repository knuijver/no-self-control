// export * from './common/utils';
// export * from './common/strings';
// export * from './common/dates';
// export * from './common/html';
// export * from './common/clipboard';

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

class ReactRoot extends HTMLElement {
	constructor() {		
		super();
	}

	connectedCallback() {	
		this.outerHTML = defaultBody;
	}
}
window.customElements.define('px-root', ReactRoot);