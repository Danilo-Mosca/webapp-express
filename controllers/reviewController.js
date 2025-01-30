// Importo il modulo per la connessione al database:
import connection from "../connection.js";
// Importo la classe customError con il messaggio di errore personalizzato:
import CustomError from "../classes/CustomError.js";

function index(req, res) {
    // Recupero tutti i commenti:
    const sql = "SELECT * FROM `reviews`";
    // Uso il metodo query() per passargli la query SQL e una funzione di callback:
    connection.query(sql, (err, results) => {
        // Se rilevo un errore nella chiamata al database, restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
        if (err) res.status(500).json({ error: 'Errore del server' });
        // console.log(results);
        // Creo un oggetto contenente il conteggio totale delle recensioni e il risultato della query precedente (items: results):
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
    // Recupero i commenti con l'id corrispondente:
    // Creo la query SQL con le Prepared statements (? al posto di id) per evitare le SQL Injections:
    const sql = "SELECT * FROM `reviews` WHERE `id` = ?";
    // Uso il metodo query() per passargli la query SQL, il valore di di id nel segnaposto "?", e una funzione di callback:
    connection.query(sql, [id], (err, results) => {
        // Se rilevo un errore restituisco l'errore HTTP 500 Internal Server Error” e un messaggio personalizzato:
        if (err) return res.status(500).json({
            error: 'Query non trovata nel database'
        });
        // Assegno alla costante item i dati ritornati dalla query:
        const item = results[0];
        // Poi verifico se l'interrogazione al database ha tornato qualche dato (se l'id passato alla query non esiste: "results[0] == undefined" ritorno un oggetto con status 404 e messaggio "Recensione non trovata":
        if (!item) return res.status(404).json({ error: 'Recensione non trovata' });
        // Ritorno l'oggetto (item) con il commento corrispondente all'id della query (se presente)
        res.json(item);
    });
};

function store(req, res) { }

function update(req, res) { }

function destroy(req, res) {
    const id = parseInt(req.params.id);
    const sql = "SELECT * FROM reviews WHERE id = ?"
    connection.query(sql, [id], (err, results) => {
        if (!results[0]) return res.status(404).json({ error: "Not Found" });
        const deleteSql = "DELETE FROM reviews WHERE id = ?"
        connection.query(deleteSql, [id], (err) => {
            if (err) return res.status(404).json({ error: "Item not fount" });
            res.sendStatus(204)
        })
    })
}

export { index, show, store, update, destroy };