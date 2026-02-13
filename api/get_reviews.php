<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=it_vuz;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Проверяем существует ли таблица reviews
    $tableExists = $pdo->query("SHOW TABLES LIKE 'reviews'")->rowCount() > 0;
    
    if ($tableExists) {
        $reviews = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 6")->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reviews);
    } else {
        // Возвращаем тестовые данные
        echo json_encode([
            [
                'name' => 'Госкорпорация Ростех',
                'position' => 'Стратегический партнер',
                'text' => 'Высоко оцениваем уровень подготовки выпускников IT-ВУЗ. Сотрудничаем более 5 лет.',
                'rating' => 5,
                'avatar' => 'images/partners/rostech.png'
            ],
            [
                'name' => 'Яндекс',
                'position' => 'IT-партнер',
                'text' => 'Студенты IT-ВУЗ показывают отличные результаты на стажировках.',
                'rating' => 5,
                'avatar' => 'images/partners/yandex.png'
            ]
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([]);
}
?>