function render() {
    renderMealCategoryLinks(); // rendert den Scroll-Container mit den Links zu den meal-Kategorien
    renderMealsContainer(); // rendert den zentralen Container mit den Kategorien und den Mahlzeiten
    writePriceToButton(); // schreibt den Preis in den button "Warenkorb öffnen" in der responsive-Ansicht
    renderShoppingBasketRight(); // rendert den Warenkorb rechts (Inhalt, Preis, Buttons usw.)
    renderShoppingBasketOverlay(); // rendert das Warenkorb-Overlay
}


function renderMealCategoryLinks() { // auch die Links können sich je nach Restaurant ändern --> mit innerHTML dynamisch aus Array schreiben
    let mealCategoryContainer = document.getElementById('meal-category-links');
    let categories = searchAllCategories(); // wir suchen alle vorhandenen Kategorien im Array meals (können ja je nach Restaurant unterschiedlich sein)
    mealCategoryContainer.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        mealCategoryContainer.innerHTML += /*html*/ `
            <a href="#${categories[i]}">${categories[i]}</a>
        `;
    }
}


function renderMealsContainer() {
    let mealsContainer = document.getElementById('meals'); // wir holen uns den Container per ID aus dem hard gecodeten HTML Teil
    mealsContainer.innerHTML = ''; // Container wird beim Aufruf der Funktion geleert

    let categories = searchAllCategories(); // wir suchen alle vorhandenen Kategorien im Array meals (können ja je nach Restaurant unterschiedlich sein)

    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) { // wir durchlaufen das Array, in dem NUR die Kategorien enthalten sind. ACHTUNG: Index muss hier anders als i sein, da in Funktion darunter wieder i vorkommt
        renderHeader(categories[categoryIndex], mealsContainer); // Header der Kategorie rendern
        renderMeal(categories[categoryIndex], mealsContainer); // Mahlzeiten der Kategorie rendern
    }
}


function renderHeader(category, mealsContainer) {
    let selectedFoods = getCategory(category); // generiert eigenes Array, wo nur mehr die Elemente der gesuchten Kategorie drin sind
    const selectedFood = selectedFoods[0]; // wir wollen header nur 1x pro Kategorie schreiben, deshalb das eigene Array nur an Stelle 0 auslesen
    mealsContainer.innerHTML += /*html*/ `
    <div id="${selectedFood['category']}" class="category-header">
        <img class="category-image" src="img/category/${selectedFood['category']}.jpg" alt=""> 
        <h2 class="category-name">${selectedFood['category']}</h2>
    </div>
    `;
}


function renderMeal(category, mealsContainer) {
    let selectedFoods = getCategory(category); // generiert eigenes Array, wo nur mehr die Elemente der gesuchten Kategorie drin sind

    for (let i = 0; i < selectedFoods.length; i++) { // durchläuft das eigene Array, wo nur mehr die Elemente der gesuchten Kategorie drin sind
        const selectedFood = selectedFoods[i]; // eigene Variable selectedFood, die sich bei jedem Durchlauf ändert -- macht es übersichtlicher
        const price = selectedFood['price'].toFixed(2);
        mealsContainer.innerHTML += /*html*/ `
            <div class="meal" onclick="addMeal('${selectedFood['name']}', ${selectedFood['price']})">
                <div>
                    <h3 class="meal-name">${selectedFood['name']}</h3>
                    <span class="meal-ingredients">${selectedFood['ingredients']}</span><br>
                    <span class="meal-choose">${selectedFood['choose']}</span><br>
                    <span class="meal-price">${price} €</span>
                </div>
            <div>
            <img class="add-button" src="img/plus-8-16.png" alt=""> 
        </div>
    </div> `;
    }
}


function getCategory(handoverCategory) { // sucht alle Kategorien, die den Filter-Kriterien entsprechen
    return meals.filter(f => f.category == handoverCategory) // nach dem == bedeuted category die von der Funktion übergebene category; vor dem == ist category die Bezeichnung im Array
}


function searchAllCategories() { // sucht alle Kategorien an Gerichten, die das Restaurant anbietet
    let allCategories = []; // neues Array deklarieren --> da pushen wir jede einzelne Kategorie rein, aber immer nur je 1x

    for (let i = 0; i < meals.length; i++) { // wir durchlaufen das große Array meals
        const meal = meals[i]; // wir schauen jede einzelne Stelle im großen Array an --> deshalb Zuweisung an eigene Variable --> ist einfacher
        if (allCategories.includes(meal.category) == false) { // wenn im Kategorie-Array eine Kategorie aus dem großen Array fehlt pushen wir sie rein (wollen keine Kategorie doppelt!)
            allCategories.push(meal.category);
        }
    }
    return allCategories; // die Funktion gibt das Array zurück (drin sind alle Kategorien von Produkten, die das Restaurant anbietet)
}
