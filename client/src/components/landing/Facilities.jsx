import { motion } from 'framer-motion';
import { Building2, FlaskConical, Library, Dumbbell, Laptop, Trees } from 'lucide-react';

const Facilities = () => {
    const facilities = [
        {
            icon: <Library size={24} />,
            title: 'Modern Library',
            description: '50,000+ books and digital resources',
            gradient: 'linear-gradient(135deg, #4F46E5, #6366F1)',
        },
        {
            icon: <FlaskConical size={24} />,
            title: 'Science Labs',
            description: 'State-of-the-art equipment for all sciences',
            gradient: 'linear-gradient(135deg, #10B981, #34D399)',
        },
        {
            icon: <Laptop size={24} />,
            title: 'Computer Labs',
            description: 'Latest technology and software',
            gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
        },
        {
            icon: <Dumbbell size={24} />,
            title: 'Sports Complex',
            description: 'Indoor and outdoor sports facilities',
            gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
        },
        {
            icon: <Building2 size={24} />,
            title: 'Auditorium',
            description: '500-seat multipurpose hall',
            gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
        },
        {
            icon: <Trees size={24} />,
            title: 'Green Campus',
            description: 'Eco-friendly environment with gardens',
            gradient: 'linear-gradient(135deg, #059669, #10B981)',
        },
    ];

    return (
        <section id="facilities" className="section" style={{
            background: 'linear-gradient(to bottom, white, var(--color-gray-50))',
        }}>
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
                        Facilities
                    </span>
                    <h2 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        color: 'var(--color-gray-900)',
                        marginBottom: '1rem',
                    }}>
                        World-Class Infrastructure
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-gray-600)',
                        maxWidth: '700px',
                        margin: '0 auto',
                    }}>
                        Experience learning in an environment designed for excellence
                    </p>
                </motion.div>

                <div className="grid-3">
                    {facilities.map((facility, index) => (
                        <motion.div
                            key={facility.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-2xl)',
                                overflow: 'hidden',
                                background: 'white',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                cursor: 'pointer',
                                height: '280px',
                            }}
                        >
                            {/* Image placeholder with gradient */}
                            <div style={{
                                width: '100%',
                                height: '180px',
                                background: facility.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '4rem',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {facility.icon}
                                {/* Animated overlay on hover */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 600,
                                    }}
                                >
                                    View Details
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div style={{
                                padding: 'var(--space-5)',
                            }}>
                                <h3 style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 700,
                                    color: 'var(--color-gray-900)',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    {facility.title}
                                </h3>
                                <p style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-gray-600)',
                                    margin: 0,
                                }}>
                                    {facility.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Facilities;
