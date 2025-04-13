// Script to promote an existing user to admin role
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "epicesports";

// Email address of the user to promote to admin
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide an email address as an argument.');
  console.log('Usage: node make-admin.js <user_email>');
  process.exit(1);
}

async function makeAdmin() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(MONGODB_DB);
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email: userEmail });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found.`);
      process.exit(1);
    }
    
    // Update user role to admin
    const result = await db.collection('users').updateOne(
      { email: userEmail },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount === 1) {
      console.log(`User ${userEmail} has been promoted to admin role.`);
    } else {
      console.log(`User ${userEmail} is already an admin or could not be updated.`);
    }

    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  }
}

makeAdmin(); 