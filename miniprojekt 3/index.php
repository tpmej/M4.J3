<?php
// 1. Pobierz aktualną godzinę (00-23)
$godzina = (int)date('H');

// 2. Warunek ustalający powitanie (06:00 do 17:59)
if ($godzina >= 6 && $godzina <= 17) {
    $powitanie = "Dzień dobry!";
} else {
    $powitanie = "Dobry wieczór!";
}

// 3. Tablica z cytatami i losowanie
$cytaty = [
    "Najlepszy sposób na przewidzenie przyszłości to jej stworzenie.",
    "Każda wielka podróż zaczyna się od pierwszego kroku.",
    "Sukces to suma niewielkich wysiłków powtarzanych z dnia na dzień.",
    "Jedyne ograniczenie to to, które sam sobie narzucisz."
];

$losowyKlucz = array_rand($cytaty);
$wylosowanyCytat = $cytaty[$losowyKlucz];
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamiczna Karta Powitalna</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="card">
        <h1><?php echo $powitanie; ?></h1>
        <p class="quote">„<?php echo $wylosowanyCytat; ?>”</p>
        <button id="themeToggle">Zmień motyw</button>
        <button onclick="location.reload();">Losuj inny cytat</button>
    </div>
    <script src="script.js"></script>
</body>
</html>