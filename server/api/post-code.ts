import { readBody } from "h3";
import { getDb } from "~/db/connection";

export default defineEventHandler(async (event) => {
	try {
		/* `const body = await readBody(event);` is a line of code that is reading the body of the HTTP
		request event. The `readBody` function is likely a utility function that extracts the body content
		from the event object. In this case, it is used to get form data sent by the client in the
		request. The extracted body data is then stored in the `body` variable for further processing,
		such as extracting the `title` and `code` fields from it. */
		const body = await readBody(event); // Get form data from the client
		let { title, code } = body;
		console.log(body);
		code = code?.trim() || "";
		const db = getDb();
		if (!db) throw new Error("No database connection");
		const result = await db.collection("posts-code-data").insertOne({
			title,
			code,
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
