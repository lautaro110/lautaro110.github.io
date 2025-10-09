-- -----------------------------------------------------
-- Base de datos web_escolar
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS web_escolar
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE web_escolar;

-- -----------------------------------------------------
-- Tabla noticias
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    principal TINYINT(1) DEFAULT 0, -- 1 si va al carrusel
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Ejemplo de inserción de noticias
-- -----------------------------------------------------
INSERT INTO noticias (titulo, resumen, contenido, imagen, principal)
VALUES
('Bienvenida al Ciclo Lectivo 2025', 'Comenzamos un nuevo año escolar con muchas actividades.', 'Contenido completo de la noticia de bienvenida.', 'bienvenida.jpg', 1),
('Nueva Biblioteca Virtual', 'La escuela inaugura su biblioteca digital.', 'Contenido completo sobre la nueva biblioteca.', 'biblioteca.jpg', 0),
('Torneo de Matemática', 'Participa en nuestro torneo anual de matemáticas.', 'Detalles completos del torneo.', 'matematica.jpg', 0),
('Semana de la Ciencia', 'Actividades y talleres durante la Semana de la Ciencia.', 'Información completa de los talleres.', 'ciencia.jpg', 1),
('Festival de Arte Escolar', 'Exposición de trabajos de estudiantes de arte.', 'Contenido completo del festival.', 'arte.jpg', 0);
