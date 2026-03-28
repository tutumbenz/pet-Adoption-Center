<?php

header('Content-Type: application/json');
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query('SELECT * FROM animals');
            $animals = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($animals); // Return and print in the frontend
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['name'], $input['species'], $input['color'], $input['age'], $input['gender'], $input['health_status'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }

            $stmt = $pdo->prepare('INSERT INTO animals (name, species, color, age, gender, health_status, isAdopted) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $input['name'],
                $input['species'],
                $input['color'],
                $input['age'],
                $input['gender'],
                $input['health_status'],
                $input['isAdopted'] ?? 0 // Uses 0 (false) if the user didn't provide a value
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
        case 'PATCH':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                break;
            }
        
            if (isset($input['health_status'])) {
                $stmt = $pdo->prepare('UPDATE animals SET health_status = ? WHERE id = ?');
                $stmt->execute([$input['health_status'], $input['id']]);
            }
        
            if (isset($input['isAdopted'])) {
                $stmt = $pdo->prepare('UPDATE animals SET isAdopted = ? WHERE id = ?');
                $stmt->execute([(int)$input['isAdopted'], $input['id']]);
            }
            
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                break;
            }

            $stmt = $pdo->prepare('DELETE FROM animals WHERE id = ?');
            $stmt->execute([$input['id']]);
            
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
