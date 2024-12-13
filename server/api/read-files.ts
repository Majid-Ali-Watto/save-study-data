import { Collection, Document } from "mongodb";
import { defineEventHandler, H3Event, createError } from "h3";
import { getDbFile } from "~/db/connection";

export default defineEventHandler(async (event: H3Event): Promise<object> => {
	try {
		let db = getDbFile();
		let collection: Collection<Document>;
		if (!db) throw new Error("Database connection not available");
		collection = db.collection("files");

		if (!collection) {
			throw new Error("Database connection not available");
		}

		// Fetch all files from the collection
		const files = await collection.find().toArray();

		if (files.length === 0) {
			throw new Error("No files found");
		}
		//	console.log(files)

		// Format the files' metadata
		const fileList = files.map((file) => ({
			filename: file.filename,
			contentType: file.contentType,
			description: file.description,
			size: file.size // Binary data length represents file size
		}));

		return { files: fileList };
	} catch (error: any) {
		throw createError({ statusCode: 500, message: error.message || "An error occurred while retrieving files" });
	}
});
