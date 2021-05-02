class TimelineForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._addEventListeners();
    }

    connectedCallback() {
        this._render();
    }

    _addComic() {
        const form = this.shadowRoot.getElementById('timeline-form');
        const comicType = form.querySelector('select').value;
        console.log(
            'title: ', form['comic-title'].value,
            'start: ', form['comic-start'].value,
            'end: ', form['comic-end'].value,
            'volume: ', form['comic-volume'].value,
            'issues: ', form['comic-issues'].value
        );

        fbData.collection(comicType).add({
            title: form['comic-title'].value,
            start: form['comic-start'].value,
            end: form['comic-end'].value,
            volume: form['comic-volume'].value,
            issues: form['comic-issues'].value,
        });

        window.alert(`Added ${form['comic-title'].value}.`)

        form['comic-title'].value = '';
        form['comic-start'].value = '';
        form['comic-end'].value = '';
        form['comic-volume'].value = '';
        form['comic-issues'].value = '';
    }

    _onSubmitHandler(event) {
        event.preventDefault();
        this._addComic();
    }

    _addEventListeners() {
        this.shadowRoot.addEventListener('submit', this._onSubmitHandler.bind(this));
    }

    _createStyle() {
        const style = new DOMParser().parseFromString(`
            <style>
                :host {
                    box-sizing: border-box;
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    padding: var(--padding-medium);
                    background-color: var(--x-black);
                    width: 100vw;
                    color: var(--x-yellow);
                }
                form {
                    display: flex;
                    flex-wrap: wrap;
                }
                h2, button {
                    width: 100%;
                }
                button {
                    padding: var(--padding-medium) 0;
                    margin: var(--padding-medium) 0;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                        width: 300px;
                }
            </style>
        `, 'text/html').head.firstChild;
        
        return style;
    }

    _createContent() {
        // this.getMonth();
        const content = new DOMParser().parseFromString(`
            <form id="timeline-form">
                <h2>Add new comic</h2>

                <div class="input-group">
                    <label for="comic-type">Type</label>
                    <select id="comic-type" name="comic-type" required>
                        <option value="ongoings">Ongoing</option>
                        <option value="limitedSeries">Limited serie</option>
                        <option value="oneShots">One shot</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="comic-title">Title</label>
                    <input type="text" id="comic-title" name="comic-title" required>
                </div>
                <div class="input-group">
                    <label for="comic-start">Start date</label>
                    <input type="text" id="comic-start" name="comic-start" required>
                </div>
                <div class="input-group">
                    <label for="comic-end">End date</label>
                    <input type="text" id="comic-end" name="comic-end" required>
                </div>
                <div class="input-group">
                    <label for="comic-volume">Volume</label>
                    <input type="text" id="comic-volume" name="comic-volume" required>
                </div>
                <div class="input-group">
                    <label for="comic-issues">Number of issues</label>
                    <input type="text" id="comic-issues" name="comic-issues" required>
                </div>
                <button>Add Comic</button>
            </form>
        `, 'text/html').body.firstChild;

        return content;
    }

    _render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(this._createStyle(), this._createContent());

        window.dispatchEvent(new CustomEvent('ready'));
    }
}

customElements.define('timeline-form', TimelineForm);