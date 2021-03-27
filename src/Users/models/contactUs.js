import mongoose from "mongoose";

let contactSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reply: {
      message: String,
      date: Date,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let ContactModel = mongoose.model("Contact", contactSchema);

export { ContactModel };
