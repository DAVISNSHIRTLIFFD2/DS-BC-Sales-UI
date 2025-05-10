import { NextResponse } from 'next/server';
import connectDB from '../db';
import Lead from '@/app/models/Lead';
import { seedEngagements } from './engagements';

const seedData = [
  {
    "name": "DAVIS & SHIRTLIFF ETHIOPIA",
    "contact": "CT004491",
    "email": "sales@davishirtliff.et",
    "region": "Ethiopia",
    "status": "Qualified",
    "score": 75,
    "lastContact": "2022-01-10",
    "industry": "Water Equipment",
    "revenue": "$2.5M",
    "tags": ["International", "Equipment Supplier", "UNDP"],
    "notes": "UNDP ORDER- LORENTZ PUMPS",
    "assignedTo": "TMACHARIA",
    "context": "commercial"
  },
  {
    "name": "JOHN ABONG",
    "contact": "CT003167",
    "email": "jabong@mail.com",
    "region": "Nairobi",
    "status": "New Lead",
    "score": 60,
    "lastContact": "2022-01-10",
    "industry": "Individual",
    "revenue": "$50K",
    "tags": ["Individual Client", "Supply Only"],
    "notes": "TO SUPPLY ONLY",
    "assignedTo": "SKARUA",
    "context": "residential"
  },
  {
    "name": "CHINA WU YI CO. LIMITED",
    "contact": "CT004193",
    "email": "info@chinawuyi.com",
    "region": "Kenya",
    "status": "Hot Lead",
    "score": 90,
    "lastContact": "2022-01-10",
    "industry": "Construction",
    "revenue": "$15M",
    "tags": ["Major Account", "Construction", "Irrigation"],
    "notes": "SUPPLY AND INSTALLATION OF IRRIGATION SYSTEM P58 - PAYMENT CERT NO.3",
    "assignedTo": "ROKOTH",
    "context": "commercial"
  },
  {
    "name": "KENYA COMMERCIAL BANK LTD",
    "contact": "CT006548",
    "email": "corporate@kcb.co.ke",
    "region": "Nairobi",
    "status": "Proposal Sent",
    "score": 85,
    "lastContact": "2022-01-10",
    "industry": "Banking",
    "revenue": "$350M",
    "tags": ["Financial Institution", "Installation", "Booster Pump"],
    "notes": "SUPPLY & INSTALLATION OF DAYLIFF DI-N45-3 11KW BOOSTER PUMP",
    "assignedTo": "OTIENOK",
    "context": "commercial"
  },
  {
    "name": "KARUA STEPHEN",
    "contact": "CT002812",
    "email": "skarua@mail.com",
    "region": "Nairobi",
    "status": "Follow-up",
    "score": 65,
    "lastContact": "2022-01-10",
    "industry": "Individual",
    "revenue": "$30K",
    "tags": ["Individual Client", "Supply Only"],
    "notes": "SUPPLY ONLY",
    "assignedTo": "FWAWERU",
    "context": "residential"
  },
  {
    "name": "ALLIANCE LOGISTICS (K) LTD",
    "contact": "CT003363",
    "email": "info@alliancelogistics.co.ke",
    "region": "Nairobi",
    "status": "Contacted",
    "score": 70,
    "lastContact": "2022-01-10",
    "industry": "Logistics",
    "revenue": "$1.2M",
    "tags": ["Logistics", "Supply Only"],
    "notes": "SUPPLY ONLY",
    "assignedTo": "FWAWERU",
    "context": "commercial"
  },
  {
    "name": "BUILDMART TILES HARDWARE & PLUMBING SUPP",
    "contact": "CT003982",
    "email": "sales@buildmart.co.ke",
    "region": "Mombasa",
    "status": "Nurturing",
    "score": 75,
    "lastContact": "2022-01-10",
    "industry": "Construction Supply",
    "revenue": "$3.5M",
    "tags": ["Hardware", "Supplies", "Retail"],
    "notes": "Regular hardware supplies",
    "assignedTo": "OMILLICENT",
    "context": "commercial"
  },
  {
    "name": "GREENBO AFRICA",
    "contact": "CT005541",
    "email": "contact@greenboafrica.com",
    "region": "Nairobi",
    "status": "New Lead",
    "score": 68,
    "lastContact": "2022-01-10",
    "industry": "Agriculture",
    "revenue": "$850K",
    "tags": ["Agricultural Supplies", "Counter Collection"],
    "notes": "COLLECT FROM THE COUNTER",
    "assignedTo": "BOUMA",
    "context": "commercial"
  },
  {
    "name": "DUASO ELECTRICALS",
    "contact": "CT004732",
    "email": "info@duasoelectric.co.ke",
    "region": "Nairobi",
    "status": "Qualified",
    "score": 72,
    "lastContact": "2022-01-10",
    "industry": "Electrical",
    "revenue": "$1.8M",
    "tags": ["Electrical Supplies", "Regular Customer"],
    "notes": "SR SALES",
    "assignedTo": "DMWANGI",
    "context": "industrial"
  },
  {
    "name": "THE GREEN GARDEN SCHOOL",
    "contact": "CT005548",
    "email": "admin@greengarden.edu",
    "region": "Nairobi",
    "status": "Contacted",
    "score": 65,
    "lastContact": "2022-01-10",
    "industry": "Education",
    "revenue": "$780K",
    "tags": ["School", "Educational Institution"],
    "notes": "School supplies",
    "assignedTo": "RDITONGE",
    "context": "commercial"
  },
  {
    "name": "CHLORIDE EXIDE (K) LTD",
    "contact": "CT004203",
    "email": "info@chlorideexide.co.ke",
    "region": "Nairobi",
    "status": "Hot Lead",
    "score": 82,
    "lastContact": "2022-01-10",
    "industry": "Manufacturing",
    "revenue": "$7.2M",
    "tags": ["Battery Supplier", "Borehole Equipment"],
    "notes": "SUPPLY OF BOREHOLE ITEMS",
    "assignedTo": "VOMULO",
    "context": "industrial"
  },
  {
    "name": "BONVE AFRICA LTD",
    "contact": "CT003918",
    "email": "sales@bonveafrica.com",
    "region": "Nairobi",
    "status": "Follow-up",
    "score": 76,
    "lastContact": "2022-01-10",
    "industry": "Retail",
    "revenue": "$2.1M",
    "tags": ["Retail", "Self Collect"],
    "notes": "CLIENT TO COLLECT",
    "assignedTo": "NMARANGA",
    "context": "commercial"
  },
  {
    "name": "CAPITAL APARTMENTS LTD",
    "contact": "CT004043",
    "email": "info@capitalapartments.co.ke",
    "region": "Nairobi",
    "status": "Qualified",
    "score": 78,
    "lastContact": "2022-01-10",
    "industry": "Real Estate",
    "revenue": "$4.3M",
    "tags": ["Real Estate", "Property Management"],
    "notes": "langat to collect",
    "assignedTo": "PGITUNDU",
    "context": "commercial"
  },
  {
    "name": "BATCH ASSOCIATES",
    "contact": "CT003725",
    "email": "contact@batchassociates.com",
    "region": "Nairobi",
    "status": "New Lead",
    "score": 67,
    "lastContact": "2022-01-10",
    "industry": "Consulting",
    "revenue": "$920K",
    "tags": ["Consulting", "Professional Services"],
    "notes": "Consulting services",
    "assignedTo": "COKUMU",
    "context": "commercial"
  },
  {
    "name": "BEWA WATER SERVICES",
    "contact": "CT003779",
    "email": "bewa@waterservices.co.ke",
    "region": "Nairobi",
    "status": "Contacted",
    "score": 73,
    "lastContact": "2022-01-10",
    "industry": "Water Services",
    "revenue": "$1.5M",
    "tags": ["Water Treatment", "Services"],
    "notes": "TO BE COLLECTED BY BENSON NYUTHO 0721 544869",
    "assignedTo": "JWAINAINA",
    "context": "industrial"
  },
  {
    "name": "BENAX SOLAR & BOREHOLE SOLUTIONS LTD",
    "contact": "CT003762",
    "email": "info@benaxsolar.co.ke",
    "region": "Nairobi",
    "status": "Hot Lead",
    "score": 80,
    "lastContact": "2022-01-11",
    "industry": "Renewable Energy",
    "revenue": "$2.8M",
    "tags": ["Solar Energy", "Borehole", "Solutions Provider"],
    "notes": "RUHIU KIMANI",
    "assignedTo": "HASEGA",
    "context": "industrial"
  },
  {
    "name": "MAIYAN HOTEL MANAGEMENT LIMITED",
    "contact": "CT005074",
    "email": "reservations@maiyanhotel.com",
    "region": "Nanyuki",
    "status": "Proposal Sent",
    "score": 85,
    "lastContact": "2022-01-11",
    "industry": "Hospitality",
    "revenue": "$5.7M",
    "tags": ["Hotel", "Hospitality", "LPO"],
    "notes": "LPO3348",
    "assignedTo": "EMWENDA",
    "context": "commercial"
  },
  {
    "name": "BOILER TECHNIQUES ENGINEERING",
    "contact": "CT003910",
    "email": "info@boilertechniques.co.ke",
    "region": "Nairobi",
    "status": "New Lead",
    "score": 71,
    "lastContact": "2022-01-11",
    "industry": "Engineering",
    "revenue": "$1.9M",
    "tags": ["Engineering", "Boiler Systems", "Self Collect"],
    "notes": "client to collect",
    "assignedTo": "MOLALA",
    "context": "industrial"
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await Lead.deleteMany({});
    
    // Insert new leads
    const leads = await Lead.insertMany(seedData);
    
    // Seed engagements
    await seedEngagements();
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      leads,
      engagements: 'Engagements seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
} 