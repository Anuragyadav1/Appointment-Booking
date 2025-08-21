# Appointment Booking Client

A modern React frontend for the clinic appointment booking system with patient and admin dashboards.

## Features

- **User Authentication**: Secure login/register with JWT tokens
- **Patient Dashboard**: Book appointments, view available slots
- **Admin Dashboard**: View all bookings, manage appointments
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live slot availability and booking status
- **Role-based Access**: Separate interfaces for patients and admins

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Styling**: Custom CSS with responsive design
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── LoadingSpinner.jsx # Loading indicator
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── PatientDashboard.jsx # Patient main view
│   └── AdminDashboard.jsx   # Admin main view
├── services/           # API services
│   └── api.js         # HTTP client and API functions
├── App.jsx            # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the client directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Note: For development, the Vite proxy will handle API calls to `/api`

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Usage

### Patient Features

- **Register/Login**: Create account or sign in
- **View Available Slots**: Browse 30-minute time slots (9 AM - 5 PM)
- **Book Appointments**: Select and confirm appointment times
- **View My Bookings**: See all your scheduled appointments

### Admin Features

- **Login**: Access admin dashboard
- **View All Bookings**: See all patient appointments
- **Filter Bookings**: Filter by status (confirmed, cancelled, completed)
- **Pagination**: Navigate through large numbers of bookings

### Demo Accounts

- **Admin**: `admin@example.com` / `Passw0rd!`
- **Patient**: `patient@example.com` / `Passw0rd!`

## API Integration

The client communicates with the backend through the following endpoints:

- **Authentication**: `/api/login`, `/api/register`
- **Slots**: `/api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Bookings**: `/api/book`, `/api/my-bookings`, `/api/all-bookings`

### API Service Structure

```javascript
// Authentication
authAPI.login(credentials);
authAPI.register(userData);

// Slots
slotsAPI.getSlots(fromDate, toDate);

// Bookings
bookingsAPI.bookSlot(bookingData);
bookingsAPI.getMyBookings();
bookingsAPI.getAllBookings(page, limit, status);
```

## State Management

The app uses React Context API for global state management:

- **AuthContext**: Manages user authentication, login/logout, and role-based access
- **Local State**: Component-level state for forms, data fetching, and UI interactions

## Routing

Protected routes ensure users can only access appropriate sections:

- `/login`, `/register` - Public routes
- `/` - Auto-redirects based on user role
- `/patient/*` - Patient-only routes
- `/admin/*` - Admin-only routes

## Styling

- **CSS Custom Properties**: Consistent color scheme and spacing
- **Responsive Grid**: CSS Grid for layout management
- **Component Classes**: Reusable utility classes for common patterns
- **Mobile First**: Responsive design starting from mobile breakpoints

## Error Handling

- **Form Validation**: Client-side validation with error messages
- **API Error Handling**: Toast notifications for server errors
- **Loading States**: Spinner indicators during async operations
- **User Feedback**: Success/error messages for all actions

## Security Features

- **JWT Storage**: Secure token storage in localStorage
- **Route Protection**: Authentication guards for protected routes
- **Role-based Access**: UI elements hidden based on user permissions
- **Input Sanitization**: Form validation and sanitization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Functional components with hooks
- Consistent naming conventions
- Proper error boundaries
- Accessibility considerations

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder
3. Configure redirects for SPA routing

### Environment Variables

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Vite for fast development and optimized production builds
- **Minimal Dependencies**: Only essential packages included

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **API Connection Error**

   - Ensure backend server is running
   - Check CORS configuration
   - Verify API URL in environment variables

2. **Authentication Issues**

   - Clear localStorage and re-login
   - Check JWT token expiration
   - Verify backend JWT_SECRET

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## License

MIT License - see LICENSE file for details
