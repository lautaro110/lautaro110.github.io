<?php
require_once __DIR__ . '/../../vendor/autoload.php';
session_start();

$client = new Google_Client();
$client->setClientId("475324951083-lp2pvqi80vs95cshsij7hn5m8tg3b0s3.apps.googleusercontent.com");
$client->setClientSecret("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");
$client->setRedirectUri("http://localhost/pagina/login.html");
$client->addScope("email");
$client->addScope("profile");

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    if (!isset($token['error'])) {
        $client->setAccessToken($token['access_token']);
        $oauth = new Google_Service_Oauth2($client);
        $info = $oauth->userinfo->get();

        $archivoUsuarios = __DIR__ . '/../../date/usuarios.json';
        if (!file_exists($archivoUsuarios)) {
            file_put_contents($archivoUsuarios, json_encode([]));
        }

        $usuarios = json_decode(file_get_contents($archivoUsuarios), true);
        $correo = $info->email;
        $nombre = $info->name;

        // Buscar usuario existente
        $usuarioExistente = null;
        foreach ($usuarios as $u) {
            if (strcasecmp($u["correo"], $correo) === 0) {
                $usuarioExistente = $u;
                break;
            }
        }

        if (!$usuarioExistente) {
            $nuevoUsuario = [
                "id" => time(),
                "nombre" => $nombre,
                "correo" => $correo,
                "contraseña" => "",
                "rol" => "usuario",
                "tipoCuenta" => "google"
            ];

            $usuarios[] = $nuevoUsuario;
            file_put_contents($archivoUsuarios, json_encode($usuarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $_SESSION["usuario"] = $nuevoUsuario;
        \$_SESSION['user_id'] = \$nuevoUsuario['id']; // 🔹 agregado: guardar ID de usuario para control individual
        } else {
            $_SESSION["usuario"] = $usuarioExistente;
        \$_SESSION['user_id'] = \$usuarioExistente['id']; // 🔹 agregado: guardar ID de usuario para control individual
        }

        header("Location: /pagina/index.html");
        exit;
    }
}

header("Location: " . $client->createAuthUrl());
exit;
