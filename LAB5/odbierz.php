<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Odbiór danych</title>
</head>
<body>
    <h2>Wynik wysłania formularza</h2>

<?php
// Zadanie 22 i 23: Odbiór zmiennych POST
$imie = $_POST["imie"] ?? "";
$email = $_POST["email"] ?? "";
$temat = $_POST["temat"] ?? "";
$wiadomosc = $_POST["wiadomosc"] ?? "";
$zgoda = $_POST["zgoda"] ?? "";

$bledy = [];

// Zadanie 25: Wymagane dane w PHP
if (trim($imie) === "") {
    $bledy[] = "Imię jest wymagane.";
} elseif (strlen(trim($imie)) < 2) {
    $bledy[] = "Imię musi mieć min. 2 znaki.";
}

if (trim($wiadomosc) === "") {
    $bledy[] = "Wiadomość nie może być pusta.";
}

// Zadanie 26: Sprawdzenie e-maila
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $bledy[] = "Niepoprawny format adresu e-mail.";
}

// Zadanie 27: Zgoda w PHP
if ($zgoda !== "on") {
    $bledy[] = "Musisz zaakceptować regulamin.";
}

// Zadanie 28: Komunikat sukcesu lub błędów
if (count($bledy) > 0) {
    echo "<h3 style='color: red;'>Wystąpiły błędy:</h3><ul>";
    foreach ($bledy as $b) {
        echo "<li>" . htmlspecialchars($b, ENT_QUOTES, "UTF-8") . "</li>";
    }
    echo "</ul>";
    echo "<a href='index.php'>Wróć do formularza</a>";
} else {
    // Zadanie 24: Bezpieczne wyświetlanie
    $bezpieczneImie = htmlspecialchars($imie, ENT_QUOTES, "UTF-8");
    $bezpiecznyEmail = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
    $bezpiecznyTemat = htmlspecialchars($temat, ENT_QUOTES, "UTF-8");
    $bezpiecznaWiadomosc = htmlspecialchars($wiadomosc, ENT_QUOTES, "UTF-8");

    echo "<p style='color: green;'>Dziękujemy! Formularz został wysłany poprawnie.</p>";
    echo "<h3>Odebrane dane:</h3>";
    echo "<p><strong>Imię:</strong> " . $bezpieczneImie . "</p>";
    echo "<p><strong>E-mail:</strong> " . $bezpiecznyEmail . "</p>";
    echo "<p><strong>Temat:</strong> " . $bezpiecznyTemat . "</p>";
    echo "<p><strong>Wiadomość:</strong> " . $bezpiecznaWiadomosc . "</p>";
}
?>

</body>
</html>