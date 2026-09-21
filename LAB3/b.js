// Zadanie 6
const koszyk = ["chleb", "mleko"];
koszyk.push("ser");
const usunietyProdukt = koszyk.pop();
console.log("Usunięty produkt:", usunietyProdukt);

// Zadanie 7
const kolejka = ["Ola", "Jan", "Ewa"];
kolejka.unshift("Ala");
kolejka.shift();
console.log("Końcowa kolejka:", kolejka);

// Zadanie 8
const liczbySplice = [10, 20, 30, 40, 50];
liczbySplice.splice(2, 1, 99);
console.log(liczbySplice);

// Zadanie 9
const litery = ["A", "B", "C", "D", "E"];
const fragment = litery.slice(1, 4);
console.log("Nowa tablica:", fragment);
console.log("Oryginał:", litery);