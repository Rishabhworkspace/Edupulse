require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function verifyUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = require('../models/User');

    const result = await User.updateMany(
      { isVerified: false },
      { $set: { isVerified: true } }
    );

    console.log(`Updated ${result.modifiedCount} users to verified`);

    const users = await User.find({}).select('name email role isVerified _id');
    console.log('\nAll users:');
    users.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role} - Verified: ${u.isVerified} - ID: ${u._id}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyUsers();