<?php
require_once 'config.php';

// Obtener todas las noticias
$stmt = $pdo->prepare("SELECT * FROM noticias ORDER BY fecha DESC");
$stmt->execute();
$noticias = $stmt->fetchAll();

echo json_encode($noticias);
?>
