// Version management utilities
import fs from 'fs/promises';
import path from 'path';

export interface VersionInfo {
  version: string;
  buildDate: string;
}

export async function getVersion(): Promise<VersionInfo> {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = await fs.readFile(packagePath, 'utf-8');
    const packageData = JSON.parse(packageJson);
    
    return {
      version: packageData.version || '0.0.0',
      buildDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error reading version:', error);
    return {
      version: '0.0.0',
      buildDate: new Date().toISOString(),
    };
  }
}

export function parseVersion(version: string): { year: number; month: number; day: number; build: number } | null {
  const match = version.match(/^(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
    build: parseInt(match[4], 10),
  };
}

export function incrementVersion(currentVersion: string): string {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    // If version doesn't match pattern, start fresh
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}.01`;
  }
  
  const now = new Date();
  const currentDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const versionDate = `${parsed.year}.${String(parsed.month).padStart(2, '0')}.${String(parsed.day).padStart(2, '0')}`;
  
  if (currentDate === versionDate) {
    // Same date, increment build number
    const newBuild = parsed.build + 1;
    return `${versionDate}.${String(newBuild).padStart(2, '0')}`;
  } else {
    // New date, reset to .01
    return `${currentDate}.01`;
  }
}

