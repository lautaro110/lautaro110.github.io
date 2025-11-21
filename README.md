**Proyecto**: Web Escolar

- **Descripción**: Repositorio de la página web escolar (PHP + MySQL) usada localmente con XAMPP. Contiene frontend, APIs y scripts para calendario, noticias y gestión de usuarios.

**Requisitos**:
- **Servidor**: Windows (ej.: local con XAMPP) o Linux con Apache/Nginx + PHP 7.4+.
- **PHP**: 7.4 o superior con extensiones `mysqli`, `json`, `mbstring`, `curl`, `openssl`.
- **Base de datos**: MySQL/MariaDB.
- **Herramientas**: phpMyAdmin (opcional), Composer (si usas `vendor/`), XAMPP Control Panel.

**Estructura importante**:
- `config/db_connect.php` : conexión simple MySQLi.
- `php/config.php` : configuración central (carga `.env`, define constantes y crea `$conn` / `$mysqli`).
- `php/` : scripts PHP (login, upload, APIs, etc.).
- `api/` : endpoints públicos (ej. `api/users.php`).
- `date/` : funcionalidad del calendario y migraciones relacionadas.
- `sql/` : (si existe) dumps y migraciones SQL.
- `uploads/` : archivos subidos por usuarios (asegurar permisos).

**Instalación local (pasos)**:

1) Clonar/copy del proyecto en la carpeta pública del servidor (ej. `C:\xampp\htdocs\web-escolar`).

2) Iniciar XAMPP (o services) y arrancar Apache y MySQL usando XAMPP Control Panel.

3) Crear la base de datos:

   - Abrir `http://localhost/phpmyadmin` y crear una base de datos llamada `web_escolar` (o el nombre que prefieras).
   - Si tienes un dump SQL en `sql/` o exportado, impórtalo desde phpMyAdmin o usa la línea de comandos:

```powershell
mysql -u root -p web_escolar < C:\ruta\a\dump.sql
```

4) Revisar credenciales de conexión:

   - El proyecto usa por defecto `DB_HOST=localhost`, `DB_USER=root`, `DB_PASS=''` (vacío) y `DB_NAME=web_escolar`.
   - Archivos relevantes:
     - `config/db_connect.php`
     - `php/config.php`

   - Puedes usar un archivo `.env` en `php/.env` con formato `KEY=VALUE` (ejemplo abajo) o editar `config/db_connect.php` si no usas `.env`.

Ejemplo de `.env` (coloca en `php/.env`):

```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=web_escolar
GOOGLE_CREDENTIALS_PATH=../date/google_credentials.json.json
```

5) Permisos de carpetas:

- Asegúrate que la carpeta `uploads/` y `img/` sean escribibles por Apache (en Windows normalmente funciona desde `htdocs`).

6) Dependencias opcionales:

- Si el proyecto usa librerías Composer, instala con:

```powershell
cd C:\xampp\htdocs\web-escolar
composer install
```

7) Google API / Sign-in (opcional):

- Si usas Google Sign-In / Calendar, coloca las credenciales JSON en la ruta indicada en `php/config.php` o en `php/.env` y asegúrate que el archivo exista y tenga permisos de lectura.

**SQL mínimo (ejemplo)**:

Ejecuta en phpMyAdmin o CLI para crear una tabla `usuarios` básica (adaptar según código existente):

```sql
CREATE DATABASE IF NOT EXISTS web_escolar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_escolar;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tipo_cuenta VARCHAR(20) DEFAULT 'manual',
  foto LONGTEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Nota: revisa otros scripts en `date/` o `sql/` para migraciones adicionales (eventos/calendario, noticias, etc.).

**Variables de configuración importantes**:

- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` — usadas en `php/config.php` y `config/db_connect.php`.
- `GOOGLE_CREDENTIALS_PATH` — ruta al JSON de Google si usas calendar/signin.

**Cómo probar la aplicación**:

1. Abre en el navegador: `http://localhost/web-escolar/index.html` o la ruta a `index.html`.
2. Prueba el login/registro con un usuario de la tabla `usuarios` o regístrate desde la interfaz `registrarse.html`.
3. Revisa los endpoints en `api/` (ej: `http://localhost/web-escolar/api/users.php`).

**Solución de problemas comunes**:

- Error de conexión a la BD: revisa que MySQL esté corriendo y verifica credenciales en `php/config.php` o `config/db_connect.php`.
- `vendor/autoload.php no encontrado`: ejecutar `composer install` o revisar si se han subido dependencias.
- Permisos de subida: si las subidas fallan, comprueba que `uploads/` exista y sea escribible.
- Errores de codificación (caracteres raros): asegúrate que la conexión use `utf8mb4` (ya configurado en `php/config.php`).

**Seguridad y producción**:

- Nunca dejes `display_errors` activo en producción. En `php/config.php` se habilita para desarrollo; cambia `display_errors` a `0` y registra errores en archivos protegidos.
- Usa contraseñas fuertes para el usuario de DB y no uses `root` en producción.
- Protege la carpeta `uploads/` con reglas de servidor (evitar ejecución de scripts).
- Considera usar HTTPS en producción.

**Backups**:

- Realiza dumps periódicos de la base de datos con `mysqldump`:

```powershell
mysqldump -u root -p web_escolar > C:\backups\web_escolar_$(Get-Date -Format yyyyMMdd).sql
```

**Siguientes pasos / Desarrollo**:

- Añadir un script `setup.sql` en `sql/` con todas las tablas necesarias.
- Documentar endpoints `api/` (parámetros, respuestas JSON).
- Añadir instrucciones de despliegue (Docker / VPS) si quieres mover a producción.

---
Si quieres, puedo:
- generar un `sql/setup.sql` completo basado en los scripts del repo, o
- añadir un ejemplo `.env.example` y mejorar `php/config.php` para usarlo.

Indícame qué prefieres y lo hago a continuación.
