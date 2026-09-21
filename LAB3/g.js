// Zadanie 29 ★
const duplikaty = ["js", "html", "js", "css", "html"];
const unikalne = [...new Set(duplikaty)];
console.log(unikalne);

// Zadanie 30 ★
const od1do20 = Array.from({ length: 20 }, (_, i) => i + 1);
console.log(od1do20);

// Zadanie 31 ★
const macierz = [[1, 2], [3, 4], [5, 6]];
console.log(macierz.flat());

// Zadanie 32 ★
const wynikLancucha = Array.from({ length: 20 }, (_, i) => i + 1)
  .filter(x => x % 2 === 0)
  .map(x => x ** 2)
  .reduce((acc, curr) => acc + curr, 0);
console.log("Suma kwadratów liczb parzystych 1-20:", wynikLancucha);

// Zadanie 33 ★
const uczniowie = [
  { imie: "Jan", punkty: 80 },
  { imie: "Anna", punkty: 95 },
  { imie: "Piotr", punkty: 60 },
  { imie: "Ewa", punkty: 88 }
];
const rankingImion = uczniowie
  .sort((a, b) => b.punkty - a.punkty)
  .map(u => u.imie);
console.log("Ranking:", rankingImion);