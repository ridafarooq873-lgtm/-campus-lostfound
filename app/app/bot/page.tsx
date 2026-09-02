'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AIBot() {
  const [messages, setMessages] = useState([{role: 'ai', text: "Hey! I'm Campus AI 🤖"}])
  const [input, setInput] = useState('')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const lost = JSON.parse(localStorage.getItem('lostItems') || '[]')
    const found = JSON.parse(localStorage.getItem('foundItems') || '[]')
    setItems([...lost,...found])
  }, [])

  const handleSend = () => {
    if(!input.trim()) return
    setMessages(prev => [...prev, {role: 'user', text: input}])
    setTimeout(() => {
      setMessages(prev => [...prev, {role: 'ai', text: "I searched! No API needed 😎"}])
    }, 500)
    setInput('')
  }

  return (
    <main className="min-h-screen bg-gray-900 p-6">
      <Link href="/" className="text-purple-400">← Back Home</Link>
      <h1 className="text-2xl font-bold text-purple-400 mt-4">Campus AI Assistant 🤖</h1>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key === 'Enter' && handleSend()} className="bg-gray-700 p-3 rounded mt-4"/>
      <button onClick={handleSend} className="bg-purple-500 px-4 py-2 rounded ml-2">Send</button>
    </main>
  )
}
