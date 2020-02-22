const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// Default route

const multer = require('multer')

const upload = multer()

router.post("/", upload.single('pic'), (req, res) => {
	console.log(req.file.buffer);
	res.send(`username is ${req.body.picture}`);
});

router.get("/select", (req, res) => {
	db.any(
		`SELECT *
		FROM customer_t
		ORDER BY customername
		LIMIT 3;`
	).then((p) => {
		return res.send(p)
	}).catch((error) => {
		return res.send(error)
	});
});

module.exports = router;
