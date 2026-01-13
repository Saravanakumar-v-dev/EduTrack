import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    const scrollToExplore = () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="home"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #10B981 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
            }} />

            <div className="container" style={{
                position: 'relative',
                zIndex: 1,
                paddingTop: '6rem',
                paddingBottom: '4rem',
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center',
                }}>
                    {/* Animated badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-full)',
                            color: 'white',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            marginBottom: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <Sparkles size={16} />
                        Excellence in Education Since 2010
                    </motion.div>

                    {/* Headline with stagger animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        Empowering Future
                        <br />
                        <span style={{
                            background: 'linear-gradient(to right, #FBBF24, #F59E0B)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Leaders & Innovators
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            fontSize: 'var(--text-xl)',
                            color: 'rgba(255, 255, 255, 0.95)',
                            marginBottom: '3rem',
                            lineHeight: 1.6,
                            maxWidth: '700px',
                            margin: '0 auto 3rem',
                        }}
                    >
                        Where academic excellence meets holistic development. Join our community of learners, thinkers, and achievers.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <motion.button
                            className="btn"
                            onClick={scrollToExplore}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'white',
                                color: 'var(--color-primary)',
                                padding: '1rem 2rem',
                                fontSize: 'var(--text-lg)',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Explore School
                            <ArrowRight size={20} />
                        </motion.button>

                        <motion.button
                            className="btn"
                            onClick={() => navigate('/auth')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                padding: '1rem 2rem',
                                fontSize: 'var(--text-lg)',
                                border: '2px solid white',
                            }}
                        >
                            🔐 EduTrack Login
                        </motion.button>
                    </motion.div>

                    {/* Floating stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        style={{
                            marginTop: '4rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '2rem',
                            maxWidth: '800px',
                            margin: '4rem auto 0',
                        }}
                    >
                        {[
                            { number: '2000+', label: 'Students' },
                            { number: '150+', label: 'Teachers' },
                            { number: '95%', label: 'Success Rate' },
                            { number: '50+', label: 'Awards' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + index * 0.1 }}
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    fontSize: 'var(--text-4xl)',
                                    fontWeight: 800,
                                    color: 'white',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 1.5 },
                    y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                }}
                onClick={scrollToExplore}
            >
                <span style={{ opacity: 0.9 }}>Scroll to explore</span>
                <div style={{
                    width: '24px',
                    height: '36px',
                    border: '2px solid white',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0.5rem 0',
                }}>
                    <div style={{
                        width: '4px',
                        height: '8px',
                        background: 'white',
                        borderRadius: 'var(--radius-full)',
                    }} />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
