# Appointment Booking App

A full-stack clinic appointment booking system with patient and admin roles, built with modern web technologies.

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel/Netlify]
- **Backend**: [Deploy to Render/Railway]
- **Database**: MongoDB Atlas

## ✨ Features

### Patient Features

- 🔐 Secure user registration and authentication
- 📅 View available appointment slots (next 7 days)
- ⏰ Book 30-minute slots between 9:00 AM - 5:00 PM
- 📋 View and manage personal bookings
- 📱 Responsive design for all devices

### Admin Features

- 🔑 Admin login with seeded credentials
- 👥 View all patient bookings
- 🔍 Filter bookings by status
- 📊 Pagination for large datasets
- 📈 Dashboard overview

### Technical Features

- 🔒 JWT-based authentication with role-based access
- 🚫 Double-booking prevention
- 🛡️ Security: password hashing, rate limiting, CORS protection
- 📡 RESTful API with proper HTTP status codes
- 🎨 Modern, responsive UI with smooth animations

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: Built-in validation with custom error handling

### Frontend

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Styling**: Custom CSS with responsive design
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns library

## 📁 Project Structure

```
appointment-booking-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── ...
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd appointment-booking-app
```

### 2. Backend Setup

```bash
cd server
npm install
cp env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Creates demo users
npm run dev   # Start development server
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev   # Start development server
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 🔑 Demo Accounts

After running the seed script, you can use these accounts:

| Role        | Email                 | Password    |
| ----------- | --------------------- | ----------- |
| **Admin**   | `admin@example.com`   | `Passw0rd!` |
| **Patient** | `patient@example.com` | `Passw0rd!` |

## 📡 API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Slots

- `GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get available slots

### Bookings

- `POST /api/book` - Book a slot
- `GET /api/my-bookings` - Get user's bookings
- `GET /api/all-bookings` - Get all bookings (admin only)

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. **Connect Repository**

   - Connect your GitHub repository to Render/Railway
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Environment Variables**

   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-super-secret-jwt-key
   PORT=10000
   ```

3. **Database Setup**
   - Create MongoDB Atlas cluster
   - Get connection string
   - Update `MONGODB_URI` in environment variables

### Frontend Deployment (Vercel/Netlify)

1. **Connect Repository**

   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Environment Variables**

   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**
   - Push to main branch for automatic deployment
   - Update CORS origins in backend

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing with cURL

1. **Register User**

   ```bash
   curl -X POST http://localhost:5000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. **Login**

   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Get Available Slots**

   ```bash
   curl -X GET "http://localhost:5000/api/slots?from=2024-01-01&to=2024-01-07" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

4. **Book Slot**
   ```bash
   curl -X POST http://localhost:5000/api/book \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"startAt":"2024-01-01T09:00:00Z","endAt":"2024-01-01T09:30:00Z"}'
   ```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes (5 for auth)
- **CORS Protection**: Configurable origin whitelist
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Sanitized error messages
- **Role-based Access**: Patient/admin permission system

## 📊 Database Schema

### Users

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: 'patient', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Slots

```javascript
{
  startAt: Date (required),
  endAt: Date (required),
  isBooked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings

```javascript
{
  userId: ObjectId (ref: User, required),
  slotId: ObjectId (ref: Slot, required, unique),
  status: String (enum: 'confirmed', 'cancelled', 'completed'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚧 Limitations & Future Enhancements

### Current Limitations

- Basic double-booking prevention
- Server timezone only
- No email/SMS notifications
- Single server instance

### Future Enhancements

- **Advanced Concurrency**: Database transactions for booking
- **Time Zone Support**: User timezone preferences
- **Notifications**: Email/SMS integration
- **Scalability**: Load balancing, microservices
- **Real-time Updates**: WebSocket integration
- **Calendar Integration**: Google Calendar, Outlook
- **Payment Processing**: Stripe integration
- **Multi-language Support**: Internationalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **React** - A JavaScript library for building user interfaces
- **MongoDB** - The database for modern applications
- **Vite** - Next Generation Frontend Tooling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/appointment-booking-app/issues) page
2. Create a new issue with detailed information
3. Include error messages, steps to reproduce, and environment details

## 🎯 Project Goals

- ✅ **Working Features**: Auth, slots, booking, views
- ✅ **Code Quality**: Clean, maintainable code structure
- ✅ **Deployment**: Live URLs with proper setup
- ✅ **UX Polish**: Smooth flows, error handling, loading states
- ✅ **Security**: Best practices, no secrets in repo

---

**Built with ❤️ for modern web development**
