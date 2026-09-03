"use client"
import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser'

type Item = {
  id: string,
  name: string,
  desc: string,
  location: string,
  email: string,
  contact: string, // this is whatsapp
  time: string
}

const SERVICE_ID = 'ridafarooq873@gmail.com'
const TEMPLATE_ID = 'xeqqnno'
const PUBLIC_KEY = 'yLAern5F8F-Rz2kL5'

export default function Home() {
  const [lost, setLost] = useState<Item[]>([])
  const [found, setFound] = useState<Item[]>([])
  const [sentEmails, setSentEmails] = useState<string[]>([])

  useEffect(() => {
    setLost(JSON.parse(localStorage.getItem('lostItems') || '[]'))
    setFound(JSON.parse(localStorage.getItem('foundItems') || '[]'))
    // load sent emails to prevent duplicates on refresh
    setSentEmails(JSON.parse(localStorage.getItem('sentEmails') || '[]'))
  }, [])

  useEffect(() => {
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails))
  }, [sentEmails])

  const sendMatchEmail = (toEmail: string, toName: string, item: Item, matchItem: Item, type: string) => {
    if(!toEmail ||!toEmail.includes('@gmail.com')) return; // safety check

    const emailKey = `${item.id}-${matchItem.id}`
    if(sentEmails.includes(emailKey)) return;

    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: toName,
        to_email: toEmail,
        item_name: item.name,
        location: item.location,
        type: type,
        match_name: matchItem.name,
        match_location: matchItem.location,
        contact: matchItem.contact,
        email: matchItem.email
      },
      PUBLIC_KEY
    ).then(
      () => {
        console.log('✅ Email sent to', toEmail)
        setSentEmails(prev => [...prev, emailKey])
      },
      (err) => console.error('❌ Email Failed:', err)
    )
  }

  // AI Match Logic
  useEffect(() => {
    if(lost.length === 0 || found.length === 0) return;

    lost.forEach(l => {
      found.forEach(f => {
        const nameMatch = l.name.toLowerCase().includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(l.name.toLowerCase())
        const locationMatch = l.location.toLowerCase().trim() === f.location.toLowerCase().trim()

        if(nameMatch && locationMatch) {
          sendMatchEmail(l.email, l.name, l, f, 'Lost')
          sendMatchEmail(f.email, f.name, f, l, 'Found')
        }
      })
    })
  }, [lost, found])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">🤖 AI Matching Active</h1>
      <p className="text-gray-400">Lost: {lost.length} | Found: {found.length}</p>
      <p className="text-green-400 mt-2">Emails will auto-send when a match is found</p>
    </div>
  )
}

   
