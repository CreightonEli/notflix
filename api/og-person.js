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
          <title>Nullflix Person</title>
          <meta property="og:title" content="Nullflix Person" />
          <meta property="og:description" content="Check out this person on Nullflix!" />
          <meta property="og:url" content="https://nullflix.vercel.app/#/person/${id}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <p>OG tags for bots.</p>
        </body>
      </html>
    `);
  } else {
    // Redirect normal users to the React app
    res.writeHead(307, { Location: `/person/${id}` });
    res.end();
  }
}