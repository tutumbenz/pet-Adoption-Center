<?php

try {
    $pdo = new PDO('sqlite:animals.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $createTable = "
        CREATE TABLE IF NOT EXISTS animals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            color TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            health_status TEXT NOT NULL,
            isAdopted BOOLEAN DEFAULT 0 
        )
    ";
    $pdo->exec($createTable);
    //$pdo->exec("ALTER TABLE animals ADD COLUMN isAdopted BOOLEAN DEFAULT 0"); : temporarly to fix the error of adding isAdopted field to the existing table 
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
