<?php
// Configurações do banco de dados
$host = 'localhost';
$port = '5432';
$dbname = 'Email';
$user = 'postgres';
$password = 'postgres';

// DSN (Data Source Name) para a conexão PDO com PostgreSQL
$dsn = "pgsql:host=$host;dbname=$dbname;user=$usuario;password=$senha";

// Configurações adicionais para o PDO
$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
  $conexao = new PDO($dsn, $usuario, $senha, $options);
  echo "Conexão com o banco de dados PostgreSQL estabelecida com sucesso!";
} catch (PDOException $e) {
  die("Erro na conexão com o banco de dados PostgreSQL: " . $e->getMessage());
}
// Conexão com o PostgreSQL
//try {
 // $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");
//} catch (PDOException $e) {
 // die("Erro na conexão com o banco de dados: " . $e->getMessage());
//}

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
$stmt->execute([$email]);

// Verificar se houve algum erro
$errorInfo = $stmt->errorInfo();
if ($errorInfo[0] != '00000') {
    die("Erro no banco de dados: " . $errorInfo[2]);
}

// Matando conexão
$conexao = null;

