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

// Validate id
if (!isset($input['id']) || !is_numeric($input['id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Post id is required'
    ]);
    exit;
}

$postId = (int)$input['id'];

try {
    $config = require __DIR__ . '/config.php';
    $dbh = new DbConnector($config['host'], $config['user'], $config['pass'], $config['name']);

    // search the post of the logged user
    $sth = $dbh->prepare('SELECT id FROM posts
                          WHERE id = :id AND user_id = :user_id AND delete_date IS NULL');
    $sth->bindParam(':id', $postId, PDO::PARAM_INT);
    $sth->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $sth->execute();

    if (!$sth->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Post not found'
        ]);
        exit;
    }

    // soft delete, the post stays in the database
    $sth = $dbh->prepare('UPDATE posts SET delete_date = NOW() WHERE id = :id');
    $sth->bindParam(':id', $postId, PDO::PARAM_INT);
    $sth->execute();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Post deleted successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server Error: ' . $e->getMessage()
    ]);
}
