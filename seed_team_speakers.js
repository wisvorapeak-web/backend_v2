require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Speaker = require('./src/models/speaker.model');
const TeamMember = require('./src/models/teammember.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed Speakers
    const speakersPath = path.join(__dirname, 'data', 'speakers.json');
    if (fs.existsSync(speakersPath)) {
        const speakersData = JSON.parse(fs.readFileSync(speakersPath, 'utf8'));
        await Speaker.deleteMany({});
        const cleanedSpeakers = speakersData.map(item => {
            const { _id, id, __v, createdAt, updatedAt, ...rest } = item;
            return rest;
        });
        const speakerResult = await Speaker.insertMany(cleanedSpeakers);
        console.log(`Successfully seeded ${speakerResult.length} speakers!`);
    }

    // Seed Team
    const teamPath = path.join(__dirname, 'data', 'team.json');
    if (fs.existsSync(teamPath)) {
        const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf8'));
        await TeamMember.deleteMany({});
        const cleanedTeam = teamData.map(item => {
            const { _id, id, __v, createdAt, updatedAt, ...rest } = item;
            return rest;
        });
        const teamResult = await TeamMember.insertMany(cleanedTeam);
        console.log(`Successfully seeded ${teamResult.length} team members!`);
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
