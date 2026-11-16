<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="zgloszenia_it.csv"');

$output = fopen('php://output', 'w');

// Znacznik UTF-8 BOM dla poprawnego wyświetlania polskich znaków w MS Excel
fwrite($output, "\xEF\xBB\xBF");

// Nagłówki kolumn
fputcsv($output, [
    'ID',
    'Kategoria',
    'Sala',
    'Tytuł',
    'Opis',
    'Priorytet',
    'Status',
    'Data utworzenia'
], ';');

$stmt = $pdo->query(
    'SELECT t.id, c.name AS category_name, t.room, t.title, t.description, t.priority, t.status, t.created_at
     FROM tickets t
     INNER JOIN categories c ON t.category_id = c.id
     ORDER BY t.created_at DESC'
);

while ($row = $stmt->fetch()) {
    fputcsv($output, [
        $row['id'],
        $row['category_name'],
        $row['room'],
        $row['title'],
        $row['description'],
        $row['priority'],
        $row['status'],
        $row['created_at'],
    ], ';');
}

fclose($output);
exit;