'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        
        {/* LOGO / TITLE */}
        <div className="mb-8">
          <div className="text-6xl mb-4">📍</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Campus Lost & Found
          </h1>
          <p className="text-gray-600 text-lg">
            Lost something? Found something? Let's reunite them! 💙
          </p>
        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* LOST CARD */}
          <Link href="/lost" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-red-100">
              <div className="text-5xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-red-500 mb-2">I Lost Something</h2>
              <p className="text-gray-600 mb-4">Report your lost item and hope someone found it</p>
              <div className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-red-600">
                Report Lost
              </div>
            </div>
          </Link>

          {/* FOUND CARD */}
          <Link href="/found" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-green-100">
              <div className="text-5xl mb-4">😊</div>
              <h2 className="text-2xl font-bold text-green-500 mb-2">I Found Something</h2>
              <p className="text-gray-600 mb-4">Help someone get their lost item back</p>
              <div className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-green-600">
                Report Found
              </div>
            </div>
          </Link>
        </div>

        {/* FOOTER */}
        <p className="text-gray-400 text-sm mt-8">
          Made for students, by students ❤️
        </p>
      </div>
    </main>
  )
}

 
