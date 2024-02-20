<?php
// Configurações do banco de dados
$host = 'localhost';
$port = '5432';
$dbname = 'Email';
$user = 'postgres';
$password = 'postgres';

// Conexão com o PostgreSQL
try {
  $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");
} catch (PDOException $e) {
  die("Erro na conexão com o banco de dados: " . $e->getMessage());
}

// Processar formulário e salvar e-mail no banco de dados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'];

  // Verificar se o e-mail já existe na tabela (opcional)
  $stmt = $pdo->prepare("SELECT * FROM emails WHERE email = ?");
  $stmt->execute([$email]);

  if ($stmt->rowCount() == 0) {
    // Inserir e-mail na tabela
    $stmt = $pdo->prepare("INSERT INTO emails (email) VALUES (?)");
    $stmt->execute([$email]);
    echo "E-mail cadastrado com sucesso!";
  } else {
    echo "Este e-mail já está cadastrado!";
  }
}
?>
