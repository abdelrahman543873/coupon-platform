import mongoose from "mongoose";

let questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CLIENT", "PROVIDER"],
      required: true,
    },
    lang: {
      type: String,
      enum: ["en", "ar"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let QuestionsModel = mongoose.model("Questions", questionSchema);

export { QuestionsModel };
