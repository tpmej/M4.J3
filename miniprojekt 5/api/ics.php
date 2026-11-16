<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

if ($id === false || $id <= 0) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Nieprawidłowy identyfikator rezerwacji.';
    exit;
}

$sql = "
    SELECT 
        res.id,
        res.user_name,
        res.start_time,
        res.end_time,
        r.name AS resource_name,
        r.type AS resource_type
    FROM reservations res
    INNER JOIN resources r ON r.id = res.resource_id
    WHERE res.id = :id
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':id' => $id]);
$reservation = $stmt->fetch();

if (!$reservation) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Nie znaleziono rezerwacji.';
    exit;
}

$tzWarsaw = new DateTimeZone('Europe/Warsaw');
$tzUtc    = new DateTimeZone('UTC');

$dtStart = (new DateTimeImmutable($reservation['start_time'], $tzWarsaw))->setTimezone($tzUtc);
$dtEnd   = (new DateTimeImmutable($reservation['end_time'], $tzWarsaw))->setTimezone($tzUtc);
$dtStamp = new DateTimeImmutable('now', $tzUtc);

$escapeIcs = static function (string $text): string {
    $text = str_replace(['\\', ';', ',', "\r\n", "\n"], ['\\\\', '\;', '\,', '\n', '\n'], $text);
    return $text;
};

$summary     = $escapeIcs("Rezerwacja: {$reservation['resource_name']} ({$reservation['user_name']})");
$location    = $escapeIcs("Smart Office — {$reservation['resource_name']}");
$description = $escapeIcs("System Rezerwacji Smart Office SPA\nStanowisko: {$reservation['resource_name']}\nOsoba rezerwująca: {$reservation['user_name']}");

header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: attachment; filename="rezerwacja.ics"');

$icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Office SPA//INF03 Project//PL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    "UID:smart-office-res-{$reservation['id']}@localhost",
    'DTSTAMP:' . $dtStamp->format('Ymd\THis\Z'),
    'DTSTART:' . $dtStart->format('Ymd\THis\Z'),
    'DTEND:' . $dtEnd->format('Ymd\THis\Z'),
    "SUMMARY:{$summary}",
    "LOCATION:{$location}",
    "DESCRIPTION:{$description}",
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
];

echo implode("\r\n", $icsContent) . "\r\n";