const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://wisvorapeak_db_user:Z67U87EOEgpWTQuh@wisvorapeakprivatelimit.fi3fzjy.mongodb.net/Ascendix_Summit_DB2?appName=WISVORAPEAKPRIVATELIMITED').then(async () => {
  const db = mongoose.connection.db;
  const teammembers = await db.collection('teammembers').find({}).toArray();
  console.log("Team members:");
  teammembers.forEach(tm => {
    console.log(`- ${tm.name} | category: ${tm.category} | is_active: ${tm.is_active} | display_order: ${tm.display_order}`);
  });
  mongoose.disconnect();
}).catch(console.error);
