const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const fs = require('fs');
const Organizer = require('./src/models/organizer.model');
require('dotenv').config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not defined in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const data = JSON.parse(fs.readFileSync('./data/organizers.json', 'utf8'));
    console.log(`Found ${data.length} organizers in json.`);

    // Check if we need to clear first or just insert/update
    // Let's use bulk operations to update or insert (upsert)
    const operations = data.map(item => {
      // Remove any unwanted fields like __v from the json if present
      const { _id, __v, createdAt, updatedAt, ...rest } = item;
      return {
        updateOne: {
          filter: { _id },
          update: { $set: rest },
          upsert: true
        }
      };
    });

    const result = await Organizer.bulkWrite(operations);
    console.log(`Successfully seeded organizers: ${result.upsertedCount} inserted, ${result.modifiedCount} modified.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error seeding organizers:", error);
    process.exit(1);
  }
};

seed();
