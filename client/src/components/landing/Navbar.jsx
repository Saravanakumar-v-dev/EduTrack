import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import '../../styles/landing.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Detect scroll for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Academics', href: '#academics' },
        { name: 'Facilities', href: '#facilities' },
        { name: 'Events', href: '#events' },
        { name: 'Contact', href: '#contact' },
    ];

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/auth');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isScrolled
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'transparent',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                boxShadow: isScrolled
                    ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    : 'none',
            }}
        >
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem var(--container-padding)',
            }}>
                {/* Logo */}
                <motion.div
                    className="logo"
                    whileHover={{ scale: 1.05 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                    }}
                    onClick={() => scrollToSection('#home')}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 700,
                            color: 'var(--color-gray-900)',
                            lineHeight: 1,
                            marginBottom: '0.25rem',
                        }}>
                            EduTrack School
                        </h2>
                        <p style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-gray-600)',
                            lineHeight: 1,
                            margin: 0,
                        }}>
                            Excellence in Education
                        </p>
                    </div>
                </motion.div>

                {/* Desktop Navigation */}
                <div
                    className="desktop-nav"
                    style={{
                        display: 'none',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                >
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(link.href);
                            }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                            style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: 600,
                                color: 'var(--color-gray-700)',
                                textDecoration: 'none',
                                transition: 'color var(--transition-base)',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-700)'}
                        >
                            {link.name}
                        </motion.a>
                    ))}

                    <motion.button
                        className="btn btn-accent"
                        onClick={handleLoginClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            marginLeft: '1rem',
                        }}
                    >
                        🔐 EduTrack Login
                    </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        color: 'var(--color-gray-700)',
                    }}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            backgroundColor: 'white',
                            borderTop: '1px solid var(--color-gray-200)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            className="container"
                            style={{
                                padding: '1.5rem var(--container-padding)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(link.href);
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 600,
                                        color: 'var(--color-gray-700)',
                                        textDecoration: 'none',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid var(--color-gray-100)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}

                            <motion.button
                                className="btn btn-accent"
                                onClick={handleLoginClick}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                }}
                            >
                                🔐 EduTrack Login
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
        </motion.nav>
    );
};

export default Navbar;
