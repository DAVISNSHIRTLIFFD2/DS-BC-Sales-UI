// Utility functions for data fetching and manipulation

import leadsData from "@/data/leads.json"
import engagementsData from "@/data/engagements.json"
import proposalsData from "@/data/proposals.json"
import insightsData from "@/data/insights.json"
import productsData from "@/data/products.json"

// Type definitions
export interface Lead {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  score: number
  status: string
  lastContact: string
  region: string
  notes: string
  interests: string[]
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
export function getLeads(): Lead[] {
  // TODO: Replace with API call
  return leadsData
}

// Fetch a specific lead by ID
export function getLeadById(id: number): Lead | undefined {
  // TODO: Replace with API call
  return leadsData.find((lead) => lead.id === id)
}

// Fetch engagements for a specific lead
export function getEngagementByLeadId(leadId: number): Engagement | undefined {
  // TODO: Replace with API call
  return engagementsData[leadId.toString() as keyof typeof engagementsData]
}

// Fetch all proposals
export function getProposals(): Proposal[] {
  // TODO: Replace with API call
  return proposalsData
}

// Fetch a specific proposal by ID
export function getProposalById(id: number): Proposal | undefined {
  // TODO: Replace with API call
  return proposalsData.find((proposal) => proposal.id === id)
}

// Fetch proposals for a specific lead
export function getProposalsByLeadId(leadId: number): Proposal[] {
  // TODO: Replace with API call
  return proposalsData.filter((proposal) => proposal.leadId === leadId)
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
