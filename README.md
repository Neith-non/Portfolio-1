# Neithan portfolio (PHP + MySQL)

This version runs on Apache/PHP with vanilla CSS and JavaScript. The pages are
`index.php`, `updates.php`, `internship.php`, and `catloon.php`. Data is exposed
through a small PDO-backed JSON API.

## XAMPP setup

1. Copy/clone this folder into `C:\xampp\htdocs\portfolio`.
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Open phpMyAdmin, create/import `database/schema.sql`, then run
   `database/seed.sql` in the `portfolio` database.
4. Browse to `http://localhost/portfolio/`. The default database connection is
   `127.0.0.1`, database `portfolio`, user `root`, and an empty password.
   Override these with `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS` if needed.

If MySQL is temporarily unavailable, the API uses the bundled content fallback
so the pages remain usable.

## API / Postman examples

All responses are JSON:

* `GET http://localhost/portfolio/api/index.php?endpoint=updates`
* `GET http://localhost/portfolio/api/index.php?endpoint=internship`

The JavaScript client fetches these endpoints and safely renders the response.
Unknown endpoints return HTTP 404. If MySQL is unavailable, the known endpoints
serve the bundled fallback content; unexpected API failures return HTTP 500 with
a generic error message.
