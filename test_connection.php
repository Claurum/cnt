<?php
require_once 'config/db.php';

echo "<h2>Тест подключения к MySQL</h2>";

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "✅ Успешное подключение к MySQL!<br>";
    
    // Проверяем версию MySQL
    $stmt = $db->query("SELECT VERSION()");
    $version = $stmt->fetchColumn();
    echo "Версия MySQL: " . $version . "<br>";
    
    // Проверяем список таблиц
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "✅ Таблицы в базе данных:<br>";
        foreach ($tables as $table) {
            echo "- " . $table . "<br>";
        }
    } else {
        echo "⚠️ Таблицы не найдены. Нужно создать структуру.<br>";
    }
    
} else {
    echo "❌ Ошибка подключения к MySQL!<br>";
    echo "Проверьте:<br>";
    echo "1. Запущен ли MySQL сервер<br>";
    echo "2. Правильный ли пароль в config/db.php<br>";
    echo "3. Существует ли база данных 'it_vuz_db'<br>";
}

// Проверяем переменные среды
echo "<hr><h3>Информация о сервере:</h3>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
?>