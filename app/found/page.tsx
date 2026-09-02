'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FoundForm() {
  const [form, setForm] = useState({name:'', location:'', desc:'', contact:''})
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const items = JSON.parse(localStorage.getItem('foundItems') || '[]')
    items.push({...form, type: 'found', date: new Date().toLocaleString()})
    localStorage.setItem('foundItems', JSON.stringify(items))
    alert('Report Submitted!')
    setForm({name:'', location:'', desc:'', contact:''})
    router.push('/') // This will close the page and go back to home
  }

  const handleClose = () => {
    router.push('/') // Back button / X button
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <main onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl relative">
        
        {/* CLOSE BUTTON */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">
          ×
        </button>

        <h1 className="text-3xl font-bold text-green-500 mb-6">Report Found Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Item Name</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required
              placeholder="e.g. Keys, Wallet, ID Card"
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 placeholder-gray-400" />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Location Found</label>
            <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required
              placeholder="e.g. Library, Cafeteria, Parking"
              className="w-full border-gray-300 p-3 rounded-lg text-gray-800 placeholder-gray-400" />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Description</label>
            <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} required
              placeholder="Color, brand, where exactly did you find it..."
              className="w-full border border-gray-300 p-3 rounded-lg h-24 text-gray-800 placeholder-gray-400"></textarea>
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Your Contact</label>
            <input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} required
              placeholder="WhatsApp number or Email"
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 placeholder-gray-400" />
          </div>
          
          <button type="submit" 
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600">
            Submit Found Report
          </button>
        </form>

        <button onClick={handleClose} className="block text-center w-full mt-4 text-gray-600 hover:underline">
          ← Back to Home
        </button>
      </main>
    </div>
  )
}
