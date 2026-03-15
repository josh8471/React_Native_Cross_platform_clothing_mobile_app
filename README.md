# Clothing App

A cross-platform e-commerce clothing application built with React Native (Expo) for the mobile frontend and Node.js/Express for the backend API.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Product Management**: Browse, search, and manage clothing products
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Place orders, track order history
- **Payment Processing**: Secure payments with Stripe integration
- **Admin Panel**: Product management and order oversight
- **Cross-Platform**: Works on iOS, Android, and Web
- **Image Upload**: Cloudinary integration for product images

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Payments**: Stripe
- **Image Storage**: Cloudinary
- **Security**: Helmet, CORS

### Mobile
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Payments**: Stripe React Native
- **Storage**: AsyncStorage, SecureStore
- **Icons**: Expo Vector Icons

## Project Structure

```
clothing_app/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Main server file
│   ├── scripts/            # Utility scripts
│   ├── package.json
│   └── tsconfig.json
└── mobile/                 # React Native app
    ├── app/                # Expo Router pages
    │   ├── (tabs)/         # Main app tabs
    │   ├── admin/          # Admin panel
    │   └── product/        # Product detail pages
    ├── assets/             # Images and icons
    ├── components/         # Reusable components
    ├── services/           # API service functions
    ├── store/              # Zustand state stores
    ├── types/              # TypeScript type definitions
    ├── package.json
    └── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Expo CLI (for mobile development)
- Stripe account (for payments)
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

### Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the mobile root with the following variables:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Mobile (.env)
- `EXPO_PUBLIC_API_URL` - Backend API URL
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Mobile
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run on web browser

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.