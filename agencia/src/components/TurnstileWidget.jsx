import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "../backend/supabase_client";

export default function TurnstileWidget({ onToken }) {
  return (
    <Turnstile
      siteKey={TURNSTILE_SITE_KEY}
      onSuccess={onToken}
      options={{
        theme: "light",
        size: "invisible",
      }}
    />
  );
}
