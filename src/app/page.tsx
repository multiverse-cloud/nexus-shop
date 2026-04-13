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
// ICONS COMPONENT
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
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by teams at world-leading companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl font-bold text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-pointer"
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
// FEATURE CARD
// ============================================
const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
)

// ============================================
// PRICING CARD
// ============================================
const PricingCard = ({ plan, onSelect }: { plan: Plan; onSelect: () => void }) => {
  const features = JSON.parse(plan.features)
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={cn(
        "relative",
        plan.isFeatured && "lg:-mt-4 lg:mb-4"
      )}
    >
      {plan.isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-emerald-500 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      <Card className={cn(
        "relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800",
        plan.isFeatured && "border-purple-500 shadow-xl shadow-purple-500/10"
      )}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription className="text-base">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/{plan.interval.toLowerCase().replace('ly', '')}</span>
            {plan.comparePrice && (
              <span className="ml-2 text-lg text-muted-foreground line-through">${plan.comparePrice}</span>
            )}
          </div>
          <ul className="space-y-3 text-left mb-6">
            {features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onSelect}
            className={cn(
              "w-full",
              plan.isFeatured
                ? "bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600"
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
// TESTIMONIAL CARD
// ============================================
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 h-full">
    <CardContent className="pt-6">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-emerald-500 text-white">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// ============================================
// PRODUCT CARD
// ============================================
const ProductCard = ({ product, onQuickView, onAddToCart, onToggleWishlist, isInWishlist }: {
  product: Product
  onQuickView: () => void
  onAddToCart: () => void
  onToggleWishlist: () => void
  isInWishlist: boolean
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.featuredImage || JSON.parse(product.images)[0]}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={onQuickView}>
            <Eye className="w-4 h-4 mr-1" /> Quick View
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900"
          onClick={onToggleWishlist}
        >
          <Heart className={cn("w-5 h-5", isInWishlist && "fill-red-500 text-red-500")} />
        </Button>
        {product.comparePrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
          </Badge>
        )}
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
        <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{product.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">${product.price}</span>
            {product.comparePrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">${product.comparePrice}</span>
            )}
          </div>
          <Button size="sm" onClick={onAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-1" /> Add
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
  // RENDER LANDING PAGE
  // ============================================
  const renderLandingPage = () => (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="#" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">
                NexusShop
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <button onClick={() => store.setCurrentView('landing')} className="text-sm font-medium hover:text-purple-500 transition-colors">
                  Home
                </button>
                <button onClick={() => store.setCurrentView('products')} className="text-sm font-medium hover:text-purple-500 transition-colors">
                  Products
                </button>
                <a href="#pricing" className="text-sm font-medium hover:text-purple-500 transition-colors">Pricing</a>
                <a href="#testimonials" className="text-sm font-medium hover:text-purple-500 transition-colors">Testimonials</a>
                <a href="#faq" className="text-sm font-medium hover:text-purple-500 transition-colors">FAQ</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                  value={store.searchQuery}
                  onChange={(e) => store.setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => store.toggleCart()}>
                <div className="relative">
                  <ShoppingCart />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-purple-500">
                      {cartCount}
                    </Badge>
                  )}
                </div>
              </Button>
              
              {store.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={store.user?.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-emerald-500 text-white text-sm">
                          {store.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-semibold">{store.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{store.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => store.setCurrentView('dashboard')}>
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </DropdownMenuItem>
                    {store.user?.role === 'ADMIN' && (
                      <DropdownMenuItem onClick={() => store.setCurrentView('admin')}>
                        <Settings className="w-4 h-4 mr-2" /> Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => store.openAuthModal('login')}>
                  <User className="w-4 h-4 mr-2" /> Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-16"
          >
            <div className="p-4">
              <Input
                placeholder="Search products..."
                className="mb-4"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
              <nav className="space-y-4">
                <button onClick={() => { store.setCurrentView('landing'); setIsMobileMenuOpen(false) }} className="block w-full text-left py-2 font-medium">
                  Home
                </button>
                <button onClick={() => { store.setCurrentView('products'); setIsMobileMenuOpen(false) }} className="block w-full text-left py-2 font-medium">
                  Products
                </button>
                <a href="#pricing" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                <a href="#testimonials" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
                <a href="#faq" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)", backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-purple-500/10 text-purple-500 border-purple-500/20">
                <Sparkles className="w-3 h-3 mr-1" /> New Release
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Build Your <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Digital Empire</span> With Us
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                The ultimate SaaS + Ecommerce platform that combines powerful subscription management with a premium shopping experience. Start scaling your business today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600" onClick={() => store.isAuthenticated ? store.setCurrentView('products') : store.openAuthModal('register')}>
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600">
                  <Play className="w-4 h-4 mr-2" /> Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-emerald-500 text-white text-xs">
                        {String.fromCharCode(64 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by 10,000+ users</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/80 dark:bg-slate-800/80">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                        </div>
                        <span className="text-sm font-medium">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold">$48.5K</p>
                      <p className="text-xs text-emerald-500">+12.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-slate-800/80">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium">Customers</span>
                      </div>
                      <p className="text-2xl font-bold">2,847</p>
                      <p className="text-xs text-emerald-500">+8.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-slate-800/80">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-sm font-medium">Orders</span>
                      </div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-xs text-emerald-500">+15.3% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-slate-800/80">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-rose-500" />
                        </div>
                        <span className="text-sm font-medium">Subscribers</span>
                      </div>
                      <p className="text-2xl font-bold">847</p>
                      <p className="text-xs text-emerald-500">+5.7% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trusted Brands */}
      <TrustedBrands />
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you build, grow, and scale your business with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized performance with instant page loads and real-time updates. Your customers will love the experience."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Payments"
              description="Industry-standard encryption and PCI compliance. Accept payments securely from anywhere in the world."
            />
            <FeatureCard
              icon={Globe}
              title="Global Scale"
              description="Built on modern infrastructure that scales automatically. Handle millions of users without breaking a sweat."
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Support"
              description="Round-the-clock customer support with live chat, email, and phone. We're always here to help."
            />
            <FeatureCard
              icon={Award}
              title="Premium Quality"
              description="Enterprise-grade features with consumer-friendly pricing. Get the best of both worlds."
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Deep insights into your business with real-time dashboards and comprehensive reporting tools."
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2" variant="secondary">Products</Badge>
              <h2 className="text-3xl font-bold">Featured Products</h2>
            </div>
            <Button variant="outline" onClick={() => store.setCurrentView('products')}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {store.products.filter(p => p.isFeatured).slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
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
      <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {store.plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
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
      <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience.
            </p>
          </div>
          
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {store.testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {store.faqs.map((faq, i) => (
                <AccordionItem key={faq.id} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Subscribe to our newsletter for the latest updates, tips, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-white text-slate-900 hover:bg-slate-100">
                Subscribe <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4" variant="secondary">Contact Us</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Get in <span className="bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@nexusshop.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">123 Business Ave, Suite 100, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {contactFormSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">We'll get back to you soon.</p>
                    <Button className="mt-4" onClick={() => setContactFormSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">NexusShop</h3>
              <p className="text-sm text-slate-400 mb-4">
                The ultimate SaaS + Ecommerce platform for modern businesses.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <Button key={social} variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Globe className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-slate-800 mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2024 NexusShop. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
  
  // ============================================
  // RENDER PRODUCTS PAGE
  // ============================================
  const renderProductsPage = () => (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => store.setCurrentView('landing')} className="mb-2">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Home
            </Button>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-muted-foreground">{filteredProducts.length} products found</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Categories
                    </Button>
                    {store.categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
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
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => store.openProductModal(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  isInWishlist={store.wishlistItems.some(i => i.productId === product.id)}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
  // ============================================
  // RENDER USER DASHBOARD
  // ============================================
  const renderUserDashboard = () => (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {store.user?.name}!</p>
          </div>
          <Button variant="outline" onClick={() => store.setCurrentView('landing')}>
            Back to Home
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <p className="text-3xl font-bold">{store.orders.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="text-sm font-medium">Wishlist Items</span>
                  </div>
                  <p className="text-3xl font-bold">{store.wishlistItems.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium">Cart Items</span>
                  </div>
                  <p className="text-3xl font-bold">{store.cartItems.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium">Notifications</span>
                  </div>
                  <p className="text-3xl font-bold">{unreadNotifications}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {store.orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-8 h-8 mx-auto mb-2" />
                      <p>No orders yet</p>
                      <Button className="mt-4" onClick={() => store.setCurrentView('products')}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {store.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {store.notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-3">
                        {store.notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors",
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
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
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
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {store.orders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p>Start shopping to see your orders here.</p>
                    <Button className="mt-4" onClick={() => store.setCurrentView('products')}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {store.orders.map((order) => (
                      <Card key={order.id} className="bg-slate-100 dark:bg-slate-800">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                              <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'outline'}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={item.image || '/placeholder.png'}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${item.total.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item(s)
                            </p>
                            <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
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
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {store.wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p>Save items you love by clicking the heart icon.</p>
                    <Button className="mt-4" onClick={() => store.setCurrentView('products')}>
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
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                {store.subscription ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{store.subscription.plan.name} Plan</h3>
                        <Badge>{store.subscription.status}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <p className="text-sm text-muted-foreground">Current Period</p>
                        <p className="font-medium">
                          {new Date(store.subscription.currentPeriodStart).toLocaleDateString()} - {new Date(store.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <p className="text-sm text-muted-foreground">Next Billing Date</p>
                        <p className="font-medium">
                          {new Date(store.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline">Manage Subscription</Button>
                      <Button variant="outline" className="text-red-500 hover:text-red-600">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Crown className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No active subscription</h3>
                    <p>Subscribe to a plan to unlock premium features.</p>
                    <Button className="mt-4" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault()
                  // Handle profile update
                }}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settings-name">Name</Label>
                      <Input
                        id="settings-name"
                        defaultValue={store.user?.name || ''}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings-email">Email</Label>
                      <Input
                        id="settings-email"
                        type="email"
                        defaultValue={store.user?.email || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings-phone">Phone</Label>
                      <Input
                        id="settings-phone"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings-role">Role</Label>
                      <Input
                        id="settings-role"
                        defaultValue={store.user?.role || ''}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
  
  // ============================================
  // RENDER ADMIN DASHBOARD
  // ============================================
  const renderAdminDashboard = () => (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => store.setCurrentView('landing')}>
              View Site
            </Button>
            <Button onClick={() => store.setCurrentView('products')}>
              <Store className="w-4 h-4 mr-2" /> Manage Products
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Revenue</p>
                  <p className="text-3xl font-bold">${store.adminStats?.totalRevenue.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-purple-100 mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +{store.adminStats?.revenueGrowth || 0}% from last month
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Total Orders</p>
                  <p className="text-3xl font-bold">{store.adminStats?.totalOrders || 0}</p>
                  <p className="text-sm text-emerald-100 mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +{store.adminStats?.ordersGrowth || 0}% from last month
                  </p>
                </div>
                <Package className="w-12 h-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Total Products</p>
                  <p className="text-3xl font-bold">{store.adminStats?.totalProducts || 0}</p>
                  <p className="text-sm text-amber-100 mt-1">Active listings</p>
                </div>
                <Store className="w-12 h-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100">Total Users</p>
                  <p className="text-3xl font-bold">{store.adminStats?.totalUsers || 0}</p>
                  <p className="text-sm text-rose-100 mt-1">Registered users</p>
                </div>
                <Users className="w-12 h-12 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={store.adminStats?.revenueData || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <RechartsTooltip />
                    <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Package className="w-4 h-4 mr-2" /> Add New Product
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" /> Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Tag className="w-4 h-4 mr-2" /> Create Coupon
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" /> View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" /> Site Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card className="mt-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Payment</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {store.adminStats?.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4">
                        <span className="font-medium">{order.orderNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'outline'}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
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
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({cartCount})
            </SheetTitle>
            <SheetDescription>
              {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item(s) in your cart`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <ScrollArea className="flex-1 -mx-6 px-6">
              {store.cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button onClick={() => { store.toggleCart(); store.setCurrentView('products') }}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {store.cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        src={item.product.featuredImage || JSON.parse(item.product.images)[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.product.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-8 h-8"
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-8 h-8"
                            onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {store.cartItems.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{cartTotal > 100 ? 'Free' : '$9.99'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to NexusShop</DialogTitle>
            <DialogDescription>
              Sign in to your account or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={store.authModalTab} onValueChange={(v) => store.openAuthModal(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Demo: demo@example.com / demo123
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Modal */}
      <Dialog open={store.isProductModalOpen} onOpenChange={(open) => !open && store.closeProductModal()}>
        <DialogContent className="sm:max-w-4xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedProduct.featuredImage || JSON.parse(selectedProduct.images)[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{selectedProduct.category?.name}</p>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.round(selectedProduct.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedProduct.averageRating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>
                
                <div>
                  <span className="text-3xl font-bold">${selectedProduct.price}</span>
                  {selectedProduct.comparePrice && (
                    <span className="ml-2 text-lg text-muted-foreground line-through">
                      ${selectedProduct.comparePrice}
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground">{selectedProduct.shortDesc || selectedProduct.description}</p>
                
                <div className="flex items-center gap-2">
                  <Badge variant={selectedProduct.quantity > 0 ? 'default' : 'destructive'}>
                    {selectedProduct.quantity > 0 ? `In Stock (${selectedProduct.quantity})` : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600"
                    onClick={() => {
                      handleAddToCart(selectedProduct.id)
                      store.closeProductModal()
                    }}
                    disabled={selectedProduct.quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                  >
                    <Heart className={cn(
                      "w-5 h-5",
                      store.wishlistItems.some(i => i.productId === selectedProduct.id) && "fill-red-500 text-red-500"
                    )} />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="w-4 h-4" />
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your order
            </DialogDescription>
          </DialogHeader>
          
          {checkoutStep === 'confirmation' ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Order Placed Successfully!</h3>
              <p className="text-muted-foreground mb-4">Thank you for your purchase. You'll receive an email confirmation shortly.</p>
              <Button onClick={() => {
                store.closeCheckoutModal()
                setCheckoutStep('cart')
                store.setCurrentView('dashboard')
              }}>
                View Orders
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                {['cart', 'shipping', 'payment'].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      checkoutStep === step
                        ? "bg-purple-500 text-white"
                        : i < ['cart', 'shipping', 'payment'].indexOf(checkoutStep)
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700"
                    )}>
                      {i + 1}
                    </div>
                    <span className="ml-2 text-sm capitalize hidden sm:inline">{step}</span>
                    {i < 2 && (
                      <div className="w-12 sm:w-24 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2" />
                    )}
                  </div>
                ))}
              </div>
              
              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Summary</h3>
                  <ScrollArea className="h-[200px]">
                    {store.cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-2">
                        <img
                          src={item.product.featuredImage || JSON.parse(item.product.images)[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{cartTotal > 100 ? 'Free' : '$9.99'}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={() => setCheckoutStep('shipping')}>
                    Continue to Shipping
                  </Button>
                </div>
              )}
              
              {checkoutStep === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Billing Address</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={checkoutForm.billing.firstName}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, firstName: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={checkoutForm.billing.lastName}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, lastName: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={checkoutForm.billing.email}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={checkoutForm.billing.phone}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Street Address</Label>
                      <Input
                        value={checkoutForm.billing.street}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, street: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        value={checkoutForm.billing.city}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, city: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={checkoutForm.billing.state}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, state: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>ZIP Code</Label>
                      <Input
                        value={checkoutForm.billing.zipCode}
                        onChange={(e) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, zipCode: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select
                        value={checkoutForm.billing.country}
                        onValueChange={(v) => setCheckoutForm({
                          ...checkoutForm,
                          billing: { ...checkoutForm.billing, country: v }
                        })}
                      >
                        <SelectTrigger>
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
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="same-as-billing"
                      checked={checkoutForm.sameAsBilling}
                      onCheckedChange={(checked) => setCheckoutForm({
                        ...checkoutForm,
                        sameAsBilling: checked as boolean
                      })}
                    />
                    <Label htmlFor="same-as-billing">Shipping address same as billing</Label>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCheckoutStep('cart')}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={() => setCheckoutStep('payment')}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Method</h3>
                  
                  <div className="grid gap-4">
                    <div
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer",
                        checkoutForm.paymentMethod === 'credit_card' && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      )}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'credit_card' })}
                    >
                      <CreditCard className="w-6 h-6" />
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-sm text-muted-foreground">Pay with Visa, MasterCard, etc.</p>
                      </div>
                    </div>
                    
                    <div
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer",
                        checkoutForm.paymentMethod === 'paypal' && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      )}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'paypal' })}
                    >
                      <Globe className="w-6 h-6" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Coupon Code</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={checkoutForm.couponCode}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, couponCode: e.target.value })}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Total</span>
                      <span>${(cartTotal + (cartTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setCheckoutStep('shipping')}>
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Subscribe to {selectedPlan?.name} Plan</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to subscribe to the {selectedPlan?.name} plan at ${selectedPlan?.price}/{selectedPlan?.interval.toLowerCase().replace('ly', '')}.
              This feature would normally redirect to Stripe checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setSelectedPlan(null)}>
              Proceed to Checkout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Tag icon component
const Tag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" />
    <circle cx="7" cy="7" r="1.5" />
  </svg>
)
