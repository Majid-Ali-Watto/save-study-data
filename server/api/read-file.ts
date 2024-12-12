import { GridFSBucket } from "mongodb";
import { sendStream } from "h3";
import { getDbFile } from "~/db/connection";

export default defineEventHandler(async (event) => {
	const query = getQuery(event); // Extract query params
	const fileName = query.filename as string;

	if (!fileName) {
		throw createError({ statusCode: 400, message: "Filename is required" });
	}

	try {
		const db = getDbFile();
		if (!db) {
			throw createError({ statusCode: 500, message: "Files database connection not available" });
		}

		const bucket = new GridFSBucket(db, { bucketName: "uploads" });

		// Find the file by name
		const files = await bucket.find({ filename: fileName }).toArray();

		if (!files || files.length === 0) {
			throw createError({ statusCode: 404, message: "File not found" });
		}

		const file = files[0];

		// Log to ensure the file is correct
		console.log("Found file:", file);

		// Stream the file content back to the client
		const downloadStream = bucket.openDownloadStream(file._id);

		// Set the headers correctly for download
		event.node.res.setHeader("Content-Type", file.contentType || "application/octet-stream");
		event.node.res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

		// Stream the file to the client using sendStream
		await sendStream(event, downloadStream);
	} catch (error) {
		console.error("Error reading file:", error);
		throw createError({ statusCode: 500, message: "Error reading file" });
	}
});
