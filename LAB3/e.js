// Zadanie 18
const podwojone = [1, 2, 3, 4, 5].map(x => x * 2);
console.log(podwojone);

// Zadanie 19
const cenyNetto = [100, 250, 80];
const cenyBrutto = cenyNetto.map(c => Number((c * 1.23).toFixed(2)));
console.log(cenyBrutto);

// Zadanie 20
const przefiltrowaneLiczby = [3, 12, 7, 25, 18, 2].filter(x => x >= 10);
console.log(przefiltrowaneLiczby);

// Zadanie 21
const magazyn = [
  { nazwa: "Myszka", stan: 10 },
  { nazwa: "Monitor", stan: 0 },
  { nazwa: "Klawiatura", stan: 5 }
];
const dostepne = magazyn.filter(p => p.stan > 0);
console.log(dostepne);

// Zadanie 22
const sumaReduce = [10, 20, 30, 40].reduce((acc, curr) => acc + curr, 0);
console.log("Suma reduce:", sumaReduce);

// Zadanie 23
const koszykProjekt = [
  { cena: 100, szt: 2 },
  { cena: 50, szt: 1 },
  { cena: 200, szt: 3 }
];
const wartoscKoszyka = koszykProjekt.reduce((acc, item) => acc + item.cena * item.szt, 0);
console.log("Łączna wartość koszyka:", wartoscKoszyka);