require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Topic = require('./src/models/topic.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const dataPath = path.join(__dirname, 'data', 'topics.json');
    const topicData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    await Topic.deleteMany({});
    console.log('Cleared existing topics data');

    const cleanedData = topicData.map(item => {
      const { _id, id, __v, createdAt, updatedAt, ...rest } = item;
      return rest;
    });

    const result = await Topic.insertMany(cleanedData);
    console.log(`Successfully seeded ${result.length} topics!`);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
