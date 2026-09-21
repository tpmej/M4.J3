// Zadanie 34
const produktyHTML = [
  { nazwa: "Laptop", cena: 3000, stan: 5 },
  { nazwa: "Myszka", cena: 50, stan: 0 },
  { nazwa: "Klawiatura", cena: 100, stan: 2 }
];

const kodHTML = produktyHTML
  .filter(p => p.stan > 0)
  .map(p => `<li>${p.nazwa} - ${p.cena} zł</li>`)
  .join("");
console.log("Kod HTML listy:\n", kodHTML);

// Zadanie 35
// (Kod wykonywany w środowisku przeglądarki z plikiem HTML)
const daneZFormularza = Array.from(document.querySelectorAll("input"))
  .map(input => input.value.trim())
  .filter(wartosc => wartosc !== "");
console.log("Pobrane dane z formularza:", daneZFormularza);