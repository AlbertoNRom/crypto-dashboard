import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { donations } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', message } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least $1' },
        { status: 400 }
      );
    }

    // Get user if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Donación a CryptoDash',
              description: message || 'Gracias por apoyar el desarrollo de CryptoDash',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/donation/cancelled`,
      metadata: {
        userId: user?.id || '',
        message: message || '',
      },
    });

    // Save donation record to database
    try {
      await db.insert(donations).values({
        userId: user?.id || null,
        email: user?.email || null,
        amount: amount.toString(),
        currency: 'USDC',
        stripePaymentIntentId: session.id,
        status: 'pending',
        message: message || null,
      });
    } catch (dbError) {
      console.error('Error saving donation to database:', dbError);
      // Continue with payment even if DB save fails
    }

    return NextResponse.json({ clientSecret: session.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}