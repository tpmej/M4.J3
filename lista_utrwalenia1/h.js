// Zadanie 34. Dla liczba = -5 wyświetl dodatnia albo ujemna lub zero.
let liczba34 = -5;
if (liczba34 > 0) {
  console.log("Dodatnia");
} else if (liczba34 < 0) {
  console.log("Ujemna");
} else {
  console.log("Zero");
}

// Zadanie 35. Dla punkty = 75 wyświetl zaliczone, jeśli liczba punktów wynosi co najmniej 50.
let punkty = 75;
if (punkty >= 50) {
  console.log("Zaliczone");
}

// Zadanie 36. Ustaw login = "admin". Jeśli login jest poprawny, wyświetl Witaj administratorze.
let login36 = "admin";
if (login36 === "admin") {
  console.log("Witaj administratorze");
}

// Zadanie 37. Ustaw login = "admin" i haslo = "1234". Wyświetl Zalogowano tylko wtedy, gdy obie wartości są poprawne.
let login37 = "admin";
let haslo37 = "1234";
if (login37 === "admin" && haslo37 === "1234") {
  console.log("Zalogowano");
}

// Zadanie 38. Dla temperatury wyświetl gorąco dla temperatury powyżej 25°C, ciepło dla co najmniej 15°C, a w pozostałych przypadkach zimno.
let temperatura = 20;
if (temperatura > 25) {
  console.log("Gorąco");
} else if (temperatura >= 15) {
  console.log("Ciepło");
} else {
  console.log("Zimno");
}