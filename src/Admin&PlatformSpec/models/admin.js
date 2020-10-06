import mongoose from "mongoose";

let adminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "EDITOR", "CUSTOMER_SERVICE"],
      required: true,
    },
    
    fcmToken:String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let AdminModel = mongoose.model("Admin", adminSchema);

export { AdminModel };
