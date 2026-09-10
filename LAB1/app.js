// app.js

// Czekamy, aż cały dokument HTML zostanie załadowany (dobra praktyka)
document.addEventListener("DOMContentLoaded", () => {
    
    // Pobieranie elementów z DOM
    const heading = document.getElementById("main-heading");
    const description = document.getElementById("description");
    const button = document.getElementById("action-btn");

    // Sprawdzamy w konsoli, czy elementy zostały poprawnie pobrane
    console.log("Strona załadowana, elementy DOM pobrane pomyślnie.");

    // Dodanie nasłuchiwania zdarzenia 'click' na przycisku
    button.addEventListener("click", () => {
        // Zmiana tekstu
        heading.textContent = "Tekst został zmieniony!";
        description.textContent = "Gratulacje, Twój skrypt JavaScript działa poprawnie. Otwórz konsolę, aby sprawdzić logi.";
        
        // Zmiana koloru nagłówka (dodatkowy efekt)
        heading.style.color = "#28a745";

        // Informacja w konsoli po udanej akcji
        console.log("Przycisk został kliknięty. Tekst uległ zmianie.");
    });
});