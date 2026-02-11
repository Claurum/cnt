<?php
// ============================================
// ВЫВОД ВСЕХ ДАННЫХ ИЗ БАЗЫ ДАННЫХ IT-ВУЗ
// ============================================

// 1. ПОДКЛЮЧЕНИЕ К БД
$host = 'localhost';
$dbname = 'it_vuz';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $connection_status = "✅ Подключение к БД успешно!";
} catch(PDOException $e) {
    die("❌ Ошибка подключения: " . $e->getMessage());
}

// 2. ПОЛУЧАЕМ ВСЕ ТАБЛИЦЫ
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT-ВУЗ | Все данные из БД</title>
    <style>
        /* Стили в стиле IT-ВУЗ */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 30px;
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
            border-bottom: 4px solid #667eea;
            padding-bottom: 15px;
        }
        
        .connection-status {
            background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            display: inline-block;
            margin-bottom: 30px;
            font-weight: bold;
            box-shadow: 0 10px 20px rgba(67, 233, 123, 0.3);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
            transition: transform 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-10px);
        }
        
        .stat-card h3 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .stat-card p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .table-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 5px solid #667eea;
        }
        
        .table-title {
            color: #2c3e50;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .table-title span {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 25px;
            font-size: 0.9em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            color: #2c3e50;
        }
        
        tr:hover td {
            background: #f5f5f5;
        }
        
        .empty-message {
            background: #fff3cd;
            color: #856404;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #ffeeba;
        }
        
        .export-btn {
            background: linear-gradient(45deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            margin-bottom: 20px;
            transition: transform 0.3s;
        }
        
        .export-btn:hover {
            transform: scale(1.05);
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6c757d;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        
        .nav-menu {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .nav-btn {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
            padding: 10px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .nav-btn:hover {
            background: #667eea;
            color: white;
        }
        
        .nav-btn.active {
            background: #667eea;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- ШАПКА -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1>🏫 IT-ВУЗ</h1>
                <div class="connection-status">
                    <?php echo $connection_status; ?>
                </div>
            </div>
            <div style="font-size: 1.2em; color: #667eea; font-weight: bold;">
                📊 База данных: <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 20px;"><?php echo $dbname; ?></span>
            </div>
        </div>
        
        <!-- НАВИГАЦИЯ -->
        <div class="nav-menu">
            <a href="#stats" class="nav-btn active">📊 Статистика</a>
            <a href="#all-data" class="nav-btn">📋 Все таблицы</a>
            <a href="#export" class="nav-btn">📥 Экспорт</a>
            <a href="index.html" class="nav-btn">🏠 На главную</a>
        </div>
        
        <!-- СТАТИСТИКА ПО БД -->
        <div id="stats">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">📈 Аналитика базы данных</h2>
            <div class="stats-grid">
                <?php
                $total_records = 0;
                foreach ($tables as $table) {
                    $count = $pdo->query("SELECT COUNT(*) as cnt FROM $table")->fetch()['cnt'];
                    $total_records += $count;
                    
                    // Определяем иконку для таблицы
                    $icon = '📁';
                    if (strpos($table, 'user') !== false) $icon = '👥';
                    if (strpos($table, 'course') !== false) $icon = '📚';
                    if (strpos($table, 'student') !== false) $icon = '🎓';
                    if (strpos($table, 'news') !== false) $icon = '📰';
                    if (strpos($table, 'review') !== false) $icon = '⭐';
                    
                    echo "<div class='stat-card'>";
                    echo "<h3>$icon $count</h3>";
                    echo "<p>" . strtoupper($table) . "</p>";
                    echo "</div>";
                }
                
                // Добавляем общую статистику
                echo "<div class='stat-card' style='background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);'>";
                echo "<h3>📊 $total_records</h3>";
                echo "<p>ВСЕГО ЗАПИСЕЙ</p>";
                echo "</div>";
                
                // Количество таблиц
                echo "<div class='stat-card' style='background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);'>";
                echo "<h3>📋 " . count($tables) . "</h3>";
                echo "<p>ТАБЛИЦ</p>";
                echo "</div>";
                ?>
            </div>
        </div>
        
        <!-- ВСЕ ТАБЛИЦЫ И ИХ ДАННЫЕ -->
        <div id="all-data">
            <h2 style="color: #2c3e50; margin: 40px 0 20px;">📋 Все данные из базы</h2>
            
            <?php
            if (empty($tables)) {
                echo "<div class='empty-message'>";
                echo "<h3>⚠️ В базе данных нет таблиц</h3>";
                echo "<p>Импортируйте файл DB.sql в базу данных it_vuz</p>";
                echo "</div>";
            } else {
                foreach ($tables as $table) {
                    echo "<div class='table-section'>";
                    
                    // Заголовок таблицы с количеством записей
                    $count = $pdo->query("SELECT COUNT(*) as cnt FROM $table")->fetch()['cnt'];
                    echo "<div class='table-title'>";
                    echo "<h2>📌 " . ucfirst(str_replace('_', ' ', $table)) . "</h2>";
                    echo "<span>Записей: $count</span>";
                    echo "</div>";
                    
                    if ($count > 0) {
                        // Получаем все данные из таблицы
                        $data = $pdo->query("SELECT * FROM $table LIMIT 100");
                        $columns = $pdo->query("SHOW COLUMNS FROM $table")->fetchAll(PDO::FETCH_COLUMN);
                        
                        echo "<table>";
                        echo "<thead><tr>";
                        foreach ($columns as $column) {
                            echo "<th>" . htmlspecialchars($column) . "</th>";
                        }
                        echo "</tr></thead><tbody>";
                        
                        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
                            echo "<tr>";
                            foreach ($row as $value) {
                                if ($value === null) {
                                    echo "<td><em style='color: #999;'>NULL</em></td>";
                                } else {
                                    echo "<td>" . htmlspecialchars(substr($value, 0, 50)) . (strlen($value) > 50 ? '...' : '') . "</td>";
                                }
                            }
                            echo "</tr>";
                        }
                        echo "</tbody></table>";
                        
                        // SQL запрос для этой таблицы
                        echo "<div style='margin-top: 15px; background: #2c3e50; padding: 10px; border-radius: 5px;'>";
                        echo "<code style='color: #a8e6cf;'>SELECT * FROM $table LIMIT 100;</code>";
                        echo "</div>";
                    } else {
                        echo "<div class='empty-message'>📭 Таблица пуста. Добавьте данные через админ-панель.</div>";
                    }
                    
                    echo "</div>";
                }
            }
            ?>
        </div>
        
        <!-- ЭКСПОРТ ДАННЫХ -->
        <div id="export">
            <h2 style="color: #2c3e50; margin: 40px 0 20px;">📥 Экспорт данных</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 15px;">📊 Статистика</h3>
                    <p>Всего таблиц: <?php echo count($tables); ?></p>
                    <p>Всего записей: <?php echo $total_records; ?></p>
                    <button onclick="exportToCSV('all')" class="export-btn" style="margin-top: 20px;">
                        ⬇️ Экспорт в CSV
                    </button>
                </div>
                
                <div style="background: linear-gradient(45deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 15px;">📋 SQL дамп</h3>
                    <p>Структура и данные</p>
                    <button onclick="exportToSQL()" class="export-btn" style="margin-top: 20px; background: white; color: #11998e;">
                        ⬇️ Скачать SQL
                    </button>
                </div>
                
                <div style="background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 15px;">📄 JSON</h3>
                    <p>Для API и разработки</p>
                    <button onclick="exportToJSON()" class="export-btn" style="margin-top: 20px; background: white; color: #f5576c;">
                        ⬇️ Скачать JSON
                    </button>
                </div>
            </div>
        </div>
        
        <!-- ФУТЕР -->
        <div class="footer">
            <p>🏫 IT-ВУЗ | Информационная система | Обновлено: <?php echo date('d.m.Y H:i'); ?></p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                <?php echo "Сервер: " . $_SERVER['SERVER_SOFTWARE']; ?> | 
                PHP: <?php echo phpversion(); ?> | 
                MySQL: <?php echo $pdo->query("SELECT VERSION()")->fetchColumn(); ?>
            </p>
        </div>
    </div>

    <script>
    // Функции экспорта
    function exportToCSV(table) {
        alert('Функция экспорта будет доступна после добавления данных в таблицы!');
    }
    
    function exportToSQL() {
        alert('Используйте phpMyAdmin или команду: mysqldump -u root -p it_vuz > backup.sql');
    }
    
    function exportToJSON() {
        alert('JSON экспорт будет доступен в следующей версии!');
    }
    
    // Плавная прокрутка к секциям
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    </script>
</body>
</html>