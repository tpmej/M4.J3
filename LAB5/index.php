<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularz kontaktowy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <form action="odbierz.php" method="post" id="formularz">
        <h2>Formularz kontaktowy</h2>

        <p id="powitanie"></p>

        <label for="imie">Imię:</label><br>
        <input type="text" id="imie" name="imie" required>
        <span id="blad-imie" class="blad"></span>
        <br><br>

        <label for="email">E-mail:</label><br>
        <input type="email" id="email" name="email" placeholder="jan@example.com" required>
        <span id="blad-email" class="blad"></span>
        <br><br>

        <label for="temat">Temat:</label><br>
        <select id="temat" name="temat">
            <option value="Pytanie">Pytanie</option>
            <option value="Zgłoszenie">Zgłoszenie</option>
            <option value="Inne">Inne</option>
        </select>
        <br><br>

        <label for="wiadomosc">Wiadomość:</label><br>
        <textarea id="wiadomosc" name="wiadomosc" rows="3" maxlength="200" required></textarea>
        <div>Znaki: <span id="licznik">0</span> / Pozostało: <span id="pozostalo">200</span></div>
        <span id="blad-wiadomosc" class="blad"></span>
        <br><br>

        <label>
            <input type="checkbox" id="zgoda" name="zgoda" required> Akceptuję regulamin
        </label>
        <span id="blad-zgoda" class="blad"></span>
        <br><br>

        <button type="submit">Wyślij</button>
        <button type="button" id="btnTest">Testuj imię</button>
    </form>

    <script src="script.js"></script>
</body>
</html>