import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identity, email, phone, parameters } = body;

    // Validate core requirements
    if (!identity || !email || !parameters) {
      return NextResponse.json({ error: 'Incomplete parameters' }, { status: 400 });
    }

    // 1. Insert payload into Supabase Databanks
    // Notice how these perfectly match your exact SQL schema columns now
    const { error: dbError } = await supabase.from('inquiries').insert([{ 
      client_identity: identity, 
      email: email, 
      phone: phone || null,
      project_parameters: parameters 
    }]);

    // Better error handling so you aren't flying blind
    if (dbError) {
      console.error("Supabase Error Details:", dbError);
      throw new Error(dbError.message);
    }

    // 2. Initialize Secure Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 3. Dispatch High-Priority Alert to Lead Architect
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, 
      subject: `🚨 FRUOR LEAD: ${identity}`,
      html: `
        <div style="font-family: monospace; padding: 30px; background-color: #FAFAFA; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px;">
          <h2 style="color: #D97757; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px;">System Alert: New Lead</h2>
          
          <p style="margin: 8px 0;"><strong>CLIENT IDENTITY:</strong> ${identity}</p>
          <p style="margin: 8px 0;"><strong>EMAIL:</strong> <a href="mailto:${email}" style="color: #2563EB;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>DIRECT LINE:</strong> ${phone || 'Not Provided'}</p>
          
          <div style="margin-top: 30px; padding: 20px; border-left: 4px solid #D97757; background: #FFF; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border-radius: 0 8px 8px 0;">
            <p style="font-weight: bold; color: #9CA3AF; font-size: 12px; margin-top: 0;">TRANSMISSION PAYLOAD:</p>
            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">${parameters}</pre>
          </div>
          
          <div style="margin-top: 30px; font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
            FRUOR Architecture Automated Routing System
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Transmission failed.' }, { status: 500 });
  }
}