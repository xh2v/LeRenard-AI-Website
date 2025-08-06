import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: Ai;
	// S'il y a d'autres bindings, ils doivent être définis ici
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
			'Access-Control-Max-Age': '86400',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					...corsHeaders,
					'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
				},
			});
		}

		const url = new URL(request.url);

		if (url.pathname === '/api/chat') {
			if (request.method === 'POST') {
				try {
					const contentType = request.headers.get('Content-Type');
					if (!contentType || !contentType.includes('application/json')) {
						return new Response(JSON.stringify({ error: 'Invalid Content-Type, expected application/json' }), {
							headers: { 
								'Content-Type': 'application/json',
								...corsHeaders,
							},
							status: 400
						});
					}
					
					const { messages, model } = await request.json() as { messages: Message[], model: string };
					
					if (!messages || !model) {
						return new Response(JSON.stringify({ error: 'Missing messages or model in request body' }), {
							headers: { 
								'Content-Type': 'application/json',
								...corsHeaders,
							},
							status: 400
						});
					}

					const ai = new Ai(env.AI);
					
					const response = await ai.run(model, { messages });
					
					const result = response.response;
					
					return new Response(JSON.stringify({ response: result }), {
						headers: { 
							'Content-Type': 'application/json',
							...corsHeaders,
						},
						status: 200
					});
				} catch (e: any) {
					console.error("AI fetch error:", e);
					return new Response(JSON.stringify({ error: e.message || 'Erreur lors de la génération de la réponse par l\'IA' }), {
						headers: { 
							'Content-Type': 'application/json',
							...corsHeaders,
						},
						status: 500
					});
				}
			} else {
				return new Response('Endpoint only supports POST requests.', {
					status: 405,
					headers: corsHeaders,
				});
			}
		}

		// Pour toutes les autres requêtes, on renvoie une réponse par défaut.
		return new Response('API Worker is running. Send a POST request to /api/chat to interact with the AI.', {
			status: 200,
			headers: corsHeaders,
		});
	},
};


