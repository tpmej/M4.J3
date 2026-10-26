<?php
// Mówimy przeglądarce, że serwer zwraca dane w formacie JSON
header('Content-Type: application/json');

// Pobieramy dane wysłane przez fetch()
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

// Walidacja po stronie PHP
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Serwer: Proszę wypełnić wszystkie pola.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Serwer: Podaj poprawny adres e-mail.'
    ]);
    exit;
}

// Sukces – dane są poprawne
echo json_encode([
    'status' => 'success',
    'message' => 'Serwer: Wiadomość została pomyślnie wysłana!'
]);