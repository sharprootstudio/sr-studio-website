// ==============================================================================
// SR STUDIO — SUPABASE EDGE FUNCTION: SECURE LEAD SUBMISSION & NOTIFICATIONS
// File: supabase/functions/submit-lead/index.ts
// Runtime: Deno / Supabase Edge Functions
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// In-memory sliding rate limiting store (per Edge Function container instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Clean up expired rate limit entries periodically
function cleanExpiredRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

interface SubmitLeadPayload {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  details?: string;
  honeypot?: string;
  turnstile_token?: string;
  idempotency_key?: string;
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 2. Enforce POST method only
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Client IP identification & Rate Limiting
    const clientIp = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-real-ip') || 
                     req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     'unknown';

    cleanExpiredRateLimits();

    const now = Date.now();
    const currentRate = rateLimitStore.get(clientIp);

    if (currentRate && now < currentRate.resetAt) {
      if (currentRate.count >= MAX_SUBMISSIONS_PER_WINDOW) {
        return new Response(
          JSON.stringify({
            error: 'Too many submissions from this connection. Please wait a few minutes before trying again.',
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      currentRate.count += 1;
    } else {
      rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    // 4. Parse & Limit Request Body Payload
    const rawBody = await req.text();
    if (rawBody.length > 50 * 1024) { // Max 50KB
      return new Response(
        JSON.stringify({ error: 'Payload size exceeds allowable limit.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let payload: SubmitLeadPayload = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Malformed JSON payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Bot Defense: Honeypot Verification
    // Hidden field that humans cannot see. If filled, return 200 silently to sink the bot.
    if (payload.honeypot && payload.honeypot.trim() !== '') {
      console.warn(`[Anti-Abuse] Honeypot trap triggered from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Inquiry received.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Bot Defense: Cloudflare Turnstile Verification (if configured)
    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (turnstileSecret && turnstileSecret.trim() !== '') {
      const token = payload.turnstile_token;
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Verification token required.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const turnstileFormData = new FormData();
      turnstileFormData.append('secret', turnstileSecret);
      turnstileFormData.append('response', token);
      turnstileFormData.append('remoteip', clientIp);

      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: turnstileFormData,
      });

      const turnstileOutcome = await turnstileRes.json();
      if (!turnstileOutcome.success) {
        console.warn(`[Turnstile] Challenge verification failed from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: 'Security challenge verification failed. Please try again.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 7. Validation & Normalization
    const name = payload.name?.trim() || '';
    const email = payload.email?.trim().toLowerCase() || '';
    const company = payload.company?.trim() || null;
    const service = payload.service?.trim() || 'General Inquiry';
    const details = payload.details?.trim() || '';
    const idempotencyKey = payload.idempotency_key?.trim() || null;

    if (!name || name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid full name between 2 and 100 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (company && company.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Company name exceeds allowable length (100 characters).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!details || details.length < 5 || details.length > 3000) {
      return new Response(
        JSON.stringify({ error: 'Project details must be between 5 and 3000 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Initialize Supabase Admin Client (Service-Role)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Configuration Error] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Edge Function.');
      return new Response(
        JSON.stringify({ error: 'Database service is currently unconfigured. Please contact support.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 9. Idempotency Check: Avoid duplicates during client retries
    if (idempotencyKey) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, submitted_at')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingLead) {
        return new Response(
          JSON.stringify({
            success: true,
            leadId: existingLead.id,
            message: 'Inquiry was previously received and confirmed.',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 10. Persist Lead to Database
    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        company,
        service,
        details,
        status: 'new',
        source: 'website_contact_form',
        idempotency_key: idempotencyKey,
        metadata: {
          client_ip_truncated: clientIp.substring(0, 15),
          user_agent: req.headers.get('user-agent')?.substring(0, 150) || 'unknown',
        },
      })
      .select('id, name, email, service, company, details, submitted_at')
      .single();

    if (insertError || !insertedLead) {
      console.error('[Database Insert Error]', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save inquiry to database. Please try again later.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log creation activity
    await supabase.from('lead_activities').insert({
      lead_id: insertedLead.id,
      activity_type: 'created',
      description: 'New lead submitted via website contact form',
      metadata: { service, source: 'website_contact_form' },
    });

    // 11. Dispatch Notifications (Asynchronously, never failing the saved lead)
    const notificationPromises: Promise<unknown>[] = [];

    // 11.1 Resend Email Notification
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailTo = Deno.env.get('NOTIFICATIONS_EMAIL_TO') || 'sharprootstudio@gmail.com';
    const emailFrom = Deno.env.get('NOTIFICATIONS_EMAIL_FROM') || 'SR Studio Inquiries <inquiries@srstudio.agency>';

    if (resendApiKey && resendApiKey.trim() !== '') {
      notificationPromises.push(
        (async () => {
          try {
            const htmlContent = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0C0D10; color: #F5F1EB; padding: 32px; border-radius: 16px; border: 1px solid #24272B;">
                <div style="margin-bottom: 24px; border-bottom: 1px solid #24272B; padding-bottom: 16px;">
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #FFAD76; font-weight: bold;">SR STUDIO • NEW INQUIRY ALERT</span>
                  <h1 style="font-size: 24px; margin: 8px 0 0; color: #FFFFFF;">${insertedLead.name}</h1>
                  <p style="font-size: 14px; color: #F07835; margin: 4px 0 0;">${insertedLead.service}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 8px 0; color: #A5A5A5; font-size: 13px; width: 120px;">Email:</td>
                    <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-weight: 600;"><a href="mailto:${insertedLead.email}" style="color: #FFAD76; text-decoration: none;">${insertedLead.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #A5A5A5; font-size: 13px;">Company:</td>
                    <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${insertedLead.company || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #A5A5A5; font-size: 13px;">Submitted:</td>
                    <td style="padding: 8px 0; color: #A5A5A5; font-size: 13px;">${new Date().toUTCString()}</td>
                  </tr>
                </table>

                <div style="background: #17191C; padding: 20px; border-radius: 12px; border: 1px solid #2E3339; margin-bottom: 24px;">
                  <h3 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #A5A5A5;">Project Brief</h3>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E5E7EB; white-space: pre-wrap;">${insertedLead.details}</p>
                </div>

                <div style="text-align: center; padding-top: 16px; border-top: 1px solid #24272B;">
                  <a href="${Deno.env.get('PUBLIC_SITE_URL') || 'https://sr-studio-website.vercel.app'}/admin/leads/${insertedLead.id}" 
                     style="display: inline-block; background: #F07835; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px;">
                    Open in Admin Dashboard →
                  </a>
                </div>
              </div>
            `;

            const resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: emailFrom,
                to: [emailTo],
                reply_to: insertedLead.email,
                subject: `[SR Studio Inquiry] ${insertedLead.name} — ${insertedLead.service}`,
                html: htmlContent,
              }),
            });

            if (resendRes.ok) {
              const resData = await resendRes.json();
              await supabase.from('notification_logs').insert({
                lead_id: insertedLead.id,
                channel: 'email',
                recipient: emailTo,
                attempt_count: 1,
                status: 'sent',
                metadata: { resend_id: resData.id },
              });
            } else {
              const errBody = await resendRes.text();
              console.error('[Resend Error]', errBody);
              await supabase.from('notification_logs').insert({
                lead_id: insertedLead.id,
                channel: 'email',
                recipient: emailTo,
                attempt_count: 1,
                status: 'failed',
                error_message: `Resend HTTP ${resendRes.status}: ${errBody.substring(0, 200)}`,
              });
            }
          } catch (err) {
            console.error('[Resend Exception]', err);
            await supabase.from('notification_logs').insert({
              lead_id: insertedLead.id,
              channel: 'email',
              recipient: emailTo,
              attempt_count: 1,
              status: 'failed',
              error_message: err instanceof Error ? err.message : 'Unknown email error',
            });
          }
        })()
      );
    } else {
      // Record unconfigured status
      notificationPromises.push(
        supabase.from('notification_logs').insert({
          lead_id: insertedLead.id,
          channel: 'email',
          recipient: emailTo,
          attempt_count: 0,
          status: 'skipped_unconfigured',
          error_message: 'RESEND_API_KEY is not configured in environment',
        })
      );
    }

    // 11.2 WhatsApp Cloud API Notification
    const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    const whatsappRecipient = Deno.env.get('WHATSAPP_ALERT_RECIPIENT_PHONE');

    if (whatsappToken && whatsappPhoneId && whatsappRecipient) {
      notificationPromises.push(
        (async () => {
          try {
            // Note: WhatsApp requires an approved business template for proactive outbound notifications
            const templateName = Deno.env.get('WHATSAPP_TEMPLATE_NAME') || 'sr_studio_lead_alert';
            
            const waRes = await fetch(`https://graph.facebook.com/v21.0/${whatsappPhoneId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${whatsappToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: whatsappRecipient,
                type: 'template',
                template: {
                  name: templateName,
                  language: { code: 'en' },
                  components: [
                    {
                      type: 'body',
                      parameters: [
                        { type: 'text', text: insertedLead.name },
                        { type: 'text', text: insertedLead.service },
                        { type: 'text', text: insertedLead.email },
                        { type: 'text', text: insertedLead.details.substring(0, 100) },
                      ],
                    },
                  ],
                },
              }),
            });

            if (waRes.ok) {
              const waData = await waRes.json();
              await supabase.from('notification_logs').insert({
                lead_id: insertedLead.id,
                channel: 'whatsapp',
                recipient: whatsappRecipient,
                attempt_count: 1,
                status: 'sent',
                metadata: { message_id: waData.messages?.[0]?.id },
              });
            } else {
              const errBody = await waRes.text();
              console.error('[WhatsApp Cloud API Error]', errBody);
              await supabase.from('notification_logs').insert({
                lead_id: insertedLead.id,
                channel: 'whatsapp',
                recipient: whatsappRecipient,
                attempt_count: 1,
                status: 'failed',
                error_message: `WhatsApp HTTP ${waRes.status}: ${errBody.substring(0, 200)}`,
              });
            }
          } catch (err) {
            console.error('[WhatsApp Exception]', err);
            await supabase.from('notification_logs').insert({
              lead_id: insertedLead.id,
              channel: 'whatsapp',
              recipient: whatsappRecipient,
              attempt_count: 1,
              status: 'failed',
              error_message: err instanceof Error ? err.message : 'Unknown WhatsApp error',
            });
          }
        })()
      );
    } else {
      // Record unconfigured status
      notificationPromises.push(
        supabase.from('notification_logs').insert({
          lead_id: insertedLead.id,
          channel: 'whatsapp',
          recipient: whatsappRecipient || 'unconfigured',
          attempt_count: 0,
          status: 'skipped_unconfigured',
          error_message: 'WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured in environment',
        })
      );
    }

    // Await notification processing without blocking client response significantly
    await Promise.allSettled(notificationPromises);

    // 12. Return Success
    return new Response(
      JSON.stringify({
        success: true,
        leadId: insertedLead.id,
        message: 'Inquiry received and securely stored.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Server Error in submit-lead]', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error processing inquiry.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

