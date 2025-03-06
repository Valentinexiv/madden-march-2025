import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-response';

/**
 * Debug endpoint that logs and returns the raw request details
 * This is helpful for debugging what the Madden Companion app is sending
 */
export async function GET(req: NextRequest) {
  const headers = Object.fromEntries(req.headers.entries());
  const url = req.url;
  const method = req.method;
  const params = Object.fromEntries(new URL(req.url).searchParams.entries());
  
  console.log('--- DEBUG REQUEST INFO ---');
  console.log('URL:', url);
  console.log('Method:', method);
  console.log('Headers:', JSON.stringify(headers, null, 2));
  console.log('Query Params:', JSON.stringify(params, null, 2));
  console.log('------------------------');
  
  return successResponse({
    message: 'Request details logged',
    request: {
      url,
      method,
      headers,
      params
    }
  });
}

export async function POST(req: NextRequest) {
  const headers = Object.fromEntries(req.headers.entries());
  const url = req.url;
  const method = req.method;
  
  // Try to parse the body
  let body = null;
  try {
    const clonedReq = req.clone();
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await clonedReq.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await clonedReq.formData();
      body = Object.fromEntries(formData.entries());
    } else if (contentType.includes('text/')) {
      body = await clonedReq.text();
    } else {
      body = 'Body format not supported for logging';
    }
  } catch (error) {
    body = `Error parsing body: ${error.message}`;
  }
  
  console.log('--- DEBUG REQUEST INFO (POST) ---');
  console.log('URL:', url);
  console.log('Method:', method);
  console.log('Headers:', JSON.stringify(headers, null, 2));
  console.log('Body:', typeof body === 'string' ? body : JSON.stringify(body, null, 2));
  console.log('--------------------------------');
  
  return successResponse({
    message: 'POST request details logged',
    request: {
      url,
      method,
      headers,
      body
    }
  });
}