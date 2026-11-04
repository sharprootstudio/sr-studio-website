import React, { useState } from 'react';
import { Send, Mail, MapPin, Clock, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'api_success' | 'mailto_opened' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Configurable external backend endpoint (e.g. Formspree, Web3Forms, or custom API route)
  // Can be configured via .env variable VITE_CONTACT_FORM_ENDPOINT without hardcoding secrets
  const formEndpoint = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined)?.trim();

  const serviceOptions = [
    'Website Development',
    'AI Solutions & Automation',
    'Branding & Creative Design',
    'Digital Growth Solutions',
    'General Inquiry'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.details.trim()) {
      errs.details = 'Please briefly describe your project goals or requirements.';
    }
    return errs;
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`[SR Studio Inquiry] ${formData.name} — ${formData.service}`);
    const body = encodeURIComponent(
      `Hello SR Studio Team,\n\n` +
      `I would like to discuss a project with SR STUDIO.\n\n` +
      `• Name: ${formData.name}\n` +
      `• Email: ${formData.email}\n` +
      `• Company / Organization: ${formData.company || 'Not specified'}\n` +
      `• Service of Interest: ${formData.service}\n\n` +
      `• Project Details & Goals:\n${formData.details}\n\n` +
      `Looking forward to your response,\n${formData.name}`
    );
    return `mailto:sharprootstudio@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleOpenMailClient = () => {
    const mailto = generateMailtoUrl();
    window.location.href = mailto;
    setStatus('mailto_opened');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    // If an external form endpoint is configured, submit via POST
    if (formEndpoint) {
      setStatus('submitting');
      try {
        const response = await fetch(formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            _subject: `New Project Inquiry: ${formData.name} (${formData.service})`,
            submittedAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          setStatus('api_success');
        } else {
          const resData = await response.json().catch(() => ({}));
          throw new Error(resData.message || 'Submission failed. Please send via email client.');
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Network error while contacting form endpoint.');
        setStatus('error');
      }
      return;
    }

    // Default: No backend configured -> Open mail client transparently
    handleOpenMailClient();
  };

  const copyDetailsToClipboard = () => {
    const text =
      `SR Studio Project Inquiry\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Company: ${formData.company || 'Not specified'}\n` +
      `Service: ${formData.service}\n` +
      `Details: ${formData.details}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-[#0C0D10] overflow-hidden border-t border-white/[0.08]">
      {/* Background Agent Valley Grid & Center Light Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#F07835]/08 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Agency Contact Info & Status */}
          <div className="lg:col-span-5">
            <Badge variant="orange" size="sm" className="mb-4">
              Get In Touch
            </Badge>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-5">
              Have an Idea? <br />
              <span className="text-orange-gradient">Let's Make It Happen.</span>
            </h2>

            {/* Live Studio Availability Indicator (Agent Valley Inspired) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141619] border border-[#F07835]/30 text-xs font-mono text-[#FFAD76] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACCEPTING SELECT PROJECTS · Q2/Q3 2026</span>
            </div>

            <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed mb-8 font-normal">
              Tell us what you're planning. Let's explore how we can turn your vision into something valuable through creative design, modern web engineering, and practical AI.
            </p>

            <div className="space-y-4">
              {/* Direct Email Card with One-Click Copy */}
              <div className="premium-card rounded-2xl p-5 flex items-start justify-between gap-4 group">
                <a
                  href="mailto:sharprootstudio@gmail.com"
                  className="flex items-start gap-4 flex-grow min-w-0"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] flex-shrink-0 group-hover:scale-105 group-hover:border-[#F07835]/50 transition-all duration-300">
                    <Mail size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFAD76] block mb-1">
                      Direct Email
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#F5F1EB] group-hover:text-[#F07835] transition-colors break-all">
                      sharprootstudio@gmail.com
                    </span>
                    <p className="text-xs text-[#A5A5A5] mt-1 font-normal">
                      Typically responds within 24 business hours
                    </p>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={copyDetailsToClipboard}
                  title="Copy email address"
                  className="p-2.5 rounded-xl bg-[#17191C] border border-white/10 hover:border-[#F07835]/50 text-[#A5A5A5] hover:text-[#FFAD76] transition-colors flex-shrink-0 cursor-pointer self-center"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Working Schedule */}
              <div className="premium-card rounded-2xl p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#FFAD76] flex-shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFAD76] block mb-1">
                    Working Schedule
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#F5F1EB]">
                    Monday – Friday, Remote / Global
                  </span>
                  <p className="text-xs text-[#A5A5A5] mt-1 font-normal">
                    Partnering with clients across multiple time zones
                  </p>
                </div>
              </div>

              {/* Studio Location */}
              <div className="premium-card rounded-2xl p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#FFAD76] flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFAD76] block mb-1">
                    Studio Location
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#F5F1EB]">
                    Remote Studio • Operating Globally
                  </span>
                  <p className="text-xs text-[#A5A5A5] mt-1 font-normal">
                    Sharp Root Studio (SR STUDIO)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              {/* Top Specular Glow Line */}
              <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/50 to-transparent" />
              
              {/* STATE 1: API SUCCESS (Only if a real endpoint was called and succeeded) */}
              {status === 'api_success' && (
                <div className="mb-8 p-6 rounded-2xl bg-green-500/15 border border-green-500/40 text-[#F5F1EB] animate-fadeIn">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={24} className="text-green-400 flex-shrink-0" />
                    <h3 className="font-display font-bold text-lg text-white">
                      Inquiry Received Successfully
                    </h3>
                  </div>
                  <p className="text-sm text-[#A5A5A5] mb-2">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your project details have been received by our studio.
                  </p>
                  <p className="text-xs text-[#A5A5A5]">
                    We will review your inquiry and follow up at <strong className="text-[#FFAD76]">{formData.email}</strong> within 24 business hours.
                  </p>
                </div>
              )}

              {/* STATE 2: MAILTO OPENED (Transparent & Truthful distinction) */}
              {status === 'mailto_opened' && (
                <div className="mb-8 p-6 rounded-2xl bg-[#F07835]/15 border border-[#F07835]/40 text-[#F5F1EB] animate-fadeIn">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={24} className="text-[#F07835] flex-shrink-0" />
                    <h3 className="font-display font-bold text-lg text-white">
                      Email Application Launched
                    </h3>
                  </div>
                  <p className="text-sm text-[#A5A5A5] mb-3">
                    Your inquiry has been formatted and opened in your email application. <strong className="text-white">Please remember to click "Send" in your email client</strong> to complete delivery to <strong className="text-[#FFAD76]">sharprootstudio@gmail.com</strong>.
                  </p>
                  <p className="text-xs text-[#A5A5A5]/80 mb-4">
                    If your email client did not open automatically, you can re-open it or copy the inquiry text below:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={generateMailtoUrl()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F07835] text-white text-xs font-semibold hover:bg-[#ff843f] transition-colors shadow-md"
                    >
                      <Mail size={14} />
                      Re-open Email App
                    </a>
                    <button
                      type="button"
                      onClick={copyDetailsToClipboard}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24272B] hover:bg-[#2e3237] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copied ? 'Copied to Clipboard' : 'Copy Inquiry Text'}
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 3: API ERROR (With instant mailto fallback) */}
              {status === 'error' && (
                <div className="mb-8 p-6 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle size={22} className="text-red-400 flex-shrink-0" />
                    <h4 className="font-bold text-white">Endpoint Transmission Failed</h4>
                  </div>
                  <p className="text-xs text-red-200/90 mb-4">
                    {errorMessage || 'Unable to deliver message through the configured endpoint.'} You can dispatch directly via your email app below:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenMailClient}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F07835] text-white text-xs font-semibold hover:bg-[#ff843f] transition-colors"
                    >
                      <Mail size={14} /> Send via Email Client
                    </button>
                    <button
                      type="button"
                      onClick={copyDetailsToClipboard}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24272B] text-white text-xs font-semibold border border-white/10"
                    >
                      {copied ? 'Copied' : 'Copy Inquiry'}
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-2">
                      Your Name <span className="text-[#F07835]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Alex Morgan"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`w-full bg-[#121417] border ${
                        errors.name ? 'border-red-500' : 'border-white/[0.09] focus:border-[#F07835]'
                      } rounded-xl px-4 py-3 text-[#F5F1EB] placeholder-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-[#F07835]/50 transition-colors`}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-2">
                      Email Address <span className="text-[#F07835]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="alex@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full bg-[#121417] border ${
                        errors.email ? 'border-red-500' : 'border-white/[0.09] focus:border-[#F07835]'
                      } rounded-xl px-4 py-3 text-[#F5F1EB] placeholder-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-[#F07835]/50 transition-colors`}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-2">
                    Company / Organization <span className="text-xs text-[#A5A5A5]/60 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Innovations"
                    className="w-full bg-[#121417] border border-white/[0.09] focus:border-[#F07835] rounded-xl px-4 py-3 text-[#F5F1EB] placeholder-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-[#F07835]/50 transition-colors"
                  />
                </div>

                {/* Service Selection Pills */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-2.5">
                    Service of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={formData.service === opt}
                        onClick={() => setFormData({ ...formData, service: opt })}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                          formData.service === opt
                            ? 'bg-[#F07835] text-white shadow-[0_2px_14px_rgba(240,120,53,0.4)]'
                            : 'bg-[#121417] text-[#A5A5A5] hover:text-[#F5F1EB] border border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label htmlFor="details" className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-2">
                    Project Details & Goals <span className="text-[#F07835]" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    required
                    value={formData.details}
                    onChange={(e) => {
                      setFormData({ ...formData, details: e.target.value });
                      if (errors.details) setErrors({ ...errors, details: '' });
                    }}
                    placeholder="Tell us about what you want to build, your timeline, or any specific requirements..."
                    aria-invalid={!!errors.details}
                    aria-describedby={errors.details ? 'details-error' : undefined}
                    className={`w-full bg-[#121417] border ${
                      errors.details ? 'border-red-500' : 'border-white/[0.09] focus:border-[#F07835]'
                    } rounded-xl px-4 py-3 text-[#F5F1EB] placeholder-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-[#F07835]/50 transition-colors resize-none`}
                  />
                  {errors.details && (
                    <p id="details-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.details}
                    </p>
                  )}
                </div>

                {/* Transparent Notice about Delivery Method */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#A5A5A5] leading-relaxed">
                  {formEndpoint ? (
                    <span>
                      ✓ Configured endpoint active. Submitting will transmit your inquiry directly to our server.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-[#FFAD76]">Delivery Note:</strong> Submitting will launch your default email client with your message pre-composed for <strong className="text-[#F5F1EB]">sharprootstudio@gmail.com</strong>. You must press <em>Send</em> in your email app to deliver the inquiry.
                    </span>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status === 'submitting'}
                    icon={status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    className="w-full text-base font-semibold shadow-[0_4px_25px_rgba(240,120,53,0.45)] hover:shadow-[0_6px_35px_rgba(240,120,53,0.65)]"
                  >
                    {status === 'submitting'
                      ? 'Transmitting Inquiry...'
                      : formEndpoint
                      ? 'Submit Project Inquiry'
                      : 'Prepare Inquiry in Email App'}
                  </Button>
                </div>

                {/* Direct Email Fallback Link */}
                <p className="text-center text-xs text-[#A5A5A5] pt-1">
                  Prefer direct email?{' '}
                  <a
                    href="mailto:sharprootstudio@gmail.com"
                    className="text-[#F5F1EB] hover:text-[#F07835] font-semibold underline underline-offset-4 decoration-[#F07835]/40"
                  >
                    sharprootstudio@gmail.com
                  </a>
                </p>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
