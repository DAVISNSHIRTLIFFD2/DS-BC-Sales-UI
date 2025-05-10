import connectDB from '../app/api/db';
import Lead from '../app/models/Lead';

const seedData = [
  {
    name: "Acme Corporation",
    contact: "John Doe",
    email: "john@acme.com",
    region: "Nairobi",
    status: "New Lead",
    score: 85,
    lastContact: "2 days ago"
  },
  {
    name: "Tech Solutions Ltd",
    contact: "Jane Smith",
    email: "jane@techsolutions.com",
    region: "Mombasa",
    status: "Qualified",
    score: 92,
    lastContact: "1 day ago"
  },
  {
    name: "Global Industries",
    contact: "Mike Johnson",
    email: "mike@globalind.com",
    region: "Kisumu",
    status: "Proposal Sent",
    score: 78,
    lastContact: "3 days ago"
  },
  {
    name: "Innovative Systems",
    contact: "Sarah Williams",
    email: "sarah@innovsys.com",
    region: "Nakuru",
    status: "Hot Lead",
    score: 95,
    lastContact: "Today"
  }
];

async function seed() {
  try {
    await connectDB();
    
    // Clear existing data
    await Lead.deleteMany({});
    
    // Insert new data
    await Lead.insertMany(seedData);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 