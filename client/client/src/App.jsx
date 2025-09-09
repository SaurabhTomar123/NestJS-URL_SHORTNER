import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    setShortenedUrl('');
    setError('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/short-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to shorten URL');
      } else {
        const data = await response.json();
        setShortenedUrl(data.shortUrl || '');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("/img.svg")`, // <-- your image in public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
        <h1 className="text-center mb-4 text-white">URL Shortener</h1>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="btn btn-danger w-100"
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {shortenedUrl && (
          <div className="alert alert-success mt-3">
            Shortened URL:{' '}
            <a href={shortenedUrl} target="_blank" rel="noreferrer">
              {shortenedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
