// Zadanie 10
const jezyki = ["HTML", "CSS", "JavaScript"];
console.log("Czy zawiera JavaScript:", jezyki.includes("JavaScript"));
console.log("Czy zawiera Python:", jezyki.includes("Python"));

// Zadanie 11
const miasta = ["Warszawa", "Kraków", "Gdańsk"];
console.log("Indeks Warszawy:", miasta.indexOf("Warszawa"));
console.log("Indeks Poznania:", miasta.indexOf("Poznań"));
// Wyjaśnienie: Wynik -1 oznacza, że dany element nie został odnaleziony w tablicy.

// Zadanie 12
const uzytkownicy = [
  { id: 1, imie: "Anna" },
  { id: 2, imie: "Piotr" },
  { id: 3, imie: "Ewa" }
];
const szukanyUzytkownik = uzytkownicy.find(u => u.id === 2);
console.log(szukanyUzytkownik);

// Zadanie 13
const oceny = [5, 4, 3, 5, 2];
console.log("Czy występuje 2:", oceny.some(o => o === 2));
console.log("Czy wszystkie >= 2:", oceny.every(o => o >= 2));

// Zadanie 14
const produktySzukane = [
  { nazwa: "Myszka", cena: 80 },
  { nazwa: "Laptop", cena: 3500 },
  { nazwa: "Klawiatura", cena: 150 }
];
const indeksDrogiego = produktySzukane.findIndex(p => p.cena > 1000);
console.log("Indeks produktu > 1000 zł:", indeksDrogiego);