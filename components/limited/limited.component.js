class HTMLXMenLimitedElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });

        this._limitedHeaderOffsetTop = 0;
        window.addEventListener('ready', this._addIntersectionObserver.bind(this));
    }
    
    static get observedAttributes() {
        return [
            'end',
            'issues',
            'series-title',
            'start'
        ];
    }

    connectedCallback() {
        this._render();
        this._addIntersectionObserver();
        this._addEventListeners();
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
            const target = this.shadowRoot.querySelector('.x-men-limited');
            const scrollHandler = this._onWindowScrollHandler.bind(this);
            const observer = new IntersectionObserver((entries) => {
                const limitedHeader = this.shadowRoot.querySelector('.x-men-limited h3');
                const currentEntry = entries[0];

                currentEntry.isIntersecting
                    ? window.addEventListener('scroll', scrollHandler)
                    : window.removeEventListener('scroll', scrollHandler);
            });

            observer.observe(target);
    }

    _onWindowScrollHandler() {
        const scrollCustomEvent = new CustomEvent('timeline-scroll');
        this.shadowRoot.querySelector('.x-men-limited').dispatchEvent(scrollCustomEvent);
    }

    _onTimelineScrollHandler({ target }) {
        const limitedLeftBoundary = target.getBoundingClientRect().left;
        const limitedTitleWidth = target.querySelector('h3').getBoundingClientRect().width;
        target.querySelector('h3').style.transform = 
            target.getBoundingClientRect().left < 0 && target.getBoundingClientRect().right >= limitedTitleWidth / 2
            ? `translateX(${limitedLeftBoundary * -1 + 10}px)`
            : '';
    }

    _addEventListeners() {
        this.shadowRoot.querySelector('.x-men-limited').addEventListener('timeline-scroll', this._onTimelineScrollHandler.bind(this));
    }

    _createStyle() {
        const style = new DOMParser().parseFromString(`
            <style>
                :host {
                    left: calc(((12 * ${this.getYears()}) - (12 - ${this.getMonth()}) - 1) * 10px);
                }
                .x-men-limited {
                    position: relative;
                    background-color: red;
                    color: var(--x-yellow);
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
                    transform: translateX(0);
                    transition: transform 1s;
                }
                p {
                    font-size: 0.8rem;
                    margin: 0;
                    white-space: nowrap;
                    line-height: 1.5;
                }
            </style>
        `, 'text/html').head.firstChild;
        
        return style;
    }

    _createContent() {
        // this.getMonth();
        const content = new DOMParser().parseFromString(`
            <div class="x-men-limited">
                <h3>${this.seriesTitle} (1-${this.issues})</h3>
            </div>
        `, 'text/html').body.firstChild;

        return content;
    }

    _render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(this._createStyle(), this._createContent());

        window.dispatchEvent(new CustomEvent('ready'));
    }
}


customElements.define('x-men-limited', HTMLXMenLimitedElement);