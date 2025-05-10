// Utility functions for data fetching and manipulation

import leadsData from "@/data/leads.json"
import engagementsData from "@/data/engagements.json"
import proposalsData from "@/data/proposals.json"
import insightsData from "@/data/insights.json"
import productsData from "@/data/products.json"

// Type definitions
export interface Lead {
  _id: string;
  name: string;
  contact: string;
  email: string;
  region: string;
  status: string;
  score: number;
  lastContact: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Engagement {
  leadId: number
  messages: {
    id: number
    sender: string
    name: string
    avatar: string
    initials: string
    content: string
    time: string
    date: string
  }[]
  history: {
    date: string
    action: string
    details: string
  }[]
  aiSuggestions: string[]
}

export interface Proposal {
  id: number
  name: string
  leadId: number
  client: string
  contact: string
  date: string
  status: string
  value: string
  products: string[]
  services: string[]
  notes: string
}

export interface Product {
  id: number
  category: string
  items: {
    id: number
    name: string
    description: string
    variants: string[]
  }[]
}

// Fetch all leads
export async function getLeads(): Promise<Lead[]> {
  try {
    const response = await fetch('/api/leads');
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

// Fetch a specific lead by ID
export async function getLeadById(id: string): Promise<Lead | undefined> {
  try {
    const response = await fetch(`/api/leads?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch lead');
    return response.json();
  } catch (error) {
    console.error('Error fetching lead:', error);
    return undefined;
  }
}

// Fetch engagements for a specific lead
export async function getEngagementByLeadId(leadId: string): Promise<Engagement | undefined> {
  try {
    const response = await fetch(`/api/engagements?leadId=${leadId}`);
    if (!response.ok) throw new Error('Failed to fetch engagement');
    return response.json();
  } catch (error) {
    console.error('Error fetching engagement:', error);
    return undefined;
  }
}

// Fetch all proposals
export async function getProposals(): Promise<Proposal[]> {
  try {
    const response = await fetch('/api/proposals');
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
}

// Fetch a specific proposal by ID
export async function getProposalById(id: string): Promise<Proposal | undefined> {
  try {
    const response = await fetch(`/api/proposals?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch proposal');
    return response.json();
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return undefined;
  }
}

// Fetch proposals for a specific lead
export async function getProposalsByLeadId(leadId: string): Promise<Proposal[]> {
  try {
    const response = await fetch(`/api/proposals?leadId=${leadId}`);
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
}

// Fetch insights data
export function getInsightsData() {
  // TODO: Replace with API call
  return insightsData
}

// Fetch all products
export function getProducts(): Product[] {
  // TODO: Replace with API call
  return productsData
}

// Fetch products by category
export function getProductsByCategory(category: string): Product | undefined {
  // TODO: Replace with API call
  return productsData.find((product) => product.category === category)
}

// Format currency
export function formatCurrency(amount: number): string {
  return `KES ${amount.toLocaleString()}`
}
