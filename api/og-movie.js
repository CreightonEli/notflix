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
          <title>Nullflix Movie</title>
          <meta property="og:title" content="Nullflix Movie" />
          <meta property="og:description" content="Check out this movie on Nullflix!" />
          <meta property="og:url" content="https://nullflix.vercel.app/#/movie/${id}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <p>OG tags for bots.</p>
        </body>
      </html>
    `);
  } else {
    // Redirect normal users to the React app
    res.writeHead(307, { Location: `/movie/${id}` });
    res.end();
  }
}