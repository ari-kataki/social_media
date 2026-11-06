<?php
require_once 'TokenManager.php';

header('Content-Type: application/json; charset=utf-8');

function validateAuthToken(): int {
    // 1. exteact header Authorization
    $headers = getallheaders();
    // echo print_r($headers, true);
    // echo print_r($_SERVER, true); 
    // to debug if getallheaders is not working, because of the server configuration 
    // (apache vs nginx, etc) and find the header in $_SERVER 
    // (HTTP_AUTHORIZATION or similar)

    // 2. search for header Authorization (case insensitive) and extract token
    $authHeader = null;
    if (array_key_exists('Authorization', $headers)) {
        $authHeader = $headers['Authorization'];
    } elseif (array_key_exists('authorization', $headers)) {
        $authHeader = $headers['authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    
    // 3. (if) exist, token
    if ($authHeader === null) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Header Authorization not found'
        ]);
        exit;
    }
    
    // Verifiy format (bearer token)
    $parti = explode(' ', $authHeader, 2);
    if (count($parti) !== 2) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Authorization header format not valid. Use: Bearer <token>'
        ]);
        exit;
    }
    
    $tipoAuth = $parti[0];
    $token = $parti[1];
    
    if (strtolower($tipoAuth) !== 'bearer') {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Type of auth not supported. Use Bearer'
        ]);
        exit;
    }
    
    // 4. Validate token
    $tokenManager = new TokenManager();
    $userId = $tokenManager->validate($token);
    
// 5. if token is not valid, response 401(JSON error) and exit
    if ($userId === false) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token non valido o scaduto'
        ]);
        exit;
    }
    
    return $userId;
}