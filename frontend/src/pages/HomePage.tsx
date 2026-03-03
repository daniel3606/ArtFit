import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Compass, Plus, Settings as SettingsIcon, User, Heart, MessageCircle, LogOut, Menu, X } from "lucide-react"
import logo from "../assets/logo.png"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface InspirationCard {
  id: string
  title: string
  author: string
  image: string
  category: string
  likes: number
  comments: number
  height: number
}

function CardComponent({ card }: { card: InspirationCard }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-900"
      style={{ height: `${card.height}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
          <p className="text-white/80 text-sm mb-3">by {card.author}</p>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{card.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{card.comments}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HomePage() {
  const nav = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (!auth.access) nav("/login")
  }, [nav])

  const cards = useMemo<InspirationCard[]>(() => {
    const imgs = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=450&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=550&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=350&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=450&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=350&fit=crop",
    ]
    const titles = [
      "Modern UI Design", "3D Abstract Art", "Gradient Exploration", "React Dashboard",
      "Typography Study", "Mobile App UI", "Code Animation", "Brand Identity",
      "Web Components", "Color Palette", "API Integration", "Icon Design",
    ]
    const authors = ["Sarah Chen", "Mike Johnson", "Emma Wilson", "Alex Turner", "Lisa Park", "David Kim", "Rachel Green", "Tom Harris", "Nina Patel", "Chris Lee", "Maya Singh", "James Brown"]
    const categories = ["Design", "Design", "Design", "Development", "Design", "Design", "Development", "Design", "Development", "Design", "Development", "Design"]
    const heights = [300, 250, 350, 280, 320, 380, 290, 310, 340, 270, 330, 300]

    return Array.from({ length: 12 }).map((_, i) => ({
      id: String(i + 1),
      title: titles[i],
      author: authors[i],
      image: imgs[i],
      category: categories[i],
      likes: 100 + ((i * 137) % 700),
      comments: 5 + ((i * 23) % 50),
      height: heights[i],
    }))
  }, [])

  const filteredCards = useMemo(() => {
    let filtered = cards
    if (activeFilter !== "All") {
      filtered = filtered.filter((c) => c.category === activeFilter)
    }
    if (searchValue) {
      const q = searchValue.toLowerCase()
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q))
    }
    return filtered
  }, [cards, activeFilter, searchValue])

  const navItems = [
    { icon: Compass, label: "Explore", to: "/home", active: true },
    { icon: Search, label: "Search", to: "/search", active: false },
    { icon: Plus, label: "Add Project", to: "/projects/new", active: false },
    { icon: SettingsIcon, label: "Settings", to: "/settings", active: false },
    { icon: User, label: "Profile", to: "/profile", active: false },
  ]

  const filters = ["All", "Design", "Development"]

  function handleLogout() {
    auth.clear()
    nav("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "240px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block fixed left-0 top-0 h-full bg-slate-950 border-r border-slate-800 z-40"
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-8 flex items-center gap-3">
            <img src={logo} alt="ArtFit" className="h-10 w-10 object-contain shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-white font-bold text-xl whitespace-nowrap"
                >
                  ArtFit
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to}>
                <motion.div
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                    item.active
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      item.active && "bg-gradient-to-br from-purple-500 to-pink-500"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>

          <div className="space-y-2 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium whitespace-nowrap"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <motion.div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50" whileHover={{ scale: 1.02 }}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">AF</AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-white text-sm font-medium truncate">ArtFit User</p>
                    <p className="text-slate-400 text-xs truncate">@artfit</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="ArtFit" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-800 text-white">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-slate-950 border-l border-slate-800 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                      item.active ? "bg-purple-500/20 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="lg:transition-[margin-left] lg:duration-300 lg:ease-in-out"
        style={{ marginLeft: "var(--sidebar-width, 80px)" }}
        animate={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 1024 ? (isCollapsed ? "80px" : "240px") : "0px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top Bar */}
        <div className="sticky top-0 lg:top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search inspiration..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <Link to="/projects/new">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-6 rounded-2xl">
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className={cn(
                    "rounded-full px-6 py-2 transition-all",
                    activeFilter === filter
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="px-6 lg:px-8 py-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card) => (
                <div key={card.id} className="break-inside-avoid">
                  <CardComponent card={card} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No results found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
