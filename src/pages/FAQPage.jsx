import React, { useState } from 'react';
import faqImg from '../assets/images/faq.png';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is the minimum order value ?",
      answer: "Minimum order is Rs 1000"
    },
    {
      question: "How fast can you deliver?",
      answer: "Keeping the fast paced lives today and emergencies in mind, we wish to deliver your order ASAP. In our case the maximum time limit would be 2 hours, but we would want to reach your doorstep sooner."
    },
    {
      question: "Can I change the delivery address of my order?",
      answer: "You cannot change the delivery address once the order is placed. You can cancel the previous order and place a new one."
    },
    {
      question: "Gst?",
      answer: "Keeping the fast paced lives today and emergencies in mind, we wish to deliver your order ASAP. In our case the maximum time limit would be 2 hours, but we would want to reach your doorstep sooner."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page-wrapper">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; FAQs</p>
        </div>
      </div>

      <main className="container faq-main">
        <div className="faq-card">
          <div className="faq-content-grid">
            <div className="faq-image-side">
              <img src={faqImg} alt="FAQ Illustration" />
            </div>
            <div className="faq-accordion-side">
              {faqs.map((faq, index) => (
                <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                  <div className="faq-question" onClick={() => toggleAccordion(index)}>
                    <span className="faq-icon">{activeIndex === index ? '▲' : '▼'}</span>
                    <h3>{faq.question}</h3>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
