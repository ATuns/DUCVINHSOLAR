/**
 * Extract Google Drive file ID from common share/view/open/uc/thumbnail/lh3 URLs.
 */
export function extractGoogleDriveFileId(rawUrl: string): string | null {
  const url = (rawUrl || '').trim();
  if (!url) return null;

  // 1. https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
  const filePathMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/i);
  if (filePathMatch?.[1]) return filePathMatch[1];

  // 2. https://lh3.googleusercontent.com/d/<FILE_ID>=w1600
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/i);
  if (lh3Match?.[1]) return lh3Match[1];

  // 3. https://drive.google.com/open?id=<FILE_ID> or /uc?id=<FILE_ID> or /thumbnail?id=<FILE_ID>
  if (/drive\.google\.com|docs\.google\.com/i.test(url)) {
    try {
      const parsed = new URL(url);
      const idParam = parsed.searchParams.get('id');
      if (idParam && /^[a-zA-Z0-9_-]{10,}$/.test(idParam)) {
        return idParam;
      }
    } catch {
      const idRegex = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/i);
      if (idRegex?.[1]) return idRegex[1];
    }
  }

  return null;
}

/**
 * Convert any Google Drive share link into a direct high-res displayable image URL.
 * Non-Drive URLs are returned unchanged.
 */
export function normalizeImageUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w1600`;
  }

  return trimmed;
}

/**
 * Secondary fallback URL for Google Drive images if lh3 fails to load in a specific browser/network.
 */
export function getGoogleDriveFallbackUrl(rawUrl: string): string | null {
  const driveId = extractGoogleDriveFileId(rawUrl);
  if (!driveId) return null;
  if (rawUrl.includes('drive.google.com/thumbnail')) return null;
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
}
