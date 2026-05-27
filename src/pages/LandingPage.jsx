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
      stat: '$2.5B+',
      statLabel: 'in claims paid',
      title: 'Coverage You Can Count On',
      description: "From fender-benders to total losses, we've got you covered with policies built around real life — not fine print.",
    },
    {
      icon: <CheckmarkFilled size={48} />,
      stat: '48 hrs',
      statLabel: 'average payout',
      title: 'Lightning-Fast Claims',
      description: 'File in minutes from your phone, track progress in real time, and get paid in days — not weeks.',
    },
    {
      icon: <Car size={48} />,
      stat: '24/7',
      statLabel: 'live support',
      title: 'Humans, Not Hold Music',
      description: 'Real agents available around the clock. Call, chat, or text — we answer in under 60 seconds, day or night.',
    },
    {
      icon: <HomeIcon size={48} />,
      stat: '15%',
      statLabel: 'avg. savings',
      title: 'Built Around You',
      description: "Bundle and save, adjust on the fly, and pay only for what you need. No surprises, no upsells — ever.",
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
            <div className="features-intro">
              <span className="features-eyebrow">Why InsureCo</span>
              <Heading className="section-heading">
                Insurance that actually <em>has your back.</em>
              </Heading>
              <p className="features-subtitle">
                Trusted by 500,000+ drivers and homeowners across the country. Here's what makes us different.
              </p>
            </div>
          </Column>
          {features.map((feature, index) => (
            <Column lg={4} md={4} sm={4} key={index}>
              <Tile className="feature-tile">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-stat">
                  <span className="feature-stat__value">{feature.stat}</span>
                  <span className="feature-stat__label">{feature.statLabel}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Tile>
            </Column>
          ))}
        </Grid>
      </section>

      {/* Car Insurance Section */}
      <section id="car-insurance" className="product-section car-insurance-section">
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <div className="product-content">
              <span className="product-eyebrow">
                <Car size={16} /> Auto Insurance
              </span>
              <Heading className="product-heading">
                Coverage that keeps up with <em>every mile.</em>
              </Heading>
              <p className="product-description">
                Get a personalized quote in under 5 minutes, lock in your rate, and hit the road knowing you're covered for whatever's around the next bend.
              </p>

              <div className="product-pricing">
                <div className="product-pricing__price">
                  <span className="product-pricing__currency">$</span>
                  <span className="product-pricing__amount">29</span>
                  <span className="product-pricing__period">/mo</span>
                </div>
                <span className="product-pricing__label">Starting rate · Save up to 30% when you bundle</span>
              </div>

              <ul className="product-features product-features--enhanced">
                <li>
                  <CheckmarkFilled size={20} />
                  <div>
                    <strong>Collision &amp; comprehensive</strong>
                    <span>Full repair coverage, even for hit-and-runs</span>
                  </div>
                </li>
                <li>
                  <CheckmarkFilled size={20} />
                  <div>
                    <strong>Liability protection up to $500K</strong>
                    <span>Industry-leading limits, included by default</span>
                  </div>
                </li>
                <li>
                  <CheckmarkFilled size={20} />
                  <div>
                    <strong>24/7 roadside assistance</strong>
                    <span>Tow, jump, or tire change in 30 min or less</span>
                  </div>
                </li>
                <li>
                  <CheckmarkFilled size={20} />
                  <div>
                    <strong>Rental car reimbursement</strong>
                    <span>Stay mobile while your car's in the shop</span>
                  </div>
                </li>
              </ul>

              <div className="product-actions">
                <Button
                  kind="primary"
                  onClick={() => navigate('/signup')}
                  renderIcon={ArrowRight}
                >
                  Get My Quote
                </Button>
                <Button
                  kind="ghost"
                  onClick={() => navigate('/signup')}
                >
                  See sample policy
                </Button>
              </div>
            </div>
          </Column>
          <Column lg={8} md={4} sm={4}>
            <div className="product-image">
              <img
                src="https://images.pexels.com/photos/220309/pexels-photo-220309.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern blue sedan representing everyday auto insurance coverage"
                loading="lazy"
              />
              <div className="product-image__badge product-image__badge--top">
                <span className="badge-rating">4.9★</span>
                <span className="badge-label">12,408 reviews</span>
              </div>
              <div className="product-image__badge product-image__badge--bottom">
                <CheckmarkFilled size={20} />
                <div>
                  <strong>Quote in 5 minutes</strong>
                  <span>No credit pull required</span>
                </div>
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

      {/* Sign Up CTA Section */}
      <section className="signup-cta-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="signup-cta-banner">
              <h2 className="signup-cta-banner__title">Sign Up for InsureCo</h2>
              <p className="signup-cta-banner__subtitle">
                Get started with your insurance coverage in just a few steps
              </p>
            </div>

            <div className="signup-cta-steps">
              {[
                { num: 1, label: 'Personal Info', desc: 'Your basic details' },
                { num: 2, label: 'Address', desc: 'Where you live' },
                { num: 3, label: 'Insurance Type', desc: 'Car, Home, or Both' },
                { num: 4, label: 'Coverage', desc: 'Pick your plan' },
                { num: 5, label: 'Review', desc: 'Confirm & submit' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.num}>
                  <div className="signup-cta-step">
                    <div className="signup-cta-step__marker">{step.num}</div>
                    <span className="signup-cta-step__label">{step.label}</span>
                    <span className="signup-cta-step__desc">{step.desc}</span>
                  </div>
                  {i < arr.length - 1 && <div className="signup-cta-step__line" />}
                </React.Fragment>
              ))}
            </div>

            <div className="signup-cta-action">
              <Button
                kind="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                renderIcon={ArrowRight}
              >
                Start Your Application
              </Button>
            </div>
          </Column>
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
