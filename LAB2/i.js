// Zadanie 47
let kolor = "zielony";

if (kolor === "zielony") {
  console.log("JEDŹ");
} else if (kolor === "żółty") {
  console.log("UWAGA");
} else if (kolor === "czerwony") {
  console.log("STOP");
}


// Zadanie 48
let punkty = 85;

if (punkty >= 90) {
  console.log(5);
} else if (punkty >= 75) {
  console.log(4);
} else if (punkty >= 50) {
  console.log(3);
} else {
  console.log(2);
}


// Zadanie 49
let opcja = 1;

switch (opcja) {
  case 1:
    console.log("Nowa gra");
    break;
  case 2:
    console.log("Ustawienia");
    break;
  case 3:
    console.log("Wyjście");
    break;
  default:
    console.log("Nieznana opcja");
}


// Zadanie 50
let login = "admin";
let haslo = "1234";

if (login === "admin" && haslo === "1234") {
  console.log("Zalogowano");
} else {
  console.log("Błędne dane");
}