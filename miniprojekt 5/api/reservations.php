<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

function sendJson(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function parseDateTime(string $value): ?DateTimeImmutable
{
    $value = trim($value);
    $formats = ['Y-m-d H:i', 'Y-m-d H:i:s'];

    foreach ($formats as $format) {
        $dt = DateTimeImmutable::createFromFormat($format, $value);
        $errors = DateTimeImmutable::getLastErrors();
        if ($dt !== false && ($errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0))) {
            return $dt;
        }
    }

    return null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    switch ($method) {
        case 'GET':
            handleGet($pdo);
            break;

        case 'POST':
            handlePost($pdo);
            break;

        case 'DELETE':
            handleDelete($pdo);
            break;

        default:
            sendJson(405, [
                'status'  => 'error',
                'message' => 'Niedozwolona metoda HTTP.'
            ]);
    }
} catch (PDOException $e) {
    sendJson(500, [
        'status'  => 'error',
        'message' => 'Wystąpił błąd serwera bazy danych.'
    ]);
}

function handleGet(PDO $pdo): void
{
    $startParam = $_GET['start'] ?? '';
    $endParam   = $_GET['end'] ?? '';

    if ($startParam !== '' && $endParam !== '') {
        $startDt = parseDateTime($startParam);
        $endDt   = parseDateTime($endParam);

        if ($startDt === null || $endDt === null) {
            sendJson(400, [
                'status'  => 'error',
                'message' => 'Nieprawidłowy format daty. Wymagany format: YYYY-MM-DD HH:MM.'
            ]);
        }

        if ($endDt <= $startDt) {
            sendJson(400, [
                'status'  => 'error',
                'message' => 'Godzina zakończenia musi być późniejsza niż rozpoczęcia.'
            ]);
        }
    } else {
        $startDt = new DateTimeImmutable('now');
        $endDt   = $startDt->modify('+1 hour');
    }

    $startSql = $startDt->format('Y-m-d H:i:s');
    $endSql   = $endDt->format('Y-m-d H:i:s');

    $sqlResources = "
        SELECT 
            r.id,
            r.name,
            r.type,
            r.capacity,
            EXISTS (
                SELECT 1
                FROM reservations res
                WHERE res.resource_id = r.id
                  AND res.start_time < :end_time
                  AND res.end_time > :start_time
            ) AS is_occupied
        FROM resources r
        ORDER BY r.id ASC
    ";

    $stmtResources = $pdo->prepare($sqlResources);
    $stmtResources->execute([
        ':start_time' => $startSql,
        ':end_time'   => $endSql,
    ]);

    $resources = array_map(static function (array $row): array {
        return [
            'id'          => (int)$row['id'],
            'name'        => $row['name'],
            'type'        => $row['type'],
            'capacity'    => (int)$row['capacity'],
            'is_occupied' => (bool)$row['is_occupied'],
        ];
    }, $stmtResources->fetchAll());

    $sqlReservations = "
        SELECT 
            res.id,
            res.resource_id,
            r.name AS resource_name,
            r.type AS resource_type,
            res.user_name,
            DATE_FORMAT(res.start_time, '%Y-%m-%d %H:%i') AS start_time,
            DATE_FORMAT(res.end_time, '%Y-%m-%d %H:%i') AS end_time,
            res.created_at
        FROM reservations res
        INNER JOIN resources r ON r.id = res.resource_id
        WHERE res.end_time >= NOW()
        ORDER BY res.start_time ASC, res.id ASC
    ";

    $stmtReservations = $pdo->prepare($sqlReservations);
    $stmtReservations->execute();
    $reservations = $stmtReservations->fetchAll();

    sendJson(200, [
        'status'       => 'success',
        'range'        => [
            'start' => $startDt->format('Y-m-d H:i'),
            'end'   => $endDt->format('Y-m-d H:i'),
        ],
        'resources'    => $resources,
        'reservations' => $reservations,
    ]);
}

function handlePost(PDO $pdo): void
{
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput ?: '', true);

    if (!is_array($data)) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Nieprawidłowe dane wejściowe JSON.'
        ]);
    }

    $resourceId = filter_var($data['resource_id'] ?? null, FILTER_VALIDATE_INT);
    $rawName    = trim((string)($data['user_name'] ?? ''));
    $startRaw   = (string)($data['start_time'] ?? '');
    $endRaw     = (string)($data['end_time'] ?? '');

    if ($resourceId === false || $resourceId <= 0) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Nieprawidłowy identyfikator stanowiska.'
        ]);
    }

    if (mb_strlen($rawName, 'UTF-8') < 3 || mb_strlen($rawName, 'UTF-8') > 100) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Imię i nazwisko musi zawierać od 3 do 100 znaków.'
        ]);
    }

    $startDt = parseDateTime($startRaw);
    $endDt   = parseDateTime($endRaw);

    if ($startDt === null || $endDt === null) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Nieprawidłowy format daty lub godziny.'
        ]);
    }

    if ($endDt <= $startDt) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.'
        ]);
    }

    $nowThreshold = (new DateTimeImmutable('now'))->modify('-2 minutes');
    if ($startDt < $nowThreshold) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Nie można utworzyć rezerwacji w przeszłości.'
        ]);
    }

    $stmtCheckResource = $pdo->prepare('SELECT id, name FROM resources WHERE id = :id');
    $stmtCheckResource->execute([':id' => $resourceId]);
    $resource = $stmtCheckResource->fetch();

    if (!$resource) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Wybrane stanowisko nie istnieje w bazie.'
        ]);
    }

    $cleanUserName = htmlspecialchars($rawName, ENT_NOQUOTES, 'UTF-8');
    $startSql = $startDt->format('Y-m-d H:i:s');
    $endSql   = $endDt->format('Y-m-d H:i:s');

    $pdo->beginTransaction();

    try {
        $sqlConflict = "
            SELECT COUNT(*) AS conflicts
            FROM reservations
            WHERE resource_id = :resource_id
              AND start_time < :end_time
              AND end_time > :start_time
            FOR UPDATE
        ";

        $stmtConflict = $pdo->prepare($sqlConflict);
        $stmtConflict->execute([
            ':resource_id' => $resourceId,
            ':start_time'  => $startSql,
            ':end_time'    => $endSql,
        ]);

        $conflicts = (int)$stmtConflict->fetchColumn();

        if ($conflicts > 0) {
            $pdo->rollBack();
            sendJson(409, [
                'status'  => 'error',
                'message' => 'Konflikt terminów! To stanowisko jest już zarezerwowane w wybranym przedziale.'
            ]);
        }

        $sqlInsert = "
            INSERT INTO reservations (resource_id, user_name, start_time, end_time)
            VALUES (:resource_id, :user_name, :start_time, :end_time)
        ";

        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            ':resource_id' => $resourceId,
            ':user_name'   => $cleanUserName,
            ':start_time'  => $startSql,
            ':end_time'    => $endSql,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $pdo->commit();

        sendJson(201, [
            'status'         => 'success',
            'message'        => "Zarezerwowano: {$resource['name']}.",
            'reservation_id' => $newId,
            'ics_url'        => "api/ics.php?id={$newId}"
        ]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function handleDelete(PDO $pdo): void
{
    $idRaw = $_GET['id'] ?? null;

    if ($idRaw === null) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput ?: '', true);
        if (is_array($data) && isset($data['id'])) {
            $idRaw = $data['id'];
        }
    }

    $id = filter_var($idRaw, FILTER_VALIDATE_INT);

    if ($id === false || $id <= 0) {
        sendJson(400, [
            'status'  => 'error',
            'message' => 'Nieprawidłowy identyfikator rezerwacji.'
        ]);
    }

    $stmt = $pdo->prepare('DELETE FROM reservations WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        sendJson(404, [
            'status'  => 'error',
            'message' => 'Nie znaleziono rezerwacji o podanym ID.'
        ]);
    }

    sendJson(200, [
        'status'  => 'success',
        'message' => 'Rezerwacja została pomyślnie anulowana.'
    ]);
}