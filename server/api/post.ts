import { readBody } from "h3";
import { getDb } from "~/db/connection";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event); // Get form data from the client
		const { title, link, description } = body;

		const db = getDb();
		if (!db) throw new Error("No database connection");
		const result = await db.collection("posts-data").insertOne({
			title,
			link,
			description,
			createdAt: new Date()
		});

		return {
			success: true,
			post: result // Return the inserted post
		};
	} catch (error) {
		console.error("Error inserting post into MongoDB:", error);
		return {
			success: false,
			message: "Failed to create post."
		};
	}
});
