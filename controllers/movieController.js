// Importo il modulo per la connessione al database:
import connection from "../connection.js";
// Importo la classe customError con il messaggio di errore personalizzato:
import CustomError from "../classes/CustomError.js";

function index(req, res) {
    const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_average, COUNT(reviews.text) AS commenti
                FROM movies
                JOIN reviews 
                ON reviews.movie_id = movies.id
                GROUP BY movies.id`;

    connection.query(sql, (err, results) => {
        if (err) res.status(500).json({ error: 'Errore del server' });
        console.log(results);
        const response = {
            count: results.length,
            items: results,
        }
        res.json(response);
    });
}

function show(req, res) {
    const id = parseInt(req.params.id);

    const sql = `SELECT * FROM reviews WHERE movie_id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({
            error: 'Query non trovata nel database'
        });
        const item = results[0];
        if (!item) return res.status(404).json({ error: 'Libro non trovato' });

        const sqlReviews = `SELECT movies.*, AVG(reviews.vote) AS vote_average, COUNT(reviews.text) AS commenti
                FROM reviews
                RIGHT JOIN movies
                ON movies.id = reviews.movie_id
                WHERE movies.id = ?`;

        connection.query(sqlReviews, [id], (err, reviews) => {
            if (err) return res.status(500).json({ error: "Error server" });
            item.reviews = reviews;
            res.json(item);
        });
    });
}

function store(req, res) { }

function update(req, res) { }

function destroy(req, res) {
    const id = parseInt(req.params.id);
    const sql = "DELETE FROM `movies` WHERE `id` = ?";
    // Uso il metodo query() per passargli la query SQL, il valore di "?", e una funzione di callback:
    connection.query(sql, [id], (err, results) => {
        // Se rilevo un errore restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
        if (err) return res.status(500).json({ error: 'Errore del server' });

        // Poi verifico se l'interrogazione al database ha tornato qualche dato (se l'id passato alla query non esiste: "results[0] == undefined" ritorno un oggetto con status 404 e messaggio "L'elemento non esiste":
        if (!results[0]) return res.status(404).json({ error: "L'elemento non esiste" });
        //Altrimenti rispondo con un messaggio di conferma "Libro cancellato" e con uno status 204: che indica che la richiesta del client è stata elaborata correttamente:
        res.json({ message: "Movie cancellato ", results });
        res.sendStatus(204);
    });
}

export { index, show, store, update, destroy };