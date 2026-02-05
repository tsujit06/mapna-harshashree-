import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../backend/supabaseAdminClient';
import {
  getBearerTokenFromRequest,
  verifySupabaseToken,
} from '../../../../../backend/supabaseJwtVerifier';

/**
 * GET /api/razorpay/quote
 * Returns activation pricing for the current user (no side effects).
 */
export async function GET(request: Request) {
  try {
    const bearerToken = getBearerTokenFromRequest(request);
    if (!bearerToken) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const payload = await verifySupabaseToken(bearerToken);
    const userId = payload.sub;
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const { count: existingActivations } = await supabaseAdmin
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('is_activation', true);

    const activationIndex = (existingActivations ?? 0) + 1;

    let amountPaise = 0;
    if (activationIndex <= 100) {
      amountPaise = 0;
    } else if (activationIndex <= 500) {
      amountPaise = 9900;
    } else if (activationIndex <= 1000) {
      amountPaise = 19900;
    } else {
      amountPaise = 29900;
    }

    return NextResponse.json({
      isFree: amountPaise === 0,
      amountPaise,
      activationNumber: activationIndex,
    });
  } catch (error) {
    console.error('Razorpay quote error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get quote' },
      { status: 500 }
    );
  }
}
