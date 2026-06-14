import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "../backend/supabase_client";

export default function TurnstileWidget({ onToken }) {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <Turnstile
      siteKey={TURNSTILE_SITE_KEY}
      onSuccess={onToken}
      onError={() => setErrored(true)}
      options={{
        theme: "light",
        size: "invisible",
        retry: "never",
      }}
    />
  );
}
