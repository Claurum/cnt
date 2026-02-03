<?php
require_once 'config/db.php';

echo "<h2>Список пользователей</h2>";
echo "<table border='1'>";
echo "<tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th></tr>";

try {
    $stmt = $pdo->query("SELECT * FROM users LIMIT 10");
    while ($row = $stmt->fetch()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['email'] . "</td>";
        echo "<td>" . $row['role'] . "</td>";
        echo "</tr>";
    }
} catch(PDOException $e) {
    echo "Ошибка: " . $e->getMessage();
}

echo "</table>";
?>