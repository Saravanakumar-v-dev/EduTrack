import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer id="contact" style={{
            background: 'linear-gradient(to bottom, var(--color-gray-900),  var(--color-gray-800))',
            color: 'white',
            paddingTop: 'var(--space-16)',
            paddingBottom: 'var(--space-8)',
        }}>
            <div className="container">
                <div className="grid-3" style={{ marginBottom: 'var(--space-12)', alignItems: 'start' }}>
                    {/* About Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: 'var(--space-4)',
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    marginBottom: '0.25rem',
                                }}>
                                    EduTrack School
                                </h3>
                                <p style={{
                                    fontSize: 'var(--text-xs)',
                                    opacity: 0.8,
                                    margin: 0,
                                    lineHeight: 1,
                                }}>
                                    Excellence in Education
                                </p>
                            </div>
                        </div>
                        <p style={{
                            fontSize: 'var(--text-base)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.7,
                        }}>
                            Empowering students to reach their full potential through innovative education and holistic development.
                        </p>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-4)',
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-3)',
                        }}>
                            {['Home', 'About', 'Academics', 'Facilities', 'Events'].map((link) => (
                                <motion.li key={link} whileHover={{ x: 5 }}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            textDecoration: 'none',
                                            fontSize: 'var(--text-base)',
                                            transition: 'color var(--transition-base)',
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = 'white'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                                    >
                                        {link}
                                    </a>
                                </motion.li>
                            ))}
                            <motion.li whileHover={{ x: 5 }}>
                                <a
                                    href="/auth"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/auth');
                                    }}
                                    style={{
                                        color: 'var(--color-accent-light)',
                                        textDecoration: 'none',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 600,
                                        transition: 'color var(--transition-base)',
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--color-accent-light)'}
                                >
                                    🔐 EduTrack Login
                                </a>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Contact Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-4)',
                        }}>
                            Contact Us
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-3)',
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                alignItems: 'flex-start',
                            }}>
                                <MapPin size={20} style={{ flexShrink: 0, marginTop: '0.25rem', opacity: 0.8 }} />
                                <span style={{
                                    fontSize: 'var(--text-base)',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.6,
                                }}>
                                    123 Education Lane, Knowledge City, India - 560001
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                alignItems: 'center',
                            }}>
                                <Phone size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
                                <a
                                    href="tel:+911234567890"
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    +91 123 456 7890
                                </a>
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                alignItems: 'center',
                            }}>
                                <Mail size={20} style={{ flexShrink: 0, opacity: 0.8 }} />
                                <a
                                    href="mailto:info@edutrackschool.edu"
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    info@edutrackschool.edu
                                </a>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-3)',
                            marginTop: 'var(--space-6)',
                        }}>
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Linkedin, href: '#' },
                            ].map(({ Icon, href }, index) => (
                                <motion.a
                                    key={index}
                                    href={href}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'all var(--transition-base)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 'var(--space-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-4)',
                    alignItems: 'center',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: 0,
                    }}>
                        © {new Date().getFullYear()} EduTrack School. All rights reserved.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-6)',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        <a
                            href="#"
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color var(--transition-base)',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color var(--transition-base)',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                transition: 'color var(--transition-base)',
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                        >
                            Admissions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
