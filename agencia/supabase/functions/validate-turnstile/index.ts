// Supabase Edge Function — validate-turnstile
// Valida un token de Turnstile (Cloudflare) llamando a su API
//
// Desplegar en Supabase Dashboard > Edge Functions > Create Function
// Copiar esta función, y en Secrets agregar:
//   TURNSTILE_SECRET_KEY (obtener desde Cloudflare Dashboard > Turnstile)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "Token requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const outcome = await result.json();

    return new Response(JSON.stringify({ success: outcome.success }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
