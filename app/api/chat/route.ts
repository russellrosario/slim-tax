import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Simple tax-related responses for demonstration
const taxResponses = [
  "Based on your situation, you might be eligible for the home office deduction if you use part of your home exclusively for business.",
  "Have you considered maximizing your retirement contributions? This can significantly reduce your taxable income.",
  "For self-employed individuals, quarterly estimated tax payments are crucial to avoid penalties.",
  "The standard deduction for 2025 is $13,850 for single filers and $27,700 for married couples filing jointly.",
  "If you've worked remotely in different states, you may need to file multiple state tax returns.",
  "Charitable donations are deductible if you itemize your deductions rather than taking the standard deduction.",
  "Capital gains from investments held longer than a year qualify for lower long-term capital gains tax rates.",
  "If you're a gig worker or freelancer, don't forget to deduct your business expenses to reduce your taxable income.",
  "Education expenses might qualify for tax credits like the American Opportunity Credit or the Lifetime Learning Credit.",
  "Medical expenses exceeding 7.5% of your adjusted gross income can be deducted if you itemize.",
]

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Verify user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    // In a real application, you would call an AI service here
    // For demo purposes, we'll return a random tax-related response
    const randomResponse = taxResponses[Math.floor(Math.random() * taxResponses.length)]

    // Add some personalization
    const personalizedResponse = `${randomResponse} Would you like more specific advice about your tax situation?`

    // Simulate a delay to make it feel more realistic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ response: personalizedResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

