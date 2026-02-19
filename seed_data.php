<?php
// ============================================
// ЗАПОЛНЕНИЕ БАЗЫ ТЕСТОВЫМИ ДАННЫМИ
// ============================================

$pdo = new PDO("mysql:host=localhost;dbname=it_vuz;charset=utf8", "root", "");

// 1. Создаем таблицы
$pdo->exec("
    CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        course INT,
        faculty VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        hours INT,
        teacher VARCHAR(100),
        price DECIMAL(10,2)
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        position VARCHAR(100),
        text TEXT,
        rating INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
");

// 2. Добавляем студентов
$students = [
    ['Иван Петров', 'ivan@itvuz.ru', 3, 'Программная инженерия'],
    ['Анна Смирнова', 'anna@itvuz.ru', 4, 'Информационные системы'],
    ['Михаил Иванов', 'mikhail@itvuz.ru', 2, 'Кибербезопасность'],
    ['Елена Козлова', 'elena@itvuz.ru', 1, 'Искусственный интеллект'],
    ['Дмитрий Сидоров', 'dmitry@itvuz.ru', 3, 'Веб-разработка']
];

foreach ($students as $student) {
    $pdo->prepare("INSERT IGNORE INTO students (name, email, course, faculty) VALUES (?, ?, ?, ?)")
        ->execute($student);
}

// 3. Добавляем курсы
$courses = [
    ['Python для начинающих', 'Базовый курс программирования на Python', 72, 'Смирнов А.В.', 15000],
    ['Веб-разработка', 'HTML, CSS, JavaScript, React', 144, 'Козлова Е.П.', 25000],
    ['Базы данных', 'MySQL, PostgreSQL, MongoDB', 96, 'Иванов Д.С.', 20000],
    ['Машинное обучение', 'Введение в ML и нейросети', 120, 'Петрова М.И.', 35000]
];

foreach ($courses as $course) {
    $pdo->prepare("INSERT IGNORE INTO courses (title, description, hours, teacher, price) VALUES (?, ?, ?, ?, ?)")
        ->execute($course);
}

// 4. Добавляем отзывы
$reviews = [
    ['Госкорпорация Ростех', 'Стратегический партнер', 'Отличные специалисты, сотрудничаем более 5 лет', 5],
    ['Яндекс', 'IT-партнер', 'Высокий уровень подготовки студентов', 5],
    ['Сбербанк', 'Финансовый партнер', 'Более 30 выпускников работают в нашей компании', 5]
];

foreach ($reviews as $review) {
    $pdo->prepare("INSERT IGNORE INTO reviews (name, position, text, rating) VALUES (?, ?, ?, ?)")
        ->execute($review);
}

echo "✅ База данных успешно заполнена тестовыми данными!\n";
echo "🎓 Добавлено студентов: " . count($students) . "\n";
echo "📚 Добавлено курсов: " . count($courses) . "\n";
echo "⭐ Добавлено отзывов: " . count($reviews) . "\n";
?>