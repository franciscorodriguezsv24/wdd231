// Data layer — fetches the provider list with the Fetch API.
// All callers wrap this in try/catch for robust error handling.

export async function fetchProviders() {
  const response = await fetch("data/providers.json");
  if (!response.ok) {
    throw new Error(`Network error: HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.providers;
}
