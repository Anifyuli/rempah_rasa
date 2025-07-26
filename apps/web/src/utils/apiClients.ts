export function createApiClient(
  accessToken: string | null,
  refreshAccessToken: () => Promise<boolean>
) {
  return async function api(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const headers: HeadersInit = {
      ...(init?.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    let res = await fetch(input, { ...init, headers });

    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newToken = localStorage.getItem("accessToken");
        const retryHeaders: HeadersInit = {
          ...(init?.headers || {}),
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        };
        res = await fetch(input, { ...init, headers: retryHeaders });
      }
    }

    return res;
  };
}
