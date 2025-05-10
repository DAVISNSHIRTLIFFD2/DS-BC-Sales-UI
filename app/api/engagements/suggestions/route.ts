import { NextResponse } from 'next/server';
import connectDB from '../../db';
import Engagement from '@/app/models/Engagement';
import Lead from '@/app/models/Lead';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
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
      \nGenerate 4 relevant follow-up questions for the sales representative. Respond ONLY with a JSON array of strings, e.g. ["Question 1", "Question 2", "Question 3", "Question 4"]`;

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
    console.log('OpenAI suggestions raw response:', suggestionsResponse);
    if (!suggestionsResponse) {
      return NextResponse.json({ suggestions: [] });
    }
    let newSuggestions = [];
    try {
      const parsed = JSON.parse(suggestionsResponse);
      if (Array.isArray(parsed.suggestions)) {
        newSuggestions = parsed.suggestions;
      } else if (Array.isArray(parsed)) {
        newSuggestions = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Convert object values to array
        newSuggestions = Object.values(parsed);
      }
    } catch {
      newSuggestions = [];
    }
    return NextResponse.json({ suggestions: newSuggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
} 