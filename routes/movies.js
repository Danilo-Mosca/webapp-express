import express from "express";
const router = express.Router();

import { index, show, store, update, destroy } from '../controllers/movieController.js';

/* ROTTE */

// Index - Read all
router.get("/index", index);

// Show - Read one
router.get("/show/:id", show);

// Store - Create
router.post("/", store);

// Update - Update
router.put("/:id", update);

// Modify - Update (partial)
// router.patch("/:id", (req, res) => {
//   res.send("Modifica parziale item con id: " + req.params.id);
// });

// Destroy - Delete
router.delete("/:id", destroy);

// Esporto la rotta router
export default router;