const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API = {
  case: `${BASE_URL}/api/v1/case`,
  reporter: `${BASE_URL}/api/v1/reporter`,
  editor: `${BASE_URL}/api/v1/editor`,
  assignedCase: `${BASE_URL}/api/v1/assignedcase`
  // add more endpoints here as your app grows
};

export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<TResponse>;
}

export async function apiPut<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<TResponse>;
}