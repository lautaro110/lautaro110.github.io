<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if($_SERVER["REQUEST_METHOD"] === "POST"){
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    if(!$nombre || !$email || !$mensaje){
        echo json_encode(['status' => 'error', 'message' => 'Complete todos los campos']);
        exit;
    }

    $mail = new PHPMailer(true);
    try {
        // Configuración SMTP de Gmail
        $mail->isSMTP();
        $mail->SMTPDebug = 2; 
        $mail->Debugoutput = 'html';

        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'belawskylautaro@gmail.com'; // correo del admin
        $mail->Password = 'nxie zjqk oudi wvlk'; // contraseña de aplicación de Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('belawskylautaro@gmail.com', 'Web Escuela Técnica');
        $mail->addAddress('belawskylautaro@gmail.com', 'Administrador'); // destino

        $mail->Subject = 'Nuevo mensaje de contacto';
        $mail->Body    = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado correctamente']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Error al enviar: {$mail->ErrorInfo}"]);
    }
}
?>
