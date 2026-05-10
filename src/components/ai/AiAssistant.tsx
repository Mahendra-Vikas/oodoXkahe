'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Best budget tips for Southeast Asia?',
  'What to pack for a beach trip?',
  'Top 5 must-visit places in Europe?',
  'How to stay safe while traveling solo?',
]

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hi! I\'m Loopy, your AI travel buddy! Ask me anything about travel planning, destinations, or budgets.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', message: msg }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFB830)' }}
      >
        <span className="text-2xl">{open ? '✕' : '🌍'}</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#0D1628', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #FF6B6B22, #FFB83022)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFB830)' }}>🌍</div>
              <div>
                <p className="font-semibold text-white">Loopy AI</p>
                <p className="text-xs" style={{ color: '#6B7A9F' }}>Your travel assistant</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-sm"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #FF6B6B, #FFB830)'
                        : 'rgba(255,255,255,0.06)',
                      color: '#F0F4FF',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="flex gap-1">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="whitespace-nowrap text-xs px-2 py-1 rounded-full border transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#6B7A9F' }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Loopy anything..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#F0F4FF' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFB830)', color: 'white' }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
