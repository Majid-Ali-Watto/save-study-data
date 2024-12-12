import multer, { FileFilterCallback } from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import type { H3Event } from "h3";

const mongoURI = "mongodb://localhost:27017/nuxt-file-db";

// Allowed MIME types
const allowedFileTypes: string[] = ["application/javascript", "text/plain", "application/pdf"];

// GridFS Storage Configuration
const storage = new GridFsStorage({
	url: mongoURI,
	options: { useUnifiedTopology: true },
	file: (_req, file): Promise<{ bucketName: string; filename: string }> => {
		return new Promise((resolve, reject) => {
			if (!allowedFileTypes.includes(file.mimetype)) {
				return reject(new Error("File type not allowed"));
			}
			resolve({
				bucketName: "uploads", // Bucket to store files
				filename: `${Date.now()}-${file.originalname}`
			});
		});
	}
});

const upload = multer({ storage });

export default defineEventHandler(async (event: H3Event): Promise<object> => {
	if (event.node.req.method !== "POST") {
		return { message: "Only POST requests are allowed." };
	}

	const uploadMiddleware = upload.single("file");

	return new Promise((resolve, reject) => {
		uploadMiddleware(event.node.req, event.node.res, (err: unknown) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					message: "File uploaded successfully",
					file: (event.node.req as any).file
				});
			}
		});
	});
});
