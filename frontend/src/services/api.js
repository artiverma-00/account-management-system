const BASE = "/api";

async function parseResponse(res, fallbackMessage) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function signup(name, email, password) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return parseResponse(res, "Signup failed");
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(res, "Login failed");
}

export async function getBalance(token) {
  const res = await fetch(`${BASE}/account/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res, "Failed to load balance");
}

export async function getStatement(token) {
  const res = await fetch(`${BASE}/account/statement`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseResponse(res, "Failed to load statement");
}

export async function transfer(token, receiverId, amount) {
  const res = await fetch(`${BASE}/account/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiverId, amount: Number(amount) }),
  });

  return parseResponse(res, "Transfer failed");
}
