<?php
session_start();

require_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    try {
        if (!isset($_SESSION['visit_id'])) {
            $_SESSION['visit_id'] = uniqid('visit_', true);
        }
        
        $query = "INSERT INTO site_statistics (page_url, ip_address, user_agent, referrer, session_id) 
                  VALUES (:page_url, :ip_address, :user_agent, :referrer, :session_id)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':page_url', $_SERVER['REQUEST_URI']);
        $stmt->bindParam(':ip_address', $_SERVER['REMOTE_ADDR']);
        $stmt->bindParam(':user_agent', $_SERVER['HTTP_USER_AGENT']);
        $stmt->bindParam(':referrer', $_SERVER['HTTP_REFERER'] ?? '');
        $stmt->bindParam(':session_id', $_SESSION['visit_id']);
        
        $stmt->execute();
        
    } catch(PDOException $e) {
        error_log("Statistics error: " . $e->getMessage());
    }
}
?>