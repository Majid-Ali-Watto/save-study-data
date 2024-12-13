import { createError } from "h3";
import { getDbFile } from "~/db/connection"; // Assuming you have a `getDbFile` function to get the database connection

export default defineEventHandler(async (event) => {
	const query = getQuery(event); // Extract query params
	const fileName = query.filename as string;

	if (!fileName) {
		throw createError({ statusCode: 400, message: "Filename is required" });
	}

	try {
		const db = getDbFile();
		if (!db) throw new Error('Could not find database connection.');
		const collection = db.collection("files");
		const file = await collection.findOne({ filename: fileName });

		if (!file) {
			throw createError({ statusCode: 404, message: "File not found" });
		}

		// Convert MongoDB Binary data to Buffer
		const fileDataBuffer = file.data.buffer ? Buffer.from(file.data.buffer) : file.data;

		// Set the headers for the file download
		event.node.res.setHeader("Content-Type", file.contentType || "application/octet-stream");
		event.node.res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

		// Send the file content as a buffer
		event.node.res.write(fileDataBuffer);
		event.node.res.end();
	} catch (error) {
		console.error("Error reading file:", error);
		throw createError({ statusCode: 500, message: "Error reading file" });
	}
});
