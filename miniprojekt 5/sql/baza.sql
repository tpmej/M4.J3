-- Baza danych: smart_office
CREATE DATABASE IF NOT EXISTS `smart_office`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `smart_office`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `resources`;

-- Tabela zasobów biurowych (biurka i sale konferencyjne)
CREATE TABLE `resources` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `type` ENUM('desk', 'room') NOT NULL,
  `capacity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela rezerwacji z kluczem obcym ON DELETE CASCADE
CREATE TABLE `reservations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `resource_id` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_resource_time` (`resource_id`, `start_time`, `end_time`),
  CONSTRAINT `fk_reservations_resource`
    FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Dane startowe: 2 sale konferencyjne oraz 8 biurek
INSERT INTO `resources` (`id`, `name`, `type`, `capacity`) VALUES
(1, 'Sala Konferencyjna Alfa', 'room', 8),
(2, 'Sala Konferencyjna Beta', 'room', 12),
(3, 'Biurko A1', 'desk', 1),
(4, 'Biurko A2', 'desk', 1),
(5, 'Biurko B1', 'desk', 1),
(6, 'Biurko B2', 'desk', 1),
(7, 'Biurko A3', 'desk', 1),
(8, 'Biurko A4', 'desk', 1),
(9, 'Biurko B3', 'desk', 1),
(10, 'Biurko B4', 'desk', 1);

-- Przykładowe rezerwacje startowe (na jutrzejszy dzień roboczy)
INSERT INTO `reservations` (`resource_id`, `user_name`, `start_time`, `end_time`) VALUES
(1, 'Anna Nowak', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 09:00:00'), CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 11:00:00')),
(4, 'Jan Kowalski', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 10:00:00'), CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 14:00:00')),
(7, 'Katarzyna Wiśniewska', CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 08:00:00'), CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 12:00:00'));