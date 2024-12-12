import { GridFSBucket } from "mongodb";
import { getDbFile } from "~/db/connection";

export default defineEventHandler(async (event) => {
	try {
		const db = getDbFile();
		if (!db) {
			throw createError({ statusCode: 500, message: "Files database connection not available" });
		}

		// Initialize GridFSBucket
		const bucket = new GridFSBucket(db, { bucketName: "uploads" });

		// Find all files in the uploads bucket
		const files = await bucket.find().toArray();

		if (files.length === 0) {
			throw createError({ statusCode: 404, message: "No files found" });
		}

		// Return the list of files to the client
		const fileList = files.map((file) => ({
			filename: file.filename,
			contentType: file.contentType,
			length: file.length, // Optional: File size
			uploadDate: file.uploadDate // Optional: Upload date
		}));

		return fileList;
	} catch (error) {
		console.error("Error retrieving files:", error);
		throw createError({ statusCode: 500, message: "Error retrieving files" });
	}
});
