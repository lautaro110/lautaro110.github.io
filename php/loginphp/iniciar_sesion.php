<?php
header('Content-Type: application/json; charset=UTF-8');
session_start();

$archivoUsuarios = __DIR__ . '/../../date/usuarios.json';
if (!file_exists($archivoUsuarios)) {
    echo json_encode(["success" => false, "message" => "No hay usuarios registrados."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$correo = trim($data["correo"] ?? "");
$contraseña = trim($data["contraseña"] ?? "");

if ($correo === "" || $contraseña === "") {
    echo json_encode(["success" => false, "message" => "Completa todos los campos."]);
    exit;
}

$usuarios = json_decode(file_get_contents($archivoUsuarios), true);

foreach ($usuarios as $usuario) {
    if (strcasecmp($usuario["correo"], $correo) === 0 && $usuario["contraseña"] === $contraseña) {
        $_SESSION["usuario"] = $usuario;
        echo json_encode(["success" => true, "usuario" => $usuario]);
        exit;
    }
}

echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
