export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 bytes";
  }

  const units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1).replace(/\.0$/, "")} ${units[unitIndex]}`;
}

export const generateUUID = () =>  crypto.randomUUID();
