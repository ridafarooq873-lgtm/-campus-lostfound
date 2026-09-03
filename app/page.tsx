'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type Item = {
  id: string
  name: string
  location: string
  desc: string
  contact: string
  type: 'lost' | 'found'
  date: string
  image: string
  claimed: boolean
}

export default function HomePage() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({name:'', email:''})
  const [showSplash, setShowSplash] = useState(true)

  const [lostItems, setLostItems] = useState<Item[]>([])
  const [foundItems, setFoundItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if(savedUser) setUser(JSON.parse(savedUser))

    setLostItems(JSON.parse(localStorage.getItem('lostItems') || '[]'))
    setFoundItems(JSON.parse(localStorage.getItem('foundItems') || '[]'))

    const timer = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('user', JSON.stringify(loginForm))
    setUser(loginForm)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const allItems = [...lostItems,...foundItems]
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  )

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <img src="/logo.png" alt="Campus Lost Found Logo" className="w-3/4 max-w-md animate-pulse" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold text-purple-400">📍 Campus Lost & Found</h1>
        {user? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Hi, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600">Logout</button>
          </div>
        ) : (
          <button onClick={()=>setShowLogin(true)} className="bg-purple-500 px-4 py-2 rounded-lg text-white hover:bg-purple-600">Login</button>
        )}
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-3xl w-full text-center pt-28 pb-10 px-6 mx-auto">
        <div className="mb-10">
          <div className="text-7xl mb-4">📍</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Campus Lost & Found
          </h1>
          <p className="text-gray-300 text-lg">
            Lost something? Found something? Let's reunite them! 💜
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/lost" className="group">
            <div className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-2 border-red-500/30">
              <div className="text-5xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">I Lost Something</h2>
              <p className="text-gray-300 mb-4">Report your lost item</p>
              <div className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold">Report Lost</div>
            </div>
          </Link>

          <Link href="/found" className="group">
            <div className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all hover:-translate-y-2 border-green-500/30">
              <div className="text-5xl mb-4">😊</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">I Found Something</h2>
              <p className="text-gray-300 mb-4">Help someone get it back</p>
              <div className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold">Report Found</div>
            </div>
          </Link>
        </div>
        <Link href="/bot" className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition mt-6">
          🤖 Talk to AI Assistant
        </Link>
      </div>

      {/* NEW: DASHBOARD LIST */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search all items: wallet, keys, library..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border-2 border-purple-500 bg-gray-800 p-4 rounded-xl mb-6 text-white text-lg"
        />

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/60 p-4 rounded-lg shadow text-center backdrop-blur-lg">
            <p className="text-3xl font-bold text-red-500">{lostItems.filter(i =>!i.claimed).length}</p>
            <p className="text-gray-300">Items Lost</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-lg shadow text-center backdrop-blur-lg">
            <p className="text-3xl font-bold text-green-500">{foundItems.filter(i =>!i.claimed).length}</p>
            <p className="text-gray-300">Items Found</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-lg shadow text-center backdrop-blur-lg">
            <p className="text-3xl font-bold text-blue-500">{lostItems.filter(i => i.claimed).length + foundItems.filter(i => i.claimed).length}</p>
            <p className="text-gray-300">Reunited</p>
          </div>
        </div>

        {/* ITEMS GRID */}
        <h2 className="text-2xl font-bold mb-4 text-white">All Recent Items</h2>
        {filteredItems.length === 0? (
          <p className="text-center text-gray-400 py-10">No items yet. Be the first to report!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
              <div key={item.id} className={`backdrop-blur-lg p-4 rounded-xl border-2 ${item.type === 'lost'? 'border-red-500/30 bg-red-900/20' : 'border-green-500/30 bg-green-900/20'} ${item.claimed? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.type === 'lost'? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {item.type === 'lost'? 'LOST' : 'FOUND'}
                  </span>
                  {item.claimed && <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">CLOSED</span>}
                </div>
                {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded mb-2"/>}
                <h3 className="font-bold text-lg text-white">{item.name}</h3>
                <p className="text-sm text-gray-300"><b>Location:</b> {item.location}</p>
                <p className="text-sm text-gray-300"><b>Desc:</b> {item.desc}</p>
                <p className="text-sm text-gray-300"><b>Contact:</b> {item.contact}</p>
                <p className="text-xs text-gray-400 mt-2">{item.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={()=>setShowLogin(false)}>
          <form onSubmit={handleLogin} onClick={(e)=>e.stopPropagation()} className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
            <input placeholder="Your Name" value={loginForm.name} onChange={e=>setLoginForm({...loginForm,name:e.target.value})} required className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>
            <input placeholder="Your Email" type="email" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} required className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"/>
            <button type="submit" className="w-full bg-purple-500 py-3 rounded-lg text-white font-semibold hover:bg-purple-600">Login</button>
          </form>
        </div>
      )}
    </main>
  )
}

   
