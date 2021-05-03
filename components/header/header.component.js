class TimelineHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._render();
    };

    _createStyle() {
        const style = new DOMParser().parseFromString(`
            <style>
                h1 {
                    text-align: center;
                }
            </style>
        `, 'text/html').head.firstChild;

        return style;
    }

    _createContent() {
        const content = new DOMParser().parseFromString(`
            <header>
                <h1>X-men Publication Timeline</h1>
            </header>
        `, 'text/html').body.firstChild;

        return content;
    }

    _render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(this._createStyle(), this._createContent());
    }
}

customElements.define('timeline-header', TimelineHeader);