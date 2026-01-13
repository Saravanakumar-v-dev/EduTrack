import { motion } from 'framer-motion';
import { BookOpen, Calculator, Beaker, Globe2, Palette, Music } from 'lucide-react';

const Academics = () => {
    const subjects = [
        { icon: <BookOpen size={28} />, name: 'Language Arts', color: '#4F46E5', description: 'English & Literature' },
        { icon: <Calculator size={28} />, name: 'Mathematics', color: '#10B981', description: 'Algebra to Calculus' },
        { icon: <Beaker size={28} />, name: 'Sciences', color: '#F59E0B', description: 'Physics, Chemistry & Biology' },
        { icon: <Globe2 size={28} />, name: 'Social Studies', color: '#8B5CF6', description: 'History & Geography' },
        { icon: <Palette size={28} />, name: 'Arts & Design', color: '#EC4899', description: 'Visual & Digital Arts' },
        { icon: <Music size={28} />, name: 'Music & Drama', color: '#14B8A6', description: 'Performing Arts' },
    ];

    return (
        <section id="academics" className="section" style={{ background: 'white' }}>
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
                        Academics
                    </span>
                    <h2 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        color: 'var(--color-gray-900)',
                        marginBottom: '1rem',
                    }}>
                        Comprehensive Curriculum
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-gray-600)',
                        maxWidth: '700px',
                        margin: '0 auto',
                    }}>
                        Our rigorous academic programs challenge students to reach their full potential
                    </p>
                </motion.div>

                <div className="grid-3">
                    {subjects.map((subject, index) => (
                        <motion.div
                            key={subject.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-6)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                border: `2px solid ${subject.color}20`,
                                transition: 'all var(--transition-base)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: `linear-gradient(135deg, ${subject.color}, ${subject.color}CC)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                {subject.icon}
                            </motion.div>
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 700,
                                color: 'var(--color-gray-900)',
                                marginBottom: 'var(--space-2)',
                            }}>
                                {subject.name}
                            </h3>
                            <p style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--color-gray-600)',
                                margin: 0,
                            }}>
                                {subject.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Academics;
