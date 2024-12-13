import multer from "multer";
import { defineEventHandler } from "h3";
import { getDbFile } from "~/db/connection";

export default defineEventHandler(async (event) => {
	if (event.node.req.method !== "POST") {
		event.node.res.statusCode = 405; // Method Not Allowed
		event.node.res.end();
		return { message: "Only POST requests are allowed." };
	}
	const db = getDbFile();
	if (!db) {
		event.node.res.statusCode = 500; // Method Not Allowed
		event.node.res.end();
		return { message: "Internal Server Error." };
	}
	const collection = db.collection("files");

	const upload = multer();

	const uploadMiddleware = upload.single("file");
	return new Promise((resolve, reject) => {
		uploadMiddleware(event.node.req as any, event.node.res as any, async (err) => {
			if (err) {
				event.node.res.statusCode = 400;
				return reject({ error: "File upload failed", details: err });
			}

			// Store binary data directly
			const uploadedFile = (event.node.req as any).file;
			const desc = (event.node.req as any).body.description;
			console.log(desc);
			// Get the size of the buffer
			const fileSize = Buffer.byteLength(uploadedFile.buffer);
			await collection.insertOne({
				filename: uploadedFile.originalname,
				contentType: uploadedFile.mimetype,
				data: uploadedFile.buffer,
				description: desc,
				size: fileSize // Store the size in the database if needed
			});

			event.node.res.statusCode = 200;
			resolve({ message: "File uploaded successfully" });
		});
	});
});
