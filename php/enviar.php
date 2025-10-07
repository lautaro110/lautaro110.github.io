<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
        exit;
    }

    // Validar sesión enviada desde el cliente
    $usuarioLogueado = isset($_POST['usuarioLogueado']) ? trim($_POST['usuarioLogueado']) : '';
    if ($usuarioLogueado === '') {
        http_response_code(401);
        echo json_encode(['ok' => false, 'message' => 'Debes iniciar sesión']);
        exit;
    }

    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

    if ($nombre === '' || $email === '' || $mensaje === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Faltan campos']);
        exit;
    }

    // Config destinos
    $destinatario = 'destino@ejemplo.com';
    $subjectPrefix = '[Contacto Web]';
    $configPath = __DIR__ . '/../date/mail_config.json';
    if (file_exists($configPath)) {
        $cfg = json_decode(file_get_contents($configPath), true);
        if (!empty($cfg['to'])) $destinatario = $cfg['to'];
        if (!empty($cfg['subject_prefix'])) $subjectPrefix = $cfg['subject_prefix'];
    }

    $subject = $subjectPrefix . ' ' . $nombre;
    $body = "Nombre: {$nombre}\nEmail: {$email}\nUsuario: {$usuarioLogueado}\n\nMensaje:\n{$mensaje}\n";
    $headers = "From: {$nombre} <{$email}>\r\nReply-To: {$email}\r\n";

    $ok = @mail($destinatario, $subject, $body, $headers);
    if (!$ok) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'message' => 'No se pudo enviar (configurar SMTP)']);
        exit;
    }

    echo json_encode(['ok' => true, 'message' => 'Mensaje enviado correctamente']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error del servidor']);
}


