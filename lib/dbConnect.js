import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const MONGOOSE_OPTS = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,   // 10s to find a server
    socketTimeoutMS: 45000,            // 45s socket idle timeout
    connectTimeoutMS: 10000,           // 10s to establish TCP connection
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
};

async function dbConnect() {
    // Return cached connection if still open
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Reset stale connection
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, MONGOOSE_OPTS)
            .then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Clear promise so next request can retry the connection
        cached.promise = null;
        cached.conn = null;
        throw error;
    }

    return cached.conn;
}

export default dbConnect;