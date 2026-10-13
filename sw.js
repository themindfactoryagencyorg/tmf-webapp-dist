// Qrema service worker — Web Push only (CAS-5186). No fetch handler on purpose:
// the app is never served from a cache, so a deploy can't leave a stale shell.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  // iOS revokes push for a web app that receives a push without showing one.
  event.waitUntil(self.registration.showNotification(data.title || 'Qrema', {
    body: data.body || '',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    tag: data.tag || undefined,
    data: { link: data.link || null },
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const link = event.notification.data && event.notification.data.link
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const url = link && link.screen ? `/#push=${encodeURIComponent(JSON.stringify(link))}` : '/'
    const client = windows.find((c) => new URL(c.url).origin === self.location.origin && 'navigate' in c)
    if (client) {
      // Persist in the URL before focusing. Works even before React listens,
      // while signed out, or when the session expires during navigation.
      const navigated = await client.navigate(url).catch(() => null)
      if (navigated) { await navigated.focus(); return }
    }
    await self.clients.openWindow(url)
  })())
})
