/* This TypeScript code snippet is setting up a connection to a MongoDB database using the `mongodb`
driver. */
import { MongoClient, Db, CommandStartedEvent } from "mongodb";

/* The line `const client = new MongoClient("mongodb://localhost:27017", { monitorCommands: true });`
is creating a new instance of the `MongoClient` class from the `mongodb` driver in TypeScript. It is
setting up a connection to a MongoDB database located at `mongodb://localhost:27017` with the option
`monitorCommands` set to `true`. This option enables monitoring of database commands, allowing you
to track and log the commands being executed on the database. */
const client = new MongoClient("mongodb://localhost:27017", { monitorCommands: true });
let db: Db | undefined;
let dbFile: Db | undefined;

/* The `interface ExtendedCommandStartedEvent` is extending the `CommandStartedEvent` interface
provided by the `mongodb` driver in TypeScript. By extending the `CommandStartedEvent`, we are
creating a new interface that includes additional properties specific to our application's needs. */
interface ExtendedCommandStartedEvent extends CommandStartedEvent {
	name: string;
	address: string;
	databaseName: string;
	commandName: string;
}

/* This code snippet is establishing a connection to a MongoDB database using the `MongoClient`
instance created earlier. The `connect()` method is called on the `client` object to initiate the
connection process. */
client
	.connect()
	.then(() => {
		db = client.db("posts"); // database name
		dbFile = client.db("nuxt-file-db"); // database name

		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

/* This code snippet is setting up an event listener on the `client` object for the "commandStarted"
event. When a command is started on the MongoDB database, this event will be triggered. The callback
function provided to `client.on("commandStarted", ...)` receives an `ExtendedCommandStartedEvent`
object as a parameter, which contains information about the command that was started. */
client.on("commandStarted", (started: ExtendedCommandStartedEvent) => {
	const { name, address, databaseName, commandName } = started;
	const { find, $db } = started.command;
	const infoObj = Object.entries({ name, address, databaseName, commandName, find, $db });
	console.log(...infoObj);
});

/**
 * This function returns the database instance or undefined.
 */
export const getDb = (): Db | undefined => db;
export const getDbFile = (): Db | undefined => dbFile;
