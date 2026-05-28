import React, { useState } from 'react';
import {
  Grid,
  Column,
  Button,
  Tile,
  Modal,
  TextInput,
  TextArea,
  Heading,
  Stack,
} from '@carbon/react';
import {
  Security,
  Home as HomeIcon,
  CheckmarkFilled,
  ArrowRight,
} from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const features = [
    {
      icon: <HomeIcon size={48} />,
      title: 'Whole-Home Coverage',
      description: 'Protect your house, belongings, and everything in between with policies built for homeowners.',
    },
    {
      icon: <CheckmarkFilled size={48} />,
      title: 'Fast Claims Processing',
      description: 'File a claim from your phone and get repairs underway quickly with our streamlined digital process.',
    },
    {
      icon: <Security size={48} />,
      title: '24/7 Support',
      description: 'Our dedicated home insurance specialists are available around the clock when disaster strikes.',
    },
    {
      icon: <CheckmarkFilled size={48} />,
      title: 'Flexible Plans',
      description: 'Choose from dwelling, contents, and liability options that fit the way you live at home.',
    },
  ];

  const testimonials = [
    {
      quote: 'InsureCo made insuring our new home so easy. The process was smooth and the savings were immediate.',
      author: 'Sarah Johnson',
      role: 'Homeowner since 2022',
    },
    {
      quote: 'When a storm damaged our roof, they handled everything professionally and got repairs done quickly.',
      author: 'Michael Chen',
      role: 'Homeowner since 2021',
    },
    {
      quote: 'Best home insurance experience I\'ve had. The customer service is exceptional and the rates are competitive.',
      author: 'Emily Rodriguez',
      role: 'Homeowner since 2023',
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/9518191/9518191-hd_720_1366_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="hero-content">
              <Heading className="hero-heading">
                Protect Your Home with Confidence
              </Heading>
              <p className="hero-tagline">
                Comprehensive home insurance designed for the modern homeowner.
                Get your house covered in minutes with InsureCo.
              </p>
              <div className="hero-actions">
                <Button
                  kind="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  renderIcon={ArrowRight}
                >
                  Sign Up Now
                </Button>
                <Button
                  kind="secondary"
                  size="lg"
                  onClick={() => setDemoModalOpen(true)}
                >
                  Get a Demo
                </Button>
              </div>
            </div>
          </Column>
        </Grid>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Heading className="section-heading">
              Why Choose InsureCo?
            </Heading>
          </Column>
          {features.map((feature, index) => (
            <Column lg={4} md={4} sm={4} key={index}>
              <Tile className="feature-tile">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Tile>
            </Column>
          ))}
        </Grid>
      </section>

      {/* Home Insurance Section */}
      <section id="home-insurance" className="product-section home-insurance-section">
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <div className="product-image">
              <img
                src="https://images.pexels.com/photos/7587856/pexels-photo-7587856.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern suburban home representing comprehensive home insurance protection"
                loading="lazy"
              />
            </div>
          </Column>
          <Column lg={8} md={4} sm={4}>
            <div className="product-content">
              <div className="product-icon">
                <HomeIcon size={64} />
              </div>
              <Heading className="product-heading">Home Insurance</Heading>
              <p className="product-description">
                Protect your home and belongings with our comprehensive homeowners insurance. 
                Coverage for property damage, personal liability, and more. Your peace of mind 
                is our priority.
              </p>
              <ul className="product-features">
                <li><CheckmarkFilled size={20} /> Property damage coverage</li>
                <li><CheckmarkFilled size={20} /> Personal liability protection</li>
                <li><CheckmarkFilled size={20} /> Natural disaster coverage</li>
                <li><CheckmarkFilled size={20} /> Personal property protection</li>
              </ul>
              <Button
                kind="tertiary"
                onClick={() => navigate('/signup')}
                renderIcon={ArrowRight}
              >
                Learn More
              </Button>
            </div>
          </Column>
        </Grid>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Heading className="section-heading">
              What Our Customers Say
            </Heading>
          </Column>
          {testimonials.map((testimonial, index) => (
            <Column lg={5} md={4} sm={4} key={index}>
              <Tile className="testimonial-tile">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </Tile>
            </Column>
          ))}
        </Grid>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="cta-content">
              <Heading className="cta-heading">
                Ready to Protect Your Home?
              </Heading>
              <p className="cta-text">
                Join thousands of satisfied homeowners who trust InsureCo to protect their houses.
              </p>
              <Button
                kind="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                renderIcon={ArrowRight}
              >
                Get Your Free Quote
              </Button>
            </div>
          </Column>
        </Grid>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Grid>
          <Column lg={4} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">InsureCo</h4>
              <p className="footer-description">
                Protecting homes and the people in them since 2020.
              </p>
            </div>
          </Column>
          <Column lg={3} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">Products</h4>
              <ul className="footer-links">
                <li><a href="#home-insurance">Home Insurance</a></li>
                <li><button onClick={() => navigate('/signup')} className="footer-link-button">Condo Insurance</button></li>
                <li><button onClick={() => navigate('/signup')} className="footer-link-button">Renters Insurance</button></li>
              </ul>
            </div>
          </Column>
          <Column lg={3} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><button onClick={() => navigate('/about')} className="footer-link-button">About Us</button></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </Column>
          <Column lg={3} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#help">Help Center</a></li>
                <li><button onClick={() => navigate('/dashboard')} className="footer-link-button">File a Claim</button></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </Column>
          <Column lg={3} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-links">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </Column>
        </Grid>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="footer-bottom">
              <p>&copy; 2024 InsureCo. All rights reserved.</p>
            </div>
          </Column>
        </Grid>
      </footer>

      {/* Demo Request Modal */}
      <Modal
        open={demoModalOpen}
        onRequestClose={() => setDemoModalOpen(false)}
        modalHeading="Request a Demo"
        primaryButtonText="Submit Request"
        secondaryButtonText="Cancel"
        onRequestSubmit={(e) => {
          e.preventDefault();
          setDemoModalOpen(false);
          alert('Thank you for your interest! We will contact you soon.');
        }}
        size="sm"
      >
        <Stack gap={6}>
          <TextInput
            id="demo-name"
            labelText="Full Name"
            placeholder="Enter your name"
          />
          <TextInput
            id="demo-email"
            labelText="Email Address"
            placeholder="Enter your email"
            type="email"
          />
          <TextInput
            id="demo-phone"
            labelText="Phone Number"
            placeholder="Enter your phone number"
            type="tel"
          />
          <TextArea
            id="demo-message"
            labelText="Message (Optional)"
            placeholder="Tell us about your insurance needs"
            rows={4}
          />
        </Stack>
      </Modal>
    </div>
  );
}
