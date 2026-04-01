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
  Car,
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
      icon: <Security size={48} />,
      title: 'Comprehensive Coverage',
      description: 'Protect what matters most with our comprehensive insurance plans tailored to your needs.',
    },
    {
      icon: <CheckmarkFilled size={48} />,
      title: 'Fast Claims Processing',
      description: 'Get your claims processed quickly and efficiently with our streamlined digital process.',
    },
    {
      icon: <Car size={48} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist you when you need it most.',
    },
    {
      icon: <HomeIcon size={48} />,
      title: 'Flexible Plans',
      description: 'Choose from a variety of coverage options that fit your lifestyle and budget.',
    },
  ];

  const testimonials = [
    {
      quote: 'InsureCo made switching my insurance so easy. The process was smooth and the savings were immediate.',
      author: 'Sarah Johnson',
      role: 'Customer since 2022',
    },
    {
      quote: 'When I had a claim, they handled everything professionally and got me back on the road quickly.',
      author: 'Michael Chen',
      role: 'Customer since 2021',
    },
    {
      quote: 'Best insurance experience I\'ve had. The customer service is exceptional and the rates are competitive.',
      author: 'Emily Rodriguez',
      role: 'Customer since 2023',
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="hero-content">
              <Heading className="hero-heading">
                Protect Your Future with Confidence
              </Heading>
              <p className="hero-tagline">
                Comprehensive car and home insurance designed for the modern world. 
                Get covered in minutes with InsureCo.
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

      {/*
       * Car Insurance Section
       * ----------------------
       * This is a primary product showcase section anchored at #car-insurance so
       * it can be reached via the footer navigation link and any in-page anchor.
       *
       * Layout: Two equal columns (Carbon lg={8}) — left holds all copy/CTA,
       * right holds the photo with a floating rating badge.
       *
       * Design goals:
       *  - Establish authority with the "Most Popular" badge
       *  - Build trust through measurable social-proof stats
       *  - Lower purchase friction with the reassurance line under the CTA
       *  - Keep the visual focus on the image on larger viewports
       */}
      <section id="car-insurance" className="product-section car-insurance-section">
        <Grid>
          <Column lg={8} md={8} sm={4}>
            <div className="product-content">
              {/*
               * "Most Popular" badge — signals this product has the highest uptake,
               * nudging visitors toward it via social proof before they even read the copy.
               * Styled as a red pill using --interactive-primary so it inherits theme color.
               */}
              <span className="product-badge">Most Popular</span>
              <Heading className="product-heading">Car Insurance</Heading>
              <p className="product-description">
                Drive with total confidence. Our auto insurance wraps you in protection
                from every angle — so you can focus on the road ahead, not what could
                go wrong.
              </p>
              {/*
               * Stats Row
               * ----------
               * Three quantified proof-points separated by vertical dividers.
               * Each stat consists of a large brand-colored number and a small
               * supporting label. The entire row sits on a secondary background
               * tile to visually separate it from the surrounding copy.
               *
               * Stats are intentionally brief (e.g. "500K+" not "500,000+") to
               * maximise visual impact at a glance.
               */}
              <div className="car-stats-row">
                <div className="car-stat-item">
                  <span className="car-stat-number">500K+</span>
                  <span className="car-stat-label">Drivers protected</span>
                </div>
                <div className="car-stat-divider" />
                <div className="car-stat-item">
                  <span className="car-stat-number">$400</span>
                  <span className="car-stat-label">Avg. annual savings</span>
                </div>
                <div className="car-stat-divider" />
                <div className="car-stat-item">
                  <span className="car-stat-number">24hr</span>
                  <span className="car-stat-label">Claims turnaround</span>
                </div>
              </div>
              {/*
               * Coverage Features Grid
               * ----------------------
               * Extends the base .product-features list with a two-column CSS grid
               * layout via the .car-features-grid modifier class. Six features are
               * shown instead of the original four, giving a richer sense of value
               * without overwhelming the user. Each item uses the Carbon
               * CheckmarkFilled icon coloured with --color-success for quick scanning.
               */}
              <ul className="product-features car-features-grid">
                <li><CheckmarkFilled size={20} /> Collision coverage</li>
                <li><CheckmarkFilled size={20} /> Liability protection</li>
                <li><CheckmarkFilled size={20} /> Roadside assistance</li>
                <li><CheckmarkFilled size={20} /> Rental car coverage</li>
                <li><CheckmarkFilled size={20} /> Uninsured motorist</li>
                <li><CheckmarkFilled size={20} /> Gap coverage</li>
              </ul>
              {/*
               * CTA Group
               * ----------
               * Upgraded from a ghost "Learn More" button to a full primary
               * "Get My Quote" button to make the action more direct and conversion-
               * oriented. The reassurance line below reduces hesitation by
               * communicating zero commitment and a fast process.
               */}
              <div className="product-cta-group">
                <Button
                  kind="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  renderIcon={ArrowRight}
                >
                  Get My Quote
                </Button>
                <p className="cta-reassurance">No commitment. Takes 2 minutes.</p>
              </div>
            </div>
          </Column>
          <Column lg={8} md={8} sm={4}>
            {/*
             * Image Wrapper
             * --------------
             * Wraps the photo and the floating rating badge in a single relative
             * container so the badge can be absolutely positioned over the image.
             * The wrapper sets a min-height to maintain visual balance before the
             * image loads and on smaller viewports.
             */}
            <div className="car-image-wrapper">
              <div className="product-image">
                <img
                  src="https://images.pexels.com/photos/220309/pexels-photo-220309.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Modern blue sedan representing everyday auto insurance coverage"
                  loading="lazy"
                />
              </div>
              {/*
               * Floating Rating Badge
               * ----------------------
               * A small card positioned over the bottom-left of the image that
               * displays the average customer star rating. It uses
               * --background-primary and --border-subtle so it adapts to both
               * light and dark themes automatically. The badge reinforces trust
               * at the exact moment the visitor's eye is drawn to the photo.
               */}
              <div className="car-image-badge">
                <span className="car-image-badge-stars">★★★★★</span>
                <span className="car-image-badge-text">4.9 / 5 customer rating</span>
              </div>
            </div>
          </Column>
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
                Ready to Get Started?
              </Heading>
              <p className="cta-text">
                Join thousands of satisfied customers who trust InsureCo for their insurance needs.
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
                Protecting what matters most since 2020.
              </p>
            </div>
          </Column>
          <Column lg={3} md={2} sm={4}>
            <div className="footer-section">
              <h4 className="footer-heading">Products</h4>
              <ul className="footer-links">
                <li><a href="#car-insurance">Car Insurance</a></li>
                <li><a href="#home-insurance">Home Insurance</a></li>
                <li><button onClick={() => navigate('/signup')} className="footer-link-button">Bundle & Save</button></li>
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
