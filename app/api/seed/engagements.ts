import connectDB from '../db';
import Engagement from '@/app/models/Engagement';
import Lead from '@/app/models/Lead';

const initialEngagements = [
  {
    context: "international_water_equipment",
    requirements: "UNDP project requirements for Lorentz pumps and solar modules",
    messages: [
      {
        content: "Hello, I'm from Davis & Shirtliff Ethiopia. We're working on a UNDP project and need to discuss water equipment requirements.",
        role: "customer",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: "Thank you for reaching out. I understand you're working on a UNDP project. Could you tell me more about the specific water equipment needs?",
        role: "sales",
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        content: "We need Lorentz pumps and solar modules for a water supply project. What specifications do you have available?",
        role: "customer",
        timestamp: new Date(Date.now() - 3400000)
      }
    ],
    suggestions: [
      {
        stage: "initial",
        suggestions: [
          "What's the required pump capacity for your project?",
          "Do you need complete solar pump systems or just the modules?",
          "What's your project timeline?",
          "Are there specific UNDP compliance requirements?"
        ]
      },
      {
        stage: "requirements",
        suggestions: [
          "Would you like to see our solar pump system specifications?",
          "Should we discuss installation and maintenance services?",
          "Do you need backup power solutions?",
          "Would you like a detailed quote for the complete system?"
        ]
      }
    ]
  },
  {
    context: "construction_irrigation",
    requirements: "Large-scale irrigation system for construction project",
    messages: [
      {
        content: "Hi, I'm from China Wu Yi Co. Limited. We're working on a major construction project and need to discuss irrigation system requirements.",
        role: "customer",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: "Hello! I understand you're working on a large construction project. Could you share more details about your irrigation needs?",
        role: "sales",
        timestamp: new Date(Date.now() - 3500000)
      }
    ],
    suggestions: [
      {
        stage: "initial",
        suggestions: [
          "What's the scale of your irrigation system?",
          "Do you need automated control systems?",
          "What's your water source?",
          "Are you looking for turnkey solutions?"
        ]
      }
    ]
  },
  {
    context: "banking_booster_pump",
    requirements: "Commercial booster pump system for banking facility",
    messages: [
      {
        content: "Hello, I'm from Kenya Commercial Bank. We need to upgrade our water pressure system in our main branch.",
        role: "customer",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: "Thank you for contacting us. I understand you need to upgrade your water pressure system. Could you tell me more about your current setup?",
        role: "sales",
        timestamp: new Date(Date.now() - 3500000)
      }
    ],
    suggestions: [
      {
        stage: "initial",
        suggestions: [
          "What's your current water pressure?",
          "How many floors need to be served?",
          "Do you need backup systems?",
          "What's your maintenance schedule?"
        ]
      }
    ]
  },
  {
    context: "hotel_water_systems",
    requirements: "Complete water treatment and distribution system for hotel",
    messages: [
      {
        content: "Hi, I'm from Maiyan Hotel Management. We're looking to upgrade our water systems for our new property in Nanyuki.",
        role: "customer",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: "Hello! Congratulations on your new property. Could you tell me more about your water system requirements?",
        role: "sales",
        timestamp: new Date(Date.now() - 3500000)
      }
    ],
    suggestions: [
      {
        stage: "initial",
        suggestions: [
          "How many rooms will need water supply?",
          "Do you need water treatment systems?",
          "What's your peak water demand?",
          "Are you looking for energy-efficient solutions?"
        ]
      }
    ]
  },
  {
    context: "solar_borehole",
    requirements: "Solar-powered borehole solutions for renewable energy company",
    messages: [
      {
        content: "Hello, I'm from Benax Solar. We're expanding our borehole solutions business and need to discuss equipment options.",
        role: "customer",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: "Thank you for reaching out. I understand you're in the solar and borehole solutions business. What specific equipment are you looking for?",
        role: "sales",
        timestamp: new Date(Date.now() - 3500000)
      }
    ],
    suggestions: [
      {
        stage: "initial",
        suggestions: [
          "What capacity of solar pumps do you need?",
          "Do you need complete borehole solutions?",
          "What's your target market?",
          "Are you looking for partnership opportunities?"
        ]
      }
    ]
  }
];

export async function seedEngagements() {
  try {
    await connectDB();
    
    // Clear existing engagements
    await Engagement.deleteMany({});
    
    // Get all leads
    const leads = await Lead.find({});
    
    // Create engagements for each lead
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const engagementTemplate = initialEngagements[i % initialEngagements.length];
      
      // Map context to allowed enum values
      let context = 'commercial';
      if (lead.industry === "Water Equipment" || lead.industry === "Construction" || lead.industry === "Banking" || lead.industry === "Hospitality" || lead.industry === "Consulting" || lead.industry === "Education" || lead.industry === "Logistics" || lead.industry === "Retail" || lead.industry === "Real Estate") {
        context = 'commercial';
      } else if (lead.industry === "Renewable Energy" || lead.industry === "Manufacturing" || lead.industry === "Water Services" || lead.industry === "Engineering" || lead.industry === "Electrical") {
        context = 'industrial';
      } else if (lead.industry === "Individual") {
        context = 'residential';
      } else {
        context = 'commercial'; // default fallback
      }
      
      // Generate a dynamic initial customer message for the lead
      const customerMessage = {
        content: `Hi, I'm from ${lead.name}. We're working on a ${lead.industry?.toLowerCase() || 'project'} and need to discuss ${lead.notes || 'our requirements'}.`,
        role: 'customer',
        timestamp: new Date(Date.now() - 3600000)
      };
      const messages = [customerMessage];
      
      const engagement = new Engagement({
        leadId: lead._id,
        context: context,
        requirements: engagementTemplate.requirements,
        messages: messages,
        suggestions: [], // Initialize with empty suggestions array
        currentStage: "initial"
      });
      
      await engagement.save();
    }
    
    console.log('Engagements seeded successfully');
  } catch (error) {
    console.error('Error seeding engagements:', error);
    throw error;
  }
} 