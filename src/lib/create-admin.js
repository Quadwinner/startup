// Script to create an admin user in the MongoDB database
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "epicesports";

async function createAdminUser() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(MONGODB_DB);
    
    // Check if user collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await db.createCollection('users');
    }

    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@epicesports.com', role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      // Create admin user
      const result = await db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@epicesports.com',
        role: 'admin',
        createdAt: new Date(),
        emailVerified: new Date(),
      });
      
      console.log(`Admin user created with ID: ${result.insertedId}`);
    }

    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 