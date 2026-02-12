<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=it_vuz;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stats = [];
    
    // Проверяем наличие таблиц и считаем записи
    $tables = [
        'users' => '👥 Пользователи',
        'students' => '🎓 Студенты',
        'courses' => '📚 Курсы',
        'partners' => '🤝 Партнеры',
        'reviews' => '⭐ Отзывы'
    ];
    
    foreach ($tables as $table => $name) {
        try {
            $result = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $stats[$table] = $result->fetch()['count'];
        } catch(Exception $e) {
            $stats[$table] = 0;
        }
    }
    
    echo json_encode($stats);
    
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>