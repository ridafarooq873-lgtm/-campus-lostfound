'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({name:'', email:''})

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if(savedUser) setUser(JSON.parse(savedUser))
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold text-purple-400">📍 Campus Lost & Found</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Hi, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600">Logout</button>
          </div>
        ) : (
          <button onClick={()=>setShowLogin(true)} className="bg-purple-500 px-4 py-2 rounded-lg text-white hover:bg-purple-600">Login</button>
        )}
      </nav>

      <div className="max-w-3xl w-full text-center mt-20">
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

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={()=>setShowLogin(false)}>
          <form onSubmit={handleLogin} onClick={(e)=>e.stopPropagation()} className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
            <input placeholder="Your Name" value={loginForm.name} onChange={e=>setLoginForm({...loginForm,name:e.target.value})} required className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border-gray-600"/>
            <input placeholder="Your Email" type="email" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} required className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border-gray-600"/>
            <button type="submit" className="w-full bg-purple-500 py-3 rounded-lg text-white font-semibold hover:bg-purple-600">Login</button>
          </form>
        </div>
      )}
    </main>
  )
}
