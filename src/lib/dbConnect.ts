import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

//assignments
//go to mongoose and check what we can provide in options

async function dbConnect(): Promise<void> {
  if (connection.isConnected) return;

  try {
    console.log(connection);

    const db = await mongoose.connect(process.env.MONGODB_URL! || "");
    // console.log(db);
    // console.log(db.connections);

    connection.isConnected = db.connections[0].readyState;
    console.log("db connected!");
  } catch (error: any) {
    console.log("something went wrong while connecting to the database");
    console.log(error.message);

    process.exit(1);
  }
}

export default dbConnect;
