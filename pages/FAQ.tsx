
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Scissors, Ruler, Heart, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-lg md:text-xl font-black italic transition-colors ${isOpen ? 'text-brand' : 'text-gray-900 group-hover:text-brand'}`}>
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-brand shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-brand shrink-0" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] pb-8' : 'max-h-0'}`}>
        <div className="text-gray-500 leading-relaxed font-medium text-sm md:text-base pr-10">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const fittingContent = (
    <div className="space-y-4">
      <p>Our wigs come with an adjustable elastic band and internal combs for a secure, glueless fit. However, selecting the right cap size is vital for the perfect melt:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Petite (Small):</strong> 21" - 21.5" circumference</li>
        <li><strong>Average (Medium):</strong> 22" - 22.5" circumference (Standard)</li>
        <li><strong>Large:</strong> 23" - 23.5" circumference</li>
      </ul>
      <p className="italic text-brand text-xs">Tip: Flatten your natural hair as much as possible before measuring for an accurate fit.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-['Poppins'] animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="relative h-[30vh] md:h-[45vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src="https://i.ibb.co/7dfSgQYj/CHIXATHAIR-1.jpg"
          alt="Chixat FAQ"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-6 py-2 rounded-full text-brand-light text-[10px] font-black uppercase tracking-[0.4em] mb-6 backdrop-blur-md">
            <HelpCircle className="w-3 h-3" /> Support & Care
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tight">Fitting & FAQ</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-8 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Quick Support
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-10">
                Cant find the answer to your bespoke query? Our stylists are available for live consultations via WhatsApp.
              </p>
              <a href="https://wa.me/2348123456789" className="btn-press flex items-center justify-center gap-3 w-full bg-black text-white py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all">
                Talk to a Stylist
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10 text-center">
                <Ruler className="w-6 h-6 text-brand mx-auto mb-3" />
                <span className="text-[8px] font-black uppercase tracking-widest text-brand">Sizing Guide</span>
              </div>
              <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10 text-center">
                <Scissors className="w-6 h-6 text-brand mx-auto mb-3" />
                <span className="text-[8px] font-black uppercase tracking-widest text-brand">Custom Cuts</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Frequently Asked Questions</h2>

              <FAQItem
                question="What makes our 'Fiber Mix' hair special?"
                answer="Our High Quality Fiber Mix hair is a premium blend designed to mimic the natural texture and luster of human hair while remaining incredibly affordable. It is durable, tangle-resistant, and offers a luxurious look without the premium price tag."
              />

              <FAQItem
                question="How do I ensure my wig fits perfectly?"
                answer={fittingContent}
              />

              <FAQItem
                question="How do I style my Chixat pieces?"
                answer="Our High Quality Fiber Mix pieces are pre-styled for your convenience. If you wish to restyle, use low-heat tools and avoid high-temperature styling to preserve the fiber's longevity. Our signature designs provide a seamless, natural look for every queen."
              />

              <FAQItem
                question="How do I care for my Fiber Mix pieces?"
                answer="While our fiber mix is highly durable, we recommend avoiding extreme heat. For styling, use low-temperature tools. The best part is that our fiber mix maintains its style even after washing, giving you consistent beauty every time."
              />

              <FAQItem
                question="How do I maintain the bounce and silkiness?"
                answer="Wash your pieces every 2-3 weeks using sulfate-free shampoo and deep conditioners. Always air dry when possible. For our straight textures, a light silk-press serum and heat protectant are recommended before styling. Store your crowns on a wig stand or in the original silk bag provided."
              />

              <FAQItem
                question="How long does shipping take?"
                answer="Ready-to-wear pieces typically ship within 24-48 hours. Bespoke or custom-colored units require 5-7 business days for creation. Local delivery within Lagos takes 24 hours, while international shipping (DHL Express) takes 3-5 business days."
              />

              <FAQItem
                question="Do you offer installation services?"
                answer="We currently provide exclusive installation services at our Lekki Atelier for local clients. Please contact our concierge to book an appointment with Edna's preferred stylists."
              />
            </div>

            <div className="mt-20 p-10 bg-white rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6 text-left">
                <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-8 h-8 text-brand" />
                </div>
                <div>
                  <h4 className="text-xl font-black italic">Quality Guaranteed</h4>
                  <p className="text-xs text-gray-500 font-medium">Every piece is hand-inspected by Edna.</p>
                </div>
              </div>
              <Link to="/returns" className="text-[10px] font-black uppercase tracking-[0.3em] text-brand hover:text-black transition-colors flex items-center gap-2">
                Read Return Policy <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;
