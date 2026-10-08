import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_GD_TOPICS } from '@/lib/gd-topics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = {
  params: {
    path: string[];
  };
};

async function proxyRequest(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const configuredApiUrl = process.env.API_URL;
  const apiOrigin = configuredApiUrl
    ? configuredApiUrl.replace(/\/+$/, '')
    : process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : null;

  if (!apiOrigin) {
    const isTopicListRequest =
      request.method === 'GET' &&
      params.path.length === 2 &&
      params.path[0] === 'gd' &&
      params.path[1] === 'topics';

    if (isTopicListRequest) {
      return NextResponse.json({ success: true, data: DEFAULT_GD_TOPICS });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'This feature needs the PlacementOS API, which is not connected yet.',
      },
      { status: 503 }
    );
  }

  if (new URL(apiOrigin).origin === request.nextUrl.origin) {
    return NextResponse.json(
      {
        success: false,
        message: 'API_URL must point to the API service, not back to the website.',
      },
      { status: 503 }
    );
  }

  const path = params.path.map(encodeURIComponent).join('/');
  const upstreamUrl = new URL(
    `/api/v1/${path}${request.nextUrl.search}`,
    apiOrigin
  );
  const headers = new Headers(request.headers);
  headers.delete('accept-encoding');
  headers.delete('connection');
  headers.delete('content-length');
  headers.delete('host');

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'manual',
    });
  } catch (error) {
    console.error('API proxy request failed:', error);
    return NextResponse.json(
      { success: false, message: 'API service is unavailable.' },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete('connection');
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
