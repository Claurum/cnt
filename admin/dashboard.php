<?php
session_start();
require_once '../config/db.php';

// Проверка авторизации
if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

// Получаем различные данные для дашборда
$stats = [];
$tables = ['users', 'courses', 'news', 'reviews'];

foreach ($tables as $table) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
        $stats[$table] = $stmt->fetch()['count'];
    } catch(Exception $e) {
        $stats[$table] = 0;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Админ-панель IT-ВУЗ</title>
    <style>
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <h1>Админ-панель</h1>
    <div class="dashboard">
        <?php foreach ($stats as $table => $count): ?>
        <div class="stat-card">
            <h3><?php echo ucfirst($table); ?></h3>
            <p>Записей: <?php echo $count; ?></p>
            <a href="list.php?table=<?php echo $table; ?>">Управление</a>
        </div>
        <?php endforeach; ?>
    </div>
</body>
</html>