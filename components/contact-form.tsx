"use client";
import { useState } from "react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Dynamic state to track where the client is in their journey
  const [projectStage, setProjectStage] = useState<"existing" | "new" | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const targetUrl = formData.get("targetUrl") || "N/A";
    const service = formData.get("service") || "N/A";
    const userMessage = formData.get("parameters");
    
    // Construct the payload based on their specific path
    const constructedParameters = projectStage === "existing"
      ? `[DIAGNOSTIC REQUEST]\nTarget URL: ${targetUrl}\n\nBottlenecks/Context: ${userMessage}`
      : `[NEW ARCHITECTURE REQUEST]\nInterested Service: ${service}\n\nBusiness Goal/Requirements: ${userMessage}`;

    const payload = {
      identity: formData.get("identity"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      parameters: constructedParameters,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setProjectStage(null); // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full relative">
      {/* Step 1: The Dynamic Choice */}
      {!projectStage && status === "idle" && (
        <div className="p-8 md:p-12 bg-white/70 backdrop-blur-2xl border border-white flex flex-col gap-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="text-center mb-4">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Select Your Project Stage</h4>
            <p className="text-sm text-gray-500">To route your request to the correct engineering pipeline, please select your current status.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setProjectStage("existing")}
              className="p-6 text-left border border-gray-200 rounded-2xl bg-gray-50 hover:border-fruor-copper hover:bg-fruor-copper/5 transition-all group"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-lg mb-4 group-hover:border-fruor-copper">🔄</div>
              <h5 className="font-bold text-gray-900 mb-2">Upgrade Existing System</h5>
              <p className="text-xs text-gray-500 leading-relaxed">I have a website or software that needs optimization, scaling, or a complete rebuild.</p>
            </button>
            
            <button 
              onClick={() => setProjectStage("new")}
              className="p-6 text-left border border-gray-200 rounded-2xl bg-gray-50 hover:border-fruor-copper hover:bg-fruor-copper/5 transition-all group"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-lg mb-4 group-hover:border-fruor-copper">🏗️</div>
              <h5 className="font-bold text-gray-900 mb-2">Build From Scratch</h5>
              <p className="text-xs text-gray-500 leading-relaxed">I am launching a new business or product and need custom architecture from day one.</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: The Form */}
      {projectStage && status === "idle" && (
        <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-white/70 backdrop-blur-2xl border border-white flex flex-col gap-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-between items-center mb-2 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-fruor-copper uppercase tracking-widest mb-1">
                {projectStage === "existing" ? "System Diagnostic" : "Architecture Blueprint"}
              </p>
              <h4 className="text-xl font-bold text-gray-900">
                {projectStage === "existing" ? "Request System Review" : "Initialize New Project"}
              </h4>
            </div>
            <button 
              type="button" 
              onClick={() => setProjectStage(null)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 px-3 py-1.5 rounded-full"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="identity" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input required type="text" id="identity" name="identity" placeholder="John Doe" className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address *</label>
              <input required type="email" id="email" name="email" placeholder="john@company.com" className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone / WhatsApp</label>
              <input type="tel" id="phone" name="phone" placeholder="+971 5X XXX XXXX" className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all rounded-xl" />
            </div>
          </div>

          {/* Conditional Input for Existing Systems: URL */}
          {projectStage === "existing" && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
              <label htmlFor="targetUrl" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current System URL *</label>
              <input required type="url" id="targetUrl" name="targetUrl" placeholder="https://yourcompany.com" className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all rounded-xl" />
            </div>
          )}

          {/* Conditional Input for New Systems: Service Dropdown */}
          {projectStage === "new" && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
              <label htmlFor="service" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Interested In *</label>
              <select required name="service" id="service" defaultValue="" className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all rounded-xl cursor-pointer appearance-none">
                <option value="" disabled>Select a service</option>
                <option value="Website Development">Website Development</option>
                <option value="Social Media Marketing">Social Media Marketing</option>
                <option value="SEO">SEO</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Lead Generation">Lead Generation</option>
                <option value="Email Marketing">Email Marketing</option>
                <option value="AI Automation">AI Automation</option>
                <option value="Android & iOS Platform">Android & iOS Platform</option>
                <option value="Custom ERP Software">Custom ERP Software</option>
                <option value="CRM System">CRM System</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="parameters" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {projectStage === "existing" ? "What are your current bottlenecks?" : "What are your business goals?"} *
            </label>
            <textarea required id="parameters" name="parameters" rows={3} placeholder={projectStage === "existing" ? "E.g., The site loads too slowly, or the CRM is crashing..." : "E.g., We need a platform to manage 500+ daily bookings..."} className="w-full bg-gray-50/50 border border-gray-200 px-4 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fruor-copper/20 focus:border-fruor-copper transition-all resize-none rounded-xl"></textarea>
          </div>

          <button disabled={loading} type="submit" className="mt-2 w-full py-5 bg-gray-900 text-white font-bold tracking-widest uppercase hover:bg-fruor-copper transition-colors rounded-xl disabled:opacity-50 shadow-lg flex items-center justify-center gap-2">
            {loading ? "Transmitting..." : (projectStage === "existing" ? "Request System Diagnostic →" : "Request Blueprint Call →")}
          </button>
        </form>
      )}

      {/* Success Message (Shows when it works) */}
      {status === "success" && (
        <div className="p-8 md:p-12 bg-white/70 backdrop-blur-2xl border border-white flex flex-col items-center justify-center gap-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-2">✓</div>
          <h4 className="text-2xl font-bold text-gray-900">Transmission Received</h4>
          <p className="text-gray-500 max-w-sm">Your parameters have been logged in the FRUOR databanks. Lead engineering will review and reply within 24 hours.</p>
          <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-bold text-fruor-copper hover:text-gray-900 transition-colors">
            Submit another request
          </button>
        </div>
      )}

      {/* THE MISSING ERROR MESSAGE (Shows if API fails) */}
      {status === "error" && (
        <div className="p-8 md:p-12 bg-white/70 backdrop-blur-2xl border border-white flex flex-col items-center justify-center gap-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-2">✕</div>
          <h4 className="text-2xl font-bold text-gray-900">Transmission Failed</h4>
          <p className="text-gray-500 max-w-sm">There was an issue connecting to the servers. Please check your internet connection or use the WhatsApp link below.</p>
          <button onClick={() => { setStatus("idle"); setProjectStage(null); }} className="mt-4 text-sm font-bold text-fruor-copper hover:text-gray-900 transition-colors">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}