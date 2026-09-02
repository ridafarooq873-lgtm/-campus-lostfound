"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Phone, Mail, Plus, X, CheckCircle, MessageCircle, User, LogIn, LogOut, Send } from "lucide-react";
import { format } from "date-fns";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
}

type Item = {
  id: string;
  type: "lost" | "found";
  itemName: string;
  description: string;
  location: string;
  date: string;
  contact: string;
  userId: string; // who posted it
  status: "active" | "claimed";
};

type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
  itemId: string; // chat about which item
}

type AIMatch = {
  item1: Item;
  item2: Item;
  score: number;
  reason: string;
} | null;

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatWith, setChatWith] = useState<User | null>(null);
  const [chatItem, setChatItem] = useState<Item | null>(null);
  const [formType, setFormType] = useState<"lost" | "found">("lost");
  const [search, setSearch] = useState("");
  const [aiMatch, setAiMatch] = useState<AIMatch>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");
  const [chatText, setChatText] = useState("");
  
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    date: "",
    contact: "",
  });
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("campus-user");
    const savedItems = localStorage.getItem("campus-items");
    const savedMsgs = localStorage.getItem("campus-messages");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  // Save to localStorage
  useEffect(() => { localStorage.setItem("campus-user", JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem("campus-items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("campus-messages", JSON.stringify(messages)); }, [messages]);

  // AI Match Check
  useEffect(() => {
    const lost = items.filter(i => i.type === 'lost').length;
    const found = items.filter(i => i.type === 'found').length;
    if(lost >= 1 && found >= 1 &&!aiMatch &&!loadingAI) {
      checkAIMatch();
    }
  }, [items])

  const checkAIMatch = async () => {
    setLoadingAI(true);
    setAiError("");
    try {
      const lostItems = items.filter(i => i.type === 'lost');
      const foundItems = items.filter(i => i.type === 'found');
      
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lost: lostItems, found: foundItems })
      });

      if(!res.ok) throw new Error("API call failed");

      const matchData = await res.json();
      if(matchData && matchData.score > 70) {
        const item1 = items.find(i => i.id === matchData.item1_id)!
        const item2 = items.find(i => i.id === matchData.item2_id)!
        if(item1 && item2) setAiMatch({ item1, item2, score: matchData.score, reason: matchData.reason })
      }
    } catch(e: any) {
      setAiError("AI ERROR: " + e.message);
    }
    setLoadingAI(false);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = { id: Date.now().toString(),...profileData }
    setCurrentUser(newUser);
    setShowProfile(false);
  }

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("campus-user");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!currentUser) return alert("Please create profile first");
    const newItem: Item = {
      id: Date.now().toString(),
      type: formType,
      userId: currentUser.id,
     ...formData,
      status: "active",
    };
    setItems([newItem,...items]);
    setFormData({ itemName: "", description: "", location: "", date: "", contact: "" });
    setShowForm(false);
  };

  const startChat = (item: Item) => {
    if(!currentUser) return alert("Please create profile first");
    if(item.userId === currentUser.id) return alert("This is your own item");
    const otherUser: User = { id: item.userId, name: "User " + item.userId.slice(-4), email: "", phone: item.contact }
    setChatWith(otherUser);
    setChatItem(item);
    setShowChat(true);
  }

  const sendMessage = () => {
    if(!chatText ||!currentUser ||!chatWith ||!chatItem) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: chatWith.id,
      text: chatText,
      timestamp: Date.now(),
      itemId: chatItem.id
    }
    setMessages([...messages, newMsg]);
    setChatText("");
  }

  const chatMessages = messages.filter(m => 
    ((m.from === currentUser?.id && m.to === chatWith?.id) || (m.from === chatWith?.id && m.to === currentUser?.id))
    && m.itemId === chatItem?.id
  )

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const lostItems = filteredItems.filter(i => i.type === "lost");
  const foundItems = filteredItems.filter(i => i.type === "found");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Campus Lost & Found
            </h1>
            <p className="text-gray-400">AI-Powered + Chat</p>
          </div>
          {currentUser? (
            <div className="flex gap-2">
              <button onClick={() => setShowProfile(true)} className="bg-purple-500 px-4 py-2 rounded-lg flex items-center gap-2">
                <User size={18} /> {currentUser.name}
              </button>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowProfile(true)} className="bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
              <LogIn size={18} /> Create Profile
            </button>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => { setFormType("lost"); setShowForm(true); }} 
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <Plus size={20} /> Report Lost
          </button>
          <button onClick={() => { setFormType("found"); setShowForm(true); }} 
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <Plus size={20} /> Report Found
          </button>
        </div>

        {/* SEARCH */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items, location..."
            className="w-full bg-gray-800 border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* AI MATCH BOX */}
        {loadingAI && <p className="text-center text-purple-400 mb-4">🤖 AI is scanning for matches...</p>}
        {aiMatch && (
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">🤖 AI Found Possible Match! {aiMatch.score}% Match</h2>
            <p className="text-gray-300 mb-4">{aiMatch.reason}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 p-4 rounded-xl">
                <p className="text-red-400 font-semibold">LOST: {aiMatch.item1.itemName}</p>
                <button onClick={() => startChat(aiMatch.item1)} className="mt-2 bg-blue-500 px-3 py-1 rounded text-sm flex items-center gap-1"><MessageCircle size={14}/> Chat</button>
              </div>
              <div className="bg-green-500/10 p-4 rounded-xl">
                <p className="text-green-400 font-semibold">FOUND: {aiMatch.item2.itemName}</p>
                <button onClick={() => startChat(aiMatch.item2)} className="mt-2 bg-blue-500 px-3 py-1 rounded text-sm flex items-center gap-1"><MessageCircle size={14}/> Chat</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ITEMS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LOST */}
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Lost Items ({lostItems.length})</h2>
            <div className="space-y-4">
              {lostItems.map(item => (
                <div key={item.id} className="bg-gray-800/50 border-red-500/30 p-4 rounded-xl">
                  <h3 className="font-bold text-lg">{item.itemName}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} />{item.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} />{item.date}</span>
                  </div>
                  <button onClick={() => startChat(item)} className="mt-3 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex items-center justify-center gap-2">
                    <MessageCircle size={16}/> Chat with Owner
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FOUND */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Found Items ({foundItems.length})</h2>
            <div className="space-y-4">
              {foundItems.map(item => (
                <div key={item.id} className="bg-gray-800/50 border border-green-500/30 p-4 rounded-xl">
                  <h3 className="font-bold text-lg">{item.itemName}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} />{item.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} />{item.date}</span>
                  </div>
                  <button onClick={() => startChat(item)} className="mt-3 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex items-center justify-center gap-2">
                    <MessageCircle size={16}/> Chat with Finder
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROFILE MODAL */}
        <AnimatePresence>
        {showProfile && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
              <input required placeholder="Your Name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <input required type="email" placeholder="Email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <input required placeholder="Phone" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-4"/>
              <button type="submit" className="w-full bg-green-500 py-3 rounded-xl font-semibold">Save Profile</button>
            </form>
          </motion.div>
        )}
        </AnimatePresence>

        {/* CHAT MODAL */}
        <AnimatePresence>
        {showChat && chatWith && chatItem && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chat about: {chatItem.itemName}</h2>
                <button onClick={() => setShowChat(false)}><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900 p-3 rounded-lg mb-3">
                {chatMessages.map(m => (
                  <div key={m.id} className={`mb-2 ${m.from === currentUser?.id? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg ${m.from === currentUser?.id? 'bg-purple-500' : 'bg-gray-700'}`}>
                      <p>{m.text}</p>
                      <p className="text-xs opacity-70">{format(m.timestamp, 'hh:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={chatText} onChange={e => setChatText(e.target.value)} placeholder="Type message..." className="flex-1 bg-gray-700 p-3 rounded-lg"/>
                <button onClick={sendMessage} className="bg-blue-500 px-4 rounded-lg"><Send /></button>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* ITEM FORM MODAL */}
        <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.form onSubmit={handleSubmit}
              initial={{scale: 0.9}} animate={{scale: 1}} exit={{scale: 0.9}}
              className="bg-gray-800 p-6 rounded-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Report {formType === "lost"? "Lost" : "Found"} Item</h2>
              <input required placeholder="Item Name" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <input required placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-3"/>
              <input required placeholder="Contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-gray-700 p-3 rounded-lg mb-4"/>
              <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-xl font-semibold">Submit</button>
            </motion.form>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </main>
  );
}