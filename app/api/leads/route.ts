import { NextResponse } from 'next/server';
import connectDB from '../db';
import Lead from '@/app/models/Lead';
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET /api/leads
export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Fetching leads...');
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    console.log('Leads found:', leads.length);
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const lead = await Lead.create(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// PUT /api/leads/:id
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const lead = await Lead.findByIdAndUpdate(id, body, { new: true });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/leads/:id
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
} 