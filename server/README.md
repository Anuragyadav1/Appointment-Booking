# Appointment Booking Server

A Node.js/Express backend for a clinic appointment booking system with patient and admin roles.

## Features

- **User Authentication**: JWT-based auth with role-based access control
- **Appointment Management**: Book, view, and manage appointments
- **Slot Management**: 30-minute time slots between 9:00 AM - 5:00 PM
- **Role-based Access**: Separate patient and admin dashboards
- **Security**: Password hashing, rate limiting, CORS protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: Built-in validation with custom error handling

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Slots

- `GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get available slots

### Bookings

- `POST /api/book` - Book a slot
- `GET /api/my-bookings` - Get user's bookings
- `GET /api/all-bookings` - Get all bookings (admin only)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/appointment-booking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Database Setup**

   - Ensure MongoDB is running
   - Update `MONGODB_URI` in `.env` if using cloud MongoDB

5. **Seed Database**

   ```bash
   npm run seed
   ```

   This creates default users:

   - Admin: `admin@example.com` / `Passw0rd!`
   - Patient: `patient@example.com` / `Passw0rd!`

6. **Start Server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Database Schema

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

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes (5 for auth)
- **CORS Protection**: Configurable origin whitelist
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Sanitized error messages

## Deployment

### Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Environment (development/production)

### Production Considerations

- Use strong JWT_SECRET
- Configure CORS origins for production domains
- Set up MongoDB Atlas or production MongoDB instance
- Use environment-specific configurations
- Implement proper logging and monitoring

## Testing

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

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "message": "Additional details (development only)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Limitations & Trade-offs

- **Concurrency**: Basic double-booking prevention (could be enhanced with transactions)
- **Time Zones**: Currently uses server timezone (could be enhanced with user timezone support)
- **Notifications**: No email/SMS notifications (could be added with external services)
- **Scalability**: Single server instance (could be enhanced with load balancing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
