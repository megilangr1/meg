import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL sengaja dihapus — same-domain, docs `/docs/integrations/next` tidak pakai baseURL.
  // `BETTER_AUTH_URL` tanpa prefix `NEXT_PUBLIC_` = undefined di browser.
  plugins: [adminClient()],
});
