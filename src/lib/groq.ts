import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function askGroq(
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          systemPrompt ||
          `You are Loopy, an enthusiastic AI travel assistant for Traveloop. 
           Help users plan amazing trips, suggest activities, estimate budgets, and give travel tips.
           Be specific, practical, and encouraging. Use emojis sparingly.`,
      },
      { role: 'user', content: userMessage },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 1024,
  })
  return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
}

export async function generateTripSuggestion(params: {
  destination: string
  days: number
  budget: number
  interests: string[]
}): Promise<any> {
  const prompt = `Create a detailed ${params.days}-day travel itinerary for ${params.destination}.
Total budget: $${params.budget} USD.
Traveler interests: ${params.interests.join(', ')}.

Return ONLY valid JSON, no markdown, no explanation:
{
  "days": [
    {
      "day": 1,
      "theme": "Arrival & Exploration",
      "activities": [
        { "time": "09:00 AM", "name": "Activity name", "description": "Brief description", "cost": 20, "location": "Location name", "category": "Sightseeing" }
      ],
      "meals": ["Breakfast spot", "Lunch spot", "Dinner spot"],
      "tips": "One helpful tip for the day",
      "dailyCost": 150
    }
  ],
  "totalEstimatedCost": 800,
  "packingTips": ["tip1", "tip2", "tip3"],
  "bestTimeToVisit": "October to March",
  "localTransport": "Metro and tuk-tuks are cheapest"
}`

  const raw = await askGroq(prompt)
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { error: 'Could not parse AI response', raw }
  }
}

export async function generatePackingList(params: {
  destination: string
  days: number
  activities: string[]
}): Promise<any[]> {
  const prompt = `Generate a packing checklist for ${params.days} days in ${params.destination}.
Activities planned: ${params.activities.join(', ')}.

Return ONLY a JSON array, no markdown:
[
  { "label": "Passport", "category": "DOCUMENTS" },
  { "label": "T-shirts x5", "category": "CLOTHING" }
]

Categories must be one of: DOCUMENTS, CLOTHING, ELECTRONICS, HEALTH, TOILETRIES, OTHER`

  const raw = await askGroq(prompt)
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

export async function generateItinerarySuggestion(params: {
  destination: string
  days: number
  budget: number
  interests: string[]
}) {
  return generateTripSuggestion(params)
}
