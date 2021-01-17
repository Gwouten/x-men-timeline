class HTMLXMenTimelineElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });

        this.segmentGrid = {
            width: 120,
            yearLineColor: 'rgba(0, 0, 0, 1)',
            lineColor: 'rgba(0, 0, 0, 0.2)',
            spaceColor: 'rgba(0, 0, 0, 0)'
        }

        this._data = null;
        this._rows = 0;
        this._startOffsetY = 120;
        this._ongoingLineHeight = 80;
    }
    
    connectedCallback() {
        this._render();
        this._arrangeOngoings();
    }

    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
        this._render();
    }

    _createSegments() {
        const currentYear = new Date().getFullYear();
        const segments = [];
        let year = 1963;
        while(year <= currentYear) {
            const segment = `<x-men-timeline-segment year="${year}"></x-men-timeline-segment>`;
            segments.push(segment);
            year++;
        }
        return segments.join('');
    }

    _setupGrid() {
        const increment = 100 / this.segmentGrid.width;
        const gradientString = [];
        let lineStart = 0;
        let lineEnd = increment;
        let spaceStart = lineEnd; 
        let spaceEnd = increment * 10;

        for( let i = 1; i <= 13; i++) {
            gradientString.push(
                `${i === 1 ? this.segmentGrid.yearLineColor : this.segmentGrid.lineColor} ${lineStart.toFixed(2)}% ${lineEnd.toFixed(2)}%, 
                ${this.segmentGrid.spaceColor} ${spaceStart.toFixed(2)}% ${spaceEnd.toFixed(2)}%,`
            );

            lineStart = spaceEnd;
            lineEnd = lineStart + increment;
            spaceStart = lineEnd;
            spaceEnd = increment * 10 * i;
        }

        return gradientString.join('').replace(/,$/gi, '');
    }

    _createOngoings() {
        if (!this.data) {
            return '';
        }

        const ongoings = this.data.ongoings.map(ongoing => {
            return `
                <x-men-ongoing 
                    start="${ongoing.start}" 
                    end="${ongoing.end}" 
                    series-title="${ongoing.title}" 
                    volume="${ongoing.volume}" 
                    issues="${ongoing.issues}">
                </x-men-ongoing>`;
        }).join('');

        return ongoings;
    }

    _arrangeOngoings() {
        window.addEventListener('load', () => {
            const allOngoings = this.shadowRoot.querySelectorAll('x-men-ongoing');
            allOngoings.forEach((ongoing, index) => {

                const previousOngoings = Array.from(allOngoings).slice(0, index);
                const ongoingSegment = ongoing.shadowRoot.querySelector('.x-men-ongoing');
                const ongoingSegmentLeft = ongoingSegment.getBoundingClientRect().left;
                let ongoingTop = ongoing.getBoundingClientRect().top;
                
                const relevantOngoings = previousOngoings.filter(previousOngoing => {
                    const previousOngoingSegment = previousOngoing.shadowRoot.querySelector('.x-men-ongoing');
                    const previousOngoingLeft = previousOngoingSegment.getBoundingClientRect().left;
                    const previousOngoingRight = previousOngoingSegment.getBoundingClientRect().right;

                    return previousOngoingLeft < ongoingSegmentLeft && previousOngoingRight > ongoingSegmentLeft;
                });

                relevantOngoings
                .sort((a, b) => {
                    if (a.getBoundingClientRect().top > b.getBoundingClientRect().top) {
                        return 1;
                    }
                    if (a.getBoundingClientRect().top < b.getBoundingClientRect().top) {
                        return -1;
                    }
                    return 0;
                })
                .forEach(relevantOngoing => {
                    if(ongoing.seriesTitle === 'X-men Unlimited'){
                        console.log(relevantOngoing.seriesTitle, relevantOngoing.getBoundingClientRect().top, ongoing.seriesTitle, ongoingTop);
                    }
                    if (relevantOngoing.getBoundingClientRect().top === ongoingTop) {
                        ongoing.style.top = `${ongoing.offsetTop + 100}px`;
                        ongoingTop = ongoing.getBoundingClientRect().top;
                    }
                });
            });
        });
    }

    _createStyle() {
        const style = new DOMParser().parseFromString(`
            <style>
                #segments {
                    display: flex;
                }
                .x-men-timeline {
                    position: relative;
                    background: linear-gradient(
                        90deg, 
                        ${this._setupGrid()}
                    );
                    background-size: ${this.segmentGrid.width}px 100%;
                    width: calc((${new Date().getFullYear()} - 1962) * 120px);
                }
                x-men-ongoing {
                    position: absolute;
                    top: ${this._startOffsetY}px;
                }
            </style>
        `, 'text/html').head.firstChild;

        return style
    }

    _createContent() {
        const content = new DOMParser().parseFromString(`
           <div class="x-men-timeline">
                <h1>X-men Timeline</h1>
                <div id="segments"></div>
                ${this._createOngoings()}
            </div>
        `, 'text/html').body.firstChild;

        return content;
    }
    
    _render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(this._createStyle(), this._createContent());

        const allSegments = new DOMParser().parseFromString(this._createSegments(), 'text/html').body.children;
        Array.from(allSegments).forEach(child => {
            this.shadowRoot.querySelector('#segments').append(child);    
        });
    }
}


customElements.define('x-men-timeline', HTMLXMenTimelineElement);