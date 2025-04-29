// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;
  const apiUrl = `http://144.91.74.15:8000/${Array.isArray(path) ? path.join('/') : path}`;
  
  try {
    const headers: HeadersInit = {
      'Content-Type': req.headers['content-type'] as string || 'application/json',
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization as string;
    }
    
    // Prepare request body for non-GET requests
    let body: string | undefined;
    if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
      body = JSON.stringify(req.body);
    }
    
    const response = await fetch(apiUrl, {
      method: req.method,
      headers,
      body,
    });
    
    const data = await response.text();
    
    // Forward the response status
    res.status(response.status);
    
    try {
      // If it's JSON, parse and send as JSON
      const json = JSON.parse(data);
      return res.json(json);
    } catch {
      // Otherwise send as text
      return res.send(data);
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from API' });
  }
}