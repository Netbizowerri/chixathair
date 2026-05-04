import React from 'react';
import { Sparkles, Heart, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#fcfbf7] font-['Poppins'] animate-in fade-in duration-700">
            <SEO
                title="Our Story | Chixat Hair"
                description="Discover the passion behind Chixat Hair. We specialize in high-quality fiber mix hair that offers affordable luxury to every queen."
            />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-black">
                <img
                    src="https://i.ibb.co/bj9GL64M/Whats-App-Image-2026-01-28-at-10-55-39-PM-1.jpg"
                    alt="About Chixat Hair"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                <div className="relative z-10 text-center text-white px-6">
                    <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-6 py-2 rounded-full text-brand-light text-[10px] font-black uppercase tracking-[0.4em] mb-6 backdrop-blur-md">
                        <Sparkles className="w-3 h-3" /> Since 2024
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tight">Our Story</h1>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="py-20 lg:py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black italic mb-8 leading-tight">Affordable Luxury for Every Queen.</h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                At Chixat Hair, we believe that elegance shouldn't come with an unreachable price tag. Our mission is to bridge the gap between high-end style and everyday affordability.
                            </p>
                        </div>

                        <p className="text-gray-500 leading-relaxed">
                            Founded by Edna, Chixat Hair was born from a vision to empower women with premium-looking hair that maintains its luster, bounce, and beauty without the extreme cost of raw virgin hair. We specialize in **High Quality Fiber Mix**—a meticulously crafted blend that mimics the natural movement and sheen of human hair.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Heart className="w-6 h-6 text-brand" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-2">Passion Driven</h4>
                                    <p className="text-xs text-gray-400">Every unit is curated with love and precision.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-brand" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-2">Quality Mix</h4>
                                    <p className="text-xs text-gray-400">Premium fibers for a long-lasting, natural look.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl">
                            <img
                                src="https://i.ibb.co/bj9GL64M/Whats-App-Image-2026-01-28-at-10-55-39-PM-1.jpg"
                                alt="Edna, Founder of Chixat Hair"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-3xl shadow-2xl hidden md:block border border-gray-50">
                            <p className="text-3xl font-black italic text-brand mb-2">"True beauty is affordable."</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">— Edna, Founder</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-black text-white text-center md:rounded-[4rem] mx-4 mb-20 overflow-hidden relative">
                <div className="absolute inset-0 bg-brand/10 opacity-50"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <ShoppingBag className="w-10 h-10 text-brand mx-auto mb-8" />
                    <h2 className="text-3xl md:text-5xl font-black italic mb-10">Start Your Journey with Chixat.</h2>
                    <Link
                        to="/shop"
                        className="btn-press inline-flex items-center gap-6 bg-brand text-white px-12 py-6 rounded-full font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl"
                    >
                        Explore Collections <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
