class ListElement extends HTMLElement {

    set name(value) {
        this._nameElement.textContent = this._nameForm.elements.name.value = value;
    }

    set oid(value) {
        // permet de donner un moyen "facile" de cibler l'élément à partir de son id
        this.dataset.oid = this._oid = value;
    }

    get oid() {
        // du coup, faut aussi pouvoir accéder à l'info
        return this._oid;
    }

    hasCards() {
        return !!this.children.length;
    }

    // appelé en premier, avec une bonne longueur d'avance
    constructor() {
        // la syntaxe class nous permet d'utiliser les mots-clés associés :-)
        super();
        // et d'être presque certain que this désignera toujours le bon objet

        // le shadow root cache toute la structure "interne" du CE
        const shadowRoot = this.attachShadow({mode: 'open'});
        let template = document.getElementById('template-list').content;
        shadowRoot.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">';
        shadowRoot.appendChild(template.cloneNode(true));

        // pour accéder facilement aux élément clés, on va quand même les "retenir"
        // càd en faire des propriétés
        // par convention, on met des _ devant, ce qui signifie qu'on est pas censés y accéder depuis l'extérieur
        // mais ce n'est qu'une convention, ça n'empêche pas vraiment l'accès
        this._nameElement = shadowRoot.querySelector('h2');
        this._nameForm = shadowRoot.querySelector('form');
        this._addCardButton = shadowRoot.querySelector('.button--add-card');
        this._deleteButton = shadowRoot.querySelector('.button--delete-list');

        this.addListeners();
    }

    // appelé quand l'élément est connecté au DOM pour la première fois
    // la plupart des manipulations DOM devrait avoir lieu ici ;-)
    connectedCallback() {
        // pour que l'affichage soit correct et que la liste se comporte comme un .column enfant de .columns
        // on récupère les classes de l'élément de plus haut niveau pour les appliquer plutôt au custom element
        this.className = this.shadowRoot.querySelector('div.panel').className;
        this.shadowRoot.querySelector('div.panel').className = '';
    }

    addListeners() {
        this._nameElement.addEventListener('dblclick', this.toggleNameMode.bind(this));
        this._nameForm.addEventListener('submit', this.saveName.bind(this));
        this._addCardButton.addEventListener('click', this.addCard.bind(this));
        this._deleteButton.addEventListener('click', this.deleteSelf.bind(this));
    }

    toggleNameMode() {
        this._nameElement.classList.toggle('is-hidden');
        this._nameForm.classList.toggle('is-hidden');
    }

    addCard() {
        this.dispatchEvent(new CustomEvent('add-card'));
    }

    deleteSelf() {
        this.dispatchEvent(new CustomEvent('delete-list'));
    }

    saveName(event) {
        // attention, le callback n'étant pas appelé par l'objet lui-même (sinon, ça serait pas un callback)
        // il ne faut pas oublier de lier l'objet courant à this au moment de l'ajout de listener
        event.preventDefault();

        const saveEvent = new CustomEvent('save-list-name', { detail: {
            formData: new FormData(this._nameForm)
        }});

        this.dispatchEvent(saveEvent);

        this.toggleNameMode();
    }
}

customElements.define('o-list', ListElement);