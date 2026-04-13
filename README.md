# NexusShop - Premium SaaS + Ecommerce Platform

A full-stack, production-ready SaaS + Ecommerce platform built with Next.js 15, Prisma, TypeScript, Tailwind CSS, and shadcn/ui.

![NexusShop](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)

## 🚀 Features

### Landing Page
- Modern, premium hero section with animated gradients
- Trusted brands section
- Feature highlights with premium cards
- Featured products showcase
- Pricing plans with comparison
- Customer testimonials carousel
- FAQ accordion
- Newsletter subscription
- Contact form
- Responsive footer

### Authentication System
- User registration with email verification
- Login with JWT authentication
- Role-based access control (Admin, Staff, Customer)
- Password reset functionality
- Session management

### E-commerce Features
- Product catalog with categories
- Advanced search and filtering
- Product quick view modal
- Detailed product page with specifications
- Shopping cart with quantity management
- Wishlist functionality
- Secure checkout process
- Order history and tracking

### SaaS Features
- Subscription plans (Free, Pro, Enterprise)
- Plan comparison and selection
- Subscription management
- Billing history

### User Dashboard
- Overview with statistics
- Order history
- Wishlist management
- Subscription status
- Account settings
- Notification center

### Admin Dashboard
- Revenue and order statistics
- Product management
- User management
- Analytics overview

### UI/UX Features
- Premium, modern design
- Smooth animations with Framer Motion
- Go to top button
- Responsive design for all devices
- Dark/Light mode support
- Accessible components

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: SQLite (with Prisma ORM)
- **Authentication**: JWT with bcryptjs
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexusshop
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
bunx prisma db push
bunx prisma db seed
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Staff | staff@example.com | staff123 |
| Customer | customer@example.com | customer123 |

## 📁 Project Structure

```
nexusshop/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── src/
│   ├── app/
│   │   ├── page.tsx       # Main application page
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   └── ui/            # shadcn/ui components
│   ├── lib/
│   │   ├── actions.ts     # Server actions
│   │   ├── db.ts          # Database client
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── index.ts       # Zustand store
│   └── hooks/             # Custom hooks
├── public/                # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🗄 Database Schema

The application uses the following models:
- User (authentication and profiles)
- Product (e-commerce products)
- Category (product categories)
- Order (customer orders)
- OrderItem (order line items)
- CartItem (shopping cart)
- WishlistItem (user wishlist)
- Plan (subscription plans)
- Subscription (user subscriptions)
- Review (product reviews)
- Notification (user notifications)
- Testimonial (landing page testimonials)
- FAQ (frequently asked questions)
- Contact (contact form submissions)
- Newsletter (newsletter subscribers)

## 🎨 Customization

### Colors
The application uses a gradient color scheme:
- Primary: Purple (#9333EA to #10B981)
- Background: Slate tones
- Accent colors for different sections

### Components
All UI components are built with shadcn/ui and can be customized in `src/components/ui/`.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible mobile navigation
- Responsive product grids

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation
- XSS protection

## 🚀 Deployment

### Build for Production
```bash
bun run build
```

### Start Production Server
```bash
bun run start
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please email support@nexusshop.com or open an issue in the repository.

---

Built with ❤️ using Next.js 15, Tailwind CSS, and shadcn/ui
