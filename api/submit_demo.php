<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

if (empty($data['name']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Необходимо заполнить имя и email']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

try {
    $query = "INSERT INTO demo_requests (name, email, organization, ip_address, user_agent) 
              VALUES (:name, :email, :organization, :ip_address, :user_agent)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', htmlspecialchars(strip_tags($data['name'])));
    $stmt->bindParam(':email', htmlspecialchars(strip_tags($data['email'])));
    $stmt->bindParam(':organization', htmlspecialchars(strip_tags($data['organization'] ?? '')));
    $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
    $stmt->bindParam(':user_agent', $_SERVER['HTTP_USER_AGENT']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.',
            'request_id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка сохранения данных']);
    }
    
} catch(PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Внутренняя ошибка сервера']);
}
?>