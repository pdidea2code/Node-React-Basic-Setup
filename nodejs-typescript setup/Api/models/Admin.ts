import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Interface for Admin Document
interface IAdmin extends Document {
  name?: string;
  email: string;
  password: string;
  expireOtpTime?: string | null;
  image?: string | null;
  resetCode?: string | null;
  token?: string | null;
  status: boolean;
  generateAuthToken(data: object): string;
  generateRefreshToken(data: object): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Admin Schema Definition
const AdminSchema: Schema<IAdmin> = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    expireOtpTime: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },
    resetCode: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash the password before saving
AdminSchema.pre<IAdmin>("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

// Method to generate Auth Token
AdminSchema.methods.generateAuthToken = function (data: object): string {
  const user = this as IAdmin; // Cast `this` to IAdmin
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1000m",
  });
  return token;
};

// Method to generate Refresh Token
AdminSchema.methods.generateRefreshToken = function (data: object): string {
  const user = this as IAdmin; // Cast `this` to IAdmin
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET!);
  return token;
};

// Method to compare password
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error(error);
    throw new Error("Error comparing passwords");
  }
};

// Export the model
const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
