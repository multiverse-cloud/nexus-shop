'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { 
  UserRole, 
  ProductStatus, 
  OrderStatus, 
  PaymentStatus,
  SubscriptionStatus,
  BillingInterval,
  CouponType,
  LeadStatus,
  NotificationType,
  TransactionStatus,
  TransactionType,
  PostStatus
} from '@prisma/client'

// ============================================
// TYPES
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface RegisterInput {
  email: string
  password: string
  name?: string
}

interface LoginInput {
  email: string
  password: string
}

interface ProductInput {
  name: string
  slug: string
  sku: string
  description: string
  shortDesc?: string
  price: number
  comparePrice?: number
  costPrice?: number
  categoryId: string
  quantity?: number
  images?: string
  featuredImage?: string
  status?: ProductStatus
  isFeatured?: boolean
  isDigital?: boolean
  attributes?: string
  tags?: string
  metaTitle?: string
  metaDesc?: string
}

interface CartItemInput {
  productId: string
  variantId?: string
  quantity: number
}

interface OrderInput {
  billingFirstName: string
  billingLastName: string
  billingEmail: string
  billingPhone?: string
  billingCompany?: string
  billingStreet: string
  billingApartment?: string
  billingCity: string
  billingState: string
  billingZipCode: string
  billingCountry: string
  shippingFirstName?: string
  shippingLastName?: string
  shippingPhone?: string
  shippingCompany?: string
  shippingStreet?: string
  shippingApartment?: string
  shippingCity?: string
  shippingState?: string
  shippingZipCode?: string
  shippingCountry?: string
  couponCode?: string
  customerNotes?: string
}

interface ContactInput {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function encrypt(payload: Record<string, unknown>) {
  const secret = new TextEncoder().encode(JWT_SECRET)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

async function decrypt(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) return null
  
  const payload = await decrypt(token)
  if (!payload || !payload.userId) return null
  
  const user = await db.user.findUnique({
    where: { id: payload.userId as string },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      phone: true,
      isActive: true,
      createdAt: true,
    }
  })
  
  return user
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// ============================================
// AUTHENTICATION ACTIONS
// ============================================

export async function register(input: RegisterInput): Promise<ActionResult> {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: input.email.toLowerCase() }
    })
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }
    
    const hashedPassword = await hash(input.password, 12)
    
    const user = await db.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
        name: input.name || null,
        role: 'CUSTOMER',
      }
    })
    
    const token = await encrypt({ userId: user.id, role: user.role })
    
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    revalidatePath('/')
    
    return { 
      success: true, 
      data: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Failed to create account' }
  }
}

export async function login(input: LoginInput): Promise<ActionResult> {
  try {
    const user = await db.user.findUnique({
      where: { email: input.email.toLowerCase() }
    })
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' }
    }
    
    const isValid = await compare(input.password, user.password)
    
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    const token = await encrypt({ userId: user.id, role: user.role })
    
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    revalidatePath('/')
    
    return { 
      success: true, 
      data: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Failed to login' }
  }
}

export async function logout(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Failed to logout' }
  }
}

export async function getCurrentSession(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Session error:', error)
    return { success: false, error: 'Failed to get session' }
  }
}

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts(options?: {
  categoryId?: string
  status?: ProductStatus
  isFeatured?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    const where: Record<string, unknown> = {}
    
    if (options?.categoryId) {
      where.categoryId = options.categoryId
    }
    
    if (options?.status) {
      where.status = options.status
    }
    
    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured
    }
    
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search } },
        { description: { contains: options.search } }
      ]
    }
    
    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    })
    
    return products
  } catch (error) {
    console.error('Get products error:', error)
    return []
  }
}

export async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    })
    
    return product
  } catch (error) {
    console.error('Get product error:', error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    })
    
    return product
  } catch (error) {
    console.error('Get product by slug error:', error)
    return null
  }
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }
    
    const product = await db.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        sku: input.sku,
        description: input.description,
        shortDesc: input.shortDesc,
        price: input.price,
        comparePrice: input.comparePrice,
        costPrice: input.costPrice,
        categoryId: input.categoryId,
        quantity: input.quantity || 0,
        images: input.images || '[]',
        featuredImage: input.featuredImage,
        status: input.status || 'DRAFT',
        isFeatured: input.isFeatured || false,
        isDigital: input.isDigital || false,
        attributes: input.attributes,
        tags: input.tags,
        metaTitle: input.metaTitle,
        metaDesc: input.metaDesc,
      }
    })
    
    revalidatePath('/')
    revalidatePath('/products')
    
    return { success: true, data: product }
  } catch (error) {
    console.error('Create product error:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }
    
    const product = await db.product.update({
      where: { id },
      data: input
    })
    
    revalidatePath('/')
    revalidatePath('/products')
    
    return { success: true, data: product }
  } catch (error) {
    console.error('Update product error:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }
    
    await db.product.delete({ where: { id } })
    
    revalidatePath('/')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

// ============================================
// CATEGORY ACTIONS
// ============================================

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        children: true,
      },
      orderBy: { sortOrder: 'asc' }
    })
    
    return categories
  } catch (error) {
    console.error('Get categories error:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          include: { variants: true }
        }
      }
    })
    
    return category
  } catch (error) {
    console.error('Get category error:', error)
    return null
  }
}

// ============================================
// CART ACTIONS
// ============================================

export async function getCart() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return []
    }
    
    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { variants: true, category: true }
        }
      }
    })
    
    return cartItems
  } catch (error) {
    console.error('Get cart error:', error)
    return []
  }
}

export async function addToCart(input: CartItemInput): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login to add items to cart' }
    }
    
    const product = await db.product.findUnique({
      where: { id: input.productId }
    })
    
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    
    if (product.quantity < input.quantity) {
      return { success: false, error: 'Not enough stock' }
    }
    
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: input.productId,
        variantId: input.variantId || null
      }
    })
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + input.quantity
      
      if (product.quantity < newQuantity) {
        return { success: false, error: 'Not enough stock' }
      }
      
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      await db.cartItem.create({
        data: {
          userId: user.id,
          productId: input.productId,
          variantId: input.variantId,
          quantity: input.quantity
        }
      })
    }
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

export async function updateCartItem(id: string, quantity: number): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id } })
    } else {
      await db.cartItem.update({
        where: { id },
        data: { quantity }
      })
    }
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Update cart error:', error)
    return { success: false, error: 'Failed to update cart' }
  }
}

export async function removeFromCart(id: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.cartItem.delete({ where: { id } })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
}

export async function clearCart(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.cartItem.deleteMany({ where: { userId: user.id } })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Clear cart error:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

// ============================================
// ORDER ACTIONS
// ============================================

export async function getOrders() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return []
    }
    
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return orders
  } catch (error) {
    console.error('Get orders error:', error)
    return []
  }
}

export async function getOrder(id: string) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return null
    }
    
    const order = await db.order.findFirst({
      where: { id, userId: user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    })
    
    return order
  } catch (error) {
    console.error('Get order error:', error)
    return null
  }
}

export async function createOrder(input: OrderInput): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login to place an order' }
    }
    
    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true
      }
    })
    
    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }
    
    // Calculate totals
    let subtotal = 0
    const orderItems = cartItems.map(item => {
      const price = item.product.price
      const total = price * item.quantity
      subtotal += total
      
      return {
        productId: item.productId,
        name: item.product.name,
        image: item.product.featuredImage,
        sku: item.product.sku,
        price,
        quantity: item.quantity,
        total,
        variantInfo: item.variantId || null
      }
    })
    
    // Check for coupon
    let discount = 0
    if (input.couponCode) {
      const coupon = await db.coupon.findFirst({
        where: {
          code: input.couponCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      })
      
      if (coupon) {
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (coupon.value / 100)
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount)
          }
        } else if (coupon.type === 'FIXED') {
          discount = coupon.value
        }
        
        await db.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } }
        })
      }
    }
    
    const tax = subtotal * 0.1 // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shippingCost - discount
    
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        
        billingFirstName: input.billingFirstName,
        billingLastName: input.billingLastName,
        billingEmail: input.billingEmail,
        billingPhone: input.billingPhone,
        billingCompany: input.billingCompany,
        billingStreet: input.billingStreet,
        billingApartment: input.billingApartment,
        billingCity: input.billingCity,
        billingState: input.billingState,
        billingZipCode: input.billingZipCode,
        billingCountry: input.billingCountry,
        
        shippingFirstName: input.shippingFirstName || input.billingFirstName,
        shippingLastName: input.shippingLastName || input.billingLastName,
        shippingPhone: input.shippingPhone || input.billingPhone,
        shippingCompany: input.shippingCompany || input.billingCompany,
        shippingStreet: input.shippingStreet || input.billingStreet,
        shippingApartment: input.shippingApartment || input.billingApartment,
        shippingCity: input.shippingCity || input.billingCity,
        shippingState: input.shippingState || input.billingState,
        shippingZipCode: input.shippingZipCode || input.billingZipCode,
        shippingCountry: input.shippingCountry || input.billingCountry,
        
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        
        couponCode: input.couponCode,
        customerNotes: input.customerNotes,
        
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    })
    
    // Update inventory
    for (const item of cartItems) {
      await db.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } }
      })
    }
    
    // Clear cart
    await db.cartItem.deleteMany({ where: { userId: user.id } })
    
    // Create notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'ORDER',
        title: 'Order Placed Successfully',
        message: `Your order ${order.orderNumber} has been placed successfully.`,
        data: JSON.stringify({ orderId: order.id })
      }
    })
    
    revalidatePath('/')
    
    return { success: true, data: order }
  } catch (error) {
    console.error('Create order error:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }
    
    const order = await db.order.update({
      where: { id },
      data: { 
        status,
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() })
      }
    })
    
    // Create notification for customer
    await db.notification.create({
      data: {
        userId: order.userId,
        type: 'ORDER',
        title: 'Order Status Updated',
        message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
        data: JSON.stringify({ orderId: order.id, status })
      }
    })
    
    revalidatePath('/')
    
    return { success: true, data: order }
  } catch (error) {
    console.error('Update order status error:', error)
    return { success: false, error: 'Failed to update order status' }
  }
}

// ============================================
// WISHLIST ACTIONS
// ============================================

export async function getWishlist() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return []
    }
    
    const wishlist = await db.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true, variants: true }
        }
      }
    })
    
    return wishlist
  } catch (error) {
    console.error('Get wishlist error:', error)
    return []
  }
}

export async function addToWishlist(productId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login to add to wishlist' }
    }
    
    const existing = await db.wishlistItem.findFirst({
      where: { userId: user.id, productId }
    })
    
    if (existing) {
      return { success: false, error: 'Item already in wishlist' }
    }
    
    await db.wishlistItem.create({
      data: {
        userId: user.id,
        productId
      }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return { success: false, error: 'Failed to add to wishlist' }
  }
}

export async function removeFromWishlist(productId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.wishlistItem.deleteMany({
      where: { userId: user.id, productId }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return { success: false, error: 'Failed to remove from wishlist' }
  }
}

// ============================================
// SUBSCRIPTION ACTIONS
// ============================================

export async function getPlans() {
  try {
    const plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    
    return plans
  } catch (error) {
    console.error('Get plans error:', error)
    return []
  }
}

export async function getSubscription() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return null
    }
    
    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
      include: { plan: true }
    })
    
    return subscription
  } catch (error) {
    console.error('Get subscription error:', error)
    return null
  }
}

export async function subscribeToPlan(planId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login to subscribe' }
    }
    
    const plan = await db.plan.findUnique({ where: { id: planId } })
    
    if (!plan) {
      return { success: false, error: 'Plan not found' }
    }
    
    const existingSubscription = await db.subscription.findUnique({
      where: { userId: user.id }
    })
    
    const now = new Date()
    let periodEnd = new Date()
    
    switch (plan.interval) {
      case 'MONTHLY':
        periodEnd.setMonth(periodEnd.getMonth() + 1)
        break
      case 'QUARTERLY':
        periodEnd.setMonth(periodEnd.getMonth() + 3)
        break
      case 'YEARLY':
        periodEnd.setFullYear(periodEnd.getFullYear() + 1)
        break
      case 'LIFETIME':
        periodEnd.setFullYear(periodEnd.getFullYear() + 100)
        break
    }
    
    if (existingSubscription) {
      await db.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false
        }
      })
    } else {
      await db.subscription.create({
        data: {
          userId: user.id,
          planId,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd
        }
      })
    }
    
    // Create transaction record
    await db.transaction.create({
      data: {
        subscriptionId: existingSubscription?.id,
        amount: plan.price,
        currency: 'USD',
        status: 'COMPLETED',
        type: 'SUBSCRIPTION',
        description: `Subscription to ${plan.name}`
      }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Subscribe error:', error)
    return { success: false, error: 'Failed to subscribe' }
  }
}

export async function cancelSubscription(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    const subscription = await db.subscription.findUnique({
      where: { userId: user.id }
    })
    
    if (!subscription) {
      return { success: false, error: 'No active subscription' }
    }
    
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}

// ============================================
// CONTACT & NEWSLETTER ACTIONS
// ============================================

export async function submitContactForm(input: ContactInput): Promise<ActionResult> {
  try {
    const lead = await db.contactLead.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        subject: input.subject,
        message: input.message,
        source: 'contact_form',
        status: 'NEW'
      }
    })
    
    return { success: true, data: lead }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'Failed to submit form' }
  }
}

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  try {
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (existing) {
      if (existing.isActive) {
        return { success: false, error: 'Already subscribed' }
      }
      
      await db.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { 
          isActive: true, 
          subscribedAt: new Date(),
          unsubscribedAt: null 
        }
      })
      
      return { success: true }
    }
    
    await db.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        isActive: true
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return { success: false, error: 'Failed to subscribe' }
  }
}

export async function unsubscribeNewsletter(email: string): Promise<ActionResult> {
  try {
    await db.newsletterSubscriber.update({
      where: { email: email.toLowerCase() },
      data: { 
        isActive: false, 
        unsubscribedAt: new Date() 
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return { success: false, error: 'Failed to unsubscribe' }
  }
}

// ============================================
// CONTENT ACTIONS
// ============================================

export async function getBanners(position?: string) {
  try {
    const where: Record<string, unknown> = { isActive: true }
    
    if (position) {
      where.position = position
    }
    
    const banners = await db.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    })
    
    return banners
  } catch (error) {
    console.error('Get banners error:', error)
    return []
  }
}

export async function getTestimonials(featured?: boolean) {
  try {
    const where: Record<string, unknown> = { isActive: true }
    
    if (featured) {
      where.isFeatured = true
    }
    
    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    })
    
    return testimonials
  } catch (error) {
    console.error('Get testimonials error:', error)
    return []
  }
}

export async function getFAQs(category?: string) {
  try {
    const where: Record<string, unknown> = { isActive: true }
    
    if (category) {
      where.category = category
    }
    
    const faqs = await db.fAQ.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    })
    
    return faqs
  } catch (error) {
    console.error('Get FAQs error:', error)
    return []
  }
}

export async function getBlogPosts(options?: { limit?: number; featured?: boolean }) {
  try {
    const where: Record<string, unknown> = { status: 'PUBLISHED' }
    
    if (options?.featured) {
      where.featured = true
    }
    
    const posts = await db.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: options?.limit
    })
    
    return posts
  } catch (error) {
    console.error('Get blog posts error:', error)
    return []
  }
}

// ============================================
// SETTINGS ACTIONS
// ============================================

export async function getSetting(key: string) {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key }
    })
    
    return setting?.value || null
  } catch (error) {
    console.error('Get setting error:', error)
    return null
  }
}

export async function getSettings(group?: string) {
  try {
    const where: Record<string, unknown> = {}
    
    if (group) {
      where.group = group
    }
    
    const settings = await db.siteSetting.findMany({ where })
    
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    console.error('Get settings error:', error)
    return {}
  }
}

export async function updateSetting(key: string, value: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }
    
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Update setting error:', error)
    return { success: false, error: 'Failed to update setting' }
  }
}

// ============================================
// REVIEW ACTIONS
// ============================================

export async function getReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return reviews
  } catch (error) {
    console.error('Get reviews error:', error)
    return []
  }
}

export async function createReview(input: {
  productId: string
  rating: number
  title?: string
  comment: string
}): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login to leave a review' }
    }
    
    const existing = await db.review.findFirst({
      where: { userId: user.id, productId: input.productId }
    })
    
    if (existing) {
      return { success: false, error: 'You have already reviewed this product' }
    }
    
    const review = await db.review.create({
      data: {
        userId: user.id,
        productId: input.productId,
        rating: input.rating,
        title: input.title,
        comment: input.comment
      }
    })
    
    // Update product rating
    const reviews = await db.review.findMany({
      where: { productId: input.productId, isApproved: true }
    })
    
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    
    await db.product.update({
      where: { id: input.productId },
      data: {
        averageRating: avgRating,
        reviewCount: reviews.length
      }
    })
    
    revalidatePath('/')
    
    return { success: true, data: review }
  } catch (error) {
    console.error('Create review error:', error)
    return { success: false, error: 'Failed to create review' }
  }
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

export async function getNotifications(unreadOnly?: boolean) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return []
    }
    
    const where: Record<string, unknown> = { userId: user.id }
    
    if (unreadOnly) {
      where.isRead = false
    }
    
    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    return notifications
  } catch (error) {
    console.error('Get notifications error:', error)
    return []
  }
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.notification.update({
      where: { id, userId: user.id },
      data: { isRead: true }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Mark notification read error:', error)
    return { success: false, error: 'Failed to mark as read' }
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return { success: false, error: 'Failed to mark all as read' }
  }
}

// ============================================
// ADMIN ACTIONS
// ============================================

export async function getAdminStats() {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return null
    }
    
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }),
      db.product.findMany({
        where: {
          quantity: { lte: db.product.fields.lowStockThreshold }
        },
        take: 5
      })
    ])
    
    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      lowStockProducts
    }
  } catch (error) {
    console.error('Get admin stats error:', error)
    return null
  }
}

export async function getAllOrders(options?: { status?: OrderStatus; limit?: number }) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return []
    }
    
    const where: Record<string, unknown> = {}
    
    if (options?.status) {
      where.status = options.status
    }
    
    const orders = await db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit
    })
    
    return orders
  } catch (error) {
    console.error('Get all orders error:', error)
    return []
  }
}

export async function getAllUsers() {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return []
    }
    
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return users
  } catch (error) {
    console.error('Get all users error:', error)
    return []
  }
}

// ============================================
// ADDRESS ACTIONS
// ============================================

export async function getAddresses() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return []
    }
    
    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: 'desc' }
    })
    
    return addresses
  } catch (error) {
    console.error('Get addresses error:', error)
    return []
  }
}

export async function createAddress(input: {
  label: string
  firstName: string
  lastName: string
  company?: string
  street: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
}): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    if (input.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }
    
    const address = await db.address.create({
      data: {
        userId: user.id,
        ...input
      }
    })
    
    revalidatePath('/')
    
    return { success: true, data: address }
  } catch (error) {
    console.error('Create address error:', error)
    return { success: false, error: 'Failed to create address' }
  }
}

export async function deleteAddress(id: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return { success: false, error: 'Please login' }
    }
    
    await db.address.delete({
      where: { id, userId: user.id }
    })
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Delete address error:', error)
    return { success: false, error: 'Failed to delete address' }
  }
}

// ============================================
// COUPON ACTIONS
// ============================================

export async function validateCoupon(code: string) {
  try {
    const coupon = await db.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    })
    
    if (!coupon) {
      return null
    }
    
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return null
    }
    
    return coupon
  } catch (error) {
    console.error('Validate coupon error:', error)
    return null
  }
}
