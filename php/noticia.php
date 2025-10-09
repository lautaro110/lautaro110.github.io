<?php
session_start();

// Si no está logueado, redirigir al login
if (!isset($_SESSION['user_email'])) {
    header("Location: login_google.php");
    exit;
}

// Obtener ID de noticia
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Datos de ejemplo
$noticias = [
    1 => [
        'titulo' => 'Acto de Fin de Año',
        'contenido' => 'Se realizará en el patio central el 20 de diciembre...'
    ],
    2 => [
        'titulo' => 'Viaje de Estudio',
        'contenido' => 'Los alumnos de 5to año viajaron a Córdoba, visitaron museos...'
    ]
];

// Validar noticia
if (!isset($noticias[$id])) {
    die("Noticia no encontrada");
}

// Pasar datos a la plantilla
$titulo = $noticias[$id]['titulo'];
$contenido = $noticias[$id]['contenido'];

// Incluir la plantilla
include __DIR__ . '/../templates/noticia_template.php';
