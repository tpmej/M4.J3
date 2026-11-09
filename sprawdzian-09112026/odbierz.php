<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $imie = htmlspecialchars(trim($_POST['imie'] ?? ''));
    $wiadomosc = htmlspecialchars(trim($_POST['wiadomosc'] ?? ''));

    if (!empty($imie)) {
        echo "<h2>Witaj, $imie!</h2>";
        echo "<p>Otrzymaliśmy Twoją wiadomość: <em>$wiadomosc</em></p>";
    } else {
        echo "<p>Błąd: Nie wprowadzono imienia.</p>";
    }
}
?>