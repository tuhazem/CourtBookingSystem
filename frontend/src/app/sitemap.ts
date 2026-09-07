import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://malaabna-app.vercel.app';

  // Static routes
  const routes = [
    '',
    '/about',
    '/support',
    '/partner',
    '/privacy',
    '/terms',
    '/my-bookings',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // TODO: Add dynamic court pages
  // In production, fetch courts and add them:
  // const courts = await fetchCourts();
  // const courtPages = courts.map((court) => ({
  //   url: `${baseUrl}/courts/${court.id}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.9,
  // }));

  return routes;
}
