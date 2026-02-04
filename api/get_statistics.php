<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = [
    'students' => 0,
    'courses' => 0,
    'partners' => 0
];

try {
    // Получаем реальную статистику из БД
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM students");
    $data['students'] = $stmt->fetch()['count'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM courses");
    $data['courses'] = $stmt->fetch()['count'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM partners");
    $data['partners'] = $stmt->fetch()['count'];
    
} catch(PDOException $e) {
    // В случае ошибки оставляем нулевые значения
}

echo json_encode($data);
?>