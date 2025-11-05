import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { cryptocurrencies, holdings, portfolios, users } from '@/lib/db/schema';
import { createClient as createSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getOrCreateUserByEmail(email: string) {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) return existing[0];
  const [inserted] = await db
    .insert(users)
    .values({ email })
    .returning();
  return inserted;
}

async function getOrCreateDefaultPortfolio(userId: string) {
  const existing = await db
    .select()
    .from(portfolios)
    .where(and(eq(portfolios.userId, userId), eq(portfolios.name, 'Default')));
  if (existing.length > 0) return existing[0];
  const [inserted] = await db
    .insert(portfolios)
    .values({ userId, name: 'Default', description: 'Default portfolio' })
    .returning();
  return inserted;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const u = await getOrCreateUserByEmail(user.email);
    const p = await getOrCreateDefaultPortfolio(u.id);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(30, Number(searchParams.get('limit') ?? 30));

    const rows = await db
      .select()
      .from(holdings)
      .where(eq(holdings.portfolioId, p.id));

    // Enforce 30-row limit at response level
    return NextResponse.json({ portfolioId: p.id, holdings: rows.slice(0, limit) });
  } catch (err) {
    console.error('GET /api/portfolio/holdings error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const cryptoId: string = (body?.cryptoId ?? '').toString();
    const amount: number = Number(body?.amount ?? 0);
    if (!cryptoId || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // Drizzle decimal columns expect string values for inserts/updates
    const amountStr = amount.toString();

    // Opcional: validar que la crypto exista (permitimos top assets; id como 'bitcoin', 'ethereum', etc.)
    const existingCrypto = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.id, cryptoId));
    if (existingCrypto.length === 0) {
      // Si no existe, creamos una entrada mínima para referencial integrity
      await db.insert(cryptocurrencies).values({ id: cryptoId, symbol: cryptoId.toUpperCase(), name: cryptoId });
    }

    const u = await getOrCreateUserByEmail(user.email);
    const p = await getOrCreateDefaultPortfolio(u.id);

    // Upsert de holding: si existe para ese portfolio/crypto, actualizamos amount (sustitución)
    const existingHolding = await db
      .select()
      .from(holdings)
      .where(and(eq(holdings.portfolioId, p.id), eq(holdings.cryptoId, cryptoId)));

    if (existingHolding.length > 0) {
      await db
        .update(holdings)
        .set({ amount: amountStr })
        .where(and(eq(holdings.portfolioId, p.id), eq(holdings.cryptoId, cryptoId)));
    } else {
      await db.insert(holdings).values({ portfolioId: p.id, cryptoId, amount: amountStr });
    }

    const rows = await db.select().from(holdings).where(eq(holdings.portfolioId, p.id));
    return NextResponse.json({ portfolioId: p.id, holdings: rows.slice(0, 30) });
  } catch (err) {
    console.error('POST /api/portfolio/holdings error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const cryptoId: string = (body?.cryptoId ?? '').toString();
    const amount: number = Number(body?.amount ?? 0);
    if (!cryptoId || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const amountStr = amount.toString();

    const u = await getOrCreateUserByEmail(user.email);
    const p = await getOrCreateDefaultPortfolio(u.id);

    const existingHolding = await db
      .select()
      .from(holdings)
      .where(and(eq(holdings.portfolioId, p.id), eq(holdings.cryptoId, cryptoId)));

    if (existingHolding.length === 0) {
      return NextResponse.json({ error: 'Holding not found' }, { status: 404 });
    }

    await db
      .update(holdings)
      .set({ amount: amountStr })
      .where(and(eq(holdings.portfolioId, p.id), eq(holdings.cryptoId, cryptoId)));

    const rows = await db.select().from(holdings).where(eq(holdings.portfolioId, p.id));
    return NextResponse.json({ portfolioId: p.id, holdings: rows.slice(0, 30) });
  } catch (err) {
    console.error('PATCH /api/portfolio/holdings error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const cryptoId: string = (body?.cryptoId ?? '').toString();
    if (!cryptoId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const u = await getOrCreateUserByEmail(user.email);
    const p = await getOrCreateDefaultPortfolio(u.id);

    await db
      .delete(holdings)
      .where(and(eq(holdings.portfolioId, p.id), eq(holdings.cryptoId, cryptoId)));

    const rows = await db.select().from(holdings).where(eq(holdings.portfolioId, p.id));
    return NextResponse.json({ portfolioId: p.id, holdings: rows.slice(0, 30) });
  } catch (err) {
    console.error('DELETE /api/portfolio/holdings error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}