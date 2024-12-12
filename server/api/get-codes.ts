import { defineEventHandler } from "h3";
import { getDb } from "~/db/connection";
import { ObjectId } from "mongodb";

// Define the types
type Code = {
	_id: ObjectId; // Use MongoDB's ObjectId for the `_id` field
	code: string;
	createdAt: string;
	title: string;
};

interface Response {
	success: boolean;
	codes?: Code[];
	message?: string;
}

// Define the event handler
export default defineEventHandler(async (): Promise<Response> => {
	try {
		// Get the database connection
		const db = getDb();
		if (!db) throw new Error("No database connection");

		// Fetch data from the collection
		const codes = await db.collection<Code>("posts-code-data").find().toArray();

		// Return success response
		return {
			success: true,
			codes
		};
	} catch (error) {
		console.error("Error fetching posts from MongoDB:", error);

		// Return error response
		return {
			success: false,
			message: "Error fetching data."
		};
	}
});
