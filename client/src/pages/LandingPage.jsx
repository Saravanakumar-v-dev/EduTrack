import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Academics from '../components/landing/Academics';
import Facilities from '../components/landing/Facilities';
import Events from '../components/landing/Events';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';
import '../styles/landing.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <About />
            <Academics />
            <Facilities />
            <Events />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default LandingPage;
