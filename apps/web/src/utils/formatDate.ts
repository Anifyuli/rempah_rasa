export function formatDate(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return "-"; // fallback kalau null/undefined

  // Jika sudah Date object
  const dateObj = dateValue instanceof Date ? dateValue : new Date(dateValue);

  // Cek validitas date
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date:", dateValue);
    return "-";
  }

  return dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
