require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Pricing = require('./src/models/pricing.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Read JSON file
    const dataPath = path.join(__dirname, 'data', 'pricing.json');
    const pricingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Drop existing Pricing collection
    await Pricing.deleteMany({});
    console.log('Cleared existing pricing data');

    // Remove _id and id fields from JSON objects so Mongoose generates new ObjectIds safely,
    // or keep them if they are valid ObjectIds.
    // The provided JSON has _id as strings that are valid 24-char hex strings.
    // But it's safer to just let mongoose handle it unless we need exact IDs.
    const cleanedData = pricingData.map(item => {
      const { _id, id, __v, createdAt, updatedAt, ...rest } = item;
      return rest;
    });

    // Insert new data
    const result = await Pricing.insertMany(cleanedData);
    console.log(`Successfully seeded ${result.length} pricing tiers!`);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
