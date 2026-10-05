// Zadanie 44. Kalkulator. Utwórz dwie liczby i zmienną dzialanie. W zależności od wartości "+" lub "-" wykonaj odpowiednie działanie.
let num1 = 10;
let num2 = 5;
let dzialanie = "+";

if (dzialanie === "+") {
  console.log(num1 + num2);
} else if (dzialanie === "-") {
  console.log(num1 - num2);
}

// Zadanie 45. Pole koła. Dla promienia r = 5 oblicz pole koła. Użyj Math.PI.
let r = 5;
let poleKola = Math.PI * r * r;
console.log(poleKola);

// Zadanie 46. Losowanie. Wylosuj liczbę za pomocą Math.random() i wyświetl ją w konsoli.
let losowa = Math.random();
console.log(losowa);

// Zadanie 47. Losowanie 1-10. Wylosuj liczbę całkowitą od 1 do 10.
let losowa1do10 = Math.floor(Math.random() * 10) + 1;
console.log(losowa1do10);

// Zadanie 48. Przelicznik temperatury. Dla celsius = 20 oblicz temperaturę w stopniach Fahrenheita według wzoru F = C * 1.8 + 32.
let celsius = 20;
let fahrenheit = celsius * 1.8 + 32;
console.log(fahrenheit);

// Zadanie 49. Średnia ocen. Utwórz trzy zmienne z ocenami. Oblicz ich średnią i wyświetl wynik.
let ocena1 = 4;
let ocena2 = 5;
let ocena3 = 3;
let sredniaOcen = (ocena1 + ocena2 + ocena3) / 3;
console.log(sredniaOcen);

// Zadanie 50. Koszt zamówienia. Ustaw cenę produktu, liczbę sztuk i koszt dostawy. Oblicz całkowity koszt zamówienia.
let cenaProdukt = 50;
let ilosc = 3;
let kosztDostawy = 15;
let calkowityKoszt = (cenaProdukt * ilosc) + kosztDostawy;
console.log(calkowityKoszt);

// Zadanie 51. Darmowa dostawa. Jeżeli wartość zamówienia wynosi co najmniej 200 zł, wyświetl Darmowa dostawa, w przeciwnym razie Dostawa płatna.
let wartoscZamowienia = 250;
if (wartoscZamowienia >= 200) {
  console.log("Darmowa dostawa");
} else {
  console.log("Dostawa płatna");
}

// Zadanie 52. BMI - obliczenie. Ustaw waga = 70 i wzrost = 1.75. Oblicz BMI = waga / (wzrost * wzrost) i wyświetl wynik.
let waga = 70;
let wzrost = 1.75;
let bmi = waga / (wzrost * wzrost);
console.log(bmi);

// Zadanie 53. Czas. Ustaw liczbę minut na 150. Oblicz, ile to pełnych godzin i ile pozostałych minut.
let minuty = 150;
let godziny = Math.floor(minuty / 60);
let resztaMinut = minuty % 60;
console.log(`${godziny} godz. ${resztaMinut} min.`);

// Zadanie 54. Reszta z zakupów. Klient ma 100 zł, a zakupy kosztują 73 zł. Oblicz i wyświetl resztę.
let kwota = 100;
let kosztZakupow = 73;
let reszta = kwota - kosztZakupow;
console.log(reszta);

// Zadanie 55. Rok urodzenia. Ustaw aktualny rok i wiek osoby. Oblicz przybliżony rok urodzenia.
let aktualnyRok = new Date().getFullYear();
let wiekOsoby = 20;
let rokUrodzenia = aktualnyRok - wiekOsoby;
console.log(rokUrodzenia);