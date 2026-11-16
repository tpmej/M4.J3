<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$errorMessage = '';

// Obsługa żądań POST (wzorzec PRG: Post / Redirect / Get)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // 1. Dodawanie nowego zgłoszenia (INSERT)
    if ($action === 'add') {
        $categoryId  = filter_input(INPUT_POST, 'category_id', FILTER_VALIDATE_INT);
        $room        = trim((string)($_POST['room'] ?? ''));
        $title       = trim((string)($_POST['title'] ?? ''));
        $description = trim((string)($_POST['description'] ?? ''));
        $priority    = (string)($_POST['priority'] ?? 'sredni');

        $allowedPriorities = ['niski', 'sredni', 'wysoki'];

        if (!$categoryId || $room === '' || $title === '' || $description === '' || !in_array($priority, $allowedPriorities, true)) {
            $errorMessage = 'Wszystkie pola formularza są wymagane i muszą zawierać poprawne dane.';
        } elseif (mb_strlen($title) < 5 || mb_strlen($description) > 300) {
            $errorMessage = 'Tytuł musi mieć min. 5 znaków, a opis maksymalnie 300 znaków.';
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO tickets (category_id, room, title, description, priority, status)
                 VALUES (:category_id, :room, :title, :description, :priority, :status)'
            );
            $stmt->execute([
                ':category_id' => $categoryId,
                ':room'        => $room,
                ':title'       => $title,
                ':description' => $description,
                ':priority'    => $priority,
                ':status'      => 'nowe',
            ]);

            header('Location: index.php');
            exit;
        }
    }

    // 2. Zmiana statusu zgłoszenia (UPDATE)
    if ($action === 'update_status') {
        $ticketId  = filter_input(INPUT_POST, 'ticket_id', FILTER_VALIDATE_INT);
        $newStatus = (string)($_POST['new_status'] ?? '');
        $allowedStatuses = ['nowe', 'w_trakcie', 'zamkniete'];

        if ($ticketId && in_array($newStatus, $allowedStatuses, true)) {
            $stmt = $pdo->prepare('UPDATE tickets SET status = :status WHERE id = :id');
            $stmt->execute([
                ':status' => $newStatus,
                ':id'     => $ticketId,
            ]);
        }

        header('Location: index.php');
        exit;
    }

    // 3. Usuwanie zamkniętego zgłoszenia (DELETE)
    if ($action === 'delete') {
        $ticketId = filter_input(INPUT_POST, 'ticket_id', FILTER_VALIDATE_INT);

        if ($ticketId) {
            $stmt = $pdo->prepare("DELETE FROM tickets WHERE id = :id AND status = 'zamkniete'");
            $stmt->execute([':id' => $ticketId]);
        }

        header('Location: index.php');
        exit;
    }
}

// Pobranie listy kategorii do formularza
$categoriesStmt = $pdo->query('SELECT id, name FROM categories ORDER BY name ASC');
$categories = $categoriesStmt->fetchAll();

// Pobranie zgłoszeń wraz z nazwą kategorii (SELECT ... JOIN)
$ticketsStmt = $pdo->query(
    'SELECT t.id, t.room, t.title, t.description, t.priority, t.status, t.created_at, c.name AS category_name
     FROM tickets t
     INNER JOIN categories c ON t.category_id = c.id
     ORDER BY t.created_at DESC'
);
$tickets = $ticketsStmt->fetchAll();

// Podsumowanie liczbowe statusów
$counts = [
    'nowe'      => 0,
    'w_trakcie' => 0,
    'zamkniete' => 0,
];

foreach ($tickets as $ticket) {
    if (isset($counts[$ticket['status']])) {
        $counts[$ticket['status']]++;
    }
}

// Mapy etykiet czytelnych dla użytkownika
$priorityLabels = [
    'niski'  => 'Niski',
    'sredni' => 'Średni',
    'wysoki' => 'Wysoki',
];

$statusLabels = [
    'nowe'      => 'Nowe',
    'w_trakcie' => 'W trakcie realizacji',
    'zamkniete' => 'Zamknięte',
];

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helpdesk IT — System Zgłoszeń Serwisowych</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="top-header">
        <div class="container header-inner">
            <div>
                <h1>Helpdesk IT</h1>
                <p class="subtitle">Szkolny System Obsługi Zgłoszeń Serwisowych</p>
            </div>
            <a href="export.php" class="btn btn-export">Eksportuj do CSV</a>
        </div>
    </header>

    <div class="container">
        <!-- Pasek statystyk -->
        <section class="stats-bar" aria-label="Statystyki zgłoszeń">
            <div class="stat-card stat-new">
                <span class="stat-label">Nowe</span>
                <strong class="stat-value"><?= $counts['nowe'] ?></strong>
            </div>
            <div class="stat-card stat-progress">
                <span class="stat-label">W trakcie realizacji</span>
                <strong class="stat-value"><?= $counts['w_trakcie'] ?></strong>
            </div>
            <div class="stat-card stat-closed">
                <span class="stat-label">Zamknięte</span>
                <strong class="stat-value"><?= $counts['zamkniete'] ?></strong>
            </div>
        </section>

        <!-- Główny układ dwukolumnowy -->
        <div class="main-layout">
            <!-- Panel boczny: formularz zgłoszenia -->
            <aside class="sidebar">
                <div class="card">
                    <h2>Nowe zgłoszenie</h2>

                    <?php if ($errorMessage !== ''): ?>
                        <div class="alert alert-error"><?= e($errorMessage) ?></div>
                    <?php endif; ?>

                    <form id="ticketForm" method="POST" action="index.php" novalidate>
                        <input type="hidden" name="action" value="add">

                        <div class="form-group">
                            <label for="category_id">Kategoria usterki</label>
                            <select id="category_id" name="category_id" required>
                                <?php foreach ($categories as $category): ?>
                                    <option value="<?= (int)$category['id'] ?>">
                                        <?= e($category['name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="room">Sala / Lokalizacja *</label>
                            <input type="text" id="room" name="room" maxlength="20" placeholder="np. Sala 104" required>
                            <small class="error-text" id="roomError"></small>
                        </div>

                        <div class="form-group">
                            <label for="title">Tytuł zgłoszenia *</label>
                            <input type="text" id="title" name="title" maxlength="100" placeholder="Krótki opis problemu (min. 5 znaków)" required>
                            <small class="error-text" id="titleError"></small>
                        </div>

                        <div class="form-group">
                            <label for="priority">Priorytet</label>
                            <select id="priority" name="priority">
                                <option value="niski">Niski</option>
                                <option value="sredni" selected>Średni</option>
                                <option value="wysoki">Wysoki</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="description">Szczegółowy opis usterki *</label>
                            <textarea id="description" name="description" rows="4" maxlength="300" placeholder="Opisz objawy usterki..." required></textarea>
                            <div class="field-footer">
                                <small class="error-text" id="descError"></small>
                                <span id="charCounter" class="char-counter">0 / 300</span>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">Wyślij zgłoszenie</button>
                    </form>
                </div>
            </aside>

            <!-- Główna sekcja: wyszukiwarka, filtry i lista zgłoszeń -->
            <main class="content">
                <div class="filter-panel card">
                    <div class="search-box">
                        <input type="search" id="searchInput" placeholder="Szukaj po tytule, opisie, sali lub kategorii..." aria-label="Szukaj zgłoszeń">
                    </div>
                    <div class="status-filters" role="group" aria-label="Filtruj według statusu">
                        <button type="button" class="filter-btn active" data-filter="all">Wszystkie</button>
                        <button type="button" class="filter-btn" data-filter="nowe">Nowe</button>
                        <button type="button" class="filter-btn" data-filter="w_trakcie">W trakcie</button>
                        <button type="button" class="filter-btn" data-filter="zamkniete">Zamknięte</button>
                    </div>
                </div>

                <div id="ticketsList" class="tickets-list">
                    <?php if (empty($tickets)): ?>
                        <div class="card empty-state">Brak zgłoszeń w bazie danych.</div>
                    <?php else: ?>
                        <?php foreach ($tickets as $ticket): ?>
                            <article class="ticket-card priority-<?= e($ticket['priority']) ?>" data-status="<?= e($ticket['status']) ?>">
                                <div class="ticket-header">
                                    <div class="ticket-meta">
                                        <span class="badge badge-category"><?= e($ticket['category_name']) ?></span>
                                        <span class="badge badge-room"><?= e($ticket['room']) ?></span>
                                        <span class="badge badge-priority-<?= e($ticket['priority']) ?>">
                                            Priorytet: <?= e($priorityLabels[$ticket['priority']]) ?>
                                        </span>
                                    </div>
                                    <span class="status-pill status-<?= e($ticket['status']) ?>">
                                        <?= e($statusLabels[$ticket['status']]) ?>
                                    </span>
                                </div>

                                <h3 class="ticket-title"><?= e($ticket['title']) ?></h3>
                                <p class="ticket-desc"><?= nl2br(e($ticket['description'])) ?></p>

                                <div class="ticket-footer">
                                    <time class="ticket-date" datetime="<?= e($ticket['created_at']) ?>">
                                        Dodano: <?= e(date('d.m.Y H:i', strtotime($ticket['created_at']))) ?>
                                    </time>

                                    <div class="ticket-actions">
                                        <?php if ($ticket['status'] === 'nowe'): ?>
                                            <form method="POST" action="index.php">
                                                <input type="hidden" name="action" value="update_status">
                                                <input type="hidden" name="ticket_id" value="<?= (int)$ticket['id'] ?>">
                                                <input type="hidden" name="new_status" value="w_trakcie">
                                                <button type="submit" class="btn btn-sm btn-warning">Przyjmij do realizacji</button>
                                            </form>
                                        <?php elseif ($ticket['status'] === 'w_trakcie'): ?>
                                            <form method="POST" action="index.php">
                                                <input type="hidden" name="action" value="update_status">
                                                <input type="hidden" name="ticket_id" value="<?= (int)$ticket['id'] ?>">
                                                <input type="hidden" name="new_status" value="zamkniete">
                                                <button type="submit" class="btn btn-sm btn-success">Oznacz jako zamknięte</button>
                                            </form>
                                        <?php elseif ($ticket['status'] === 'zamkniete'): ?>
                                            <form method="POST" action="index.php" class="delete-form">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="ticket_id" value="<?= (int)$ticket['id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-danger">Usuń zgłoszenie</button>
                                            </form>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

                <div id="noResultsMessage" class="card empty-state hidden">
                    Brak zgłoszeń spełniających wybrane kryteria wyszukiwania.
                </div>
            </main>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>