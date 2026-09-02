'use client'
import { useState } from 'react'

export default function LostForm() {
  const [form, setForm] = useState({name:'', location:'', desc:'', contact:''})

     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const items = JSON.parse(localStorage.getItem('lostItems') || '[]')
    items.push({...form, type: 'lost', date: new Date().toLocaleString()})
    localStorage.setItem('lostItems', JSON.stringify(items))
    alert('Report Submitted!')
    setForm({name:'', location:'', desc:'', contact:''})
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Report Lost Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Item Name</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required
              className="w-full border-gray-300 p-3 rounded-lg text-gray-800" />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Location Lost</label>
            <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required
              className="w-full border-gray-300 p-3 rounded-lg text-gray-800" />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Description</label>
            <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} required
              className="w-full border-gray-300 p-3 rounded-lg h-24 text-gray-800"></textarea>
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Your Contact</label>
            <input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} required
              className="w-full border-gray-300 p-3 rounded-lg text-gray-800" />
          </div>
          
          <button type="submit" 
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600">
            Submit Report
          </button>
        </form>
      </div>
    </main>
  )
}
