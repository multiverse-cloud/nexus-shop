import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
  avatar: string | null
  phone: string | null
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDesc: string | null
  price: number
  comparePrice: number | null
  categoryId: string
  quantity: number
  images: string
  featuredImage: string | null
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK'
  isFeatured: boolean
  averageRating: number
  reviewCount: number
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  image: string | null
  sku: string
  price: number
  quantity: number
  total: number
}

export interface Plan {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  interval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME'
  features: string
  isFeatured: boolean
  maxProducts: number | null
  maxOrders: number | null
  maxUsers: number | null
  storageLimit: number | null
}

export interface Subscription {
  id: string
  planId: string
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'TRIALING' | 'PAUSED'
  currentPeriodStart: string
  currentPeriodEnd: string
  plan: Plan
}

export interface Notification {
  id: string
  type: 'ORDER' | 'PAYMENT' | 'SUBSCRIPTION' | 'SYSTEM' | 'PROMOTION'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  avatar: string | null
  content: string
  rating: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string | null
  comment: string
  isVerified: boolean
  user: { name: string | null }
  createdAt: string
}

// UI State Types
type ViewMode = 'landing' | 'products' | 'dashboard' | 'admin'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  
  // UI State
  currentView: ViewMode
  isCartOpen: boolean
  isAuthModalOpen: boolean
  authModalTab: 'login' | 'register'
  isProductModalOpen: boolean
  selectedProductId: string | null
  isCheckoutModalOpen: boolean
  searchQuery: string
  
  // Data
  products: Product[]
  categories: Category[]
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  orders: Order[]
  subscription: Subscription | null
  notifications: Notification[]
  plans: Plan[]
  testimonials: Testimonial[]
  faqs: FAQ[]
  
  // Loading States
  isLoading: boolean
  isCartLoading: boolean
  isProductsLoading: boolean
  
  // Admin Stats
  adminStats: {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalUsers: number
    revenueGrowth: number
    ordersGrowth: number
    recentOrders: Order[]
    revenueData: { date: string; revenue: number }[]
  } | null
  
  // Auth Actions
  setUser: (user: User | null) => void
  logout: () => void
  
  // UI Actions
  setCurrentView: (view: ViewMode) => void
  toggleCart: () => void
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
  openProductModal: (productId: string) => void
  closeProductModal: () => void
  openCheckoutModal: () => void
  closeCheckoutModal: () => void
  setSearchQuery: (query: string) => void
  
  // Data Actions
  setProducts: (products: Product[]) => void
  setCategories: (categories: Category[]) => void
  setCartItems: (items: CartItem[]) => void
  addToCart: (item: CartItem) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  setWishlistItems: (items: WishlistItem[]) => void
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  setOrders: (orders: Order[]) => void
  setSubscription: (subscription: Subscription | null) => void
  setNotifications: (notifications: Notification[]) => void
  markNotificationRead: (id: string) => void
  setPlans: (plans: Plan[]) => void
  setTestimonials: (testimonials: Testimonial[]) => void
  setFAQs: (faqs: FAQ[]) => void
  setAdminStats: (stats: AppState['adminStats']) => void
  
  // Loading Actions
  setLoading: (loading: boolean) => void
  setCartLoading: (loading: boolean) => void
  setProductsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Auth State
      user: null,
      isAuthenticated: false,
      
      // Initial UI State
      currentView: 'landing',
      isCartOpen: false,
      isAuthModalOpen: false,
      authModalTab: 'login',
      isProductModalOpen: false,
      selectedProductId: null,
      isCheckoutModalOpen: false,
      searchQuery: '',
      
      // Initial Data
      products: [],
      categories: [],
      cartItems: [],
      wishlistItems: [],
      orders: [],
      subscription: null,
      notifications: [],
      plans: [],
      testimonials: [],
      faqs: [],
      
      // Initial Loading
      isLoading: false,
      isCartLoading: false,
      isProductsLoading: false,
      
      // Admin Stats
      adminStats: null,
      
      // Auth Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        currentView: user?.role === 'ADMIN' ? 'admin' : user ? 'dashboard' : 'landing'
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        currentView: 'landing',
        cartItems: [],
        wishlistItems: [],
        orders: [],
        subscription: null,
        notifications: []
      }),
      
      // UI Actions
      setCurrentView: (view) => set({ currentView: view }),
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      openAuthModal: (tab = 'login') => set({ 
        isAuthModalOpen: true, 
        authModalTab: tab 
      }),
      
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      
      openProductModal: (productId) => set({ 
        isProductModalOpen: true, 
        selectedProductId: productId 
      }),
      
      closeProductModal: () => set({ 
        isProductModalOpen: false, 
        selectedProductId: null 
      }),
      
      openCheckoutModal: () => set({ isCheckoutModalOpen: true, isCartOpen: false }),
      
      closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Data Actions
      setProducts: (products) => set({ products }),
      
      setCategories: (categories) => set({ categories }),
      
      setCartItems: (items) => set({ cartItems: items }),
      
      addToCart: (item) => set((state) => {
        const existing = state.cartItems.find(i => i.productId === item.productId)
        if (existing) {
          return {
            cartItems: state.cartItems.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        return { cartItems: [...state.cartItems, item] }
      }),
      
      updateCartItemQuantity: (id, quantity) => set((state) => ({
        cartItems: quantity > 0
          ? state.cartItems.map(i => i.id === id ? { ...i, quantity } : i)
          : state.cartItems.filter(i => i.id !== id)
      })),
      
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(i => i.id !== id)
      })),
      
      clearCart: () => set({ cartItems: [] }),
      
      setWishlistItems: (items) => set({ wishlistItems: items }),
      
      addToWishlist: (item) => set((state) => {
        const exists = state.wishlistItems.some(i => i.productId === item.productId)
        if (exists) return state
        return { wishlistItems: [...state.wishlistItems, item] }
      }),
      
      removeFromWishlist: (productId) => set((state) => ({
        wishlistItems: state.wishlistItems.filter(i => i.productId !== productId)
      })),
      
      setOrders: (orders) => set({ orders }),
      
      setSubscription: (subscription) => set({ subscription }),
      
      setNotifications: (notifications) => set({ notifications }),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      })),
      
      setPlans: (plans) => set({ plans }),
      
      setTestimonials: (testimonials) => set({ testimonials }),
      
      setFAQs: (faqs) => set({ faqs }),
      
      setAdminStats: (stats) => set({ adminStats: stats }),
      
      // Loading Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCartLoading: (loading) => set({ isCartLoading: loading }),
      
      setProductsLoading: (loading) => set({ isProductsLoading: loading }),
    }),
    {
      name: 'saas-ecommerce-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentView: state.currentView,
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
)

// Selectors
export const selectCartTotal = (state: AppState) =>
  state.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

export const selectCartCount = (state: AppState) =>
  state.cartItems.reduce((count, item) => count + item.quantity, 0)

export const selectUnreadNotifications = (state: AppState) =>
  state.notifications.filter(n => !n.isRead).length

export const selectIsInWishlist = (productId: string) => (state: AppState) =>
  state.wishlistItems.some(item => item.productId === productId)
