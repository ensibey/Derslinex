/**
 * Ortam Değişkenleri (Environment Variables) Doğrulama Modülü
 * Canlı (production) veya geliştirme ortamında kritik değişkenlerin tanımlı olup olmadığını kontrol eder.
 */

export interface EnvValidationResult {
  isValid: boolean;
  missingKeys: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const requiredVars = [
    "DATABASE_URL",
    "JWT_SECRET",
  ];

  const optionalVars = [
    "RESEND_API_KEY",
    "DAILY_API_KEY",
    "NEXT_PUBLIC_APP_URL",
  ];

  const missingKeys: string[] = [];
  const warnings: string[] = [];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      missingKeys.push(key);
    }
  }

  for (const key of optionalVars) {
    if (!process.env[key]) {
      warnings.push(`${key} tanımlanmamış. İlgili harici servisler (E-posta/Canlı Video) çalışmayabilir.`);
    }
  }

  const isValid = missingKeys.length === 0;

  if (!isValid && process.env.NODE_ENV === "development") {
    console.warn("⚠️ Eksik Kritik Ortam Değişkenleri:", missingKeys.join(", "));
  }

  return {
    isValid,
    missingKeys,
    warnings,
  };
}
