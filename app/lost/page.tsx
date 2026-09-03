'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  id: string
  name: string
  location: string
  desc: string
  contact: string
  type: 'lost'
  date: string
  image: string
  claimed: boolean
}

export default function LostForm() {
  const [form, setForm] = useState({name:'', location:'', desc:'', contact:'', image:''})
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all')
  const [view, setView] = useState<'form' | 'list'>('form')
  const router = useRouter()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lostItems') || '[]')
    setItems(saved)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm({...form, image: reader.result as string})
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newItem: Item = {
    ...form,
      id: Date.now().toString(),
      type: 'lost',
      date: new Date().toLocaleString(),
      claimed: false
    }
    const updated = [newItem,...items]
    setItems(updated)
    localStorage.setItem('lostItems', JSON.stringify(updated))
    alert('Report Submitted!')
    setForm({name:'', location:'', desc:'', contact:'', image:''})
    setView('list')
  }

  const handleClaim = (id: string) => {
    const updated = items.map(item =>
      item.id === id? {...item, claimed: true} : item
    )
    setItems(updated)
    localStorage.setItem('lostItems', JSON.stringify(updated))
  }

  const handleClose = () => {
    router.push('/')
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.desc.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'claimed' && item.claimed) ||
                         (filter === 'unclaimed' &&!item.claimed)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <main onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">
          ×
        </button>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg font-semibold ${view==='form'? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Report Lost</button>
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg font-semibold ${view==='list'? 'bg-red-500 text-white' : 'bg-gray-200'}`}>View Items ({items.length})</button>
        </div>

        {view === 'form'? (
          <>
            <h1 className="text-3xl font-bold text-red-500 mb-6">Report Lost Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-800">Item Name</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-800">Image Upload</label>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full border-gray-300 p-2 rounded-lg text-gray-800" />
                {form.image && <img src={form.image} alt="preview" className="w-32 h-32 object-cover mt-2 rounded"/>}
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-800">Location Lost</label>
                <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-800">Description</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} required
                  className="w-full border border-gray-300 p-3 rounded-lg h-24 text-gray-800"></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-800">Your Contact</label>
                <input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} required
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800" />
              </div>

              <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600">
                Submit Report
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-500 mb-4">Lost Items</h1>

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg mb-4 text-gray-800"
            />

            <div className="flex gap-2 mb-4">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter==='all'? 'bg-red-500 text-white' : 'bg-gray-200'}`}>All</button>
              <button onClick={() => setFilter('unclaimed')} className={`px-4 py-2 rounded ${filter==='unclaimed'? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Still Lost</button>
              <button onClick={() => setFilter('claimed')} className={`px-4 py-2 rounded ${filter==='claimed'? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Found</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className={`border p-4 rounded-lg ${item.claimed? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-2"/>}
                  <h3 className="font-bold text-lg">{item.name} {item.claimed && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">FOUND</span>}</h3>
                  <p className="text-sm text-gray-600"><b>Location:</b> {item.location}</p>
                  <p className="text-sm text-gray-600"><b>Desc:</b> {item.desc}</p>
                  <p className="text-sm text-gray-600"><b>Contact:</b> {item.contact}</p>
                  <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                  {!item.claimed && (
                    <button onClick={() => handleClaim(item.id)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Mark as Found
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={handleClose} className="block text-center w-full mt-4 text-gray-600 hover:underline">
          ← Back to Home
        </button>
      </main>
    </div>
  )
}
