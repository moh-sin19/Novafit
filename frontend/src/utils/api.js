const API_BASE = "http://localhost:8080";

export function setAuthToken(token, userId) {
  if (token) {
    localStorage.setItem("token", token);

    // Only persist userId if it’s a real value
    if (userId != null && userId !== "undefined") {
      localStorage.setItem("userId", String(userId));
    } else {
      localStorage.removeItem("userId");
    }
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  }
}

function getSubFromJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));
    // your token shows "sub": "2"
    return json?.sub ?? null;
  } catch {
    return null;
  }
}

export function authHeaders() {
  const t = localStorage.getItem("token");
  const u = localStorage.getItem("userId");

  const headers = {};
  if (t) headers.Authorization = `Bearer ${t}`;
  // Only send X-User-Id if it’s valid
  if (u && u !== "undefined") headers["X-User-Id"] = u;

  return headers;
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const data = await parseJson(res);
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || res.statusText || "Request failed"
    );
  return data;
}

export async function putJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || res.statusText || "Request failed"
    );
  return data;
}

export async function postJson(path, body) {
  const hasBody = body !== undefined && body !== null;
  console.log("hasbody", hasBody);
  console.log("JSON.stringify(body)", JSON.stringify(body));
  console.log("path", path);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });
  const data = await parseJson(res);
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || res.statusText || "Request failed"
    );
  return data;
}

export async function deleteJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const data = await parseJson(res);
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || res.statusText || "Request failed"
    );
  return data;
}
export function deriveUserId(token, userObj) {
  return userObj?.id ?? getSubFromJwt(token);
}
