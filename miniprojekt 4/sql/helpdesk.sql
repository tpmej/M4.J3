CREATE DATABASE IF NOT EXISTS helpdesk_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE helpdesk_db;

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    room VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('niski', 'sredni', 'wysoki') NOT NULL DEFAULT 'sredni',
    status ENUM('nowe', 'w_trakcie', 'zamkniete') NOT NULL DEFAULT 'nowe',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (id, name) VALUES
(1, 'Sprzęt komputerowy'),
(2, 'Sieć i Wi-Fi'),
(3, 'Oprogramowanie'),
(4, 'Drukarki i peryferia');

INSERT INTO tickets (category_id, room, title, description, priority, status, created_at) VALUES
(1, 'Sala 104', 'Brak obrazu na monitorze stanowiska nr 7', 'Po włączeniu jednostki centralnej monitor przechodzi w stan uśpienia. Kabel DisplayPort został sprawdzony.', 'wysoki', 'nowe', '2026-11-14 08:15:00'),
(2, 'Sala 208', 'Brak dostępu do sieci lokalnej na całej pracowni', 'Switch w szafie rackowej nie sygnalizuje połączenia uplink. Uczniowie nie mogą zalogować się do domeny.', 'wysoki', 'w_trakcie', '2026-11-14 09:40:00'),
(3, 'Sala 102', 'Wygasła licencja pakietu biurowego', 'Na stanowisku nauczycielskim pojawia się komunikat o konieczności aktywacji produktu przy uruchomieniu edytora tekstu.', 'sredni', 'nowe', '2026-11-15 10:20:00'),
(4, 'Pokój nauczycielski', 'Zacięcie papieru w podajniku drukarki sieciowej', 'Drukarka HP LaserJet zgłasza błąd podajnika nr 2 oraz wymaga wymiany tonera w najbliższym czasie.', 'niski', 'zamkniete', '2026-11-12 13:05:00'),
(3, 'Sala 205', 'Brak środowiska XAMPP na komputerach uczniowskich', 'Prośba o instalację pakietu XAMPP z PHP 8.2 przed zajęciami z pracowni aplikacji internetowych.', 'sredni', 'w_trakcie', '2026-11-15 14:10:00'),
(1, 'Biblioteka', 'Uszkodzona mysz optyczna przy katalogu', 'Lewy przycisk myszy nie reaguje na kliknięcia, wymagana wymiana urządzenia wskazującego.', 'niski', 'zamkniete', '2026-11-11 11:30:00');