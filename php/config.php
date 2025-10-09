<?php
// -----------------------------------------------------
//  CONFIGURACIÓN GOOGLE API
// -----------------------------------------------------
require_once __DIR__ . '/../vendor/autoload.php';

$client = new Google_Client();

// Datos de Google API
$client->setClientId("475324951083-lp2pvqi80vs95cshsij7hn5m8tg3b0s3.apps.googleusercontent.com");
$client->setClientSecret("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");
$client->setRedirectUri("http://localhost/web-escolar/php/login_google.php");

// Scopes para obtener datos básicos del usuario
$client->addScope("email");
$client->addScope("profile");

// -----------------------------------------------------
//  CONFIGURACIÓN BASE DE DATOS
// -----------------------------------------------------
$host = 'localhost';
$db   = 'web_escolar';
$user = 'root';
$pass = ''; // Si tu XAMPP tiene contraseña de root, colócala aquí
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit();
}
?>
