class HTMLXMenTimelineSegmentElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
    }

    static get observedAttributes() {
        return ['year'];
    }
    
    connectedCallback() {
        this._render();
    }

    get year() {
        return this.getAttribute('year');
    }

    set year(value) {
        this.setAttribute('year', value);
    }

    _createStyle() {
        return `
            <style>
                * {
                    box-sizing: border-box;
                }
                .time-segment {
                    background: var(--x-yellow);
                    border: 1px solid black;
                    border-right: none;
                    box-sizing: border-box;
                    width: 120px;
                }
                .time-segment h2 {
                    width: 100%;
                    margin: .5rem 0;
                    text-align: center;
                }
                .time-segment span {
                    width: calc(100% / 12);
                    font-size: 9px;
                    text-align: center;
                }
                .months {
                    border-top: 1px solid black;
                    display: flex;
                    padding-top: 2px;
                }
                .months span {
                    display: inline-block;
                }
            </style>
        `;
    }
    _createContent() {
        const content = `
            <div class="time-segment">
                <h2>${this.year}</h2>
                <div class="months">
                    <span>J</span>
                    <span>F</span>
                    <span>M</span>
                    <span>A</span>
                    <span>M</span>
                    <span>J</span>
                    <span>J</span>
                    <span>A</span>
                    <span>S</span>
                    <span>O</span>
                    <span>N</span>
                    <span>D</span>
                </div>
            </div>
        `
        return content;
    }

    _render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.innerHTML += this._createStyle();
        this.shadowRoot.innerHTML += this._createContent();
    }
}


customElements.define('x-men-timeline-segment', HTMLXMenTimelineSegmentElement);