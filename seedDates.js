const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const EventDate = require('./src/models/eventdate.model');
const datesData = require('./data/dates.json');

require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wiswora');
    console.log('Connected to MongoDB');
    
    // Clear existing
    await EventDate.deleteMany({});
    console.log('Cleared existing EventDates');
    
    // Insert new
    await EventDate.insertMany(datesData.map(d => ({
      _id: d._id,
      event: d.event,
      date: d.date,
      description: d.description,
      display_order: d.display_order,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    })));
    console.log(`Successfully seeded ${datesData.length} EventDates`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
