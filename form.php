<?php

$host = 'localhost';
$user = 'postgres';
$pass = 'postgres';
$dbname = 'Email';

$conn = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $email = $_POST['email'];
    
}

$stmt = $conn->prepare('INSERT INTO dados (email) VALUES ( :email )');

$stmt->bindParam(':email', $email);

$stmt->execute();

if ($stmt->rowCount() > 0) {
    echo 'Dados inseridos com sucesso!';
} else {
    echo 'Erro ao inserir os dados!';
}

?>