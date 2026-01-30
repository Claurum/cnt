-- Создание базы данных
CREATE DATABASE IF NOT EXISTS it_vuz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE it_vuz_db;

INSERT INTO admin_users (username, email, password_hash, role) 
VALUES (
    'admin', 
    'admin@it-vuz.ru', 
    'claurum',
    'admin'
);

-- Таблица для демо-запросов
CREATE TABLE demo_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    organization VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Таблица для контактов
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('general', 'support', 'partnership') DEFAULT 'general',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status ENUM('new', 'processed', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для статистики посещений
CREATE TABLE site_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_url VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100)
);

-- Таблица для отзывов (если нужно административное добавление)
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(200),
    company VARCHAR(200),
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для пользователей (если нужна админка)
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'moderator',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для логов действий
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE USER 'itvuz_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';

GRANT ALL PRIVILEGES ON it_vuz_db.* TO 'itvuz_user'@'localhost';

FLUSH PRIVILEGES;

SELECT User, Host FROM mysql.user WHERE User = 'itvuz_user';