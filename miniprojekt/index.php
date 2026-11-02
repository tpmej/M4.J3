<?php
// ===== BACKEND: odbiór i walidacja danych =====
$klasy = ['Wojownik', 'Mag', 'Łotrzyk'];
$kolory = ['Wojownik' => '#ff4d5e', 'Mag' => '#4da3ff', 'Łotrzyk' => '#3dff9a'];
$ikony = ['Wojownik' => '⚔️', 'Mag' => '🔮', 'Łotrzyk' => '🗡️'];

$bledy = [];
$postac = null;

$imie = '';
$klasa = 'Wojownik';
$sila = '';
$zrecznosc = '';
$inteligencja = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $imie = isset($_POST['imie']) ? trim($_POST['imie']) : '';
    $klasa = isset($_POST['klasa']) ? $_POST['klasa'] : '';
    $sila = isset($_POST['sila']) ? trim($_POST['sila']) : '';
    $zrecznosc = isset($_POST['zrecznosc']) ? trim($_POST['zrecznosc']) : '';
    $inteligencja = isset($_POST['inteligencja']) ? trim($_POST['inteligencja']) : '';

    if ($imie === '') {
        $bledy[] = 'Pole „Imię” nie może być puste.';
    } elseif (mb_strlen($imie) > 30) {
        $bledy[] = 'Imię może mieć maksymalnie 30 znaków.';
    }

    if (!in_array($klasa, $klasy, true)) {
        $bledy[] = 'Wybierz poprawną klasę postaci.';
        $klasa = 'Wojownik';
    }

    $statystyki = [
        'Siła' => $sila,
        'Zręczność' => $zrecznosc,
        'Inteligencja' => $inteligencja,
    ];
    foreach ($statystyki as $nazwa => $wartosc) {
        if ($wartosc === '') {
            $bledy[] = "Pole „$nazwa” nie może być puste.";
        } else {
            $liczba = filter_var($wartosc, FILTER_VALIDATE_INT);
            if ($liczba === false || $liczba < 1 || $liczba > 20) {
                $bledy[] = "Pole „$nazwa” musi być liczbą całkowitą z zakresu 1–20.";
            }
        }
    }

    if (empty($bledy)) {
        $sila = (int)$sila;
        $zrecznosc = (int)$zrecznosc;
        $inteligencja = (int)$inteligencja;

        $hp = ($sila * 10) + ($zrecznosc * 2);

        $postac = [
            'imie' => $imie,
            'klasa' => $klasa,
            'sila' => $sila,
            'zrecznosc' => $zrecznosc,
            'inteligencja' => $inteligencja,
            'hp' => $hp,
        ];
    }
}

$kolorStartowy = $kolory[$klasa] ?? $kolory['Wojownik'];

function e($tekst)
{
    return htmlspecialchars((string)$tekst, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kreator Postaci RPG</title>
    <style>
        :root {
            --tlo: #090b14;
            --powierzchnia: #121628;
            --powierzchnia-2: #1a1f38;
            --linia: #2a3157;
            --tekst: #e9ecff;
            --tekst-przyg: #8a92c4;
            --neon: #c04dff;
            --akcent: <?= e($kolorStartowy) ?>;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            color: var(--tekst);
            font-family: 'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif;
            background:
                radial-gradient(ellipse at 15% 0%, rgba(192, 77, 255, 0.22), transparent 55%),
                radial-gradient(ellipse at 90% 100%, rgba(77, 163, 255, 0.16), transparent 50%),
                repeating-linear-gradient(0deg, transparent 0 39px, rgba(255, 255, 255, 0.025) 39px 40px),
                repeating-linear-gradient(90deg, transparent 0 39px, rgba(255, 255, 255, 0.025) 39px 40px),
                var(--tlo);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 36px 16px 50px;
        }

        header {
            text-align: center;
            margin-bottom: 34px;
        }

        header small {
            display: block;
            font-family: 'Courier New', monospace;
            letter-spacing: 6px;
            color: var(--neon);
            font-size: 0.8rem;
            margin-bottom: 8px;
        }

        header h1 {
            margin: 0;
            font-size: clamp(2rem, 6vw, 3.4rem);
            font-weight: 900;
            letter-spacing: 2px;
            background: linear-gradient(90deg, #c04dff, #4da3ff, #3dff9a);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        /* ===== Układ główny: Grid ===== */
        .uklad {
            width: 100%;
            max-width: 960px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 28px;
            align-items: start;
        }

        .uklad.jedna {
            grid-template-columns: minmax(0, 460px);
            justify-content: center;
        }

        @media (max-width: 800px) {
            .uklad {
                grid-template-columns: 1fr;
            }
        }

        /* ===== Formularz ===== */
        .formularz {
            background: var(--powierzchnia);
            border: 2px solid var(--akcent);
            border-radius: 18px;
            padding: 26px;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.02), 0 12px 40px rgba(0, 0, 0, 0.5);
            transition: border-color 0.35s ease;
        }

        .formularz h2 {
            margin: 0 0 18px;
            font-size: 1.1rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--akcent);
            transition: color 0.35s ease;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .pole {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .pole span {
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--tekst-przyg);
        }

        .trzy {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        input,
        select,
        button {
            font-family: inherit;
            font-size: 1rem;
            color: var(--tekst);
        }

        input,
        select {
            width: 100%;
            padding: 12px 14px;
            background: var(--powierzchnia-2);
            border: 1px solid var(--linia);
            border-radius: 10px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus,
        select:focus {
            outline: none;
            border-color: var(--akcent);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        button {
            margin-top: 6px;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            cursor: pointer;
            color: #0a0c18;
            background: linear-gradient(90deg, #c04dff, #4da3ff);
            transition: transform 0.15s, filter 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
            filter: brightness(1.15);
        }

        .bledy {
            margin: 0 0 18px;
            padding: 12px 12px 12px 30px;
            border-left: 4px solid #ff4d5e;
            border-radius: 8px;
            background: rgba(255, 77, 94, 0.1);
            color: #ff9aa5;
            font-size: 0.88rem;
        }

        /* ===== Karta postaci ===== */
        .karta {
            --k: #ff4d5e;
            position: relative;
            background: linear-gradient(165deg, var(--powierzchnia-2), var(--powierzchnia) 60%);
            border: 2px solid var(--k);
            border-radius: 22px;
            padding: 0 0 24px;
            overflow: hidden;
            box-shadow: 0 0 40px color-mix(in srgb, var(--k) 35%, transparent), 0 12px 40px rgba(0, 0, 0, 0.6);
        }

        .karta-gora {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 22px 24px;
            background: linear-gradient(120deg, color-mix(in srgb, var(--k) 45%, #090b14), transparent);
            border-bottom: 1px solid var(--linia);
        }

        .awatar {
            flex: 0 0 68px;
            height: 68px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            background: var(--tlo);
            border: 2px solid var(--k);
            box-shadow: 0 0 18px var(--k);
        }

        .karta-gora h3 {
            margin: 0;
            font-size: 1.7rem;
            word-break: break-word;
        }

        .karta-gora p {
            margin: 2px 0 0;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
            text-transform: uppercase;
            font-size: 0.85rem;
            color: var(--k);
        }

        .karta-srodek {
            padding: 22px 24px 4px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .stat {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .stat-gora {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--tekst-przyg);
        }

        .stat-gora b {
            color: var(--tekst);
            font-size: 1rem;
        }

        .pasek {
            height: 10px;
            border-radius: 99px;
            background: #0b0e1d;
            border: 1px solid var(--linia);
            overflow: hidden;
        }

        .pasek i {
            display: block;
            height: 100%;
            border-radius: 99px;
            background: linear-gradient(90deg, color-mix(in srgb, var(--k) 40%, #fff 0%), var(--k));
            box-shadow: 0 0 10px var(--k);
        }

        .hp {
            margin: 10px 24px 0;
            padding: 16px 18px;
            border-radius: 14px;
            background: rgba(255, 77, 94, 0.1);
            border: 1px dashed #ff4d5e;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .hp span {
            letter-spacing: 3px;
            text-transform: uppercase;
            font-size: 0.85rem;
            color: #ff9aa5;
        }

        .hp strong {
            font-size: 2.2rem;
            color: #fff;
            text-shadow: 0 0 14px #ff4d5e;
        }

        .podpowiedz {
            text-align: center;
            padding: 40px 20px;
            border: 2px dashed var(--linia);
            border-radius: 22px;
            color: var(--tekst-przyg);
            font-size: 0.95rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>

    <header>
        <small>// CHARACTER CREATOR</small>
        <h1>Kreator Postaci</h1>
    </header>

    <main class="uklad">

        <section class="formularz" id="formularz">
            <h2>Nowa postać</h2>

            <?php if (!empty($bledy)): ?>
                <ul class="bledy">
                    <?php foreach ($bledy as $blad): ?>
                        <li><?= e($blad) ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <form method="post" action="">
                <label class="pole">
                    <span>Imię</span>
                    <input type="text" name="imie" required maxlength="30" placeholder="np. Aragorn" value="<?= e($imie) ?>">
                </label>

                <label class="pole">
                    <span>Klasa</span>
                    <select name="klasa" id="klasa" required>
                        <?php foreach ($klasy as $k): ?>
                            <option value="<?= e($k) ?>" <?= $klasa === $k ? 'selected' : '' ?>><?= e($k) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>

                <div class="trzy">
                    <label class="pole">
                        <span>Siła</span>
                        <input type="number" name="sila" required min="1" max="20" value="<?= e($sila) ?>">
                    </label>
                    <label class="pole">
                        <span>Zręcz.</span>
                        <input type="number" name="zrecznosc" required min="1" max="20" value="<?= e($zrecznosc) ?>">
                    </label>
                    <label class="pole">
                        <span>Intel.</span>
                        <input type="number" name="inteligencja" required min="1" max="20" value="<?= e($inteligencja) ?>">
                    </label>
                </div>

                <button type="submit">Stwórz postać</button>
            </form>
        </section>

        <?php if ($postac !== null): ?>
            <article class="karta" style="--k: <?= e($kolory[$postac['klasa']]) ?>">
                <div class="karta-gora">
                    <div class="awatar"><?= $ikony[$postac['klasa']] ?></div>
                    <div>
                        <h3><?= e($postac['imie']) ?></h3>
                        <p><?= e($postac['klasa']) ?></p>
                    </div>
                </div>

                <div class="karta-srodek">
                    <div class="stat">
                        <div class="stat-gora"><span>Siła</span><b><?= $postac['sila'] ?>/20</b></div>
                        <div class="pasek"><i style="width: <?= $postac['sila'] * 5 ?>%"></i></div>
                    </div>
                    <div class="stat">
                        <div class="stat-gora"><span>Zręczność</span><b><?= $postac['zrecznosc'] ?>/20</b></div>
                        <div class="pasek"><i style="width: <?= $postac['zrecznosc'] * 5 ?>%"></i></div>
                    </div>
                    <div class="stat">
                        <div class="stat-gora"><span>Inteligencja</span><b><?= $postac['inteligencja'] ?>/20</b></div>
                        <div class="pasek"><i style="width: <?= $postac['inteligencja'] * 5 ?>%"></i></div>
                    </div>
                </div>

                <div class="hp">
                    <span>❤ Punkty życia</span>
                    <strong><?= $postac['hp'] ?></strong>
                </div>
            </article>
        <?php else: ?>
            <div class="podpowiedz">
                Wypełnij formularz i wybierz klasę,<br>a tutaj pojawi się Twoja karta postaci.
            </div>
        <?php endif; ?>

    </main>

    <script>
        // ===== Zmiana koloru akcentu formularza po zmianie klasy =====
        const kolory = {
            'Wojownik': '#ff4d5e',
            'Mag': '#4da3ff',
            'Łotrzyk': '#3dff9a'
        };

        const select = document.getElementById('klasa');
        const formularz = document.getElementById('formularz');

        function ustawKolor() {
            formularz.style.setProperty('--akcent', kolory[select.value]);
        }

        select.addEventListener('change', ustawKolor);
        ustawKolor();
    </script>
</body>
</html>
