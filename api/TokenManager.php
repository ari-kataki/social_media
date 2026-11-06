<?php
 
declare(strict_types=1);

class TokenManager
{
    private function secret(): string
    {
        $config = require __DIR__ . '/config.php';
        return $config['token_secret'];
    }

    public function generateToken(int $userId): string
    {
        $payload = base64_encode(json_encode([
            'id' => $userId,
            'exp' => time() + 3600, // Token valid 1 hour
        ]));

        $signature = hash_hmac('sha256', $payload, $this->secret());
        return $payload . '.' . $signature;
    }

    public function validate(string $token): int|bool
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return false;
        }

        [$payload, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $payload, $this->secret());
        if (!hash_equals($expectedSignature, $signature)) {
            return false;
        }

        $data = json_decode(base64_decode($payload), true);
        if (!is_array($data) || !isset($data['id']) || $data['exp'] < time()) {
            return false;
        }

        return (int)$data['id'];
    }
}