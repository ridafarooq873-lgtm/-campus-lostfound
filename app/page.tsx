'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        
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
            <div className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-2 border border-red-500/30">
              <div className="text-5xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">I Lost Something</h2>
              <p className="text-gray-300 mb-4">Report your lost item and hope someone found it</p>
              <div className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-red-600">
                Report Lost
              </div>
            </div>
          </Link>

          <Link href="/found" className="group">
            <div className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all hover:-translate-y-2 border border-green-500/30">
              <div className="text-5xl mb-4">😊</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">I Found Something</h2>
              <p className="text-gray-300 mb-4">Help someone get their lost item back</p>
              <div className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-green-600">
                Report Found
              </div>
            </div>
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Made for students, by students ❤️
        </p>
      </div>
    </main>
  )
}
              
      
