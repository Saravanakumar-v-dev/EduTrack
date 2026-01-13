import { motion } from 'framer-motion';
import { Target, Eye, Award } from 'lucide-react';

const About = () => {
    const cards = [
        {
            icon: <Target size={32} />,
            title: 'Our Vision',
            description: 'To be a globally recognized institution that nurtures creative thinkers, responsible citizens, and lifelong learners who contribute meaningfully to society.',
            color: '#4F46E5',
        },
        {
            icon: <Eye size={32} />,
            title: 'Our Mission',
            description: 'To provide a holistic, student-centered education that combines academic rigor with character development, fostering innovation and critical thinking.',
            color: '#10B981',
        },
        {
            icon: <Award size={32} />,
            title: 'Our Values',
            description: 'Excellence, Integrity, Innovation, Inclusivity, and Compassion form the cornerstone of our educational philosophy and community culture.',
            color: '#F59E0B',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <section id="about" className="section" style={{
            background: 'linear-gradient(to bottom, var(--color-gray-50), white)',
        }}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: 'var(--space-12)',
                    }}
                >
                    <motion.span
                        style={{
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
                        }}
                    >
                        About Us
                    </motion.span>
                    <h2 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        color: 'var(--color-gray-900)',
                        marginBottom: '1rem',
                    }}>
                        Building Tomorrow's Leaders
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-gray-600)',
                        maxWidth: '700px',
                        margin: '0 auto',
                    }}>
                        For over a decade, we've been committed to providing exceptional education that prepares students for success in an ever-changing world.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid-3"
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            variants={cardVariants}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--space-8)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                transition: 'all var(--transition-base)',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Gradient accent  */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(to right, ${card.color}, ${card.color}99)`,
                            }} />

                            {/* Icon */}
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-xl)',
                                    background: `linear-gradient(135deg, ${card.color}15, ${card.color}25)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: card.color,
                                    marginBottom: 'var(--space-6)',
                                }}
                            >
                                {card.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 700,
                                color: 'var(--color-gray-900)',
                                marginBottom: 'var(--space-4)',
                            }}>
                                {card.title}
                            </h3>
                            <p style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--color-gray-600)',
                                lineHeight: 1.7,
                                margin: 0,
                            }}>
                                {card.description}
                            </p>

                            {/* Hover gradient overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '0',
                                background: `linear-gradient(to top, ${card.color}08, transparent)`,
                                transition: 'height var(--transition-base)',
                                pointerEvents: 'none',
                            }} className="hover-overlay" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        marginTop: 'var(--space-16)',
                        padding: 'var(--space-10)',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        borderRadius: 'var(--radius-2xl)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-8)',
                    }}
                >
                    {[
                        { value: '14+', label: 'Years of Excellence' },
                        { value: 'Top 10', label: 'Nationally Ranked' },
                        { value: '100%', label: 'College Placement' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            <div style={{
                                fontSize: 'var(--text-4xl)',
                                fontWeight: 800,
                                color: 'white',
                                marginBottom: '0.5rem',
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: 'var(--text-base)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                            }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
        .hover-overlay {
          height: 100% !important;
        }
      `}</style>
        </section>
    );
};

export default About;
