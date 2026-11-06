<?php

declare(strict_types=1);


class DbConnector
{
    private string $servername;
    private string $username;
    private string $Password;
    private string $dbname;
    private ?PDO $connection = null;

    public function __construct(string $servername, string $username, string $Password, string $dbname)
    {
        $this->servername = $servername;
        $this->username = $username;
        $this->Password = $Password;
        $this->dbname = $dbname;

        $this->connect();
    }

    private function connect(): void
    {
        try {
            $this->connection = new PDO(
                "mysql:host={$this->servername};dbname={$this->dbname};charset=utf8",
                $this->username,
                $this->Password
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'error' => 'Connessione al DB fallita: ' . $e->getMessage()
            ]));
        }
    }

    public function prepare(string $query): PDOStatement
    {
        if (!$this->connection) {
            $this->connect();
        }
        return $this->connection->prepare($query);
    }

    public function lastInsertId(): string
    {
        return $this->connection->lastInsertId();
    }
}
