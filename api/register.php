<?php

require_once 'DbConnector.php';
require_once 'TokenManager.php';

header('Content-Type: application/json; charset=utf-8');

// error codes and their messages
$errors = [
    '1' => 'Username is required',
    '2' => 'Password is required',
    '3' => 'Passwords do not match',
    '4' => 'Username already taken',
    '5' => 'Method not allowed. Use POST',
];

$errorCode = null;

// check that the request is a post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // read the json sent by the app
    $post = json_decode(file_get_contents('php://input'), true);

    // if a field is empty or the passwords are different show the error
    if (!is_array($post) || !array_key_exists('username', $post) || strlen(trim($post['username'])) === 0) {
        $errorCode = '1';
    } elseif (!array_key_exists('password', $post) || strlen(trim($post['password'])) === 0) {
        $errorCode = '2';
    } elseif (!array_key_exists('password2', $post) || $post['password'] !== $post['password2']) {
        $errorCode = '3';
    }

    if (!$errorCode) {
        // search a user with the received username
        $username = trim($post['username']);
        $config = require __DIR__ . '/config.php';
        $connector = new DbConnector($config['host'], $config['user'], $config['pass'], $config['name']);
        $statement = $connector->prepare('SELECT id FROM Users WHERE username = :username');
        $statement->bindParam(':username', $username, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if (!empty($result)) {
            // username already used
            $errorCode = '4';
        } else {
            // save the new user with the hashed password
            $hashedPassword = password_hash($post['password'], PASSWORD_BCRYPT);
            $statement = $connector->prepare('INSERT INTO Users (username, password) VALUES (:username, :password)');
            $statement->bindParam(':username', $username, PDO::PARAM_STR);
            $statement->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $statement->execute();

            // generate the token so the user is already logged
            $userId = (int)$connector->lastInsertId();
            $tokenManager = new TokenManager();
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'token' => $tokenManager->generateToken($userId),
                'username' => $username,
            ]);
            exit;
        }
    }
} else {
    $errorCode = '5';
}

// send the error back
http_response_code($errorCode === '5' ? 405 : ($errorCode === '4' ? 409 : 400));
echo json_encode([
    'success' => false,
    'errorCode' => $errorCode,
    'error' => $errors[$errorCode],
]);
