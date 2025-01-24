// Importo il modulo per la connessione al database:
import connection from "../connection.js";
// Importo la classe customError con il messaggio di errore personalizzato:
import CustomError from "../classes/CustomError.js";

function index(req, res) {
    // Recupero tutti i film e per ciascun film il numero delle recensioni e la media voto totale:
    const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_average, COUNT(reviews.text) AS num_review
                FROM movies
                LEFT JOIN reviews
                ON reviews.movie_id = movies.id
                GROUP BY movies.id`;
    // Uso il metodo query() per passargli la query SQL e una funzione di callback:
    connection.query(sql, (err, results) => {
        // Se rilevo un errore nella chiamata al database, restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
        if (err) res.status(500).json({ error: 'Errore del server' });
        // console.log(results);
        // Creo un oggetto contenente il conteggio totale dei film e il risultato della query precedente (items: results):
        const response = {
            count: results.length,
            items: results,
        }
        //Rispondo con l'oggetto JSON riempito con i data ricevuti dall'interrogazione fatta al database
        res.json(response);
    });
}

function show(req, res) {
    const id = parseInt(req.params.id);
    // Prima query: recupera il film con l'id corrispondente:
    // Creo la query SQL con le Prepared statements (? al posto di id) per evitare le SQL Injections:
    const sql = "SELECT * FROM `movies` WHERE `id` = ?";
    // Uso il metodo query() per passargli la query SQL, il valore di di id nel segnaposto "?", e una funzione di callback:
    connection.query(sql, [id], (err, results) => {
        // Se rilevo un errore restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
        if (err) return res.status(500).json({
            error: 'Query non trovata nel database'
        });
        // Assegno alla costante item i dati ritornati dalla query:
        const item = results[0];
        // Poi verifico se l'interrogazione al database ha restituito qualche dato (se l'id passato alla query non esiste: "results[0] == undefined" ritorno un oggetto con status 404 e messaggio "Film non trovato":
        if (!item) return res.status(404).json({ error: 'Film non trovato' });

        // Seconda query: recupera i commenti associati al film ricercato:
        const sqlReviews = "SELECT * FROM `reviews` WHERE `movie_id` = ?";

        connection.query(sqlReviews, [id], (err, reviews) => {
            if (err) return res.status(500).json({ error: "Error server" });
            // Aggiungo all'oggetto item una chiave/proprietà che conterrà i commenti associati:
            item.reviews = reviews;
            // Ritorno l'oggetto (item) con il film corrispondente all'id della query (se presenti)
            res.json(item);
        });
    });
}

function store(req, res) { }

function update(req, res) { }

function destroy(req, res) {
    const id = parseInt(req.params.id);
    // Prima verifico se per l'id passato alla query esiste un elemento nel database:
    const sql = "SELECT * FROM `movies` WHERE `id` = ?";
    connection.query(sql, [id], (err, results) => {
        // Se non trovo nessuna corrispondenza allora ritorno un oggetto con status 404 e messaggio "Elemento non trovato":
        if (!results[0]) return res.status(404).json({ error: "Elemento non trovato" });
        // Altrimenti, se c'è corrispondenza, procedo con la cancellazione:
        const deleteSql = "DELETE FROM `movies` WHERE `id` = ?";
        // Uso il metodo query() per passargli la query SQL, il valore di "?", e una funzione di callback:
        connection.query(deleteSql, [id], (err) => {
            // Se rilevo un errore restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
            if (err) return res.status(500).json({ error: 'Errore del server' });
            // Invio lo status 204: il server ha completato con successo la richiesta, ma restituisco alcun contenuto
            res.sendStatus(204);
        });
    });
}

export { index, show, store, update, destroy };