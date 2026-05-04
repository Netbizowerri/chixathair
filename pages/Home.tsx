import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ChevronRight, ChevronLeft, Sparkles, Play, X, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useCurrency } from '../context/currency';

interface HomeProps {
  products: Product[];
}

const SLIDES = [
  {
    image: 'https://i.ibb.co/rKm11FV6/CHIXATHAIR.jpg',
    mobileImage: 'https://i.ibb.co/spNfVVrp/1.jpg',
    subtitle: 'Signature Collection',
    title: 'Very Affordable and ',
    titleBold: 'Quality Fiber Mix Wigs.',
    description: 'Discover the world of Chixat Hair. High Quality Fiber Mix hair for the uncompromising woman who values style and affordability.'
  },
  {
    image: 'https://i.ibb.co/7dfSgQYj/CHIXATHAIR-1.jpg',
    mobileImage: 'https://i.ibb.co/nsPSpMxb/2.jpg',
    subtitle: 'Affordable Elegance',
    title: 'Affordable Luxury ',
    titleBold: 'Experience.',
    description: 'Our signature textures are crafted to empower and elevate your natural beauty at a fraction of the cost.'
  },
  {
    image: 'https://i.ibb.co/r2cDKYVw/CHIXATHAIR-2.jpg',
    mobileImage: 'https://i.ibb.co/fdwyD6SQ/3.jpg',
    subtitle: 'The Perfect Finish',
    title: 'Beauty in Every ',
    titleBold: 'Moment.',
    description: 'Our High Quality Fiber Mix is designed by Edna for a premium look at an unbeatable price.'
  }
];

const Home: React.FC<HomeProps> = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeVideoProduct, setActiveVideoProduct] = useState<Product | null>(null);
  const { formatPrice } = useCurrency();

  const featured = products.filter(p => p.isFeatured).slice(0, 12);
  const videoProducts = products.filter(p => p.video);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, 800);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      setIsTransitioning(false);
    }, 800);
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=0&autopause=0&title=0&byline=0&portrait=0&badge=0&player_id=0&app_id=58479`;
    }
    return null;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 440 : 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-700 font-['Poppins']">
      <SEO
        title="High Quality Fiber Mix Hair Extensions"
        description="Discover Chixat Hair by Edna - High Quality Fiber Mix hair extensions and bespoke styles. Premium quality at an affordable price for the uncompromising woman."
      />
      {/* Hero Slider Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full flex items-center overflow-hidden bg-[#0a0a0a] md:rounded-b-[3rem] shadow-2xl">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
              <img
                src={slide.image}
                alt="Chixat Luxury Hair"
                className={`w-full h-full object-cover object-top ${idx === currentSlide && !isTransitioning ? 'animate-assemble' :
                  idx === currentSlide && isTransitioning ? 'animate-disintegrate' : ''
                  }`}
              />
            </picture>
            <div className="absolute inset-0 bg-black/40 z-[1]"></div>
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
          <div className="max-w-3xl" key={currentSlide}>
            <div className="text-reveal mb-4">
              <span className="flex items-center gap-2 uppercase tracking-[0.4em] text-[10px] font-black text-brand-light">
                <Sparkles className="w-3 h-3" /> {SLIDES[currentSlide].subtitle}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              <div className="text-reveal">
                <span className="delay-100">{SLIDES[currentSlide].title}</span>
              </div>
              <div className="text-reveal">
                <span className="text-brand-light delay-200">{SLIDES[currentSlide].titleBold}</span>
              </div>
            </h1>

            <div className="text-reveal mb-10">
              <p className="text-sm md:text-lg text-white/80 max-w-lg delay-300 leading-relaxed font-light">
                {SLIDES[currentSlide].description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-reveal">
                <Link to="/shop" className="btn-press w-full sm:w-auto inline-block bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:bg-brand hover:text-white transition-all text-center delay-[400ms] shadow-2xl">
                  SHOP NOW
                </Link>
              </div>
              <div className="text-reveal">
                <Link to="/contact" className="btn-press w-full sm:w-auto inline-block bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-black transition-all text-center delay-500">
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-6 md:right-16 z-20 flex gap-4">
          <button onClick={handlePrev} className="btn-press p-4 border border-white/20 hover:bg-white/10 rounded-full text-white backdrop-blur-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} className="btn-press p-4 border border-white/20 hover:bg-white/10 rounded-full text-white backdrop-blur-md">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>


      {/* Featured Products Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black italic mb-2 tracking-tight">Affordable Fiber Mix Collections</h2>
          <p className="text-brand uppercase tracking-[0.4em] text-[10px] font-black">Curated by Edna Signature • Affordable Luxury</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16">
          {featured.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 rounded-3xl md:rounded-4xl shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-black text-gray-900 group-hover:text-brand transition-colors line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-brand font-bold text-sm">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Products Button */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/shop"
            className="btn-press group inline-flex items-center gap-6 bg-black text-white px-12 py-6 rounded-full font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand transition-all shadow-2xl shadow-black/10"
          >
            View More Products <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Personalized Quote Banner */}
      <section className="bg-brand py-32 px-6 text-white text-center md:rounded-[4rem] mx-4 my-10 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <img src="https://i.ibb.co/gFrtgKdc/Chixat-Hair.png" alt="Chixat Hair" className="h-[125px] md:h-[150px] mx-auto mb-12 brightness-0 invert animate-float" />
          <h2 className="text-4xl md:text-7xl font-black mb-10 italic leading-tight">"A queen is only as radiant as her crown."</h2>
          <p className="text-lg md:text-xl font-light tracking-[0.3em] uppercase opacity-80"> — Edna, Creative Director</p>
        </div>
      </section>

      {/* #ChixatQueens Spotting - Maison Spotlight */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-brand">#ChixatQueens</h2>
            <p className="text-3xl md:text-4xl font-black italic">Maison Spotlight</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scrollCarousel('left')} className="p-3 bg-gray-50 window-transition-all hover:bg-brand hover:text-white transition-all rounded-full border border-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollCarousel('right')} className="p-3 bg-gray-50 window-transition-all hover:bg-brand hover:text-white transition-all rounded-full border border-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-12 pb-6">
          {videoProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[70vw] md:w-[320px] aspect-[9/16] bg-black rounded-4xl overflow-hidden relative group snap-center shadow-md cursor-pointer"
              onClick={() => setActiveVideoProduct(product)}
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                />
              </div>

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 shadow-2xl transition-all scale-100 group-hover:scale-110 group-hover:bg-brand/80 group-hover:border-brand">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-8 left-6 right-6 text-white z-10">
                <h3 className="text-lg font-black italic leading-tight drop-shadow-lg">{product.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-light mt-2 opacity-100 transition-opacity">Click to View</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {activeVideoProduct && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-500">
            <button onClick={() => setActiveVideoProduct(null)} className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110] transition-transform hover:rotate-90">
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(174,122,39,0.3)] border border-white/10">
              {activeVideoProduct.video?.includes('vimeo.com') ? (
                <iframe
                  key={activeVideoProduct.id}
                  src={getVimeoEmbedUrl(activeVideoProduct.video) || ''}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={activeVideoProduct.video} autoPlay controls className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-10 left-8 right-8 bg-black/20 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 flex justify-between items-center shadow-2xl">
                <div>
                  <h4 className="font-black text-xl italic text-white mb-1">{activeVideoProduct.name}</h4>
                  <p className="text-xs font-black text-brand-light tracking-widest uppercase">{formatPrice(activeVideoProduct.price)}</p>
                </div>
                <Link to={`/product/${activeVideoProduct.id}`} onClick={() => setActiveVideoProduct(null)} className="bg-brand text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Secure Piece</Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
