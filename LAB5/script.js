var imieInput = document.getElementById("imie");
var wiadomoscInput = document.getElementById("wiadomosc");
var formularz = document.getElementById("formularz");
var powitanie = document.getElementById("powitanie");
var licznik = document.getElementById("licznik");
var pozostalo = document.getElementById("pozostalo");

function pobierzImie() {
    if (imieInput === null) {
        return "";
    }
    return imieInput.value;
}

function sprawdzDlugoscTekstu() {
    var ile = wiadomoscInput.value.length;
    licznik.innerText = ile;
    pozostalo.innerText = 200 - ile;
}

function ustawPowitanie() {
    var wynik = pobierzImie();
    if (wynik.trim() === "") {
        powitanie.innerText = "";
    } else {
        powitanie.innerText = "Witaj, " + wynik;
    }
}

function wyczyscBledy() {
    var imieBlad = document.getElementById("blad-imie");
    var emailBlad = document.getElementById("blad-email");
    var zgodaBlad = document.getElementById("blad-zgoda");

    if (imieBlad !== null) {
        imieBlad.innerText = "";
    }
}

function czyImieJestOK() {
    var tekst = pobierzImie().trim();
    var blad = document.getElementById("blad-imie");

    if (tekst === "") {
        blad.innerText = " Imię nie może być puste!";
        return false;
    }

    if (tekst.length < 2) {
        blad.innerText = " Imię musi mieć co najmniej 2 znaki!";
        return false;
    }

    return true;
}

if (przyciskTest !== null) {
    przyciskTest.addEventListener("click", function () {
        ustawPowitanie();
    });
}

if (wiadomoscInput !== null) {
    wiadomoscInput.addEventListener("input", function () {
        sprawdzDlugoscTekstu();
    });
}

if (formularz !== null) {
    formularz.addEventListener("submit", function (event) {
        var czyBlad = false;

        wyczyscBledy();

        if (!czyImieJestOK()) {
            czyBlad = true;
        }

        if (czyBlad === true) {
            event.preventDefault();
        }
    });
}

if (wiadomoscInput !== null) {
    sprawdzDlugoscTekstu();
}

if (imieInput !== null) {
    imieInput.addEventListener("input", function () {
        ustawPowitanie();
    });
}