export default async function sitemap() {
  const baseUrl = "https://www.apagonpuertorico.com";
  const currentDate = new Date();

  const routes = [
    {
      path: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  return routes;
}
