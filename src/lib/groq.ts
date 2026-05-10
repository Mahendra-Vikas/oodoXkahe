import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function askGroq(prompt: string, systemPrompt?: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt || `You are Loopy, an enthusiastic and knowledgeable AI travel assistant for Traveloop. 
        You help users plan amazing trips, suggest activities, estimate budgets, and provide travel tips. 
        Always be encouraging, specific, and practical. Format responses with clear sections when helpful.
        When suggesting itineraries, include estimated costs in USD.`,
      },
      { role: 'user', content: prompt },
    ],
    model: 'llama3-70b-8192',
    temperature: 0.7,
    max_tokens: 1024,
  })
  return completion.choices[0]?.message?.content || ''
}

export async function generateItinerarySuggestion(params: {
  destination: string
  days: number
  budget: number
  interests: string[]
}) {
  const prompt = `Create a detailed ${params.days}-day itinerary for ${params.destination} 
  with a total budget of $${params.budget} USD. 
  Interests: ${params.interests.join(', ')}.
  
  For each day provide:
  - Morning activity with estimated cost
  - Afternoon activity with estimated cost  
  - Evening activity with estimated cost
  - Recommended meal spots
  - Transportation tips
  
  Return as structured JSON with this format:
  {
    "days": [
      {
        "day": 1,
        "theme": "string",
        "activities": [
          { "time": "string", "name": "string", "description": "string", "cost": number, "location": "string" }
        ],
        "meals": ["string"],
        "tips": "string",
        "dailyCost": number
      }
    ],
    "totalEstimatedCost": number,
    "packingTips": ["string"],
    "bestTimeToVisit": "string"
  }`

  const response = await askGroq(prompt)
  try {
    return JSON.parse(response)
  } catch {
    return { raw: response }
  }
}
