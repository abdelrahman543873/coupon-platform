import mongoose from "mongoose";

// connectDB: responsible for database connection using mongoose,
// @param(dbURL): url for database
export const connectDB = async (dbURL) => {
  const mongo = await mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  // when dropping database
  mongo.connection.db.dropDatabase(() => {
    console.log("database dropped");
  });
  return mongo;
};
