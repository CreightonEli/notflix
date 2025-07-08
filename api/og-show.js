export default function handler(req, res) {
  const ua = req.headers['user-agent'] || '';
  const isBot = /bot|crawl|slurp|spider|facebook|discord|twitter|linkedin/i.test(ua);

  const { id } = req.query;

  if (isBot && id) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nullflix Show</title>
          <meta property="og:title" content="Nullflix Show" />
          <meta property="og:description" content="Check out this show on Nullflix!" />
          <meta property="og:url" content="https://nullflix.vercel.app/#/shows/${id}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <p>OG tags for bots.</p>
        </body>
      </html>
    `);
  } else {
    // Redirect normal users to the React app
    res.writeHead(307, { Location: `/shows/${id}` });
    res.end();
  }
}