
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Clock, Sparkles } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Bespoke Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-['Poppins'] animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src="https://i.ibb.co/r2cDKYVw/CHIXATHAIR-2.jpg"
          alt="Contact Chixat Hair"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-6 py-2 rounded-full text-brand-light text-[10px] font-black uppercase tracking-[0.4em] mb-6 backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> Chixat Concierge
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tight">Support & Care</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black italic mb-6">Affordable Luxury, Personalized Support</h2>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Whether you're seeking your to buy our affordable and luxury hairs or have inquiries regarding your order, our team is available to ensure your experience is seamless and stylish.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">Email Inquiries</h3>
                <p className="text-sm font-bold text-gray-900">info@chixathair.com</p>
                <p className="text-sm font-bold text-gray-900">chixathair@gmail.com</p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                  <Phone className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">Hotline</h3>
                <p className="text-sm font-bold text-gray-900">09114546210</p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                  <MessageCircle className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">WhatsApp</h3>
                <a href="https://wa.me/2349114546210" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 hover:text-brand transition-colors">09114546210</a>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                  <Clock className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">Atelier Hours</h3>
                <p className="text-sm font-bold text-gray-900">Mon - Sat: 9AM - 6PM</p>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Our Maison</h3>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand shrink-0" />
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  No 1 Ogui Road,<br />
                  Enugu, Nigeria.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Send className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-2xl font-black italic mb-4">Message Received</h3>
                <p className="text-gray-500 mb-10">Our support team will respond to your inquiry within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Queen's Name"
                    className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium appearance-none"
                  >
                    <option>Bespoke Inquiry</option>
                    <option>Order Status</option>
                    <option>Wholesale/Partnership</option>
                    <option>Product Care</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we elevate your radiance today?"
                    className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-press w-full bg-black text-white py-6 md:py-8 rounded-full font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-brand transition-all shadow-xl shadow-black/5 disabled:bg-gray-300"
                >
                  {isSubmitting ? 'Delivering...' : 'Send Inquiry'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
