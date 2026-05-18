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
        <div className="fixed top-0 left-0 right-0 w-full z-[1000]">
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full transition-all duration-300 ease-in-out ${
                    isScrolled 
                        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md py-2' 
                        : 'bg-transparent py-4'
                }`}
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
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            padding: '4px'
                        }}
                    >
                        <img src="/logo.png" alt="EduTrack Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                        <h2 className="text-gray-900 dark:text-white" style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 700,
                            lineHeight: 1,
                            marginBottom: '0.25rem',
                        }}>
                            EduTrack School
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400" style={{
                            fontSize: 'var(--text-xs)',
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
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: 600,
                                textDecoration: 'none',
                                cursor: 'pointer',
                            }}
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
                    className="mobile-menu-btn text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
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
                    }}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.button>
            </div>
        </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1001,
                            }}
                        />
                        
                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '280px',
                                zIndex: 1002,
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
                            }}
                        >
                            {/* Sidebar Header */}
                            <div className="border-b border-gray-100 dark:border-gray-800" style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: 'white',
                                        padding: '2px'
                                    }}>
                                        <img src="/logo.png" alt="EduTrack Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <span className="text-gray-900 dark:text-white" style={{ fontWeight: 700 }}>EduTrack</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                    style={{
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Links */}
                            <div style={{
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                flex: 1,
                                overflowY: 'auto',
                            }}>
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800"
                                        style={{
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            padding: '0.75rem 0',
                                        }}
                                    >
                                        {link.name}
                                    </motion.a>
                                ))}

                                <motion.button
                                    className="btn btn-accent"
                                    onClick={handleLoginClick}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                >
                                    🔐 EduTrack Login
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
