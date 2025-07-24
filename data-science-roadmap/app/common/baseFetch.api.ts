// app/common/api/baseFetch.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Makes a fetch call to the backend API.
 * Always includes credentials (cookies) for session support.
 * Throws an error if the response is not ok.
 * 
 * @param path - The API path, e.g., "/api/upload/summary"
 * @param options - Fetch options (method, headers, body, etc)
 * @returns - Parsed JSON response
 */
export async function baseFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = API_BASE_URL + path;
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    let errorMsg = "Unknown error";
    try {
      const data = await res.json();
      errorMsg = data.detail || JSON.stringify(data);
    } catch {
      errorMsg = await res.text();
    }
    const error: any = new Error(errorMsg);
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}
