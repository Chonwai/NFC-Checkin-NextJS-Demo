export async function adminFetch(endpoint: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        ...options.headers
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
