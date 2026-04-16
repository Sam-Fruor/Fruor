import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identity, email, parameters } = body;

    if (!identity || !email || !parameters) {
      return NextResponse.json({ error: 'Incomplete parameters' }, { status: 400 });
    }

    // 1. Insert payload into Supabase
    const { error: dbError } = await supabase.from('inquiries').insert([{ 
      client_identity: identity, comm_link: email, project_parameters: parameters 
    }]);

    if (dbError) throw new Error('Database insertion failed.');

    // 2. Nodemailer Transporter using your Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 3. Send the Alert
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending it to yourself
      subject: `🚨 FRUOR LEAD: ${identity}`,
      html: `
        <div style="font-family: monospace; padding: 20px;">
          <h2>SYSTEM ALERT: NEW INQUIRY</h2>
          <p><strong>CLIENT:</strong> ${identity}</p>
          <p><strong>COMM LINK:</strong> ${email}</p>
          <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #D97757;">
            <p>${parameters}</p>
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