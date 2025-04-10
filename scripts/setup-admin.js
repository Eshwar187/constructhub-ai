const { MongoClient } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ADMIN_EMAIL = 'eshwar09052005@gmail.com';
const ADMIN_USERNAME = 'eshwar2005';
const ADMIN_CLERK_ID = 'admin_eshwar2005'; 

async function setupAdmin() {

  const MONGODB_URI = "MONGODB_URI=mongodb+srv://eshwar2005:Eshwar123@cluster0.1zjx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  console.log('Using hardcoded MongoDB URI');

  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');


    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin account already exists. Updating to ensure correct role...');


      await usersCollection.updateOne(
        { email: ADMIN_EMAIL },
        {
          $set: {
            role: 'admin',
            isVerified: true,
            username: ADMIN_USERNAME
          }
        }
      );

      console.log('Admin account updated successfully');
    } else {
      console.log('Creating new admin account...');


      await usersCollection.insertOne({
        clerkId: ADMIN_CLERK_ID,
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        firstName: 'Eshwar',
        lastName: '',
        role: 'admin',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Admin account created successfully');
    }

    console.log('Admin setup complete');
  } catch (error) {
    console.error('Error setting up admin account:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

setupAdmin().catch(console.error);
