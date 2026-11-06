<?php
require_once 'DbConnector.php';
require_once 'auth_helper.php';


header('Content-Type: application/json; charset=utf-8');

// HTTP method check
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed. Use GET.'
    ]);
    exit;
}

// Validate token (if not valid, function end on exit)
$userId = validateAuthToken();

// Pagination setup
$postsPerPage = 10;
$page = (int)($_GET['page'] ?? 1);
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $postsPerPage;

// here if token is valid, and I can use $userId for my queries if I want
try {
    $config = require __DIR__ . '/config.php';
    $dbh = new DbConnector($config['host'], $config['user'], $config['pass'], $config['name']);
    
    // Get total count of posts
    $countSth = $dbh->prepare('SELECT COUNT(*) as total FROM posts WHERE delete_date IS NULL');
    $countSth->execute();
    $countResult = $countSth->fetch(PDO::FETCH_ASSOC);
    $totalPosts = (int)$countResult['total'];
    $totalPages = ceil($totalPosts / $postsPerPage);
    
    $sth = $dbh->prepare('SELECT m.id,
                                 m.content,
                                 m.creation_date,
                                 u.username
                          FROM posts m
                          INNER JOIN Users u ON m.user_id = u.id
                          WHERE m.delete_date IS NULL
                          ORDER BY m.creation_date DESC
                          LIMIT :limit OFFSET :offset');
    $sth->bindValue(':limit', $postsPerPage, PDO::PARAM_INT);
    $sth->bindValue(':offset', $offset, PDO::PARAM_INT);
    $sth->execute();
    $messages = $sth->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'items' => $messages,
        'count' => count($messages),
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_posts' => $totalPosts,
            'posts_per_page' => $postsPerPage
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server Error: ' . $e->getMessage()
    ]);
}