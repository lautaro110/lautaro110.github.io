<?php
// Archivo de prueba: devuelve 10 noticias y 5 noticias principales para el carrusel

$noticias_principales = [
    ["titulo" => "Noticia Prueba 1", "resumen" => "Resumen de prueba 1", "imagen" => "carruzel1.jpg"],
    ["titulo" => "Noticia Prueba 2", "resumen" => "Resumen de prueba 2", "imagen" => "carruzel2.jpg"],
    ["titulo" => "Noticia Prueba 3", "resumen" => "Resumen de prueba 3", "imagen" => "carruzel3.jpg"],
    ["titulo" => "Noticia Prueba 4", "resumen" => "Resumen de prueba 4", "imagen" => "carruzel4.jpg"],
    ["titulo" => "Noticia Prueba 5", "resumen" => "Resumen de prueba 5", "imagen" => "carruzel5.jpg"],
];

$noticias = [];
for($i=1; $i<=10; $i++){
    $noticias[] = [
        "titulo" => "Noticia Prueba $i",
        "resumen" => "Resumen de prueba $i",
        "imagen" => "noticiaprueba$i.jpg"
    ];
}

// Devolver JSON para que main.html lo pueda consumir
header('Content-Type: application/json');
echo json_encode(["carrusel" => $noticias_principales, "noticias" => $noticias]);
?>
