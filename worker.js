import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    if (request.method === 'POST') {
      const origin = request.headers.get('Origin');
      const headers = {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'application/json',
      };

      try {
        const { message } = await request.json();

        if (!message) {
          return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: headers,
          });
        }
        
        const ai = new Ai(env.AI);
        const model = '@cf/meta/llama-3-8b-instruct';
        const messages = [
          { role: 'system', content: "Vous êtes un assistant IA utile." },
          { role: 'user', content: message }
        ];

        const aiResponse = await ai.run(model, { messages });
        
        return new Response(JSON.stringify({ response: aiResponse.response }), {
          status: 200,
          headers: headers,
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: headers,
        });
      }
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};

function handleOptions(request) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    const origin = headers.get('Origin');
    const responseHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    });
  } else {
    return new Response(null, {
      status: 403,
      statusText: 'Forbidden',
    });
  }
}
