//External modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		profilePicture: { type: String, trim: true },
		firstName: {
			type: String,
			required: true,
			maxlength: 50,
		},
		lastName: {
			type: String,
			required: true,
			maxlength: 50,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			sparse: true,

			maxlength: 254,
		},
		mobile: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
		},
		tenants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tenant",
			},
		],
		password: {
			type: String,
			trim: true,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters"],
		},
		isDeleted: {
			type: Boolean,
			required: true,
			default: false,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
		isSuperAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

//keep email/mobile unique ignore deleted
userSchema.index({
	unique: true,
	partialFilterExpression: {
		isDeleted: { $ne: true },
		email: { $type: "string" },
	},
});
userSchema.index({
	unique: true,
	partialFilterExpression: {
		isDeleted: { $ne: true },
		mobile: { $type: "string" },
	},
});

//Indexing
userSchema.index({ tenants: 1 });

//Strip fields/remove fields
userSchema.set("toJSON", {
	transform(doc, ret) {
		delete ret.__v;
		delete ret.isDeleted;
		return ret;
	},
});

const UserModel = mongoose.model("User", userSchema);

//User Class
class UserClass {
	constructor(userData) {
		const src = userData?._doc || userData;
		Object.assign(this, src); //copy DB fields into class
	}

	getUserInfo() {
		return {
			_id: this._id,
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			mobile: this.mobile,
			isSuperAdmin: this.isSuperAdmin,
		};
	}

	isUserAccountActive() {
		return this.isActive ? true : false;
	}

	/**
	 * @param {string} password - password to verify
	 * @return {boolean} - return password is matched or not
	 */
	async verifyPassword(password) {
		return await bcrypt.compare(password, this.password);
	}
}

module.exports = {
	UserModel,
	UserClass,
};
