// Vercel Serverless Function: /api/visualize-room
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!payload || !payload.roomImage || !payload.product) {
      return res.status(400).json({ error: 'roomImage and product are required.' });
    }

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Optional: Call Gemini 2.5 Flash / Imagen if key provided
    }

    return res.status(200).json({
      success: true,
      visualizationImage: payload.roomImage,
      watermark: 'AI Concept • Nivaraa Living Atelier',
      meta: {
        piece: payload.product.name,
        color: payload.color,
        material: payload.material,
        style: payload.style,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('API /visualize-room error:', err);
    return res.status(500).json({ error: 'Internal server error processing room visualization.' });
  }
};
