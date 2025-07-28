export function createApiClient(
  getAccessToken: () => string | null,
  refreshAccessToken: () => Promise<boolean>
) {
  let isRefreshing = false; // Prevent multiple refresh calls
  let refreshPromise: Promise<boolean> | null = null;

  return async function api(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const makeRequest = async (token: string | null) => {
      const headers: HeadersInit = {
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      return fetch(input, { ...init, headers });
    };

    // First attempt with current token
    let currentToken = getAccessToken();
    let res = await makeRequest(currentToken);

    // If 401, attempt token refresh
    if (res.status === 401 && !isRefreshing) {
      try {
        // Prevent multiple simultaneous refresh attempts
        if (!refreshPromise) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
        }

        const refreshed = await refreshPromise;
        
        if (refreshed) {
          // Get the new token and retry
          const newToken = getAccessToken();
          res = await makeRequest(newToken);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return res;
  };
}
