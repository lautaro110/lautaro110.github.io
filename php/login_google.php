<?php
require_once "config.php";

session_start();

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    if (!isset($token['error'])) {
        $client->setAccessToken($token);

        // Obtener info del usuario
        $oauth = new Google_Service_Oauth2($client);
        $userinfo = $oauth->userinfo->get();
        $email = $userinfo->email;

        // Validar dominio
        if (str_ends_with($email, "@eest5.com")) {
            // Guardamos datos en sesión
            $_SESSION['user_name'] = $userinfo->name;
            $_SESSION['user_email'] = $userinfo->email;
            $_SESSION['user_picture'] = $userinfo->picture;

            // Redirigir a la página principal
            header("Location: ../main.html");
            exit;
        } else {
            echo "<h2>Acceso denegado ❌</h2>";
            echo "<p>Solo las cuentas @eest5.com pueden ingresar.</p>";
            echo "<a href='login_google.php'>Intentar con otra cuenta</a>";
            exit;
        }
    } else {
        echo "Error al obtener el token: " . $token['error'];
    }
} else {
    $login_url = $client->createAuthUrl();
    echo "<a href='" . $login_url . "'>Iniciar sesión con Google</a>";
}
?>
