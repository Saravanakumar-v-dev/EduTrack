import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Parent',
            image: '👩‍💼',
            rating: 5,
            text: 'EduTrack School has transformed my child\'s learning journey. The teachers are exceptional, and the holistic approach to education is truly commendable.',
        },
        {
            name: 'Raj Kumar',
            role: 'Alumni (Class of 2024)',
            image: '👨‍🎓',
            rating: 5,
            text: 'The foundation I received here prepared me excellently for college. The focus on both academics and extracurriculars created a well-rounded education.',
        },
        {
            name: 'Anita Patel',
            role: 'Parent',
            image: '👩',
            rating: 5,
            text: 'Outstanding facilities, caring staff, and a nurturing environment. My daughter has grown tremendously in confidence and academic performance.',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = testimonials.length - 1;
            if (nextIndex >= testimonials.length) nextIndex = 0;
            return nextIndex;
        });
    };

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    return (
        <section className="section" style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-full)',
                        color: 'white',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                    }}>
                        Testimonials
                    </span>
                    <h2 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        color: 'white',
                        marginBottom: '1rem',
                    }}>
                        What Our Community Says
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '700px',
                        margin: '0 auto',
                    }}>
                        Hear from our students, parents, and alumni
                    </p>
                </motion.div>

                {/* Carousel */}
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative',
                    minHeight: '300px',
                }}>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                            }}
                        >
                            <div style={{
                                background: 'white',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--space-10)',
                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                                position: 'relative',
                            }}>
                                {/* Quote icon */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: '40px',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                }}>
                                    <Quote size={24} />
                                </div>

                                {/* Rating */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.25rem',
                                    marginBottom: 'var(--space-4)',
                                    justifyContent: 'center',
                                }}>
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />
                                    ))}
                                </div>

                                {/* Text */}
                                <p style={{
                                    fontSize: 'var(--text-lg)',
                                    color: 'var(--color-gray-700)',
                                    lineHeight: 1.8,
                                    marginBottom: 'var(--space-6)',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                }}>
                                    "{testimonials[currentIndex].text}"
                                </p>

                                {/* Author */}
                                <div style={{
                                    textAlign: 'center',
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: 'var(--space-3)',
                                    }}>
                                        {testimonials[currentIndex].image}
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 700,
                                        color: 'var(--color-gray-900)',
                                        marginBottom: 'var(--space-1)',
                                    }}>
                                        {testimonials[currentIndex].name}
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-base)',
                                        color: 'var(--color-gray-600)',
                                    }}>
                                        {testimonials[currentIndex].role}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(-1)}
                            style={{
                                pointerEvents: 'all',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'white',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)',
                                transform: 'translateX(-24px)',
                            }}
                        >
                            <ChevronLeft size={24} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(1)}
                            style={{
                                pointerEvents: 'all',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'white',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)',
                                transform: 'translateX(24px)',
                            }}
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </div>

                    {/* Indicator dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        marginTop: '350px',
                    }}>
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                style={{
                                    width: currentIndex === index ? '32px' : '12px',
                                    height: '12px',
                                    borderRadius: 'var(--radius-full)',
                                    background: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-base)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
