import './globals.css';
import SW from '../components/SW';

export const metadata = {
  title: 'FourForge – Play Connect Four Online',
  description: 'Play Connect Four online. Challenge friends in this fast, responsive browser game. Built by AnointedTheDeveloper.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* Open Graph */}
        <meta property="og:title" content="FourForge – Connect Four Game" />
        <meta property="og:description" content="Challenge your friends in this modern Connect Four web app." />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:url" content="https://yourdomain.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FourForge – Connect Four Game" />
        <meta name="twitter:description" content="Challenge your friends in this modern Connect Four web app." />
        <meta name="twitter:image" content="/preview.png" />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": "FourForge",
          "author": { "@type": "Person", "name": "AnointedTheDeveloper" },
          "applicationCategory": "Game",
          "operatingSystem": "Web",
          "url": "https://yourdomain.vercel.app"
        })}} />
      </head>
      <body><SW />{children}</body>
    </html>
  );
}
