import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Trophy, Music, Users } from 'lucide-react';

const Events = () => {
    const events = [
        {
            icon: <Trophy size={20} />,
            title: 'Annual Sports Day',
            date: 'March 15, 2026',
            time: '9:00 AM',
            location: 'Main Sports Complex',
            category: 'Sports',
            color: '#EF4444',
            status: 'upcoming',
        },
        {
            icon: <Music size={20} />,
            title: 'Cultural Fest',
            date: 'April 20-22, 2026',
            time: '10:00 AM',
            location: 'School Auditorium',
            category: 'Cultural',
            color: '#8B5CF6',
            status: 'upcoming',
        },
        {
            icon: <Users size={20} />,
            title: 'Parent-Teacher Conference',
            date: 'February 28, 2026',
            time: '2:00 PM',
            location: 'Classrooms',
            category: 'Academic',
            color: '#10B981',
            status: 'upcoming',
        },
    ];

    return (
        <section id="events" className="section" style={{ background: 'var(--color-gray-50)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
                >
                    <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--color-primary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                    }}>
                        Events & Activities
                    </span>
                    <h2 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        color: 'var(--color-gray-900)',
                        marginBottom: '1rem',
                    }}>
                        Upcoming Events
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-gray-600)',
                        maxWidth: '700px',
                        margin: '0 auto',
                    }}>
                        Join us for exciting activities throughout the academic year
                    </p>
                </motion.div>

                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-6)',
                }}>
                    {events.map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-6)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                display: 'flex',
                                gap: 'var(--space-6)',
                                alignItems: 'flex-start',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)',
                                position: 'relative',
                                overflow: 'hidden',
                                borderLeft: `4px solid ${event.color}`,
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: 'var(--radius-lg)',
                                background: `${event.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: event.color,
                                flexShrink: 0,
                            }}>
                                {event.icon}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    marginBottom: 'var(--space-2)',
                                    flexWrap: 'wrap',
                                }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: `${event.color}20`,
                                        color: event.color,
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                    }}>
                                        {event.category}
                                    </span>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                    }}>
                                        {event.status}
                                    </span>
                                </div>

                                <h3 style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 700,
                                    color: 'var(--color-gray-900)',
                                    marginBottom: 'var(--space-3)',
                                }}>
                                    {event.title}
                                </h3>

                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--space-4)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-gray-600)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} />
                                        {event.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={16} />
                                        {event.time}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} />
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
