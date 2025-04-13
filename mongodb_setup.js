// MongoDB setup script to create indexes
// Run this in MongoDB shell or using mongoose

db.tournaments.createIndex({ game: 1 });
db.tournaments.createIndex({ status: 1 });
db.tournaments.createIndex({ teamSize: 1 });
db.tournaments.createIndex({ registrationDeadline: 1 });
db.tournaments.createIndex({ startDate: 1 });
db.tournaments.createIndex({ featured: 1 });

db.registrations.createIndex({ tournamentId: 1 });
db.registrations.createIndex({ "teamLeader.email": 1 });
db.registrations.createIndex({ teamName: 1 });
db.registrations.createIndex({ status: 1 });
db.registrations.createIndex({ paymentStatus: 1 });

// Run this from Node.js:
/*
const mongoose = require('mongoose');
const db = await mongoose.connect(process.env.MONGODB_URI, {});
await db.connection.db.collection('tournaments').createIndex({ game: 1 });
await db.connection.db.collection('tournaments').createIndex({ status: 1 });
await db.connection.db.collection('tournaments').createIndex({ teamSize: 1 });
await db.connection.db.collection('tournaments').createIndex({ registrationDeadline: 1 });
await db.connection.db.collection('tournaments').createIndex({ startDate: 1 });
await db.connection.db.collection('tournaments').createIndex({ featured: 1 });

await db.connection.db.collection('registrations').createIndex({ tournamentId: 1 });
await db.connection.db.collection('registrations').createIndex({ "teamLeader.email": 1 });
await db.connection.db.collection('registrations').createIndex({ teamName: 1 });
await db.connection.db.collection('registrations').createIndex({ status: 1 });
await db.connection.db.collection('registrations').createIndex({ paymentStatus: 1 });
*/ 