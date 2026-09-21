// Zadanie 24
const doPosortowania = [2, 10, 3, 25, 1];
const rosnamco = [...doPosortowania].sort((a, b) => a - b);
const malejaco = [...doPosortowania].sort((a, b) => b - a);
console.log("Rosnąco:", rosnamco);
console.log("Malejąco:", malejaco);

// Zadanie 25
const tabA = [1, 2, 3];
const tabB = [...tabA];
tabB.push(99);
console.log("Tablica a:", tabA);
console.log("Tablica b:", tabB);

// Zadanie 26
const t1 = [1, 2, 3];
const t2 = [4, 5, 6];
const polaczoneSpread = [...t1, ...t2];
const polaczoneConcat = t1.concat(t2);
console.log("Spread:", polaczoneSpread);
console.log("Concat:", polaczoneConcat);

// Zadanie 27
const skroty = ["HTML", "CSS", "JS"];
console.log(skroty.join(" | "));

// Zadanie 28
const tekstImiona = "Ala;Ola;Jan;Ewa";
console.log(tekstImiona.split(";"));