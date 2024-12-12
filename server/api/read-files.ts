import { MongoClient, Db, Collection, Document } from "mongodb";
import { defineEventHandler, H3Event, createError } from "h3";

// MongoDB connection details
const mongoURI = "mongodb://localhost:27017/nuxt-file-db";
const client = new MongoClient(mongoURI);
let db: Db;
let collection: Collection<Document>;

// Establish MongoDB connection
async function connectDB(): Promise<void> {
	await client.connect();
	db = client.db();
	collection = db.collection("files");
}

// Connect to the database on module initialization
connectDB().catch((err) => {
	console.error("Failed to connect to the database:", err);
});

export default defineEventHandler(async (event: H3Event): Promise<object> => {
	try {
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
