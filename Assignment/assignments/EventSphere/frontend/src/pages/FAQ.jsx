import React from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqItems = [
    {
      question: "How do I register for an event?",
      answer: "To register for an event, navigate to the Events page, select the event you're interested in, and click the 'Register' button. You'll need to be logged in to complete the registration process."
    },
    {
      question: "Can I cancel my event registration?",
      answer: "Yes, you can cancel your registration by going to your Dashboard and selecting the 'Cancel Registration' option next to the event you wish to cancel."
    },
    {
      question: "Are there refunds for canceled registrations?",
      answer: "Refund policies vary by event. Please check the specific event details page or contact our support team for information about refunds for a particular event."
    },
    {
      question: "How can I contact the event organizer?",
      answer: "Event organizer contact information is typically provided on the event details page. Alternatively, you can reach out to our support team through the Contact page, and we'll connect you with the organizer."
    },
    {
      question: "Can I update my profile information?",
      answer: "Yes, you can update your profile information by navigating to your Dashboard and selecting the 'Edit Profile' option."
    },
    {
      question: "I forgot my password. How can I reset it?",
      answer: "On the login page, click the 'Forgot Password' link and follow the instructions sent to your registered email address to reset your password."
    },
    {
      question: "How do I become an event organizer on EventSphere?",
      answer: "To become an event organizer, please contact our team through the Contact page with details about your organization and the types of events you'd like to host."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We do not store your complete credit card details on our servers."
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about EventSphere</p>
      </div>
      
      <div className="faq-content">
        {faqItems.map((item, index) => (
          <div className="faq-item" key={index}>
            <h3 className="faq-question">
              <span className="faq-icon">❓</span> {item.question}
            </h3>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="faq-contact">
        <h2>Still have questions?</h2>
        <p>If you couldn't find the answer to your question, feel free to reach out to us.</p>
        <div className="faq-buttons">
          <a href="/contact" className="faq-contact-btn">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;