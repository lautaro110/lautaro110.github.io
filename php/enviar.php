<?php
header('Content-Type: application/json');

// Log de depuración
file_put_contents('debug.txt', 'Llamada recibida: ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

/**
 * Cargar variables desde archivo .env
 */
function cargar_env($ruta) {
    if (!file_exists($ruta)) return;
    $lineas = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lineas as $linea) {
        if (trim($linea) === '' || str_starts_with(trim($linea), '#')) continue;
        list($clave, $valor) = explode('=', $linea, 2);
        $_ENV[trim($clave)] = trim(str_replace('"', '', $valor));
    }
}

cargar_env(__DIR__ . '/.env');

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nombre  = $_POST['nombre'] ?? '';
    $email   = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    if (!$nombre || !$email || !$mensaje) {
        echo json_encode(['status' => 'error', 'message' => 'Complete todos los campos']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Configuración SMTP Gmail
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['GMAIL_USER'];
        $mail->Password   = $_ENV['GMAIL_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Remitente y destinatario
        $mail->setFrom($_ENV['GMAIL_USER'], $_ENV['GMAIL_NAME']);
        $mail->addAddress($_ENV['GMAIL_USER'], 'Administrador');
        $mail->addReplyTo($email, $nombre);

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Nuevo mensaje de contacto';
        $mail->Body    = "
            <strong>Nombre:</strong> $nombre <br>
            <strong>Email:</strong> $email <br>
            <strong>Mensaje:</strong><br>
            $mensaje
        ";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado correctamente.']);
    } catch (Exception $e) {
        file_put_contents('debug.txt', "[" . date('Y-m-d H:i:s') . "] Error: " . $mail->ErrorInfo . "\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => "Error al enviar: {$mail->ErrorInfo}"]);
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
