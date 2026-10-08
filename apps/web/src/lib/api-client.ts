const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  details?: any;
}

class ApiClient {
  private getTokens() {
    if (typeof window === 'undefined') return { access: null, refresh: null };
    return {
      access: localStorage.getItem('accessToken'),
      refresh: localStorage.getItem('refreshToken')
    };
  }

  private setTokens(access: string, refresh: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  public clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { access, refresh } = this.getTokens();
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (access) {
      headers['Authorization'] = `Bearer ${access}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 and try refresh token rotation
    if (response.status === 401 && refresh) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refresh })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          this.setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);

          // Retry original request with fresh token
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          response = await fetch(url, { ...options, headers });
        } else {
          this.clearTokens();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } catch (err) {
        this.clearTokens();
      }
    }

    const payload: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'API request failed');
    }

    return payload.data;
  }

  public get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }
}

export const apiClient = new ApiClient();
