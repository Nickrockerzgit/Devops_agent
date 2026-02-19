// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AgentRunRequest {
  repoUrl: string;
  teamName: string;
  leaderName: string;
}

export interface AgentRunResponse {
  success: boolean;
  results: any;
  message: string;
}

/**
 * Call the backend agent service to run analysis
 */
export async function runAgentAPI(
  request: AgentRunRequest,
  token?: string,
): Promise<AgentRunResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/agent/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      repoUrl: request.repoUrl,
      teamName: request.teamName,
      leaderName: request.leaderName,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Register a new user
 */
export async function registerAPI(data: {
  email: string;
  password: string;
  name: string;
  teamName: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Login user
 */
export async function loginAPI(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

/**
 * Health check
 */
export async function healthCheckAPI() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
