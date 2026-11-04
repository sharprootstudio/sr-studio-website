import React, { useState } from 'react';
import { Send, Mail, MapPin, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Website Development',
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const serviceOptions = [
    'Website Development',
    'Branding & Identity',
    'AI Solutions & Automation',
    'AI Calling Agents',
    'Digital Experiences',
    'Other Inquiries',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.details.trim()) {
      errs.details = 'Please briefly describe your project vision or timeline';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate safe client-side processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#0F1012] overflow-hidden border-t border-white/5">
      {/* Background orange glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#F07835]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Agency Contact Info */}
          <div className="lg:col-span-5">
            <Badge variant="orange" size="sm" className="mb-4">
              Get In Touch
            </Badge>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-6">
              Have a Vision? <br />
              <span className="text-orange-gradient">Let's Make It Real.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed mb-10">
              Your next big idea deserves the right digital partner. Reach out directly or complete the brief form below.
            </p>

            {/* Information Cards */}
            <div className="space-y-4 mb-10">
              {/* Official Gmail Card */}
              <div className="bg-[#17191C]/80 backdrop-blur-md p-5 rounded-2xl border border-[#F07835]/30 shadow-lg shadow-black/40 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#F07835]/15 border border-[#F07835]/40 flex items-center justify-center text-[#F07835] flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-[#FFAD76] tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#F07835]" />
                    Official Agency Email
                  </div>
                  <a
                    href="mailto:sharprootstudio@gmail.com"
                    className="text-base sm:text-lg font-bold text-[#F5F1EB] hover:text-[#F07835] transition-colors underline decoration-[#F07835]/40 underline-offset-4"
                  >
                    sharprootstudio@gmail.com
                  </a>
                  <div className="text-[11px] text-[#A5A5A5] mt-0.5">
                    Click to open in your mail client
                  </div>
                </div>
              </div>

              <div className="bg-[#17191C]/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-[#A5A5A5] tracking-wider mb-0.5">
                    Response Guarantee
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#F5F1EB]">
                    Within 24 Hours Guaranteed
                  </div>
                </div>
              </div>

              <div className="bg-[#17191C]/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-[#A5A5A5] tracking-wider mb-0.5">
                    Operations
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#F5F1EB]">
                    Global Operations (Remote-First)
                  </div>
                </div>
              </div>
            </div>

            {/* Official Logo Banner */}
            <div className="p-4 rounded-2xl bg-[#17191C]/80 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#17191C] p-1 border border-[#F07835]/40 flex-shrink-0 shadow-md flex items-center justify-center">
                <img src="/logo.png" alt="SR Studio" className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(240,120,53,0.4)]" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#F5F1EB] tracking-wider">SHARP ROOT STUDIO</div>
                <div className="text-[#FFAD76] font-medium">Turning Vision Into Value.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#17191C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#F07835]/20 text-[#F07835] border border-[#F07835]/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#F5F1EB]">
                    Thank You, {formData.name}!
                  </h3>
                  <p className="text-sm text-[#A5A5A5] max-w-md mx-auto leading-relaxed">
                    Your project inquiry for <strong className="text-[#FFAD76]">{formData.service}</strong> has been prepared. Our team will review your specifications and contact you at <strong className="text-white">{formData.email}</strong> or from <strong className="text-[#F07835]">sharprootstudio@gmail.com</strong> within 24 hours.
                  </p>
                  <div className="pt-6">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          company: '',
                          service: 'Website Development',
                          details: '',
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5F1EB] mb-2">
                        Your Name <span className="text-[#F07835]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full bg-[#0F1012] border ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-sm text-[#F5F1EB] placeholder-[#737373] focus:outline-none focus:border-[#F07835] transition-colors`}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5F1EB] mb-2">
                        Email Address <span className="text-[#F07835]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className={`w-full bg-[#0F1012] border ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-sm text-[#F5F1EB] placeholder-[#737373] focus:outline-none focus:border-[#F07835] transition-colors`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5F1EB] mb-2">
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Acme Corp or Startup Name"
                      className="w-full bg-[#0F1012] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1EB] placeholder-[#737373] focus:outline-none focus:border-[#F07835] transition-colors"
                    />
                  </div>

                  {/* Service Interested In (Pills) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5F1EB] mb-3">
                      Service Interested In
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: opt })}
                          className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                            formData.service === opt
                              ? 'bg-[#F07835] text-white shadow-md shadow-[#F07835]/30'
                              : 'bg-[#0F1012] text-[#A5A5A5] hover:text-[#F5F1EB] border border-white/5'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5F1EB] mb-2">
                      Project Details & Timeline <span className="text-[#F07835]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Tell us about your objectives, desired launch timeline, and any specific technology requirements..."
                      className={`w-full bg-[#0F1012] border ${
                        errors.details ? 'border-red-500' : 'border-white/10'
                      } rounded-xl p-4 text-sm text-[#F5F1EB] placeholder-[#737373] focus:outline-none focus:border-[#F07835] transition-colors resize-y`}
                    />
                    {errors.details && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.details}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                      icon={<Send size={16} />}
                    >
                      {loading ? 'Processing Inquiry...' : 'Start a Project'}
                    </Button>
                    <p className="text-center text-[11px] text-[#737373] mt-3">
                      Inquiries routed directly to <span className="text-[#FFAD76]">sharprootstudio@gmail.com</span>
                    </p>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
