// React video app core
import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [credits, setCredits] = useState(3);

  const handleGenerate = async () => {
    if (credits <= 0) {
      alert('You’ve used all 3 free videos. Upgrade to unlock unlimited access.');
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const response = await fetch('https://api.runwayml.com/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_RUNWAY_API_KEY'
        },
        body: JSON.stringify({
          prompt,
          model: 'gen-2',
          num_outputs: 1
        })
      });

      const data = await response.json();
      const video = data.results?.[0]?.url;

      if (video) {
        setVideoUrl(video);
        setCredits(prev => prev - 1);
      } else {
        alert('Failed to generate video.');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating video.');
    }

    setLoading(false);
  };

  const handleUpgrade = async () => {
    alert('Upgrade flow goes here (Stripe)');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🎬 MakeaMovie</h1>
      <p>Turn your words into magical videos.</p>
      <textarea
        rows={4}
        style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
        placeholder="Describe your video..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {credits <= 0 && (
        <button onClick={handleUpgrade} style={{ marginLeft: '1rem' }}>
          Upgrade
        </button>
      )}
      {videoUrl && (
        <div style={{ marginTop: '1rem' }}>
          <video src={videoUrl} controls style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}
