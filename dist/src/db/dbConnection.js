import mongoose from "mongoose"; // connectDB: responsible for database connection using mongoose,
// @param(dbURL): url for database

export const connectDB = dbURL => {
  return mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};