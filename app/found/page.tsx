"use client"
import { useState } from 'react'

type Item = { 
  id: string, 
  name: string, 
  desc: string, 
  location: string, 
  email: string,      
  contact: string,    
  image: string, 
  time: string 
}

export default function FoundPage() {
  const [form, setForm] = useState({
    name: '',
    desc: '',
    location: '',
    email: '',      
    whatsapp: '',   
    image: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: Item = {
      id: Date.now().toString(),
      name: form.name,
      desc: form.desc,
      location: form.location,
      email: form.email,           
      contact: form.whatsapp,      
      image: form.image,
      time: new Date().toISOString()
    }

    const existing = JSON.parse(localStorage.getItem('foundItems') || '[]') // <-- foundItems
    localStorage.setItem('foundItems', JSON.stringify([...existing, newItem]))
    
    alert('✅ Found item reported!')
    setForm({ name: '', desc: '', location: '', email: '', whatsapp: '', image: '' })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Report Found Item</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        
        <input placeholder="Item Name *" required
          value={form.name} onChange={e=>setForm({...form, name: e.target.value})}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>

        <input placeholder="Description" 
          value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>

        <input placeholder="Location *" required
          value={form.location} onChange={e=>setForm({...form, location: e.target.value})}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>

        {/* THESE 2 ARE NEW */}
        <input placeholder="Your Email *" type="email" required
          value={form.email} onChange={e=>setForm({...form, email: e.target.value})}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>

        <input placeholder="WhatsApp Number 0300..."
          value={form.whatsapp} onChange={e=>setForm({...form, whatsapp: e.target.value})}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>

        <button type="submit" className="w-full p-3 bg-green-600 rounded-lg font-bold">
          Submit Found Item
        </button>
      </form>
    </div>
  )
}
