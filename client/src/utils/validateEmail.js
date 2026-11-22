/**
 * Validates if an email address belongs to an allowed school/educational domain.
 * Acceptable formats include:
 * - .edu (e.g., student@hostel.edu)
 * - .ac.in / .ac.uk / .ac.* (e.g., alex@iitb.ac.in)
 * - .edu.in / .edu.* (e.g., user@school.edu.in)
 * - domains containing school, college, university, or hostel keywords
 *
 * Public domains (gmail.com, yahoo.com, outlook.com, hotmail.com, etc.) are strictly rejected.
 */
export function isSchoolEmail(email) {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.trim().toLowerCase();

  // Basic email syntax format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) return false;

  const domain = cleanEmail.split("@")[1];
  if (!domain) return false;

  // Block generic public email providers
  const publicDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "gmx.com",
    "mail.com",
  ];
  if (publicDomains.includes(domain)) {
    return false;
  }

  // Allowed educational/school patterns
  const schoolDomainPatterns = [
    /\.edu$/,
    /\.edu\.[a-z]{2,3}$/,
    /\.ac\.[a-z]{2,3}$/,
    /\.school$/,
    /school/i,
    /college/i,
    /university/i,
    /hostel/i,
    /inst/i,
  ];

  return schoolDomainPatterns.some((pattern) => pattern.test(domain));
}
