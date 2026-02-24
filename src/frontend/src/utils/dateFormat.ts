/**
 * Formats a date string into a human-readable format (MM/DD/YYYY)
 * @param dateString - Date string in ISO format (YYYY-MM-DD) or other parseable format
 * @returns Formatted date string or '-' if invalid/empty
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString || dateString.trim() === '') {
    return '-';
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }

    // Format as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    return '-';
  }
}
