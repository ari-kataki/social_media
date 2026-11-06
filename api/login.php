<?php

require_once 'DbConnector.php';
require_once 'TokenManager.php';

header('Content-Type: application/json; charset=utf-8');

// error codes and their messages
$errors = [
    '1' => 'Username is required',
    '2' => 'Password is required',
    '3' => 'Username or password not valid',
    '4' => 'Method not allowed. Use POST',
];

$errorCode = null;

// check that the request is a post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // read the json sent by the app
    $post = json_decode(file_get_contents('php://input'), true);

    // if username or password are empty show the error
    if (!is_array($post) || !array_key_exists('username', $post) || strlen(trim($post['username'])) === 0) {
        $errorCode = '1';
    } elseif (!array_key_exists('password', $post) || strlen(trim($post['password'])) === 0) {
        $errorCode = '2';
    }

    if (!$errorCode) {
        // search a user with the received username
        $username = trim($post['username']);
        $config = require __DIR__ . '/config.php';
        $connector = new DbConnector($config['host'], $config['user'], $config['pass'], $config['name']);
        $statement = $connector->prepare('SELECT id, username, password FROM Users WHERE username = :username');
        $statement->bindParam(':username', $username, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if (empty($result)) {
            // user not found
            $errorCode = '3';
        } elseif (password_verify($post['password'], $result['password'])) {
            // password is correct so generate the token
            $tokenManager = new TokenManager();
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'token' => $tokenManager->generateToken((int)$result['id']),
                'username' => $result['username'],
            ]);
            exit;
        } else {
            // wrong password
            $errorCode = '3';
        }
    }
} else {
    $errorCode = '4';
}

// send the error back
http_response_code($errorCode === '4' ? 405 : ($errorCode === '3' ? 401 : 400));
echo json_encode([
    'success' => false,
    'errorCode' => $errorCode,
    'error' => $errors[$errorCode],
]);
