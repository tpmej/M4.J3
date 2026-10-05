// Zadanie 19. Utwórz zmienną z rokiem urodzenia i oblicz przybliżony wiek użytkownika.
let rokUrodzenia = 2005;
let obecnyRok = new Date().getFullYear();
let wiek = obecnyRok - rokUrodzenia;
console.log(`Przybliżony wiek: ${wiek} lat`);

// Zadanie 20. Produkt kosztuje 35 zł, a klient kupuje 4 sztuki. Oblicz i wyświetl całkowity koszt.
let cenaJednostkowa = 35;
let iloscSztuk = 4;
let kosztCalkowity = cenaJednostkowa * iloscSztuk;
console.log(`Całkowity koszt: ${kosztCalkowity} zł`);

// Zadanie 21. Ustaw temperaturę na 28. Jeśli jest większa lub równa 25, wyświetl Ciepło, w przeciwnym razie Chłodno.
let temperatura = 28;
if (temperatura >= 25) {
  console.log("Ciepło");
} else {
  console.log("Chłodno");
}