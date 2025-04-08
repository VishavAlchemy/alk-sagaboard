import { NextRequest, NextResponse } from 'next/server';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Try to get the direct auth URL first
    let convexAuthUrl = process.env.CONVEX_AUTH_URL;
    
    // If not available, construct it from the base URL
    if (!convexAuthUrl) {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      
      if (!convexUrl) {
        console.error('Missing NEXT_PUBLIC_CONVEX_URL environment variable');
        return NextResponse.json(
          { error: 'Convex URL not configured' },
          { status: 500 }
        );
      }
      
      convexAuthUrl = `${convexUrl}/auth`;
    }
    
    console.log(`Forwarding auth request to ${convexAuthUrl}`);
    
    // Get the request body
    const body = await request.json().catch(err => {
      console.error('Failed to parse request body:', err);
      return {};
    });
    
    // Forward the request to Convex
    const response = await fetch(convexAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      // Log the error response for debugging
      const errorText = await response.text();
      console.error('Convex auth error response:', errorText);
      
      return NextResponse.json(
        { error: `Authentication failed: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get the response from Convex
    const data = await response.json();
    
    // Return the response with CORS headers
    const resp = NextResponse.json(data, { status: response.status });
    resp.headers.set('Access-Control-Allow-Origin', '*');
    return resp;
  } catch (error: any) {
    console.error('Auth proxy error:', error);
    const resp = NextResponse.json(
      { error: error.message || 'Authentication error' },
      { status: 500 }
    );
    resp.headers.set('Access-Control-Allow-Origin', '*');
    return resp;
  }
} 