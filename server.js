// importo express in server js
import express from "express";

// Altri import
import errorsHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
import corsPolicy from "./middlewares/corsPolicy.js";
// Routing
import moviesRouter from "./routes/movies.js";

// Creo un'istanza di express
const app = express();

// setto la costante per la porta
const port = process.env.PORT || 3000;

// Gestione assett static impostati nella cartella pubblica "public"
app.use(express.static("public"));

// Abilita la corsPolicy
app.use(corsPolicy);

// registro il body-parser per "application/json"
app.use(express.json());

// rotta per Home Page (http://localhost:3000/)
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Altre rotte
app.use("/api/", moviesRouter);

// Gestione errori applicazione
app.use(errorsHandler);

// Gestione not found url
app.use(notFound);

// Server che rimane in ascolto dell'Host alla porta specificata
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});