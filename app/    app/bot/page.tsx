'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AIBot() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    {role: 'ai', text: "Hey! I'm Campus AI 🤖 Tell me what you lost or found and I'll help you!"}
  ])
  const [input, setInput] = useState('')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const lost = JSON.parse(localStorage.getItem('lostItems') || '[]')
    const found = JSON.parse(localStorage.getItem('foundItems') || '[]')
    setItems([...lost,...found])
  }, [])

  const handleSend = () => {
    if(!input.trim()) return
    const userMsg = {role: 'user', text: input}
    setMessages(prev => [...prev, userMsg])

    setTimeout(() => {
      const aiReply = getAIResponse(input.toLowerCase())
      setMessages(prev => [...prev, {role: 'ai', text: aiReply}])
    }, 500)
    setInput('')
  }

  const getAIResponse = (msg: string) => {
    if(msg.includes('lost') || msg.includes('find')) {
      const keywords = msg.split(' ')
      const matches = items.filter(item =>
        keywords.some(k => item.name?.toLowerCase().includes(k) || item.desc?.toLowerCase().includes(k))
      )
      if(matches.length > 0) {
        return `I found ${matches.length} possible matches! 🔍 \n\n` +
          matches.map(m => `${m.type === 'lost'? 'Lost' : 'Found'}: ${m.name}\nLocation: ${m.location}\nContact: ${m.contact}`).join('\n\n')
      } else {
        return `Sorry, I couldn't find any matches for "${msg}". Try posting a report first!`
      }
    }
    if(msg.includes('hello') || msg.includes('hi')) {
      return "Hello! 👋 How can I help? Try: 'I lost my wallet'"
    }
    return "I can help search lost/found items! Try: 'I lost my ID card'"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-400 hover:underline mb-4 inline-block">← Back Home</Link>
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border-purple-500/30 h-[80vh] flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-purple-400">Campus AI Assistant 🤖</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user'? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user'? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  {m.text.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key === 'Enter' && handleSend()} placeholder="Ask me: I lost my wallet..." className="flex-1 p-3 rounded-lg bg-gray-700 text-white border-gray-600"/>
            <button onClick={handleSend} className="bg-purple-500 px-6 py-3 rounded-lg text-white font-semibold">Send</button>
          </div>
        </div>
      </div>
    </main>
  )
}
  
         
