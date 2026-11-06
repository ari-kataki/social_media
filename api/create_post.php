<?php
require_once 'DbConnector.php';
require_once 'auth_helper.php';

header('Content-Type: application/json; charset=utf-8');

// HTTP method check
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed. Use POST.'
    ]);
    exit;
}

// Validate token (if not valid, function exits)
$userId = validateAuthToken();

// Parse JSON body
$input = json_decode(file_get_contents('php://input'), true);

// Validate content
if (!isset($input['content']) || empty(trim($input['content']))) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Content cannot be empty'
    ]);
    exit;
}

$content = trim($input['content']);

try {
    $config = require __DIR__ . '/config.php';
    $dbh = new DbConnector($config['host'], $config['user'], $config['pass'], $config['name']);
    
    $sth = $dbh->prepare('INSERT INTO posts (user_id, content, creation_date)
                          VALUES (:user_id, :content, NOW())');
    $sth->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $sth->bindParam(':content', $content, PDO::PARAM_STR);
    $sth->execute();
    
    $postId = $dbh->lastInsertId();
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Post created successfully',
        'post_id' => (int)$postId
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server Error: ' . $e->getMessage()
    ]);
}
