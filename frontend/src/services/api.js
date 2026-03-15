export async function getSystemSummary() {
  const response = await fetch("/api/system");

  if (!response.ok) {
    throw new Error("Failed to load backend data.");
  }

  return response.json();
}
