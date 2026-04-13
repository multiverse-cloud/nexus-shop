import { PrismaClient, UserRole, ProductStatus, BillingInterval, OrderStatus, PaymentStatus, SubscriptionStatus, LeadStatus, NotificationType, TransactionStatus, TransactionType, PostStatus, CouponType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.notification.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.contactLead.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.siteSetting.deleteMany()
  await prisma.verificationToken.deleteMany()

  console.log('👤 Creating users...')
  
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isActive: true,
    }
  })
  console.log('✅ Created admin user:', admin.email)

  // Create test customer
  const customerPassword = await hash('customer123', 12)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Customer',
      role: 'CUSTOMER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
      phone: '+1 (555) 123-4567',
      isActive: true,
    }
  })
  console.log('✅ Created customer user:', customer.email)

  // Create additional test users
  const staffPassword = await hash('staff123', 12)
  const staff = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      password: staffPassword,
      name: 'Sarah Staff',
      role: 'STAFF',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff',
      isActive: true,
    }
  })
  console.log('✅ Created staff user:', staff.email)

  console.log('📦 Creating categories...')
  
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices for modern living',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
        isActive: true,
        sortOrder: 1,
      }
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Trendy apparel for all occasions',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        isActive: true,
        sortOrder: 2,
      }
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Beautiful items for your home and garden',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
        isActive: true,
        sortOrder: 3,
      }
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Gear up for your next adventure',
        image: 'https://images.unsplash.com/photo-1461896836934- voices-coming-soon?w=800',
        isActive: true,
        sortOrder: 4,
      }
    }),
    prisma.category.create({
      data: {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Expand your mind with our curated collection',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
        isActive: true,
        sortOrder: 5,
      }
    }),
    prisma.category.create({
      data: {
        name: 'Software & Apps',
        slug: 'software-apps',
        description: 'Digital solutions for productivity and creativity',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        isActive: true,
        sortOrder: 6,
      }
    }),
  ])
  console.log('✅ Created', categories.length, 'categories')

  console.log('🛍️ Creating products...')
  
  const productsData = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      sku: 'WH-1000XM5',
      description: 'Experience premium sound quality with industry-leading noise cancellation. These wireless headphones feature 30-hour battery life, multipoint connection, and exceptional comfort for all-day wear. Perfect for music lovers and professionals alike.',
      shortDesc: 'Premium wireless headphones with industry-leading noise cancellation',
      price: 349.99,
      comparePrice: 399.99,
      costPrice: 180.00,
      categoryId: categories[0].id,
      quantity: 150,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      attributes: JSON.stringify({ color: ['Black', 'Silver', 'Blue'], connectivity: 'Bluetooth 5.2' }),
      tags: JSON.stringify(['audio', 'wireless', 'premium', 'noise-canceling']),
      metaTitle: 'Premium Wireless Noise-Canceling Headphones | NexusShop',
      metaDesc: 'Buy the best wireless noise-canceling headphones with 30-hour battery life. Free shipping on orders over $100.',
    },
    {
      name: 'Ultra-Slim Laptop Pro 15"',
      slug: 'ultra-slim-laptop-pro-15',
      sku: 'LAPTOP-PRO-15',
      description: 'Power meets portability in this stunning 15-inch laptop. Featuring the latest M3 chip, 16GB RAM, 512GB SSD, and a brilliant Retina display. All-day battery life keeps you productive wherever you go.',
      shortDesc: 'Powerful 15-inch laptop with M3 chip and Retina display',
      price: 1299.99,
      comparePrice: 1499.99,
      costPrice: 800.00,
      categoryId: categories[0].id,
      quantity: 75,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      attributes: JSON.stringify({ 
        processor: 'M3 Chip', 
        ram: ['16GB', '32GB'], 
        storage: ['512GB', '1TB', '2TB'],
        color: ['Space Gray', 'Silver']
      }),
      tags: JSON.stringify(['laptop', 'computer', 'productivity', 'premium']),
    },
    {
      name: 'Smart Watch Series X',
      slug: 'smart-watch-series-x',
      sku: 'WATCH-X',
      description: 'The most advanced smartwatch yet. Track your health with precision sensors, stay connected with cellular, and express yourself with customizable watch faces. Water-resistant to 50 meters.',
      shortDesc: 'Advanced smartwatch with health tracking and cellular',
      price: 449.99,
      comparePrice: 499.99,
      costPrice: 220.00,
      categoryId: categories[0].id,
      quantity: 200,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      attributes: JSON.stringify({ 
        size: ['41mm', '45mm'], 
        color: ['Midnight', 'Starlight', 'Silver', 'Red'],
        connectivity: ['GPS', 'GPS + Cellular']
      }),
      tags: JSON.stringify(['watch', 'wearable', 'fitness', 'smart']),
    },
    {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-tshirt',
      sku: 'TEE-PRE-001',
      description: 'Ultra-soft premium cotton t-shirt. Pre-shrunk for consistent sizing. Features reinforced stitching and a classic fit that looks great on everyone.',
      shortDesc: 'Ultra-soft premium cotton t-shirt',
      price: 29.99,
      comparePrice: 39.99,
      costPrice: 8.00,
      categoryId: categories[1].id,
      quantity: 500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ 
        size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 
        color: ['White', 'Black', 'Navy', 'Heather Gray']
      }),
      tags: JSON.stringify(['clothing', 'basics', 'cotton']),
    },
    {
      name: 'Designer Denim Jacket',
      slug: 'designer-denim-jacket',
      sku: 'JACKET-DEN-001',
      description: 'Classic denim jacket with a modern twist. Premium quality denim with vintage wash. Features multiple pockets and adjustable cuffs for the perfect fit.',
      shortDesc: 'Classic denim jacket with modern styling',
      price: 89.99,
      comparePrice: 120.00,
      costPrice: 35.00,
      categoryId: categories[1].id,
      quantity: 120,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      attributes: JSON.stringify({ 
        size: ['S', 'M', 'L', 'XL'], 
        color: ['Light Wash', 'Dark Wash', 'Black']
      }),
      tags: JSON.stringify(['clothing', 'jacket', 'denim', 'fashion']),
    },
    {
      name: 'Modern Minimalist Desk Lamp',
      slug: 'modern-minimalist-desk-lamp',
      sku: 'LAMP-DESK-001',
      description: 'Elegant desk lamp with touch controls and adjustable color temperature. USB charging port built into the base. Perfect for home office or bedside.',
      shortDesc: 'Elegant LED desk lamp with touch controls',
      price: 49.99,
      comparePrice: 69.99,
      costPrice: 18.00,
      categoryId: categories[2].id,
      quantity: 180,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ 
        color: ['White', 'Black', 'Natural Wood'], 
        lightModes: ['Warm', 'Cool', 'Daylight']
      }),
      tags: JSON.stringify(['home', 'lighting', 'office', 'minimalist']),
    },
    {
      name: 'Luxury Memory Foam Pillow Set',
      slug: 'luxury-memory-foam-pillow-set',
      sku: 'PILLOW-MEM-SET',
      description: 'Set of 2 premium memory foam pillows with cooling gel layer. Hypoallergenic and dust mite resistant. Machine washable cover included.',
      shortDesc: 'Premium memory foam pillows with cooling gel',
      price: 79.99,
      comparePrice: 99.99,
      costPrice: 28.00,
      categoryId: categories[2].id,
      quantity: 100,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592789705501-f9ae4287c4e9?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4e9?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ 
        firmness: ['Soft', 'Medium', 'Firm'], 
        quantity: '2 Pack'
      }),
      tags: JSON.stringify(['home', 'bedding', 'sleep', 'comfort']),
    },
    {
      name: 'Professional Yoga Mat Pro',
      slug: 'professional-yoga-mat-pro',
      sku: 'YOGA-MAT-PRO',
      description: 'Extra thick yoga mat with superior grip and cushioning. Eco-friendly TPE material. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.',
      shortDesc: 'Professional grade yoga mat with superior grip',
      price: 45.99,
      comparePrice: 59.99,
      costPrice: 15.00,
      categoryId: categories[3].id,
      quantity: 250,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ 
        thickness: '6mm', 
        color: ['Purple', 'Blue', 'Green', 'Black', 'Pink']
      }),
      tags: JSON.stringify(['fitness', 'yoga', 'exercise', 'wellness']),
    },
    {
      name: 'Insulated Sports Water Bottle',
      slug: 'insulated-sports-water-bottle',
      sku: 'BOTTLE-SPR-001',
      description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free stainless steel. Leak-proof design with wide mouth for easy cleaning.',
      shortDesc: 'Premium insulated water bottle - hot or cold',
      price: 34.99,
      comparePrice: 44.99,
      costPrice: 12.00,
      categoryId: categories[3].id,
      quantity: 400,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ 
        size: ['18oz', '24oz', '32oz'], 
        color: ['Black', 'White', 'Blue', 'Red', 'Green']
      }),
      tags: JSON.stringify(['fitness', 'hydration', 'outdoor', 'sports']),
    },
    {
      name: 'Bestseller Book Collection',
      slug: 'bestseller-book-collection',
      sku: 'BOOK-SET-001',
      description: 'Curated collection of 5 bestselling fiction novels. Hardback editions with elegant cover designs. Perfect gift for book lovers.',
      shortDesc: 'Collection of 5 bestselling hardback novels',
      price: 59.99,
      comparePrice: 89.99,
      costPrice: 30.00,
      categoryId: categories[4].id,
      quantity: 60,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: false,
      attributes: JSON.stringify({ format: 'Hardcover', quantity: '5 Books' }),
      tags: JSON.stringify(['books', 'fiction', 'gift', 'reading']),
    },
    {
      name: 'Pro Video Editing Suite',
      slug: 'pro-video-editing-suite',
      sku: 'SOFT-VID-001',
      description: 'Professional video editing software with advanced features including 8K support, AI-powered tools, motion tracking, and extensive effects library. Lifetime license with free updates.',
      shortDesc: 'Professional video editing with 8K support',
      price: 299.99,
      comparePrice: 499.99,
      costPrice: 0.00,
      categoryId: categories[5].id,
      quantity: 999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      isDigital: true,
      digitalFile: 'https://downloads.example.com/video-suite-pro.zip',
      attributes: JSON.stringify({ license: 'Lifetime', platforms: ['Windows', 'macOS'] }),
      tags: JSON.stringify(['software', 'video', 'editing', 'professional']),
    },
    {
      name: 'Creative Design Toolkit',
      slug: 'creative-design-toolkit',
      sku: 'SOFT-DES-001',
      description: 'Complete design software suite for graphic designers. Includes vector graphics, photo editing, typography tools, and 1000+ templates. Perfect for professionals and hobbyists.',
      shortDesc: 'Complete design suite for creative professionals',
      price: 149.99,
      comparePrice: 199.99,
      costPrice: 0.00,
      categoryId: categories[5].id,
      quantity: 999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'
      ]),
      featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      status: 'ACTIVE' as ProductStatus,
      isFeatured: true,
      isDigital: true,
      digitalFile: 'https://downloads.example.com/design-toolkit.zip',
      attributes: JSON.stringify({ license: '1 Year', platforms: ['Windows', 'macOS', 'Linux'] }),
      tags: JSON.stringify(['software', 'design', 'graphics', 'creative']),
    },
  ]

  const products = []
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData
    })
    products.push(product)

    // Create variants for some products
    if (product.attributes) {
      const attrs = JSON.parse(product.attributes as string)
      let variantIndex = 0
      
      if (attrs.size && attrs.color) {
        for (const size of attrs.size.slice(0, 2)) {
          for (const color of attrs.color.slice(0, 2)) {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                name: `${size} - ${color}`,
                sku: `${product.sku}-${variantIndex}`,
                price: product.price + (variantIndex * 5),
                quantity: Math.floor(product.quantity / 4),
                attributes: JSON.stringify({ size, color }),
                isActive: true,
              }
            })
            variantIndex++
          }
        }
      }
    }
  }
  console.log('✅ Created', products.length, 'products with variants')

  console.log('💰 Creating pricing plans...')
  
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: 'Basic',
        slug: 'basic',
        description: 'Perfect for individuals and small projects getting started.',
        price: 9.00,
        comparePrice: 19.00,
        interval: 'MONTHLY' as BillingInterval,
        intervalCount: 1,
        trialDays: 7,
        features: JSON.stringify([
          'Up to 10 products',
          'Basic analytics',
          'Email support',
          'Standard templates',
          '1 team member'
        ]),
        maxProducts: 10,
        maxOrders: 100,
        maxUsers: 1,
        storageLimit: 500,
        isFeatured: false,
        isActive: true,
        sortOrder: 1,
      }
    }),
    prisma.plan.create({
      data: {
        name: 'Pro',
        slug: 'pro',
        description: 'Best for growing businesses with advanced needs.',
        price: 29.00,
        comparePrice: 49.00,
        interval: 'MONTHLY' as BillingInterval,
        intervalCount: 1,
        trialDays: 14,
        features: JSON.stringify([
          'Up to 100 products',
          'Advanced analytics & reports',
          'Priority email & chat support',
          'Premium templates',
          '5 team members',
          'API access',
          'Custom domain'
        ]),
        maxProducts: 100,
        maxOrders: 1000,
        maxUsers: 5,
        storageLimit: 5000,
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      }
    }),
    prisma.plan.create({
      data: {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'For large organizations requiring maximum flexibility.',
        price: 99.00,
        comparePrice: 199.00,
        interval: 'MONTHLY' as BillingInterval,
        intervalCount: 1,
        trialDays: 30,
        features: JSON.stringify([
          'Unlimited products',
          'Enterprise analytics & custom reports',
          '24/7 dedicated support',
          'Custom templates & branding',
          'Unlimited team members',
          'Full API access',
          'Custom domain + SSL',
          'White-label options',
          'Dedicated account manager',
          'SLA guarantee'
        ]),
        maxProducts: null,
        maxOrders: null,
        maxUsers: null,
        storageLimit: 50000,
        isFeatured: false,
        isActive: true,
        sortOrder: 3,
      }
    }),
  ])
  console.log('✅ Created', plans.length, 'pricing plans')

  console.log('💬 Creating testimonials...')
  
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Sarah Mitchell',
        role: 'CEO',
        company: 'TechStart Inc.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        content: 'This platform transformed our e-commerce operations completely. The intuitive interface and powerful features helped us increase sales by 150% in just three months. Highly recommended!',
        rating: 5,
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'James Rodriguez',
        role: 'Marketing Director',
        company: 'GrowthCo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        content: 'The subscription management features are exactly what we needed. We\'ve streamlined our billing process and improved customer retention significantly. Great support team too!',
        rating: 5,
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Emily Chen',
        role: 'Founder',
        company: 'Artisan Goods',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        content: 'As a small business owner, I was looking for something affordable yet powerful. This platform delivers on both fronts. Setup was easy, and I was selling within hours.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        sortOrder: 3,
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Michael Thompson',
        role: 'E-commerce Manager',
        company: 'Retail Plus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        content: 'The analytics dashboard provides insights we never had before. We can now make data-driven decisions and optimize our inventory effectively. Game changer!',
        rating: 4,
        isFeatured: false,
        isActive: true,
        sortOrder: 4,
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Lisa Park',
        role: 'Operations Lead',
        company: 'StyleHub',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        content: 'Customer support is exceptional. They helped us migrate from our old system and trained our team. The platform itself is robust and reliable.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        sortOrder: 5,
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'David Wilson',
        role: 'Product Manager',
        company: 'InnovateTech',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        content: 'We\'ve tried several platforms, and this one stands out for its flexibility. The API documentation is excellent, and integration with our existing tools was seamless.',
        rating: 5,
        isFeatured: false,
        isActive: true,
        sortOrder: 6,
      }
    }),
  ])
  console.log('✅ Created', testimonials.length, 'testimonials')

  console.log('❓ Creating FAQs...')
  
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'How do I get started with the platform?',
        answer: 'Getting started is easy! Simply sign up for a free trial, choose your plan, and follow our guided setup wizard. You\'ll be up and running in minutes. Our support team is available 24/7 to help you through the process.',
        category: 'getting-started',
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through our PCI-compliant payment system.',
        category: 'billing',
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period. You can also export all your data before canceling.',
        category: 'subscription',
        isFeatured: true,
        isActive: true,
        sortOrder: 3,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you offer custom pricing for enterprises?',
        answer: 'Absolutely! We offer custom enterprise pricing based on your specific needs. Contact our sales team for a personalized quote. Enterprise plans include dedicated support, custom integrations, and SLA guarantees.',
        category: 'billing',
        isFeatured: false,
        isActive: true,
        sortOrder: 4,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'How secure is my data?',
        answer: 'Security is our top priority. We use industry-standard encryption (AES-256) for all data at rest and in transit. Our infrastructure is SOC 2 Type II certified, and we perform regular security audits. We also offer two-factor authentication for all accounts.',
        category: 'security',
        isFeatured: true,
        isActive: true,
        sortOrder: 5,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Can I migrate from another platform?',
        answer: 'Yes! We offer free migration assistance for all annual plans. Our team will help transfer your products, customers, and order history from your current platform. Most migrations are completed within 24-48 hours.',
        category: 'getting-started',
        isFeatured: false,
        isActive: true,
        sortOrder: 6,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'What kind of support do you offer?',
        answer: 'We offer multiple support channels: comprehensive documentation, video tutorials, community forums, and direct support. Pro and Enterprise plans include priority support with faster response times. Enterprise plans have dedicated account managers.',
        category: 'support',
        isFeatured: false,
        isActive: true,
        sortOrder: 7,
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Can I use my own domain name?',
        answer: 'Yes! Pro and Enterprise plans include custom domain support. You can connect your existing domain or purchase a new one through us. We also provide free SSL certificates for all custom domains to ensure secure transactions.',
        category: 'features',
        isFeatured: false,
        isActive: true,
        sortOrder: 8,
      }
    }),
  ])
  console.log('✅ Created', faqs.length, 'FAQs')

  console.log('🖼️ Creating banners...')
  
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Summer Sale - Up to 50% Off',
        subtitle: 'Limited time offer on selected items. Shop now and save big!',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
        link: '/products?sale=true',
        buttonText: 'Shop Now',
        position: 'hero',
        isActive: true,
        sortOrder: 1,
      }
    }),
    prisma.banner.create({
      data: {
        title: 'New Arrivals',
        subtitle: 'Check out our latest collection of premium products',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
        link: '/products?new=true',
        buttonText: 'Explore',
        position: 'hero',
        isActive: true,
        sortOrder: 2,
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Free Shipping on Orders $100+',
        subtitle: 'Use code FREESHIP at checkout',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        link: '/products',
        buttonText: 'Start Shopping',
        position: 'sidebar',
        isActive: true,
        sortOrder: 1,
      }
    }),
  ])
  console.log('✅ Created', banners.length, 'banners')

  console.log('⚙️ Creating site settings...')
  
  const settings = await Promise.all([
    prisma.siteSetting.create({
      data: {
        key: 'site_name',
        value: 'NexusShop',
        type: 'text',
        group: 'general',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'site_tagline',
        value: 'Premium Products, Exceptional Service',
        type: 'text',
        group: 'general',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'site_description',
        value: 'Your one-stop destination for premium products. Shop electronics, clothing, home goods, and more with fast shipping and excellent customer service.',
        type: 'text',
        group: 'general',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'contact_email',
        value: 'support@nexusshop.com',
        type: 'text',
        group: 'contact',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'contact_phone',
        value: '+1 (555) 123-4567',
        type: 'text',
        group: 'contact',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'contact_address',
        value: '123 Commerce Street, New York, NY 10001',
        type: 'text',
        group: 'contact',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'social_links',
        value: JSON.stringify({
          twitter: 'https://twitter.com/nexusshop',
          facebook: 'https://facebook.com/nexusshop',
          instagram: 'https://instagram.com/nexusshop',
          linkedin: 'https://linkedin.com/company/nexusshop'
        }),
        type: 'json',
        group: 'social',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'free_shipping_threshold',
        value: '100',
        type: 'number',
        group: 'shipping',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'tax_rate',
        value: '0.1',
        type: 'number',
        group: 'tax',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'currency',
        value: 'USD',
        type: 'text',
        group: 'general',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'logo_url',
        value: '/logo.svg',
        type: 'text',
        group: 'branding',
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'maintenance_mode',
        value: 'false',
        type: 'boolean',
        group: 'system',
      }
    }),
  ])
  console.log('✅ Created', settings.length, 'site settings')

  console.log('🎫 Creating sample coupons...')
  
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        description: '10% off your first order',
        type: 'PERCENTAGE' as CouponType,
        value: 10,
        minOrderAmount: 50,
        maxDiscount: 50,
        usageLimit: 1000,
        usageCount: 0,
        userLimit: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'SAVE20',
        description: '$20 off orders over $100',
        type: 'FIXED' as CouponType,
        value: 20,
        minOrderAmount: 100,
        usageLimit: 500,
        usageCount: 0,
        userLimit: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        description: 'Free shipping on any order',
        type: 'FREE_SHIPPING' as CouponType,
        value: 0,
        minOrderAmount: 0,
        usageLimit: 10000,
        usageCount: 0,
        userLimit: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    }),
  ])
  console.log('✅ Created', coupons.length, 'coupons')

  console.log('📝 Creating sample addresses...')
  
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      firstName: 'John',
      lastName: 'Customer',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    }
  })

  console.log('📢 Creating sample notifications...')
  
  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'SYSTEM' as NotificationType,
      title: 'Welcome to NexusShop!',
      message: 'Thank you for joining us. Start exploring our products and enjoy exclusive member benefits.',
      data: JSON.stringify({ type: 'welcome' }),
      isRead: false,
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log('  Users: 3 (admin@example.com, customer@example.com, staff@example.com)')
  console.log('  Categories: 6')
  console.log('  Products: 12')
  console.log('  Plans: 3 (Basic $9, Pro $29, Enterprise $99)')
  console.log('  Testimonials: 6')
  console.log('  FAQs: 8')
  console.log('  Banners: 3')
  console.log('  Coupons: 3')
  console.log('  Settings: 12')
  console.log('\n🔑 Test Credentials:')
  console.log('  Admin: admin@example.com / admin123')
  console.log('  Customer: customer@example.com / customer123')
  console.log('  Staff: staff@example.com / staff123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
