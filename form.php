<?php

$host = 'localhost';
$user = 'postgres';
$pass = 'postgres';
$dbname = 'Email';
$port = '5432';
$email = $_POST['email'];

$conn = new PDO("pg_connect:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");

$stmt = $conn->prepare('INSERT INTO emails (email) VALUES (? )');

$stmt->bindParam("s", $email);

$stmt->execute();

if ($stmt->rowCount() > 0) {
    echo 'Dados inseridos com sucesso!';
} else {
    echo 'Erro ao inserir os dados!';
}


