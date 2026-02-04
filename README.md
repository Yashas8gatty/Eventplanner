# Event Planner - React.js Web Application

A comprehensive event management web application built with React.js, featuring event creation, registration, and schedule tracking with responsive design for both desktop and mobile browsers.

## Features

### 🎯 Core Functionality
- **Event Creation**: Create and manage events with detailed information (title, description, date, time, location, capacity, category)
- **Event Registration**: Users can register for events with their contact information
- **Schedule Tracking**: Personal dashboard to track registered events
- **Event Categories**: Organize events by type (Conference, Workshop, Seminar, Networking, Social, Other)
- **Capacity Management**: Track event capacity and prevent over-registration

### 📱 Responsive Design
- Mobile-first responsive layout
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements
- Adaptive navigation and forms

### 💾 Data Persistence
- Local storage integration for data persistence
- No external database required
- Automatic save/load functionality

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the Eventplanner directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`

### Building for Production
```bash
npm run build
```

## Application Structure

### Main Views
1. **Home**: Welcome page with feature overview and upcoming events preview
2. **Events**: Browse all available events and create new ones
3. **My Schedule**: View personal registered events

### Key Components
- **Navigation**: Sticky navigation bar with view switching
- **Event Cards**: Display event information with registration options
- **Forms**: Event creation and user registration forms
- **Responsive Grid**: Adaptive layout for different screen sizes

## Technology Stack
- **Frontend**: React.js 18.2.0
- **Build Tool**: Vite 5.2.0
- **Styling**: CSS3 with responsive design
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Browser localStorage

## Features in Detail

### Event Management
- Create events with comprehensive details
- Set capacity limits and track registrations
- Categorize events for better organization
- Real-time registration status updates

### User Registration
- Simple registration form with validation
- Contact information collection
- Registration confirmation and tracking
- Prevent duplicate registrations

### Responsive Design
- Mobile-optimized navigation
- Flexible grid layouts
- Touch-friendly buttons and forms
- Adaptive typography and spacing

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- Firebase integration for real-time data sync
- User authentication and profiles
- Email notifications
- Calendar integration
- Event search and filtering
- Social sharing features

## License
This project is licensed under the MIT License - see the LICENSE file for details.