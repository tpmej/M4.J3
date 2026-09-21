// Zadanie 15
const tabDrogowskaz = ["A", "B", "C"];
for (let i = 0; i < tabDrogowskaz.length; i++) {
  console.log(`Indeks: ${i}, Wartość: ${tabDrogowskaz[i]}`);
}

// Zadanie 16
const liczbySuma = [5, 10, 15, 20];
let suma = 0;
for (const liczba of liczbySuma) {
  suma += liczba;
}
console.log("Suma pętli for...of:", suma);

// Zadanie 17
const imionaForEach = ["Ala", "Jan", "Ewa"];
imionaForEach.forEach((imie, i) => {
  console.log(`${i + 1}. ${imie}`);
});