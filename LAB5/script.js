console.log("Skrypt działa");

const imieInput = document.getElementById("imie");
const emailInput = document.getElementById("email");
const wiadomoscInput = document.getElementById("wiadomosc");
const zgodaInput = document.getElementById("zgoda");
const formularz = document.getElementById("formularz");

const powitanie = document.getElementById("powitanie");
const licznik = document.getElementById("licznik");
const pozostalo = document.getElementById("pozostalo");

// Zadanie 12 i 13: Przycisk testowy i powitanie
document.getElementById("btnTest").addEventListener("click", function () {
    const imieVal = imieInput.value;
    powitanie.innerText = "Witaj, " + imieVal;
});

// Zadanie 14 i 15: Licznik znaków
wiadomoscInput.addEventListener("input", function () {
    const dlugosc = wiadomoscInput.value.length;
    licznik.innerText = dlugosc;
    pozostalo.innerText = 200 - dlugosc;
});

// Zadanie 16-20: Walidacja przed wysłaniem
formularz.addEventListener("submit", function (e) {
    let czyBlad = false;

    // Czyszczenie starych błędów
    document.getElementById("blad-imie").innerText = "";
    document.getElementById("blad-email").innerText = "";
    document.getElementById("blad-zgoda").innerText = "";

    // Zadanie 16 i 17: Puste imię i min. 2 znaki
    const imieTekst = imieInput.value.trim();
    if (imieTekst === "") {
        document.getElementById("blad-imie").innerText = " Imię nie może być puste!";
        czyBlad = true;
    } else if (imieTekst.length < 2) {
        document.getElementById("blad-imie").innerText = " Imię musi mieć co najmniej 2 znaki!";
        czyBlad = true;
    }

    // Zadanie 18: Poprawny e-mail
    if (!emailInput.checkValidity()) {
        document.getElementById("blad-email").innerText = " Wprowadź poprawny adres e-mail!";
        czyBlad = true;
    }

    // Zadanie 19: Zgoda
    if (!zgodaInput.checked) {
        document.getElementById("blad-zgoda").innerText = " Musisz zaakceptować regulamin!";
        czyBlad = true;
    }

    // Zadanie 20: Blokowanie wysyłki przy błędach
    if (czyBlad) {
        e.preventDefault();
    }
});