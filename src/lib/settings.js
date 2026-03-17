import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'settings.json');

// Default settings jika file belum ada
const defaultSettings = {
  title: 'Blog Modern Saya',
  description: 'Temukan berbagai artikel menarik dan informatif di sini.',
  logoText: 'BlogModern',
  headerScript: '',
  footerScript: '',
  sidebarScript: '',
  articleScript: ''
};

export function getSettings() {
  if (fs.existsSync(settingsPath)) {
    const fileContent = fs.readFileSync(settingsPath, 'utf-8');
    return JSON.parse(fileContent);
  }
  return defaultSettings;
}