// Cloudflare Pages Function: /api/auth
// Startar GitHub OAuth-flödet för Decap CMS.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  const redirectUri = `${url.origin}/api/auth/callback`;

  const githubAuth = new URL("https://github.com/login/oauth/authorize");
  githubAuth.searchParams.set("client_id", clientId);
  githubAuth.searchParams.set("redirect_uri", redirectUri);
  githubAuth.searchParams.set("scope", "repo");
  githubAuth.searchParams.set("state", crypto.randomUUID());

  return Response.redirect(githubAuth.toString(), 302);
}
