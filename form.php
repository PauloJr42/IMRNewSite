<?php

$host = 'localhost';
$user = 'postgres';
$pass = 'postgres';
$dbname = 'Email';
$port = '5432';

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $email = $_POST['email'];
    
}

$stmt = $conn->prepare('INSERT INTO dados (email) VALUES (? )');

$stmt->bindParam(':email', $email);

$stmt->execute();

if ($stmt->rowCount() > 0) {
    echo 'Dados inseridos com sucesso!';
} else {
    echo 'Erro ao inserir os dados!';
}

?>