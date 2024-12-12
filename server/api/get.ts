import { defineEventHandler } from "h3";
/* The line `import { ObjectId } from "mongodb";` is importing the `ObjectId` type from the "mongodb"
package. In this context, the `ObjectId` type is used to represent MongoDB's unique identifier for
documents in a collection. By importing it, the code can use this type to define the `_id` field in
the `Link` type, ensuring that it aligns with MongoDB's ObjectId format. */
import { ObjectId } from "mongodb";
import { getDb } from "~/db/connection";

// Define the types
type Link = {
	_id: ObjectId; // Use MongoDB's ObjectId for the `_id` field
	description: string;
	createdAt: string;
	title: string;
	link: string;
};

/* The `interface Response` is defining the structure of the response object that will be returned by
the event handler function.  */
interface Response {
	success: boolean;
	/* In the code snippet provided, `posts?: Link[];` is defining a property named `posts` in the
	`Response` interface. The `?` symbol indicates that the `posts` property is optional, meaning it
	may or may not be present in the response object. */
	posts?: Link[];
	message?: string;
}

export default defineEventHandler(async (): Promise<Response> => {
	try {
		// Get the database connection
		const db = getDb();
		if (!db) throw new Error("No database connection");

		// Fetch posts from the collection
		const posts = await db.collection<Link>("posts-data").find().toArray();

		// Return success response
		return {
			success: true,
			posts
		};
	} catch (error: any) {
		console.error("Error fetching posts from MongoDB:", error.message);

		// Return error response
		return {
			success: false,
			message: process.env.NODE_ENV === "development" ? error.message : "Error fetching data. Please try again later."
		};
	}
});
