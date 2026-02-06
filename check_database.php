<?php
/**
 * Универсальный скрипт для проверки БД IT-ВУЗ
 * Поможет увидеть, что выводится из базы данных
 */

// 1. Настройки подключения
$host = 'localhost';
$dbname = 'it_vuz'; // Имя БД из DB.sql
$username = 'root';
$password = '';

// 2. Попытка подключения
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px;'>";
    echo "✅ <strong>Подключение к БД успешно!</strong>";
    echo "</div>";
} catch(PDOException $e) {
    die("<div style='background: #f8d7da; padding: 15px; border-radius: 5px;'>
        ❌ <strong>Ошибка подключения:</strong> " . $e->getMessage() . "
    </div>");
}

// 3. Получаем список всех таблиц в БД
echo "<h2>📊 Анализ базы данных: $dbname</h2>";

$tables_query = $pdo->query("SHOW TABLES");
$tables = $tables_query->fetchAll(PDO::FETCH_COLUMN);

if (empty($tables)) {
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px;'>
        ⚠️ В базе данных нет таблиц. Возможно, DB.sql не был импортирован.
        <br><br>
        <strong>Решение:</strong>
        <ol>
            <li>Зайдите в MySQL: <code>mysql -u root -p</code></li>
            <li>Выполните: <code>SOURCE /путь/к/вашему/проекту/DB.sql;</code></li>
        </ol>
    </div>";
} else {
    echo "<p>✅ Найдено таблиц: <strong>" . count($tables) . "</strong></p>";
    
    // 4. Для каждой таблицы показываем структуру и первые записи
    foreach ($tables as $table) {
        echo "<div style='border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin: 20px 0; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>";
        
        echo "<h3 style='color: #2c3e50;'>📁 Таблица: <span style='color: #e74c3c;'>$table</span></h3>";
        
        // Показываем структуру таблицы
        echo "<h4>🔧 Структура:</h4>";
        $structure = $pdo->query("DESCRIBE $table");
        echo "<table border='1' cellpadding='8' style='border-collapse: collapse; width: 100%; margin-bottom: 20px;'>";
        echo "<tr style='background: #f8f9fa;'>
                <th>Поле</th>
                <th>Тип</th>
                <th>Null</th>
                <th>Ключ</th>
                <th>По умолчанию</th>
              </tr>";
        
        while ($column = $structure->fetch()) {
            echo "<tr>";
            echo "<td><strong>" . $column['Field'] . "</strong></td>";
            echo "<td><code>" . $column['Type'] . "</code></td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . ($column['Default'] ?? 'NULL') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Показываем данные из таблицы (первые 5 записей)
        echo "<h4>📝 Данные (первые 5 записей):</h4>";
        try {
            $data = $pdo->query("SELECT * FROM $table LIMIT 5");
            $rowCount = $pdo->query("SELECT COUNT(*) as count FROM $table")->fetch()['count'];
            
            if ($rowCount > 0) {
                echo "<p>Всего записей: <strong>$rowCount</strong></p>";
                
                // Получаем заголовки таблицы
                $firstRow = $data->fetch(PDO::FETCH_ASSOC);
                
                if ($firstRow) {
                    echo "<table border='1' cellpadding='8' style='border-collapse: collapse; width: 100%;'>";
                    echo "<tr style='background: #f8f9fa;'>";
                    foreach (array_keys($firstRow) as $header) {
                        echo "<th>" . htmlspecialchars($header) . "</th>";
                    }
                    echo "</tr>";
                    
                    // Выводим первую строку
                    echo "<tr>";
                    foreach ($firstRow as $value) {
                        echo "<td>" . htmlspecialchars($value ?? 'NULL') . "</td>";
                    }
                    echo "</tr>";
                    
                    // Выводим остальные строки
                    while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
                        echo "<tr>";
                        foreach ($row as $value) {
                            echo "<td>" . htmlspecialchars($value ?? 'NULL') . "</td>";
                        }
                        echo "</tr>";
                    }
                    echo "</table>";
                }
                
                // Кнопка для просмотра всех данных
                echo "<p style='margin-top: 10px;'>
                        <a href='view_table.php?table=$table' style='background: #3498db; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none;'>
                            👁️ Посмотреть все записи
                        </a>
                      </p>";
            } else {
                echo "<div style='background: #f8f9fa; padding: 10px; border-radius: 4px;'>
                        Таблица пуста. Нет данных для отображения.
                     </div>";
            }
        } catch(Exception $e) {
            echo "<div style='color: #e74c3c;'>Ошибка при чтении данных: " . $e->getMessage() . "</div>";
        }
        
        echo "</div>"; // Закрываем блок таблицы
    }
    
    // 5. Сводная информация
    echo "<div style='background: #e8f4fd; padding: 20px; border-radius: 10px; margin-top: 30px;'>";
    echo "<h3>📈 Сводка по базе данных</h3>";
    
    $total_records = 0;
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) as cnt FROM $table")->fetch()['cnt'];
        $total_records += $count;
        echo "<p>▪️ Таблица <strong>$table</strong>: $count записей</p>";
    }
    
    echo "<p style='margin-top: 15px; font-size: 18px;'>
            <strong>Всего записей в БД: $total_records</strong>
         </p>";
    echo "</div>";
}

// 6. Тестовые запросы (если таблицы существуют)
echo "<h3>🧪 Тестовые запросы</h3>";
echo "<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;'>";

// Пример 1: Проверка таблицы users
if (in_array('users', $tables)) {
    echo "<div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";
    echo "<h4>👥 Пользователи</h4>";
    $users = $pdo->query("SELECT id, name, email, role FROM users LIMIT 3");
    while ($user = $users->fetch()) {
        echo "<div style='padding: 5px; border-bottom: 1px solid #eee;'>";
        echo "<strong>" . htmlspecialchars($user['name']) . "</strong> (" . htmlspecialchars($user['role']) . ")";
        echo "</div>";
    }
    echo "</div>";
}

// Пример 2: Проверка таблицы courses
if (in_array('courses', $tables)) {
    echo "<div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";
    echo "<h4>📚 Курсы</h4>";
    $courses = $pdo->query("SELECT id, title, description FROM courses LIMIT 3");
    while ($course = $courses->fetch()) {
        echo "<div style='padding: 5px; border-bottom: 1px solid #eee;'>";
        echo "<strong>" . htmlspecialchars($course['title']) . "</strong>";
        echo "</div>";
    }
    echo "</div>";
}

// Пример 3: Проверка таблицы news
if (in_array('news', $tables)) {
    echo "<div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";
    echo "<h4>📰 Новости</h4>";
    $news = $pdo->query("SELECT id, title, date FROM news ORDER BY date DESC LIMIT 3");
    while ($item = $news->fetch()) {
        echo "<div style='padding: 5px; border-bottom: 1px solid #eee;'>";
        echo "<strong>" . htmlspecialchars($item['title']) . "</strong>";
        echo "<br><small>" . $item['date'] . "</small>";
        echo "</div>";
    }
    echo "</div>";
}

echo "</div>";

// 7. Создаем файл для просмотра полных таблиц
file_put_contents('view_table.php', '<?php
$host = "localhost";
$dbname = "it_vuz";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch(PDOException $e) {
    die("Ошибка подключения");
}

$table = $_GET["table"] ?? "";
if (!preg_match("/^[a-zA-Z_]+$/", $table)) die("Некорректное имя таблицы");

echo "<h1>Таблица: " . htmlspecialchars($table) . "</h1>";
echo "<a href=\"check_database.php\">← Назад к анализу</a><br><br>";

$data = $pdo->query("SELECT * FROM " . $table);
$firstRow = $data->fetch(PDO::FETCH_ASSOC);

if ($firstRow) {
    echo "<table border=\"1\" cellpadding=\"8\" style=\"border-collapse: collapse;\">";
    echo "<tr>";
    foreach (array_keys($firstRow) as $header) {
        echo "<th>" . htmlspecialchars($header) . "</th>";
    }
    echo "</tr>";
    
    // Первая строка
    echo "<tr>";
    foreach ($firstRow as $value) {
        echo "<td>" . htmlspecialchars($value ?? "NULL") . "</td>";
    }
    echo "</tr>";
    
    // Остальные строки
    while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        foreach ($row as $value) {
            echo "<td>" . htmlspecialchars($value ?? "NULL") . "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";
}
?>');

echo "<div style='margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;'>";
echo "<h3>✅ Скрипт создан!</h3>";
echo "<p>Теперь вы можете:</p>";
echo "<ol>
        <li><strong>Открыть в браузере:</strong> <code>http://localhost/ваша_папка/check_database.php</code></li>
        <li>Увидеть все таблицы и их структуру</li>
        <li>Посмотреть первые записи из каждой таблицы</li>
        <li>Нажать на кнопку 'Посмотреть все записи' для детального просмотра</li>
      </ol>";
echo "</div>";
?>