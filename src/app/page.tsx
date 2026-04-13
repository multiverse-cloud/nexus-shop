'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, selectCartTotal, selectCartCount, selectUnreadNotifications, selectIsInWishlist } from '@/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Star,
  ArrowRight,
  Play,
  Check,
  Zap,
  Shield,
  Globe,
  Clock,
  Award,
  Users,
  Package,
  TrendingUp,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Truck,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  DollarSign,
  Calendar,
  Gift,
  Percent,
  Crown,
  Sparkles,
  LayoutDashboard,
  Store,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Grid3X3,
  List,
  SlidersHorizontal,
  Filter,
  SortAsc,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  ArrowUp,
  ChevronUp,
  ChevronDown,
  Menu as MenuIcon,
  XCircle,
  Layers,
  Rocket,
  Target,
  PieChart,
  Activity,
  CreditCard as CardIcon,
  Wallet,
  Lock,
  HeadphonesIcon,
} from 'lucide-react'

// Import server actions
import {
  login,
  register,
  getProducts,
  getCategories,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getOrders,
  createOrder,
  getPlans,
  getSubscription,
  getNotifications,
  markNotificationRead,
  getTestimonials,
  getFAQs,
  subscribeNewsletter,
  submitContactForm,
  getReviews,
  createReview,
  getAdminStats,
} from '@/lib/actions'

// Types
import type { Product, Category, Plan, Testimonial, FAQ, Order, Notification } from '@/store'

// ============================================
// GO TO TOP BUTTON COMPONENT
// ============================================
const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center cursor-pointer group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================
// TRUSTED BRANDS COMPONENT
// ============================================
const TrustedBrands = () => {
  const brands = [
    { name: 'Google', icon: 'G' },
    { name: 'Microsoft', icon: 'M' },
    { name: 'Amazon', icon: 'A' },
    { name: 'Apple', icon: '' },
    { name: 'Meta', icon: 'F' },
    { name: 'Netflix', icon: 'N' },
  ]
  
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-center text-sm font-medium text-muted-foreground mb-10 tracking-wider uppercase">
          Trusted by teams at world-leading companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl font-bold text-slate-300 dark:text-slate-600 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-300 cursor-pointer hover:scale-110"
            >
              {brand.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// FEATURE CARD - PREMIUM DESIGN
// ============================================
const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group relative cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-emerald-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <Card className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 rounded-3xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
)

// ============================================
// PRICING CARD - PREMIUM DESIGN
// ============================================
const PricingCard = ({ plan, onSelect, index }: { plan: Plan; onSelect: () => void; index: number }) => {
  const features = JSON.parse(plan.features)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={cn(
        "relative cursor-pointer",
        plan.isFeatured && "lg:-mt-4 lg:mb-4"
      )}
    >
      {plan.isFeatured && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white px-6 py-1.5 text-sm font-semibold shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}
      <Card className={cn(
        "relative h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl transition-all duration-500 rounded-3xl overflow-hidden",
        plan.isFeatured 
          ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/20" 
          : "hover:shadow-2xl hover:shadow-slate-500/10"
      )}>
        {plan.isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-emerald-500/5" />
        )}
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <span className="text-5xl font-extrabold">${plan.price}</span>
            <span className="text-muted-foreground text-lg">/{plan.interval.toLowerCase().replace('ly', '')}</span>
            {plan.comparePrice && (
              <span className="ml-3 text-xl text-muted-foreground line-through">${plan.comparePrice}</span>
            )}
          </div>
          <ul className="space-y-4 text-left mb-8">
            {features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pb-8">
          <Button
            onClick={onSelect}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 cursor-pointer",
              plan.isFeatured
                ? "bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                : "bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
            )}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// ============================================
// TESTIMONIAL CARD - PREMIUM DESIGN
// ============================================
const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full overflow-hidden">
      <CardContent className="pt-8">
        <div className="flex gap-1 mb-6">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed italic">"{testimonial.content}"</p>
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 ring-2 ring-purple-500/20">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-emerald-600 text-white text-lg font-semibold">
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

// ============================================
// PRODUCT CARD - PREMIUM DESIGN
// ============================================
const ProductCard = ({ product, onQuickView, onAddToCart, onToggleWishlist, isInWishlist, index }: {
  product: Product
  onQuickView: () => void
  onAddToCart: () => void
  onToggleWishlist: () => void
  isInWishlist: boolean
  index?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: (index || 0) * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className="group cursor-pointer"
  >
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-3xl">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <img
          src={product.featuredImage || JSON.parse(product.images)[0]}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <Button size="lg" variant="secondary" onClick={onQuickView} className="rounded-xl shadow-xl cursor-pointer">
            <Eye className="w-5 h-5 mr-2" /> Quick View
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 rounded-full shadow-lg cursor-pointer"
          onClick={onToggleWishlist}
        >
          <Heart className={cn("w-5 h-5", isInWishlist && "fill-red-500 text-red-500")} />
        </Button>
        {product.comparePrice && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg">
            {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
          </Badge>
        )}
        {product.isFeatured && !product.comparePrice && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">{product.category?.name}</p>
        <h3 className="font-bold text-lg mb-3 line-clamp-1 group-hover:text-purple-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${product.price}</span>
            {product.comparePrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">${product.comparePrice}</span>
            )}
          </div>
          <Button size="lg" onClick={onAddToCart} className="rounded-xl cursor-pointer bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700">
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function HomePage() {
  const store = useAppStore()
  
  // Local state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [checkoutForm, setCheckoutForm] = useState({
    billing: { firstName: '', lastName: '', email: '', phone: '', company: '', street: '', apartment: '', city: '', state: '', zipCode: '', country: 'USA' },
    shipping: { firstName: '', lastName: '', phone: '', company: '', street: '', apartment: '', city: '', state: '', zipCode: '', country: 'USA' },
    sameAsBilling: true,
    paymentMethod: 'credit_card',
    couponCode: ''
  })
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  
  // Computed values
  const cartTotal = useAppStore(selectCartTotal)
  const cartCount = useAppStore(selectCartCount)
  const unreadNotifications = useAppStore(selectUnreadNotifications)
  
  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Filtered products
  const filteredProducts = useMemo(() => {
    let products = [...store.products]
    
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.categoryId === selectedCategory)
    }
    
    if (store.searchQuery) {
      const query = store.searchQuery.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }
    
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }
    
    return products
  }, [store.products, selectedCategory, store.searchQuery, sortBy])
  
  // Selected product for modal
  const selectedProduct = useMemo(() => 
    store.products.find(p => p.id === store.selectedProductId),
    [store.products, store.selectedProductId]
  )
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      store.setLoading(true)
      
      const [products, categories, plans, testimonials, faqs] = await Promise.all([
        getProducts(),
        getCategories(),
        getPlans(),
        getTestimonials(),
        getFAQs()
      ])
      
      store.setProducts(products)
      store.setCategories(categories)
      store.setPlans(plans)
      store.setTestimonials(testimonials)
      store.setFAQs(faqs)
      store.setLoading(false)
    }
    
    fetchData()
  }, [])
  
  // Fetch user data when authenticated
  useEffect(() => {
    if (store.user && store.isAuthenticated) {
      const fetchUserData = async () => {
        const [cartItems, wishlistItems, orders, subscription, notifications] = await Promise.all([
          getCart(),
          getWishlist(),
          getOrders(),
          getSubscription(),
          getNotifications()
        ])
        
        store.setCartItems(cartItems as any)
        store.setWishlistItems(wishlistItems as any)
        store.setOrders(orders as any)
        store.setSubscription(subscription as any)
        store.setNotifications(notifications as any)
        
        if (store.user?.role === 'ADMIN') {
          const stats = await getAdminStats()
          store.setAdminStats(stats as any)
        }
      }
      
      fetchUserData()
    }
  }, [store.user, store.isAuthenticated])
  
  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(loginForm)
    if (result.success && result.data) {
      store.setUser(result.data as any)
      store.closeAuthModal()
      setLoginForm({ email: '', password: '' })
    } else {
      alert(result.error || 'Login failed')
    }
  }
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    const result = await register(registerForm)
    if (result.success && result.data) {
      store.setUser(result.data as any)
      store.closeAuthModal()
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
    } else {
      alert(result.error || 'Registration failed')
    }
  }
  
  const handleLogout = () => {
    store.logout()
    store.setCurrentView('landing')
  }
  
  const handleAddToCart = async (productId: string) => {
    if (!store.user) {
      store.openAuthModal()
      return
    }
    await addToCart({ productId, quantity: 1 })
    const items = await getCart()
    store.setCartItems(items as any)
  }
  
  const handleUpdateCartQuantity = async (itemId: string, quantity: number) => {
    if (!store.user) return
    await updateCartItem(itemId, quantity)
    const items = await getCart()
    store.setCartItems(items as any)
  }
  
  const handleRemoveFromCart = async (itemId: string) => {
    if (!store.user) return
    await removeFromCart(itemId)
    const items = await getCart()
    store.setCartItems(items as any)
  }
  
  const handleToggleWishlist = async (productId: string) => {
    if (!store.user) {
      store.openAuthModal()
      return
    }
    const isInWishlist = store.wishlistItems.some(i => i.productId === productId)
    if (isInWishlist) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
    const items = await getWishlist()
    store.setWishlistItems(items as any)
  }
  
  const handleCheckout = async () => {
    if (!store.user) return
    
    const result = await createOrder({
      billingFirstName: checkoutForm.billing.firstName,
      billingLastName: checkoutForm.billing.lastName,
      billingEmail: checkoutForm.billing.email,
      billingPhone: checkoutForm.billing.phone,
      billingCompany: checkoutForm.billing.company,
      billingStreet: checkoutForm.billing.street,
      billingApartment: checkoutForm.billing.apartment,
      billingCity: checkoutForm.billing.city,
      billingState: checkoutForm.billing.state,
      billingZipCode: checkoutForm.billing.zipCode,
      billingCountry: checkoutForm.billing.country,
      shippingFirstName: checkoutForm.sameAsBilling ? checkoutForm.billing.firstName : checkoutForm.shipping.firstName,
      shippingLastName: checkoutForm.sameAsBilling ? checkoutForm.billing.lastName : checkoutForm.shipping.lastName,
      shippingPhone: checkoutForm.sameAsBilling ? checkoutForm.billing.phone : checkoutForm.shipping.phone,
      shippingCompany: checkoutForm.sameAsBilling ? checkoutForm.billing.company : checkoutForm.shipping.company,
      shippingStreet: checkoutForm.sameAsBilling ? checkoutForm.billing.street : checkoutForm.shipping.street,
      shippingApartment: checkoutForm.sameAsBilling ? checkoutForm.billing.apartment : checkoutForm.shipping.apartment,
      shippingCity: checkoutForm.sameAsBilling ? checkoutForm.billing.city : checkoutForm.shipping.city,
      shippingState: checkoutForm.sameAsBilling ? checkoutForm.billing.state : checkoutForm.shipping.state,
      shippingZipCode: checkoutForm.sameAsBilling ? checkoutForm.billing.zipCode : checkoutForm.shipping.zipCode,
      shippingCountry: checkoutForm.sameAsBilling ? checkoutForm.billing.country : checkoutForm.shipping.country,
      couponCode: checkoutForm.couponCode || undefined
    })
    
    if (result.success) {
      setCheckoutStep('confirmation')
      store.setCartItems([])
      const orders = await getOrders()
      store.setOrders(orders as any)
    } else {
      alert(result.error || 'Checkout failed')
    }
  }
  
  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await subscribeNewsletter(newsletterEmail)
    if (result.success) {
      alert('Successfully subscribed!')
      setNewsletterEmail('')
    } else {
      alert(result.error || 'Subscription failed')
    }
  }
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await submitContactForm(contactForm)
    if (result.success) {
      setContactFormSubmitted(true)
      setContactForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
    } else {
      alert(result.error || 'Failed to submit')
    }
  }
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!store.user || !selectedProduct) return
    
    const result = await createReview(store.user.id, {
      productId: selectedProduct.id,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment
    })
    
    if (result.success) {
      alert('Review submitted!')
      setReviewForm({ rating: 5, title: '', comment: '' })
    } else {
      alert(result.error || 'Failed to submit review')
    }
  }
  
  // ============================================
  // MODERN NAVBAR
  // ============================================
  const renderNavbar = () => (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-500/5" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a 
            href="#" 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
              NexusShop
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => store.setCurrentView('landing')} className="text-sm font-semibold hover:text-purple-600 transition-colors cursor-pointer relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
            </button>
            <button onClick={() => store.setCurrentView('products')} className="text-sm font-semibold hover:text-purple-600 transition-colors cursor-pointer relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
            </button>
            <a href="#pricing" className="text-sm font-semibold hover:text-purple-600 transition-colors cursor-pointer relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#testimonials" className="text-sm font-semibold hover:text-purple-600 transition-colors cursor-pointer relative group">
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#contact" className="text-sm font-semibold hover:text-purple-600 transition-colors cursor-pointer relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search - Desktop */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-11 w-72 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-purple-500 cursor-text"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </div>

            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => store.toggleCart()} 
              className="relative w-11 h-11 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-600 to-emerald-600 border-0">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Auth / User Menu */}
            {store.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative w-11 h-11 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar className="w-9 h-9 ring-2 ring-purple-500/20">
                      <AvatarImage src={store.user?.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-emerald-600 text-white text-sm font-semibold">
                        {store.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl border-0">
                  <DropdownMenuLabel className="p-4">
                    <div>
                      <p className="font-bold">{store.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{store.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => store.setCurrentView('dashboard')} className="py-3 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                  </DropdownMenuItem>
                  {store.user?.role === 'ADMIN' && (
                    <DropdownMenuItem onClick={() => store.setCurrentView('admin')} className="py-3 cursor-pointer">
                      <Settings className="w-4 h-4 mr-3" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="py-3 text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => store.openAuthModal('login')} 
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 shadow-lg shadow-purple-500/25 cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" /> Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden w-11 h-11 rounded-xl cursor-pointer" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
  
  // ============================================
  // RENDER LANDING PAGE
  // ============================================
  const renderLandingPage = () => (
    <div className="min-h-screen">
      {renderNavbar()}
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-24"
          >
            <div className="p-6">
              <Input
                placeholder="Search products..."
                className="mb-6 h-12 rounded-xl"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
              <nav className="space-y-2">
                <button onClick={() => { store.setCurrentView('landing'); setIsMobileMenuOpen(false) }} className="block w-full text-left py-4 px-4 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  Home
                </button>
                <button onClick={() => { store.setCurrentView('products'); setIsMobileMenuOpen(false) }} className="block w-full text-left py-4 px-4 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  Products
                </button>
                <a href="#pricing" className="block py-4 px-4 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                <a href="#testimonials" className="block py-4 px-4 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
                <a href="#contact" className="block py-4 px-4 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section - Premium Design */}
      <section className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)", backgroundSize: '40px 40px' }} />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">New Release v2.0</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white">
                Build Your<br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                  Digital Empire
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
                The ultimate SaaS + Ecommerce platform that combines powerful subscription management with a premium shopping experience. Start scaling your business today.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 shadow-2xl shadow-purple-500/25 cursor-pointer" 
                  onClick={() => store.isAuthenticated ? store.setCurrentView('products') : store.openAuthModal('register')}
                >
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 text-lg rounded-2xl border-white/20 text-white hover:bg-white/10 cursor-pointer"
                >
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="w-12 h-12 border-4 border-slate-900 ring-2 ring-purple-500/20">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-emerald-500 text-white font-semibold">
                        {String.fromCharCode(64 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">Trusted by <span className="text-white font-semibold">10,000+</span> users</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-emerald-500/30 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="font-semibold text-white">Revenue</span>
                    </div>
                    <p className="text-3xl font-bold text-white">$48.5K</p>
                    <p className="text-sm text-emerald-400 mt-2">+12.5% from last month</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="font-semibold text-white">Customers</span>
                    </div>
                    <p className="text-3xl font-bold text-white">2,847</p>
                    <p className="text-sm text-emerald-400 mt-2">+8.2% from last month</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Package className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="font-semibold text-white">Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-white">1,234</p>
                    <p className="text-sm text-emerald-400 mt-2">+15.3% from last month</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-rose-400" />
                      </div>
                      <span className="font-semibold text-white">Subscribers</span>
                    </div>
                    <p className="text-3xl font-bold text-white">847</p>
                    <p className="text-sm text-emerald-400 mt-2">+5.7% from last month</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trusted Brands */}
      <TrustedBrands />
      
      {/* Features Section - Premium */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powerful features designed to help you build, grow, and scale your business with confidence.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized performance with instant page loads and real-time updates. Your customers will love the experience."
              index={0}
            />
            <FeatureCard
              icon={Shield}
              title="Secure Payments"
              description="Industry-standard encryption and PCI compliance. Accept payments securely from anywhere in the world."
              index={1}
            />
            <FeatureCard
              icon={Globe}
              title="Global Scale"
              description="Built on modern infrastructure that scales automatically. Handle millions of users without breaking a sweat."
              index={2}
            />
            <FeatureCard
              icon={HeadphonesIcon}
              title="24/7 Support"
              description="Round-the-clock customer support with live chat, email, and phone. We're always here to help."
              index={3}
            />
            <FeatureCard
              icon={Award}
              title="Premium Quality"
              description="Enterprise-grade features with consumer-friendly pricing. Get the best of both worlds."
              index={4}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Deep insights into your business with real-time dashboards and comprehensive reporting tools."
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">Products</Badge>
              <h2 className="text-4xl font-bold">Featured Products</h2>
            </div>
            <Button variant="outline" onClick={() => store.setCurrentView('products')} className="h-12 px-6 rounded-xl cursor-pointer">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {store.products.filter(p => p.isFeatured).slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={() => store.openProductModal(product.id)}
                onAddToCart={() => handleAddToCart(product.id)}
                onToggleWishlist={() => handleToggleWishlist(product.id)}
                isInWishlist={store.wishlistItems.some(i => i.productId === product.id)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent{' '}
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {store.plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={index}
                onSelect={() => {
                  if (!store.isAuthenticated) {
                    store.openAuthModal('register')
                  } else {
                    setSelectedPlan(plan)
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              See what our customers have to say about their experience.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {store.faqs.map((faq, i) => (
                <AccordionItem key={faq.id} value={`item-${i}`} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border-0 shadow-lg px-6">
                  <AccordionTrigger className="text-left py-6 text-lg font-semibold hover:no-underline cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-purple-300" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Subscribe to our newsletter for the latest updates, tips, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 px-6 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-lg"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl bg-white text-purple-900 hover:bg-slate-100 font-semibold cursor-pointer">
                Subscribe <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full">Contact Us</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Get in{' '}
                <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/20 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Email</p>
                    <p className="text-muted-foreground">support@nexusshop.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/20 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Address</p>
                    <p className="text-muted-foreground">123 Business Ave, Suite 100, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  {contactFormSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                      <p className="text-muted-foreground mb-8">We'll get back to you soon.</p>
                      <Button className="h-12 px-8 rounded-xl cursor-pointer" onClick={() => setContactFormSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base font-medium">Name</Label>
                          <Input
                            id="name"
                            className="h-12 rounded-xl"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base font-medium">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            className="h-12 rounded-xl"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
                          <Input
                            id="phone"
                            className="h-12 rounded-xl"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-base font-medium">Company</Label>
                          <Input
                            id="company"
                            className="h-12 rounded-xl"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-base font-medium">Subject</Label>
                        <Input
                          id="subject"
                          className="h-12 rounded-xl"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base font-medium">Message</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          className="rounded-xl"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 cursor-pointer">
                        Send Message <Send className="w-5 h-5 ml-2" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer - Premium */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">NexusShop</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                The ultimate SaaS + Ecommerce platform for modern businesses.
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <Button key={social} variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer">
                    <Globe className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-slate-800 mb-10" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400">
              © 2024 NexusShop. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors cursor-pointer">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Go To Top Button */}
      <GoToTopButton />
    </div>
  )
  
  // ============================================
  // RENDER PRODUCTS PAGE
  // ============================================
  const renderProductsPage = () => (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {renderNavbar()}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Button variant="ghost" onClick={() => store.setCurrentView('landing')} className="mb-4 h-12 px-4 rounded-xl cursor-pointer">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Home
            </Button>
            <h1 className="text-4xl font-bold">All Products</h1>
            <p className="text-muted-foreground text-lg mt-2">{filteredProducts.length} products found</p>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-11 w-72 h-12 rounded-xl"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-xl overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="w-12 h-12 rounded-none cursor-pointer"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="w-12 h-12 rounded-none cursor-pointer"
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl sticky top-28 overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Filter className="w-5 h-5" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                <div>
                  <h4 className="font-bold mb-4">Categories</h4>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className={cn(
                        "w-full justify-start h-11 rounded-xl cursor-pointer",
                        selectedCategory === 'all' && "bg-gradient-to-r from-purple-600 to-emerald-600"
                      )}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Categories
                    </Button>
                    {store.categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                        className={cn(
                          "w-full justify-start h-11 rounded-xl cursor-pointer",
                          selectedCategory === cat.id && "bg-gradient-to-r from-purple-600 to-emerald-600"
                        )}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className={cn(
              "grid gap-8",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onQuickView={() => store.openProductModal(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  isInWishlist={store.wishlistItems.some(i => i.productId === product.id)}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">No products found</h3>
                <p className="text-muted-foreground text-lg">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <GoToTopButton />
    </div>
  )
  
  // ============================================
  // RENDER USER DASHBOARD
  // ============================================
  const renderUserDashboard = () => (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {renderNavbar()}
        
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-2">Welcome back, {store.user?.name}!</p>
          </div>
          <Button variant="outline" onClick={() => store.setCurrentView('landing')} className="h-12 px-6 rounded-xl cursor-pointer">
            Back to Home
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid h-12 rounded-xl">
            <TabsTrigger value="overview" className="rounded-xl cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl cursor-pointer">Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="rounded-xl cursor-pointer">Wishlist</TabsTrigger>
            <TabsTrigger value="subscription" className="rounded-xl cursor-pointer">Subscription</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl cursor-pointer">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="font-semibold">Total Orders</span>
                  </div>
                  <p className="text-4xl font-bold">{store.orders.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                    <span className="font-semibold">Wishlist Items</span>
                  </div>
                  <p className="text-4xl font-bold">{store.wishlistItems.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="font-semibold">Cart Items</span>
                  </div>
                  <p className="text-4xl font-bold">{store.cartItems.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="font-semibold">Notifications</span>
                  </div>
                  <p className="text-4xl font-bold">{unreadNotifications}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="p-6">
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {store.orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg mb-4">No orders yet</p>
                      <Button className="h-12 px-6 rounded-xl cursor-pointer" onClick={() => store.setCurrentView('products')}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {store.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                          <div>
                            <p className="font-bold">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                            <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'} className="rounded-lg">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="p-6">
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {store.notifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg">No notifications</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-3">
                        {store.notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-4 rounded-xl cursor-pointer transition-colors",
                              notification.isRead
                                ? "bg-slate-100 dark:bg-slate-800"
                                : "bg-purple-100 dark:bg-purple-900/30"
                            )}
                            onClick={async () => {
                              await markNotificationRead(store.user!.id, notification.id)
                              const updated = await getNotifications(store.user!.id)
                              store.setNotifications(updated)
                            }}
                          >
                            <p className="font-semibold text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {store.orders.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Package className="w-16 h-16 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">No orders yet</h3>
                    <p className="text-lg mb-6">Start shopping to see your orders here.</p>
                    <Button className="h-12 px-6 rounded-xl cursor-pointer" onClick={() => store.setCurrentView('products')}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {store.orders.map((order) => (
                      <Card key={order.id} className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <p className="font-bold text-lg">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'} className="rounded-lg">
                                {order.status}
                              </Badge>
                              <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'outline'} className="rounded-lg">
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={item.image || '/placeholder.png'}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-lg">${item.total.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">
                              {order.items.length} item(s)
                            </p>
                            <p className="text-xl font-bold">Total: ${order.total.toFixed(2)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishlist">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {store.wishlistItems.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Your wishlist is empty</h3>
                    <p className="text-lg mb-6">Save items you love by clicking the heart icon.</p>
                    <Button className="h-12 px-6 rounded-xl cursor-pointer" onClick={() => store.setCurrentView('products')}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {store.wishlistItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item.product}
                        onQuickView={() => store.openProductModal(item.product.id)}
                        onAddToCart={() => handleAddToCart(item.product.id)}
                        onToggleWishlist={() => handleToggleWishlist(item.product.id)}
                        isInWishlist={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {store.subscription ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{store.subscription.plan.name} Plan</h3>
                        <Badge className="mt-2 rounded-lg">{store.subscription.status}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <p className="text-sm text-muted-foreground mb-2">Current Period</p>
                        <p className="font-semibold">
                          {new Date(store.subscription.currentPeriodStart).toLocaleDateString()} - {new Date(store.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <p className="text-sm text-muted-foreground mb-2">Next Billing Date</p>
                        <p className="font-semibold">
                          {new Date(store.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" className="h-12 px-6 rounded-xl cursor-pointer">Manage Subscription</Button>
                      <Button variant="outline" className="h-12 px-6 rounded-xl text-red-500 hover:text-red-600 cursor-pointer">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <Crown className="w-16 h-16 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">No active subscription</h3>
                    <p className="text-lg mb-6">Subscribe to a plan to unlock premium features.</p>
                    <Button className="h-12 px-6 rounded-xl cursor-pointer" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="settings-name" className="text-base font-medium">Name</Label>
                      <Input
                        id="settings-name"
                        className="h-12 rounded-xl"
                        defaultValue={store.user?.name || ''}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-email" className="text-base font-medium">Email</Label>
                      <Input
                        id="settings-email"
                        type="email"
                        className="h-12 rounded-xl"
                        defaultValue={store.user?.email || ''}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-phone" className="text-base font-medium">Phone</Label>
                      <Input
                        id="settings-phone"
                        className="h-12 rounded-xl"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-role" className="text-base font-medium">Role</Label>
                      <Input
                        id="settings-role"
                        className="h-12 rounded-xl"
                        defaultValue={store.user?.role || ''}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-xl font-bold">Change Password</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-base font-medium">Current Password</Label>
                      <Input id="current-password" type="password" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-base font-medium">New Password</Label>
                      <Input id="new-password" type="password" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" className="h-12 px-8 rounded-xl cursor-pointer">Save Changes</Button>
                    <Button type="button" variant="outline" className="h-12 px-8 rounded-xl cursor-pointer">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <GoToTopButton />
    </div>
  )
  
  // ============================================
  // RENDER ADMIN DASHBOARD
  // ============================================
  const renderAdminDashboard = () => (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {renderNavbar()}
        
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-2">Manage your platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => store.setCurrentView('landing')} className="h-12 px-6 rounded-xl cursor-pointer">
              View Site
            </Button>
            <Button onClick={() => store.setCurrentView('products')} className="h-12 px-6 rounded-xl cursor-pointer bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700">
              <Store className="w-4 h-4 mr-2" /> Manage Products
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-4xl font-bold mt-2">${store.adminStats?.totalRevenue.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-purple-100 mt-3">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +{store.adminStats?.revenueGrowth || 0}% from last month
                  </p>
                </div>
                <DollarSign className="w-14 h-14 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Orders</p>
                  <p className="text-4xl font-bold mt-2">{store.adminStats?.totalOrders || 0}</p>
                  <p className="text-sm text-emerald-100 mt-3">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +{store.adminStats?.ordersGrowth || 0}% from last month
                  </p>
                </div>
                <Package className="w-14 h-14 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl overflow-hidden shadow-xl shadow-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Total Products</p>
                  <p className="text-4xl font-bold mt-2">{store.adminStats?.totalProducts || 0}</p>
                  <p className="text-sm text-amber-100 mt-3">Active listings</p>
                </div>
                <Store className="w-14 h-14 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl overflow-hidden shadow-xl shadow-rose-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Total Users</p>
                  <p className="text-4xl font-bold mt-2">{store.adminStats?.totalUsers || 0}</p>
                  <p className="text-sm text-rose-100 mt-3">Registered users</p>
                </div>
                <Users className="w-14 h-14 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <Store className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manage Products</h3>
              <p className="text-muted-foreground">Add, edit, or remove products</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manage Users</h3>
              <p className="text-muted-foreground">View and manage user accounts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">View detailed analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <GoToTopButton />
    </div>
  )
  
  // ============================================
  // RENDER MAIN CONTENT
  // ============================================
  const renderMainContent = () => {
    switch (store.currentView) {
      case 'products':
        return renderProductsPage()
      case 'dashboard':
        return renderUserDashboard()
      case 'admin':
        return renderAdminDashboard()
      default:
        return renderLandingPage()
    }
  }
  
  return (
    <>
      {renderMainContent()}
      
      {/* Cart Sidebar */}
      <Sheet open={store.isCartOpen} onOpenChange={(open) => store.isCartOpen !== open && store.toggleCart()}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-2xl">
              <ShoppingCart className="w-6 h-6" />
              Shopping Cart ({cartCount})
            </SheetTitle>
            <SheetDescription className="text-base">
              {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item(s) in your cart`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <ScrollArea className="flex-1 -mx-6 px-6">
              {store.cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                  <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
                  <Button onClick={() => { store.toggleCart(); store.setCurrentView('products') }} className="h-12 px-6 rounded-xl cursor-pointer">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {store.cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={item.product.featuredImage || JSON.parse(item.product.images)[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.product.price}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-9 h-9 rounded-lg cursor-pointer"
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-9 h-9 rounded-lg cursor-pointer"
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-9 h-9 rounded-lg text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {store.cartItems.length > 0 && (
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{cartTotal > 100 ? 'Free' : '$9.99'}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 rounded-xl cursor-pointer"
                  onClick={() => {
                    if (!store.isAuthenticated) {
                      store.openAuthModal()
                    } else {
                      store.openCheckoutModal()
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Auth Modal */}
      <Dialog open={store.isAuthModalOpen} onOpenChange={(open) => !open && store.closeAuthModal()}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to NexusShop</DialogTitle>
            <DialogDescription className="text-base">
              Sign in to your account or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={store.authModalTab} onValueChange={(v) => store.openAuthModal(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
              <TabsTrigger value="login" className="rounded-xl cursor-pointer">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl cursor-pointer">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-base font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    className="h-12 rounded-xl"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-base font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    className="h-12 rounded-xl"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl cursor-pointer">
                  Sign In
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Demo: demo@example.com / demo123
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-base font-medium">Name</Label>
                  <Input
                    id="register-name"
                    className="h-12 rounded-xl"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-base font-medium">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    className="h-12 rounded-xl"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-base font-medium">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    className="h-12 rounded-xl"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-base font-medium">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    className="h-12 rounded-xl"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl cursor-pointer">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Modal */}
      <Dialog open={store.isProductModalOpen} onOpenChange={(open) => !open && store.closeProductModal()}>
        <DialogContent className="sm:max-w-5xl rounded-3xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <img
                  src={selectedProduct.featuredImage || JSON.parse(selectedProduct.images)[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">{selectedProduct.category?.name}</p>
                  <h2 className="text-3xl font-bold">{selectedProduct.name}</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.round(selectedProduct.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {selectedProduct.averageRating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>
                
                <div>
                  <span className="text-4xl font-bold">${selectedProduct.price}</span>
                  {selectedProduct.comparePrice && (
                    <span className="ml-3 text-xl text-muted-foreground line-through">
                      ${selectedProduct.comparePrice}
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed">{selectedProduct.shortDesc || selectedProduct.description}</p>
                
                <div className="flex items-center gap-3">
                  <Badge variant={selectedProduct.quantity > 0 ? 'default' : 'destructive'} className="rounded-lg px-4 py-1.5">
                    {selectedProduct.quantity > 0 ? `In Stock (${selectedProduct.quantity})` : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 rounded-xl cursor-pointer"
                    onClick={() => {
                      handleAddToCart(selectedProduct.id)
                      store.closeProductModal()
                    }}
                    disabled={selectedProduct.quantity === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl cursor-pointer"
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                  >
                    <Heart className={cn(
                      "w-5 h-5",
                      store.wishlistItems.some(i => i.productId === selectedProduct.id) && "fill-red-500 text-red-500"
                    )} />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span>2-year warranty included</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Checkout Modal */}
      <Dialog open={store.isCheckoutModalOpen} onOpenChange={(open) => !open && store.closeCheckoutModal()}>
        <DialogContent className="sm:max-w-3xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Checkout</DialogTitle>
            <DialogDescription className="text-base">
              Complete your order
            </DialogDescription>
          </DialogHeader>
          
          {checkoutStep === 'confirmation' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Order Placed Successfully!</h3>
              <p className="text-muted-foreground text-lg mb-6">Thank you for your purchase. You'll receive an email confirmation shortly.</p>
              <Button size="lg" className="h-12 px-8 rounded-xl cursor-pointer" onClick={() => {
                store.closeCheckoutModal()
                setCheckoutStep('cart')
                store.setCurrentView('dashboard')
              }}>
                View Orders
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2">
                {['cart', 'shipping', 'payment'].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      checkoutStep === step
                        ? "bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg"
                        : i < ['cart', 'shipping', 'payment'].indexOf(checkoutStep)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
                    )}>
                      {i + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium capitalize hidden sm:inline">{step}</span>
                    {i < 2 && (
                      <div className="w-16 sm:w-24 h-0.5 bg-slate-200 dark:bg-slate-700 mx-3" />
                    )}
                  </div>
                ))}
              </div>
              
              {checkoutStep === 'cart' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Order Summary</h3>
                  <ScrollArea className="h-[200px]">
                    {store.cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-3">
                        <img
                          src={item.product.featuredImage || JSON.parse(item.product.images)[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <div className="border-t pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold">{cartTotal > 100 ? 'Free' : '$9.99'}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button size="lg" className="w-full rounded-xl cursor-pointer" onClick={() => setCheckoutStep('shipping')}>
                    Continue to Shipping
                  </Button>
                </div>
              )}
              
              {checkoutStep === 'shipping' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Billing Address</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">First Name</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.firstName}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, firstName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Last Name</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.lastName}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, lastName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Email</Label>
                      <Input
                        type="email"
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.email}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Phone</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.phone}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-base font-medium">Street Address</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.street}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, street: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">City</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.city}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, city: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">State</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.state}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, state: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">ZIP Code</Label>
                      <Input
                        className="h-12 rounded-xl"
                        value={checkoutForm.billing.zipCode}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, zipCode: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Country</Label>
                      <Select
                        value={checkoutForm.billing.country}
                        onValueChange={(v) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, country: v }
                        })}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="CAN">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 py-2">
                    <Checkbox
                      id="same-as-billing"
                      checked={checkoutForm.sameAsBilling}
                      onCheckedChange={(checked) => setCheckoutForm({
                        ...checkoutForm,
                        sameAsBilling: checked as boolean
                      })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="same-as-billing" className="cursor-pointer">Shipping address same as billing</Label>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" onClick={() => setCheckoutStep('cart')} className="rounded-xl cursor-pointer">
                      Back
                    </Button>
                    <Button size="lg" className="flex-1 rounded-xl cursor-pointer" onClick={() => setCheckoutStep('payment')}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Payment Method</h3>
                  
                  <div className="grid gap-4">
                    <div
                      className={cn(
                        "flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all",
                        checkoutForm.paymentMethod === 'credit_card' ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-slate-200 dark:border-slate-700"
                      )}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'credit_card' })}
                    >
                      <CreditCard className="w-7 h-7" />
                      <div>
                        <p className="font-bold">Credit Card</p>
                        <p className="text-sm text-muted-foreground">Pay with Visa, MasterCard, etc.</p>
                      </div>
                    </div>
                    
                    <div
                      className={cn(
                        "flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all",
                        checkoutForm.paymentMethod === 'paypal' ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-slate-200 dark:border-slate-700"
                      )}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'paypal' })}
                    >
                      <Globe className="w-7 h-7" />
                      <div>
                        <p className="font-bold">PayPal</p>
                        <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Coupon Code</Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter coupon code"
                        className="h-12 rounded-xl"
                        value={checkoutForm.couponCode}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, couponCode: e.target.value })}
                      />
                      <Button variant="outline" size="lg" className="rounded-xl cursor-pointer">Apply</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between text-2xl font-bold mb-6">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" size="lg" onClick={() => setCheckoutStep('shipping')} className="rounded-xl cursor-pointer">
                        Back
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 rounded-xl cursor-pointer"
                        onClick={handleCheckout}
                      >
                        Place Order
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Plan Selection Dialog */}
      <AlertDialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Subscribe to {selectedPlan?.name} Plan</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You're about to subscribe to the {selectedPlan?.name} plan at ${selectedPlan?.price}/{selectedPlan?.interval.toLowerCase().replace('ly', '')}.
              This feature would normally redirect to Stripe checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 cursor-pointer" onClick={() => setSelectedPlan(null)}>
              Proceed to Checkout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
