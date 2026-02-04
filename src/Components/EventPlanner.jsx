import React, { useState, useEffect } from 'react';
import './EventPlanner.css';

const EventPlanner = () => {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [currentView, setCurrentView] = useState('home');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        category: 'conference'
    });
    const [registrationData, setRegistrationData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedEvents = localStorage.getItem('events');
        const savedRegistrations = localStorage.getItem('registrations');
        
        if (savedEvents) {
            setEvents(JSON.parse(savedEvents));
        }
        if (savedRegistrations) {
            setRegistrations(JSON.parse(savedRegistrations));
        }
    }, []);

    // Save to localStorage whenever events or registrations change
    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem('registrations', JSON.stringify(registrations));
    }, [registrations]);

    const handleInputChange = (e, formType = 'event') => {
        const { name, value } = e.target;
        if (formType === 'event') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setRegistrationData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateEvent = (e) => {
        e.preventDefault();
        const newEvent = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            registeredUsers: []
        };
        setEvents(prev => [...prev, newEvent]);
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            capacity: '',
            category: 'conference'
        });
        setCurrentView('events');
    };

    const handleRegisterForEvent = (e) => {
        e.preventDefault();
        const registration = {
            id: Date.now(),
            eventId: selectedEvent.id,
            eventTitle: selectedEvent.title,
            ...registrationData,
            registeredAt: new Date().toISOString()
        };
        
        setRegistrations(prev => [...prev, registration]);
        setEvents(prev => prev.map(event => 
            event.id === selectedEvent.id 
                ? { ...event, registeredUsers: [...event.registeredUsers, registration] }
                : event
        ));
        
        setRegistrationData({ name: '', email: '', phone: '' });
        setSelectedEvent(null);
        setCurrentView('schedule');
    };

    const getUpcomingEvents = () => {
        const now = new Date();
        return events.filter(event => new Date(event.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getUserRegistrations = () => {
        return registrations.map(reg => {
            const event = events.find(e => e.id === reg.eventId);
            return { ...reg, event };
        });
    };

    const renderHome = () => (
        <div className="home-view">
            <header className="hero-section">
                <h1>Welcome to Event Planner</h1>
                <p>Discover, register, and manage your events all in one place</p>
                <button 
                    className="cta-button"
                    onClick={() => setCurrentView('events')}
                >
                    Explore Events
                </button>
            </header>

            <section className="features-preview">
                <h2>What You Can Do</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Create Events</h3>
                        <p>Organize and manage your own events with ease</p>
                    </div>
                    <div className="feature-card">
                        <h3>Register for Events</h3>
                        <p>Find and register for events that interest you</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track Your Schedule</h3>
                        <p>Keep track of all your registered events</p>
                    </div>
                </div>
            </section>

            <section className="upcoming-events-preview">
                <h2>Upcoming Events</h2>
                <div className="events-grid">
                    {getUpcomingEvents().slice(0, 3).map(event => (
                        <div key={event.id} className="event-card-preview">
                            <h3>{event.title}</h3>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.location}</p>
                        </div>
                    ))}
                </div>
                {getUpcomingEvents().length === 0 && (
                    <p className="no-events">No upcoming events. Create one to get started!</p>
                )}
            </section>
        </div>
    );

    const renderEvents = () => (
        <div className="events-view">
            <div className="view-header">
                <h2>All Events</h2>
                <button 
                    className="create-event-btn"
                    onClick={() => setCurrentView('create')}
                >
                    Create Event
                </button>
            </div>
            
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-category">{event.category}</div>
                        <h3>{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {event.time}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Capacity:</strong> {event.capacity}</p>
                            <p><strong>Registered:</strong> {event.registeredUsers?.length || 0}</p>
                        </div>
                        <button 
                            className="register-btn"
                            onClick={() => {
                                setSelectedEvent(event);
                                setCurrentView('register');
                            }}
                            disabled={event.registeredUsers?.length >= parseInt(event.capacity)}
                        >
                            {event.registeredUsers?.length >= parseInt(event.capacity) ? 'Full' : 'Register'}
                        </button>
                    </div>
                ))}
            </div>
            
            {events.length === 0 && (
                <div className="empty-state">
                    <p>No events created yet. Be the first to create one!</p>
                </div>
            )}
        </div>
    );

    const renderCreateEvent = () => (
        <div className="create-event-view">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="event-form">
                <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="capacity">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="conference">Conference</option>
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="networking">Networking</option>
                            <option value="social">Social</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Create Event</button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setCurrentView('events')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    const renderRegister = () => (
        <div className="register-view">
            <h2>Register for {selectedEvent?.title}</h2>
            <div className="event-info">
                <p><strong>Date:</strong> {new Date(selectedEvent?.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedEvent?.time}</p>
                <p><strong>Location:</strong> {selectedEvent?.location}</p>
            </div>
            
            <form onSubmit={handleRegisterForEvent} className="registration-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={registrationData.name}
                        onChange={(e) => handleInputChange(e, 'registration')}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={registrationData.email}
                        onChange={(e) => handleInputChange(e, 'registration')}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={registrationData.phone}
                        onChange={(e) => handleInputChange(e, 'registration')}
                        required
                    />
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Register</button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                            setSelectedEvent(null);
                            setCurrentView('events');
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    const renderSchedule = () => (
        <div className="schedule-view">
            <h2>My Schedule</h2>
            <div className="registrations-list">
                {getUserRegistrations().map(registration => (
                    <div key={registration.id} className="registration-card">
                        <h3>{registration.eventTitle}</h3>
                        <div className="registration-details">
                            <p><strong>Date:</strong> {registration.event ? new Date(registration.event.date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Time:</strong> {registration.event?.time || 'N/A'}</p>
                            <p><strong>Location:</strong> {registration.event?.location || 'N/A'}</p>
                            <p><strong>Registered:</strong> {new Date(registration.registeredAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {registrations.length === 0 && (
                <div className="empty-state">
                    <p>You haven't registered for any events yet.</p>
                    <button 
                        className="cta-button"
                        onClick={() => setCurrentView('events')}
                    >
                        Browse Events
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="event-planner-container">
            <nav className="main-nav">
                <div className="nav-brand">
                    <h1>Event Planner</h1>
                </div>
                <div className="nav-links">
                    <button 
                        className={currentView === 'home' ? 'active' : ''}
                        onClick={() => setCurrentView('home')}
                    >
                        Home
                    </button>
                    <button 
                        className={currentView === 'events' ? 'active' : ''}
                        onClick={() => setCurrentView('events')}
                    >
                        Events
                    </button>
                    <button 
                        className={currentView === 'schedule' ? 'active' : ''}
                        onClick={() => setCurrentView('schedule')}
                    >
                        My Schedule
                    </button>
                </div>
            </nav>

            <main className="main-content">
                {currentView === 'home' && renderHome()}
                {currentView === 'events' && renderEvents()}
                {currentView === 'create' && renderCreateEvent()}
                {currentView === 'register' && renderRegister()}
                {currentView === 'schedule' && renderSchedule()}
            </main>
        </div>
    );
};

export default EventPlanner;
