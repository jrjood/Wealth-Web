import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

import { getProjectSlug } from '../src/lib/projectSlug.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
const BASE_URL = 'https://wealthholding-eg.com';

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about-us', changefreq: 'monthly', priority: 0.8 },
  { path: '/projects', changefreq: 'weekly', priority: 0.9 },
  { path: '/careers', changefreq: 'weekly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.8 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
];

const createSitemap = (content) => {
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${content}
    </urlset>
  `;
  return sitemap.trim();
};

const generateUrlEntry = (url, changefreq, priority) => {
  return `
    <url>
      <loc>${url}</loc>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
  `;
};

const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/projects`);
    return response.data.map((project) => ({
      path: `/projects/${getProjectSlug(project)}`,
      changefreq: 'weekly',
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

const generateSitemap = async () => {
  const projectPages = await fetchProjects();
  const allPages = [...staticPages, ...projectPages];

  const sitemapContent = allPages
    .map((page) =>
      generateUrlEntry(
        `${BASE_URL}${page.path}`,
        page.changefreq,
        page.priority,
      ),
    )
    .join('');

  const sitemap = createSitemap(sitemapContent);
  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
