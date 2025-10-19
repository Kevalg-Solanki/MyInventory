//imports
const mongoose = require("mongoose");

//main function
const connectToDb = async () => {
	try {
		const URI = process.env.MONGODB_URI;

		//connect to the database
		const connectionResponse = await mongoose.connect(URI);
        
		console.log(
			`Database Connection Successfull: ${connectionResponse.connection.name}`
		);
	} catch (error) {
		console.error(`Database Connection Failed : ${error}`);
		process.exit(1);
	}
};

module.exports = connectToDb;
