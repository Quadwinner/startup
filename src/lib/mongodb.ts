import { MongoClient, MongoClientOptions } from 'mongodb';

// Primary connection (local)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/epicesports";
// Fallback connection (MongoDB Atlas)
const MONGODB_ATLAS_URI = "mongodb+srv://epicesports:epicesports123@cluster0.mongodb.net/epicesports?retryWrites=true&w=majority";
const MONGODB_DB = process.env.MONGODB_DB || "epicesports";
const CONNECT_TIMEOUT = parseInt(process.env.MONGODB_CONNECT_TIMEOUT || "10000", 10);
const SOCKET_TIMEOUT = parseInt(process.env.MONGODB_SOCKET_TIMEOUT || "15000", 10);

// Check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;
let isConnecting = false;
let connectionPromise: Promise<{ client: MongoClient, db: any }> | null = null;

export async function connectToDatabase() {
  // If the database connection is cached, use it instead of creating a new connection
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If already trying to connect, wait for that promise instead of creating multiple connections
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // MongoDB connection options with timeout settings
  const options: MongoClientOptions = {
    connectTimeoutMS: CONNECT_TIMEOUT,
    socketTimeoutMS: SOCKET_TIMEOUT,
    serverSelectionTimeoutMS: CONNECT_TIMEOUT,
  };

  isConnecting = true;
  
  // Create a new connection promise
  connectionPromise = new Promise(async (resolve, reject) => {
    // First try primary connection
    try {
      console.log(`Connecting to primary MongoDB at ${MONGODB_URI}...`);
      const client = new MongoClient(MONGODB_URI, options);
      
      await client.connect();
      const db = client.db(MONGODB_DB);
      
      // Test the connection with a simple operation
      await db.command({ ping: 1 });
      console.log("MongoDB connected successfully (primary)");

      // Cache the client and db connections
      cachedClient = client;
      cachedDb = db;

      resolve({ client, db });
      return;
    } catch (primaryError) {
      console.error('Primary MongoDB connection error, trying fallback:', primaryError);
      
      // Try fallback connection
      try {
        console.log('Connecting to fallback MongoDB Atlas...');
        const client = new MongoClient(MONGODB_ATLAS_URI, {
          ...options,
          // Increase timeouts for cloud connection
          connectTimeoutMS: CONNECT_TIMEOUT * 2,
          socketTimeoutMS: SOCKET_TIMEOUT * 2,
        });
        
        await client.connect();
        const db = client.db(MONGODB_DB);
        
        // Test the connection with a simple operation
        await db.command({ ping: 1 });
        console.log("MongoDB connected successfully (fallback)");

        // Cache the client and db connections
        cachedClient = client;
        cachedDb = db;

        resolve({ client, db });
      } catch (fallbackError) {
        console.error('All MongoDB connection attempts failed:', fallbackError);
        reject(new Error(`Failed to connect to both primary and fallback MongoDB: ${primaryError.message}`));
      }
    } finally {
      isConnecting = false;
      if (!cachedClient) {
        connectionPromise = null;
      }
    }
  });
  
  return connectionPromise;
}

// Add this for compatibility with imports expecting a default export
const clientPromise = connectToDatabase().then(({ client }) => client);

export default clientPromise; 