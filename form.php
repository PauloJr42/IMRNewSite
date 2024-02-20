<?php

$host = 'localhost';
$user = 'postgres';
$pass = 'postgres';
$dbname = 'Email';
$port = '5432';
$email = $_POST['email'];

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$stmt = $conn->prepare('INSERT INTO emails (email) VALUES (? )');

$stmt->bindParam("s", $email);

$stmt->execute();

if ($stmt->rowCount() > 0) {
    echo 'Dados inseridos com sucesso!';
} else {
    echo 'Erro ao inserir os dados!';
}


