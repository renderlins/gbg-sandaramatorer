// Cloudflare Pages Function: /api/auth/callback
// Tar emot GitHub-svaret, växlar koden mot en access-token,
// och postar tillbaka resultatet till Decap CMS-fönstret.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Saknar 'code' i svaret.", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const data = await tokenRes.json();

  const status = data.access_token ? "success" : "error";
  const content = data.access_token
    ? { token: data.access_token, provider: "github" }
    : { error: data.error || "Okänt fel vid inloggning" };

  // Decap lyssnar efter ett postMessage från detta popup-fönster.
  const body = `<!doctype html><html><body><script>
    (function () {
      function send(message) {
        window.opener && window.opener.postMessage(
          'authorization:github:${status}:' + JSON.stringify(${JSON.stringify(content)}),
          '*'
        );
      }
      window.addEventListener('message', function () { send(); }, false);
      send();
    })();
  </script><p>Inloggning klar. Du kan stänga det här fönstret.</p></body></html>`;

  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
