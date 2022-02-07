export async function fetchToBackend(url, body, method) {
  const response = await fetch(url, {
    body: JSON.stringify(body) || null,
    method: method || (body ? 'post' : 'get'),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  }

  return { status: response.status, isError: true };
}
