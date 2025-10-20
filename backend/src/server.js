//external modules
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

//config
const connectToDb = require("./config/connectToDb");

//--App
const app = require("./app");

//Main
const PORT = process.env.PORT;

const startServer = async () => {
	try {
		//connect to the database
		await connectToDb();

		//then start server when connection with db is successfull
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Database connection failed: ", error);
		process.exit(1);
	}
};

//start server
startServer();
