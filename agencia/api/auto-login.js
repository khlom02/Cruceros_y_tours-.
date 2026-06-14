import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  const host = req.headers.host || '';

  if (origin && !origin.includes(host)) {
    return res.status(403).json({ error: 'Origin mismatch' });
  }

  const PRODUCTION_HOSTS = [
    'cruceros-y-tours.vercel.app',
    'crucerosytours.vercel.app',
    'crucerosytours.com',
    'www.crucerosytours.com',
  ];

  if (PRODUCTION_HOSTS.some(h => host.includes(h))) {
    return res.status(403).json({ error: 'Not available in production' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Missing configuration' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
}
