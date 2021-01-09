class HTMLXMenOngoingElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });

        this._ongoingHeaderOffsetTop = 0;
    }
    
    static get observedAttributes() {
        return [
            'end',
            'issues',
            'series-title',
            'start',
            'volume'
        ];
    }

    connectedCallback() {
        this._render();
        this._addIntersectionObserver();
    }

    get end() {
        return this.getAttribute('end');
    }

    set end(value) {
        this.setAttribute('end', value);
    }

    get issues() {
        return this.getAttribute('issues');
    }

    set issues(value) {
        this.setAttribute('issues', value);
    }

    get seriesTitle() {
        return this.getAttribute('series-title');
    }

    set seriesTitle(value) {
        this.setAttribute('series-title', value);
    }

    get start() {
        return this.getAttribute('start');
    }

    set start(value) {
        this.setAttribute('start', value);
    }

    get volume() {
        return this.getAttribute('volume');
    }

    set volume(value) {
        this.setAttribute('volume', value);
    }

    getMonth() {
        const originalDateString = this.start.match(/(\d+)/gi);
        return originalDateString[0];
    }

    getYears() {
        const originalDateString = this.start.match(/(\d+)/gi);
        return parseInt(originalDateString[1]) - 1963 + 1;
    }

    getSeriesRuntime() {
        const startMonth = parseInt(this.start.match(/\d+/gi)[0]);
        const startYear = parseInt(this.start.match(/\d+/gi)[1]);
        const endMonth = parseInt(this.end.match(/\d+/gi)[0]);
        const endYear = parseInt(this.end.match(/\d+/gi)[1]);

        return ((endYear - startYear - 1) * 12 + (12 - startMonth + 1) + endMonth) * 10;
    }
    
    _addIntersectionObserver() {
        window.addEventListener('load', () => {
            const observer = new IntersectionObserver((entries) => {
                const ongoingHeader = this.shadowRoot.querySelector('.x-men-ongoing h3');
                const currentEntry = entries[0];
                // set h3 to pos:fixed until timeline bar is no longer visible
                ongoingHeader.classList.toggle('header-fixed', currentEntry.isIntersecting);
                console.log(currentEntry);
                // set top for header when scrolling timeline segment out of the viewport on the left
                ongoingHeader.style.top = 
                    currentEntry.isIntersecting
                    ? `${currentEntry.boundingClientRect.y + ongoingHeader.getBoundingClientRect().y}px`
                    : '';

                // if (currentEntry.isIntersecting && currentEntry.boundingClientRect.x >= 0) {
                //     ongoingHeader.style.left = `${currentEntry.boundingClientRect.x}px`;
                // } else {
                //     ongoingHeader.style.left = '';
                // }
            });
            const target = this.shadowRoot.querySelector('.x-men-ongoing');
            observer.observe(target);
        });
    }

    _createStyle() {
        return `
            <style>
                .x-men-ongoing {
                    position: relative;
                    background-color: black;
                    color: var(--x-yellow);
                    left: calc(((12 * ${this.getYears()}) - (12 - ${this.getMonth()}) - 1) * 10px);
                    width: ${this.getSeriesRuntime()}px;
                    padding: 5px 10px;
                    margin: 18px 0 0 0;
                }
                h3 {
                    margin: 0 0 5px 0;
                    white-space: nowrap;
                    position: absolute;
                    top: -20px;
                    left: 0px;
                    color: var(--x-black);
                }
                h3.header-fixed {
                    position: fixed;
                }
                p {
                    font-size: 0.8rem;
                    margin: 0;
                    white-space: nowrap;
                    line-height: 1.5;
                }
            </style>
        `;
    }

    _createContent() {
        this.getMonth();
        const content = `
           <div class="x-men-ongoing">
                <h3>${this.seriesTitle} - Volume ${this.volume ? this.volume : ''}</h3>
                <p>From ${this.start} until ${this.end}</p>
                <p>${this.issues} issues</p>
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


customElements.define('x-men-ongoing', HTMLXMenOngoingElement);