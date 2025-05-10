import { NextResponse } from 'next/server';
import connectDB from '../db';
import Engagement from '@/app/models/Engagement';
import Lead from '@/app/models/Lead';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET /api/engagements?leadId=xxx
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const engagement = await Engagement.findOne({ leadId }).sort({ 'messages.timestamp': 1 });
    return NextResponse.json(engagement || { messages: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch engagement' }, { status: 500 });
  }
}

// POST /api/engagements
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { leadId, message } = body;

    if (!leadId || !message) {
      return NextResponse.json({ error: 'Lead ID and message are required' }, { status: 400 });
    }

    let engagement = await Engagement.findOne({ leadId });
    let lead = await Lead.findById(leadId);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!engagement) {
      engagement = new Engagement({
        leadId: lead._id,
        messages: [],
        context: 'commercial', // Default context
        requirements: 'Basic water treatment needs',
        currentStage: 'initial'
      });
    }

    // Add sales rep message
    engagement.messages.push({
      content: message,
      role: 'sales',
      timestamp: new Date()
    });

    // Get lead persona context
    const personaContext = `
      You are the customer (${lead.name}) in this conversation. Respond ONLY as the customer, based on your real business context and needs. Do NOT act as the sales rep. Your contact: ${lead.contact}, region: ${lead.region}, status: ${lead.status}, score: ${lead.score}, last contact: ${lead.lastContact}. Keep your response professional but natural, as if you're a real customer. Ask relevant questions or provide information based on your needs and the sales rep's message.`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: personaContext
      },
      ...engagement.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'sales' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      // Add the latest sales message as the user input
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      temperature: 0.7
    });

    const customerResponse = completion.choices[0].message.content;
    if (!customerResponse) {
      throw new Error('No response from AI');
    }

    // Add customer's response
    engagement.messages.push({
      content: customerResponse,
      role: 'customer',
      timestamp: new Date()
    });

    // Generate new suggestions based on conversation context
    const suggestionPrompt = `
      Based on this sales conversation:
      ${engagement.messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Generate 4 relevant follow-up questions for the sales representative.
      Format as a JSON array of strings.
    `;

    const suggestionCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: suggestionPrompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const suggestionsResponse = suggestionCompletion.choices[0].message.content;
    if (!suggestionsResponse) {
      throw new Error('No suggestions from AI');
    }

    const newSuggestions = JSON.parse(suggestionsResponse).suggestions || [];
    
    // Update suggestions based on conversation stage
    const currentStage = determineConversationStage(engagement.messages);
    engagement.currentStage = currentStage;
    
    // Add new suggestions
    engagement.suggestions.push({
      stage: currentStage,
      suggestions: newSuggestions
    });

    // Analyze conversation for scoring
    const analysisMessages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `Analyze this sales conversation and provide:
          1. A suggested lead score (0-100) based on:
             - Level of engagement
             - Specificity of requirements
             - Interest in solutions
             - Progress in sales cycle
          2. A suggested next status from: New Lead, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost, Nurturing, Follow-up, Hot Lead
          
          Format your response as JSON:
          {
            "score": number,
            "status": "suggested status"
          }`
      },
      ...engagement.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'sales' ? 'user' as const : 'assistant' as const,
        content: msg.content
      } as ChatCompletionMessageParam))
    ];

    const analysisCompletion = await openai.chat.completions.create({
      messages: analysisMessages,
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const analysisResponse = analysisCompletion.choices[0].message.content;
    if (!analysisResponse) {
      throw new Error('No analysis from AI');
    }
    const analysis = JSON.parse(analysisResponse);

    // Update lead score and status
    if (analysis.score !== lead.score || analysis.status !== lead.status) {
      lead.score = analysis.score;
      lead.status = analysis.status;
      lead.lastContact = new Date().toISOString();
      await lead.save();
    }

    await engagement.save();

    // Auto-generate proposal if status is 'Proposal Sent' or message contains proposal keywords
    let proposal = null;
    const proposalKeywords = /proposal|quote|cost|price/i;
    const lastMsg = engagement.messages[engagement.messages.length - 1]?.content || '';
    if (analysis.status === 'Proposal Sent' || proposalKeywords.test(lastMsg)) {
      // Prepare proposal data
      const proposalsPath = path.join(process.cwd(), 'data', 'proposals.json');
      const proposalsRaw = fs.readFileSync(proposalsPath, 'utf-8');
      const proposals = JSON.parse(proposalsRaw);
      const newId = proposals.length > 0 ? Math.max(...proposals.map((p: any) => p.id)) + 1 : 1;
      proposal = {
        id: newId,
        name: `${lead.name} - Auto Proposal`,
        leadId: lead._id,
        client: lead.name,
        contact: lead.contact,
        date: new Date().toLocaleDateString(),
        status: 'Draft',
        value: 'KES 0.00',
        products: [],
        services: [],
        notes: 'Auto-generated proposal based on engagement.'
      };
      proposals.push(proposal);
      fs.writeFileSync(proposalsPath, JSON.stringify(proposals, null, 2));
    }
    
    return NextResponse.json({
      engagement,
      lead: {
        score: lead.score,
        status: lead.status,
        lastContact: lead.lastContact
      },
      proposal
    });
  } catch (error) {
    console.error('Error in POST /api/engagements:', error);
    return NextResponse.json({ error: 'Failed to create engagement' }, { status: 500 });
  }
}

// GET /api/engagements/suggestions?leadId=xxx
export async function GET_suggestions(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const engagement = await Engagement.findOne({ leadId }).sort({ 'messages.timestamp': 1 });
    if (!engagement || !engagement.messages || engagement.messages.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Use the same persona context as in POST
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const personaContext = `
      You are the customer (${lead.name}) in this conversation. Respond ONLY as the customer, based on your real business context and needs. Do NOT act as the sales rep. Your contact: ${lead.contact}, region: ${lead.region}, status: ${lead.status}, score: ${lead.score}, last contact: ${lead.lastContact}. Keep your response professional but natural, as if you're a real customer. Ask relevant questions or provide information based on your needs and the sales rep's message.`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: personaContext
      },
      ...engagement.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'sales' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    const suggestionPrompt = `
      Based on this sales conversation:
      ${engagement.messages.map(m => `${m.role}: ${m.content}`).join('\n')}
      \nGenerate 4 relevant follow-up questions for the sales representative. Format as a JSON array of strings.`;

    const suggestionCompletion = await openai.chat.completions.create({
      messages: [
        ...messages,
        { role: 'user', content: suggestionPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const suggestionsResponse = suggestionCompletion.choices[0].message.content;
    if (!suggestionsResponse) {
      return NextResponse.json({ suggestions: [] });
    }
    const newSuggestions = JSON.parse(suggestionsResponse).suggestions || [];
    return NextResponse.json({ suggestions: newSuggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}

// Helper function to determine conversation stage
function determineConversationStage(messages: any[]): 'initial' | 'requirements' | 'proposal' | 'closing' {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  if (lastMessage.includes('proposal') || lastMessage.includes('price') || lastMessage.includes('cost')) {
    return 'proposal';
  } else if (lastMessage.includes('requirements') || lastMessage.includes('need') || lastMessage.includes('looking for')) {
    return 'requirements';
  } else if (lastMessage.includes('yes') || lastMessage.includes('proceed') || lastMessage.includes('interested')) {
    return 'closing';
  }
  
  return 'initial';
} 