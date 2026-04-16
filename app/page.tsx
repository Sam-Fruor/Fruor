"use client";

import React, { useState, useEffect, useRef } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { ContactForm } from "@/components/contact-form";
import { CustomCursor } from "@/components/ui/custom-cursor";
import Image from "next/image";

// ==========================================
// 1. BOOT SEQUENCE
// ==========================================
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const sequence = [
      "> Connecting to Dubai Edge Servers...",
      "> Loading Mobile Environment... [OK]",
      "> Initializing Architecture... [OK]",
      "> System Ready."
    ];
    let delay = 0;
    sequence.forEach((line, index) => {
      delay += index === 0 ? 400 : Math.random() * 300 + 200;
      setTimeout(() => setLines((prev) => [...prev, line]), delay);
    });
    setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        document.body.style.overflow = "auto";
        onComplete();
      }, 600);
    }, delay + 800);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z- bg-[#0A0A0A] flex flex-col justify-center px-8 md:px-24 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="font-mono text-sm md:text-base text-green-500 flex flex-col gap-3 max-w-3xl mx-auto w-full">
        {lines.map((line, i) => <div key={i} className="animate-pulse">{line}</div>)}
        <div className="w-3 h-5 bg-green-500 animate-pulse mt-2"></div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MAGNETIC BUTTON
// ==========================================
function MagneticButton({ children, href, className }: { children: React.ReactNode, href: string, className: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 }); 
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <a ref={ref} href={href} onMouseMove={handleMouse} onMouseLeave={reset} className={className} style={{ transform: `translate(${position.x}px, ${position.y}px)`, transition: position.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out' }}>
      {children}
    </a>
  );
}

// ==========================================
// 3. MOBILE-OPTIMIZED PARTICLE NETWORK
// ==========================================
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particlesArray: any[] = [];
    let mouse = { x: null as number | null, y: null as number | null, radius: 100 };

    class Particle {
      x: number; y: number; directionX: number; directionY: number; size: number;
      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx!.fillStyle = '#D97757';
        ctx!.fill();
      }
      update() {
        if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;
        
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas!.width - this.size * 10) this.x += 1;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1;
            if (mouse.y < this.y && this.y < canvas!.height - this.size * 10) this.y += 1;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1;
          }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      const isMobile = window.innerWidth < 768;
      // Drastically reduce particles on mobile to save battery and prevent lag
      let numberOfParticles = isMobile ? 15 : Math.min(40, (canvas!.height * canvas!.width) / 25000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          if (distance < 15000) { 
            opacityValue = 1 - (distance / 15000);
            ctx!.strokeStyle = `rgba(217, 119, 87, ${opacityValue * 0.15})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < particlesArray.length; i++) particlesArray[i].update();
      connect();
    }

    const handleResize = () => { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight; init(); };
    const handleMouseMove = (event: MouseEvent) => { mouse.x = event.clientX; mouse.y = event.clientY; };
    const handleMouseOut = () => { mouse.x = null; mouse.y = null; };

    handleResize();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
}

// ==========================================
// 4. 3D GLARE CARD
// ==========================================
function GlareCard({ children, className, dark = false }: { children: React.ReactNode, className?: string, dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateY = ((mouseX / width) - 0.5) * 6; 
    const rotateX = ((mouseY / height) - 0.5) * -6; 

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.8
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className={`relative [perspective:1200px] w-full h-full ${className || ''}`}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full h-full relative overflow-hidden rounded-[2rem] p-8 md:p-12 flex flex-col justify-between transition-all duration-300 ease-out border ${dark ? 'bg-gray-900 border-gray-800 shadow-[0_20px_40px_rgba(217,119,87,0.15)]' : 'bg-white border-gray-200 shadow-xl'}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
        
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 rounded-[2rem] hidden md:block"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${dark ? '0.15' : '0.6'}) 0%, rgba(255,255,255,0) 60%)`,
            mixBlendMode: dark ? "screen" : "overlay",
          }}
        />
      </div>
    </div>
  );
}

// ==========================================
// 5. CUSTOM FAQ ACCORDION
// ==========================================
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-6 text-left group"
      >
        <span className="font-bold text-base md:text-xl text-gray-900 group-hover:text-fruor-copper transition-colors pr-8">{question}</span>
        <span className="text-gray-400 text-2xl font-light group-hover:text-fruor-copper transition-colors shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ==========================================
// 6. MAIN PAGE
// ==========================================
export default function Home() {
  const [showBootSequence, setShowBootSequence] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const trustItems = [
    'Custom Websites', 'SEO Optimization', 'Lead Generation', 'AI Automation', 
    'Android & iOS Apps', 'Enterprise CRM', 'ERP Software', 'Content Creation'
  ];

  const processSteps = [
    { id: '01', title: 'System Discovery & Blueprint', desc: 'We do not guess. We map your exact business logic, define the database schema, and architect the precise technical roadmap required before a single line of code is written.' },
    { id: '02', title: 'Infrastructure Engineering', desc: 'The invisible foundation. We configure your edge servers, write the backend APIs, establish secure Row-Level Security, and connect real-time databases.' },
    { id: '03', title: 'Glassmorphic UI Development', desc: 'Bridging power with aesthetics. We build a frictionless, highly responsive user interface using Next.js and React, guaranteeing sub-second load times.' },
    { id: '04', title: 'Deployment & Client OS', desc: 'Final push to the global edge network. We integrate automated monitoring, hand over full IP ownership, and give you keys to your new digital ecosystem.' }
  ];

  return (
    <main className={`flex min-h-screen flex-col items-center bg-[#FAFAFA] font-sans md:cursor-none ${showBootSequence ? 'h-screen overflow-hidden' : ''}`}>
      
      {showBootSequence && <BootSequence onComplete={() => setShowBootSequence(false)} />}
      <CustomCursor />

      {/* Floating WhatsApp - Mobile Optimized */}
      <a href="https://wa.me/971568611391" target="_blank" rel="noreferrer" className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z- bg-green-500 text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group cursor-pointer">
         <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
         <span className="absolute right-16 bg-white text-gray-900 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap hidden md:block">Chat on WhatsApp</span>
      </a>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}} />

      {/* NAVIGATION - Mobile Optimized */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 bg-white/70 backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full transition-all">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
            <Image src="/logo.png" alt="FRUOR Logo" fill sizes="32px" className="object-contain" priority />
          </div>
          <div className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
            FRUOR<span className="text-fruor-copper">.</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-600 items-center">
          <a href="#expertise" className="hover:text-fruor-copper transition-colors">Services</a>
          <a href="#protocol" className="hover:text-fruor-copper transition-colors">Protocol</a>
          <a href="#portfolio" className="hover:text-fruor-copper transition-colors">Work</a>
          <a href="#contact" className="px-6 py-2.5 bg-gray-900 text-white hover:bg-fruor-copper transition-colors rounded-full shadow-md">Book Free Call</a>
        </div>

        {/* Mobile CTA */}
        <a href="#contact" className="md:hidden px-5 py-2 bg-gray-900 text-white text-xs font-bold tracking-wide rounded-full shadow-md hover:bg-fruor-copper transition-colors">
          Book Call
        </a>
      </nav>

      {/* 1. HERO SECTION - Fluid Text for Mobile */}
      <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAFAFA] to-white pt-24 pb-12">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-60" fill="#D97757" />
        <ParticleNetwork />
        
        <div className="z-10 text-center px-5 max-w-4xl w-full flex flex-col items-center mt-8 relative pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm mb-8 md:mb-10 rounded-full pointer-events-auto">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-gray-700 tracking-wide">Based in Dubai, UAE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-bold text-gray-900 tracking-tight mb-6 md:mb-8">
            End-to-End Solutions.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fruor-copper to-orange-400">Real Results.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl text-center leading-relaxed px-2">
            I help UAE businesses turn their digital presence into revenue-generating systems — from powerful web platforms to complete CRM infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pointer-events-auto px-4">
            <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold tracking-wide rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-fruor-copper transition-all inline-block text-center">
              Request Free Audit
            </a>
            <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold tracking-wide rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all inline-block text-center">
              Explore Work
            </a>
          </div>
        </div>
      </section>

      {/* 2. INFINITE SERVICES MARQUEE */}
      <div className="w-full border-y border-gray-100 bg-white py-6 md:py-8 overflow-hidden relative flex items-center z-10">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
        <div className="flex w-max animate-marquee cursor-default">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 md:gap-24 px-4 md:px-12 items-center">
              {trustItems.map((tech, index) => (
                <span key={index} className="text-xs md:text-base font-bold tracking-wider text-gray-300 uppercase whitespace-nowrap hover:text-fruor-copper transition-colors duration-300">
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. BENTO BOX ROI GRID */}
      <section className="w-full bg-white py-20 md:py-24 px-5 md:px-16">
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-12 md:mb-16">
            <h2 className="text-fruor-copper font-bold tracking-widest uppercase text-xs md:text-sm mb-3">By The Numbers</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Proven Track Record.</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <h4 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">99.9%</h4>
              <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">System Uptime</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <h4 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">3+</h4>
              <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Years Experience</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <h4 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">95%</h4>
              <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Client Retention</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE SERVICES BENTO GRID */}
      <section id="expertise" className="w-full py-20 md:py-24 px-5 md:px-16 bg-[#FAFAFA] relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-3">Services</h2>
            <h3 className="text-3xl md:text-6xl font-bold text-gray-900 tracking-tight">Complete Digital Systems.</h3>
            <p className="text-gray-500 mt-4 max-w-2xl text-base md:text-lg mx-auto md:mx-0">From building your online presence to optimizing your sales funnel and internal operations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-12 h-12 bg-fruor-copper/10 text-fruor-copper rounded-2xl flex items-center justify-center mb-6">💻</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Website Development</h4>
              <p className="text-gray-500 text-sm leading-relaxed">High-performance, conversion-focused websites designed to turn visitors into paying customers.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-12 h-12 bg-fruor-copper/10 text-fruor-copper rounded-2xl flex items-center justify-center mb-6">📊</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Custom CRM Systems</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Tailored CRM solutions built around your sales process to close deals faster and manage leads securely.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-12 h-12 bg-fruor-copper/10 text-fruor-copper rounded-2xl flex items-center justify-center mb-6">⚙️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Custom ERP Software</h4>
              <p className="text-gray-500 text-sm leading-relaxed">End-to-end systems tailored to your operations, integrating departments for faster and smarter decisions.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 lg:col-span-2 flex flex-col justify-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6">🤖</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">AI Automation & Integrations</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl">Smart automation — chatbots, operational workflow systems, and AI-driven tools that save massive amounts of time and increase your business efficiency.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-12 h-12 bg-fruor-copper/10 text-fruor-copper rounded-2xl flex items-center justify-center mb-6">📱</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Android & iOS</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Custom mobile app solutions to deliver seamless user experiences across all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEPLOYMENT PROTOCOL */}
      <section id="protocol" className="w-full py-20 md:py-32 px-5 md:px-16 bg-white relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 md:gap-16">
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit text-center lg:text-left">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-3">Methodology</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6">The Deployment Protocol.</h3>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8">
              Eliminate the "Black Box" of development. We operate on a strict, 4-phase architectural protocol so you know exactly what is happening behind the scenes at all times.
            </p>
          </div>
          
          <div className="lg:w-2/3 flex flex-col gap-6 md:gap-8 relative">
            <div className="absolute left-6 md:left-8 top-10 bottom-10 w-0.5 bg-gray-100 hidden sm:block z-0"></div>
            
            {processSteps.map((step, index) => (
              <div 
                key={step.id} 
                onMouseEnter={() => setActiveStep(index)}
                className={`relative z-10 p-6 md:p-8 rounded-3xl border transition-all duration-300 sm:ml-12 md:ml-16 bg-white ${activeStep === index ? 'border-fruor-copper shadow-lg md:scale-[1.02]' : 'border-gray-100 shadow-sm opacity-100 md:opacity-60'}`}
              >
                <div className={`absolute -left-[4.5rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 hidden sm:block transition-colors duration-300 ${activeStep === index ? 'bg-fruor-copper border-white shadow-[0_0_0_4px_rgba(217,119,87,0.2)]' : 'bg-gray-300 border-white'}`}></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <span className={`text-xs md:text-sm font-bold font-mono px-3 py-1 rounded-lg w-fit transition-colors ${activeStep === index ? 'bg-fruor-copper/10 text-fruor-copper' : 'bg-gray-100 text-gray-400'}`}>{step.id}</span>
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h4>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed sm:pl-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PORTFOLIO SECTION (WITH GLARE CARDS) */}
      <section id="portfolio" className="w-full py-20 md:py-32 px-5 md:px-16 bg-[#FAFAFA] relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-3">Portfolio</h2>
            <h3 className="text-3xl md:text-6xl font-bold text-gray-900 tracking-tight">Real Clients. Real Results.</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 h-auto lg:h-[450px]">
            <GlareCard>
              <div>
                <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] md:text-xs font-bold text-gray-700 mb-4 md:mb-6 shadow-sm">Corporate B2B</span>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Dubai Transportation CRM</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base pr-0 md:pr-4">
                  Developed a bespoke full-stack CRM with lead management, driver allocation, and automated workflows. Streamlined complex logistics operations for a major UAE-based transportation company.
                </p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-2 md:gap-4 border-t border-gray-100 pt-6 md:pt-8 mb-6 md:mb-8 mt-6">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">14hrs</div>
                    <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase mt-1 md:mt-2">Work Saved / Week</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">100%</div>
                    <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase mt-1 md:mt-2">Centralization</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Node.js', 'PostgreSQL', 'Automations'].map((tech) => (
                    <span key={tech} className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600 rounded-lg">{tech}</span>
                  ))}
                </div>
              </div>
            </GlareCard>

            <GlareCard dark={true}>
              <div>
                <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-fruor-copper/10 rounded-full blur-3xl -z-10 transition-colors"></div>
                <span className="inline-block px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-[10px] md:text-xs font-bold text-white mb-4 md:mb-6 shadow-sm">Property Management</span>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Hostel Manager Ecosystem</h4>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base pr-0 md:pr-4">
                  Architected a synchronized native Android app and Web Dashboard via Supabase. Features include secure authentication, real-time occupancy tracking, and automated financial reporting.
                </p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-2 md:gap-4 border-t border-gray-700 pt-6 md:pt-8 mb-6 md:mb-8 mt-6">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white">&lt;100ms</div>
                    <div className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase mt-1 md:mt-2">Real-Time Sync</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white">0</div>
                    <div className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase mt-1 md:mt-2">Data Errors</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Android Studio', 'Supabase', 'Next.js'].map((tech) => (
                    <span key={tech} className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold bg-gray-800 border border-gray-700 text-gray-300 rounded-lg">{tech}</span>
                  ))}
                </div>
              </div>
            </GlareCard>
          </div>
        </div>
      </section>

      {/* 7. THE FRUOR STANDARD */}
      <section className="w-full px-5 md:px-16 pb-20 md:pb-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto bg-gray-900 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-fruor-copper/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-6 md:mb-8">The FRUOR Standard</h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 md:mb-12 tracking-tight">
              "We do not write code to meet requirements. We <span className="text-transparent bg-clip-text bg-gradient-to-r from-fruor-copper to-orange-400">architect systems</span> designed to scale your operational capacity."
            </h3>
            
            <div className="w-16 md:w-24 h-1 bg-gray-800 mx-auto mb-8 md:mb-12 rounded-full"></div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-8 text-xs md:text-base font-bold text-gray-400 uppercase tracking-widest">
              <span>Performance</span>
              <span className="hidden sm:inline text-gray-700">•</span>
              <span>Security</span>
              <span className="hidden sm:inline text-gray-700">•</span>
              <span>Scalability</span>
              <span className="hidden sm:inline text-gray-700">•</span>
              <span className="text-white">Aesthetics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EXECUTIVE FAQ SECTION */}
      <section className="w-full py-20 md:py-32 px-5 md:px-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-3">Executive Briefing</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions.</h3>
          </div>
          
          <div className="bg-[#FAFAFA] rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
            <FAQItem 
              question="Why shouldn't I just use a template or standard WordPress agency?" 
              answer="Templates are bloated, incredibly slow, and serve as massive security liabilities. At FRUOR, we engineer custom architectures from scratch. This guarantees rapid load times, unbreakable enterprise-grade security, and software that actually scales with your revenue." 
            />
            <FAQItem 
              question="Do I own the code and the IP after deployment?" 
              answer="100%. We do not lock you into proprietary platforms or hold your code hostage. Upon final handover, the entire Intellectual Property, codebase, and database infrastructure are transferred completely to your ownership." 
            />
            <FAQItem 
              question="How long does a custom system take to build?" 
              answer="We move fast without sacrificing stability. Depending on the complexity of the database schema and UI requirements, most enterprise web architectures and CRM platforms are deployed to the edge within 4 to 8 weeks." 
            />
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION (With Glass Icons) */}
      <section id="contact" className="w-full py-20 md:py-32 px-5 md:px-16 relative overflow-hidden bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
          
          <div className="flex-1 w-full text-center lg:text-left">
            <h2 className="text-xs md:text-sm font-bold text-fruor-copper uppercase tracking-widest mb-3">Let's Work Together</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6">
              Ready to Grow<br className="hidden lg:block"/> Your Business?
            </h3>
            
            <p className="text-gray-600 mb-10 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Whether you need a full system architecture built from scratch or a technical audit of your current operations, submit your parameters below.
            </p>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full lg:w-fit mx-auto lg:mx-0">
              
              {/* Glassmorphic Location Pin */}
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm flex items-center justify-center text-fruor-copper">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                  <p className="font-bold text-gray-900 text-sm md:text-base">Dubai, United Arab Emirates</p>
                </div>
              </div>

              {/* Glassmorphic Phone Icon */}
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm flex items-center justify-center text-fruor-copper">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Direct Line / WhatsApp</p>
                  <a href="https://wa.me/971568611391" className="font-bold text-gray-900 hover:text-fruor-copper transition-colors text-sm md:text-base">+971 56 861 1391</a>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-1 w-full relative z-20">
            <div className="absolute -inset-4 bg-gradient-to-br from-fruor-copper/10 to-transparent blur-3xl z-0 pointer-events-none"></div>
            <ContactForm />
          </div>

        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="w-full py-8 md:py-12 px-5 md:px-16 border-t border-gray-200 bg-white flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 flex-shrink-0"><Image src="/logo.png" alt="Logo" fill sizes="24px" className="object-contain" /></div>
          <span className="font-bold text-gray-900 tracking-tight">FRUOR.</span>
        </div>
        <p className="text-xs md:text-sm font-semibold text-gray-500">© {new Date().getFullYear()} FRUOR Architecture. Dubai, UAE.</p>
      </footer>

    </main>
  );
}