export function toBase64Url(json: Record<string, unknown>) {
  const base64 = Buffer.from(JSON.stringify(json)).toString('base64')
  const base64Url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  return base64Url
}

export function fromBase64Url(url: string) {
  if (url) {
    const [, base64Url] = url.split('?oob=')
    const json = JSON.parse(
      Buffer.from(Buffer.from(base64Url, 'base64')).toString('utf-8')
    )
    return json
  }
  return {}
}

export async function get(endpoint: string) {
  const response = await fetch(endpoint)
  const json = await response.json()
  if (!response.ok) {
    throw new Error(JSON.stringify(json, null, 2))
  }
  return json
}
