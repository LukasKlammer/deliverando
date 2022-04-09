let basket = [];


function addMeal(name, price) { // Element dem Warenkorb hinzufügen
    animationOnChooseMeal(name);
    if (basket.some(item => item.name === name)) {
        increaseBasketElement(name); // if true --> dann Anzahl des bereits hinzugefügten Elements erhöhen
    } else {
        addToBasket(name, price); // if false --> dann neu zum Basket hinzufügen
    }
}


function addToBasket(name, price) {
    let addData = // Element zuerst in neue Variable kopieren, damit nicht an die entsprechende Stelle referenziert wird
    {
        'name': name,
        'price': price,
        'amount': 1,
        'note': '',
    };
    basket.push(addData);
    renderBasketElements(); // rendert die Elemente aus Warenkorb und dem Warenkorb-öffnen in der responsive Ansicht
}


function removeFromBasket(indexOfElement) { // Element aus Warenkorb entfernen
    basket.splice(indexOfElement, 1);
}


function increaseBasketElement(name) {
    let indexOfElement = basket.findIndex(item => item.name == name);
    basket[indexOfElement].amount = basket[indexOfElement].amount + 1;
    renderBasketElements(); // rendert die Elemente aus Warenkorb und dem Warenkorb-öffnen in der responsive Ansicht
}


function decreaseBasketElement(name) {
    let indexOfElement = basket.findIndex(item => item.name == name); // Index suchen, wessen Element gelöscht werden soll
    if (basket[indexOfElement].amount > 1) { // wenn mehr als 1 Produkt im Warenkorb ist, dann 1 Stk. wegnehmen
        basket[indexOfElement].amount = basket[indexOfElement].amount - 1;
    }
    else { // sonst Element aus Warenkorb entfernen (wir wollen keine 0)
        removeFromBasket(indexOfElement);
    }
    renderBasketElements(); // rendert die Elemente aus Warenkorb und dem Warenkorb-öffnen in der responsive Ansicht
}


function animationOnChooseMeal(name) {
    document.getElementById(name).classList.add('meal-onclick-animation');
    setTimeout(() => {
        document.getElementById(name).classList.remove('meal-onclick-animation');
    }, 125);
}


function renderShoppingBasketRight() {
    let basketContainer = document.getElementById('basket-right');
    basketContainer.innerHTML = '';

    if (basket.length == 0) { // wenn noch keine Elemente im Warenkorb sind Information anzeigen
        renderBasketEmpty(basketContainer);
    } else { // sonst Warenkorb rendern
        renderBasketMeals(basketContainer);
        renderBasketFinance(basketContainer);
    }
}


function renderShoppingBasketOverlay() {
    let basketContainer = document.getElementById('basket-overlay');
    basketContainer.innerHTML = '';

    if (basket.length == 0) { // wenn noch keine Elemente im Warenkorb sind Information anzeigen
        renderBasketEmpty(basketContainer);
    } else { // sonst Warenkorb rendern
        renderBasketMeals(basketContainer);
        renderBasketFinance(basketContainer);
    }
}


function renderBasketEmpty(basketContainer) { // Information anzeigen, was vom Nutzer erwartet wird
    basketContainer.innerHTML += /*html*/ `
    <div class="empty-basket">
        <img src="img/shopping-basket-32.png" alt="">
        <h3>Fülle deinen Warenkorb</h3>
        <span>Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
    </div>
    `;
}


function renderBasketMeals(basketContainer) { // alle Mahlzeiten im Warenkorb rendern
    for (let i = 0; i < basket.length; i++) {
        const basketElement = basket[i];
        const subtotal = basketElement['price'] * basketElement['amount'];
        const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
        basketContainer.innerHTML += /*html*/ `
            <div class="basket-meal">
                <div class="amount-name-price">
                    <span class="basket-item-amount">${basketElement.amount}</span>
                    <h4>${basketElement.name}</h4>
                    <span class="basket-item-price">${formattedSubtotal} €</span>
                </div>
                <div class="note-add-remove">
                    <a onclick="openNoteInput(${i})">Anmerkung hinzufügen</a>
                    <div class="add-remove-box">
                        <img class="add-remove" src="img/minus-2-16.png" alt="" onclick="decreaseBasketElement('${basketElement['name']}')">
                        <img class="add-remove" src="img/plus-8-16.png" alt="" onclick="increaseBasketElement('${basketElement['name']}')">
                    </div>
                </div>
                <div class="savedNote" id="savedNote${i}"></div>
                <div class="note-container d-none" id="note-container-${i}"> 
                    <textarea name="Anmerkungen" id="note${i}" rows="3"></textarea>
                    <div class="note-container-links">
                        <a onclick="closeNoteInput(${i})">abbrechen</a>
                        <a onclick="saveNote(${i})">hinzufügen</a>
                    </div>
                </div>
            </div>
    `;
    }
}


function renderBasketFinance(basketContainer) { // Finanz-Informationen anzeigen
    const costs = calculateBasketFinance(); // Objekt aus dem return-Statement der Funktion rausholen und der Variable costs zuweisen
    const formattedSubtotal = costs['subtotal'].toFixed(2).replace('.', ','); // einzelne Variablen aus dem Objekt holen und neuer Variable zuweisen (übersichtlicher)
    const formattedDeliveryCosts = costs['deliveryCosts'].toFixed(2).replace('.', ',');
    const formattedTotalPrice = costs['totalPrice'].toFixed(2).replace('.', ',');

    basketContainer.innerHTML += /*html*/ `
    <div class="basket-finance">
        <div class="basket-finance-line">
            <span>Zwischensumme</span>
            <span>${formattedSubtotal} €</span>
        </div>
        <div class="basket-finance-line">
            <span>Lieferkosten</span>
            <span>${formattedDeliveryCosts} €</span>
        </div>
        <div class="basket-finance-line">
            <span><b>Gesamt</b></span>
            <span><b>${formattedTotalPrice} €</b></span>
        </div>
    </div>
    <button onclick="orderAll()">Bezahlen (${formattedTotalPrice} €)</button>
`;
}


function calculateBasketFinance() { // Finanzinformationen berechnen
    let deliveryCosts = 5.20; // Lieferkosten sind fix
    let subtotal = 0;

    for (let i = 0; i < basket.length; i++) { // berechnet die Zwischensumme, indem es das Array durchläuft und an jeder Stelle Preis * Menge rechnet und die Ergebnisse addiert
        const basketElement = basket[i];
        subtotal += basketElement['price'] * basketElement['amount'];
    }
    const totalPrice = subtotal + deliveryCosts; // Gesamtpreis berechnen

    return {subtotal, deliveryCosts, totalPrice }; // mehrere Variablen als Objekt zurückgeben
}


function openNoteInput(i) { // Notiz-Feld im Warenkorb öffnen
    document.getElementById('note-container-' + i).classList.remove('d-none');
}


function closeNoteInput(i) {
    document.getElementById('note-container-' + i).classList.add('d-none');
}


function saveNote(i) {
    let note = document.getElementById('note' + i).value;
    basket[i].note = note;
    document.getElementById('savedNote' + i).innerHTML = note;
    document.getElementById('note' + i).value = '';
    closeNoteInput(i);
}


function orderAll() {
    alert('Bereiten Sie Messer und Gabel vor, Ihre Bestellung ist unterwegs ;-)');
}


function writePriceToButton() {
    const costs = calculateBasketFinance();
    const formattedCosts = costs['subtotal'].toFixed(2).replace('.', ',')
    document.getElementById('button-open-basket-price').innerHTML = `(${formattedCosts} €)`;
}


function openShoppingBasket() {
    document.getElementById('shopping-basket-overlay').classList.remove('d-none');
    document.getElementById('button-open-basket').classList.add('d-none');
    document.getElementById('mainpage').classList.add('d-none');
    render();
    document.getElementById('basket-right').innerHTML = ''; // löscht im Hintergrund den nicht angezeigten Warenkorb rechts - zwar nicht ganz sauber aber löst hier das Problem mit den doppelten IDs
}


function closeShoppingBasket() {
    document.getElementById('shopping-basket-overlay').classList.add('d-none');
    document.getElementById('button-open-basket').classList.remove('d-none');
    document.getElementById('mainpage').classList.remove('d-none');
}