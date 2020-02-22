const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const multer = require('multer')


// Get a user's profile data
router.get("/:username", (req, res) => {
    db.one(
		`SELECT username, firstname, lastname, email
		FROM users
		WHERE username = '${req.params.username}';`
	).then((p) => {
		return res.send(p);
	}).catch((error) => {
		return res.status(404).send({"error": `${error.message}`});
	});
});


const upload = multer()

// Create a new user
router.post("/", upload.single('profpic'), (req, res) => {
	/** request body will have the following fields:
	 * ID
	 * Username
	 * Firstname
	 * Lastname
	 * Email
	 * HashedPassword
	 * ProfilePic
	 * PrivacySetting
	 * NotificationSetting
	 */
	

	db.none(
		`INSERT INTO users (
			id, username, firstname, lastname, email,
			hashedpassword, profpic, privacysetting, notificationsetting
		) VALUES
		(
			DEFAULT, '${req.body.username}',
			'${req.body.firstname}',
			'${req.body.lastname}',
			'${req.body.email}',
			'${req.body.hashedpassword}',
			NULL,
			${req.body.privacysetting ? `'${req.body.privacysetting}'` : "NULL"},
			${req.body.notificationsetting ? `'${req.body.notificationsetting}'` : "NULL"}
		);`
	).then((p) => {
		return res.status(200).send({
			response: `User '${req.body.username}' has been created.`
		});
	}).catch((error) => {
		return res.status(500).send({
			error: `User '${req.body.username}' could not be created.`,
			postgres_response: error,
			buffer: req.file ? req.file.buffer : undefined
		});
	});
});


// Update a user's profile data
router.patch("/:username", (req, res) => {
	updateString = ''
	for (const field in req.body) {
		updateString = `${updateString}, ${field} = '${req.body[field]}'`
	}
	updateString = updateString.substr(1)
	//return res.send(updateString)

    db.none(
		`UPDATE users
		SET ${updateString}
		WHERE username = '${req.params.username}';`
	).then((p) => {
		return res.status(200).send({
			response: `User '${req.body.username}' has been updated.`
		});
	}).catch((error) => {
		return res.status(500).send(error);
	});
});


// Delete a user
router.delete("/:username", (req, res) => {
    db.any(
		`DELETE FROM users
		WHERE username = '${req.params.username}';`
	).then((p) => {
		return res.send({
			response: `User '${req.params.username}' has been deleted.`
		})
	}).catch((error) => {
		return res.status(500).send({
			error: `User '${req.params.username}' could not be created.`,
			postgres_response: error
		});
	});
});

module.exports = router;
