import enTranslations from "@/locales/en.json"
import zhTranslations from "@/locales/zh.json"

export type Locale = "en" | "zh"

export type TranslationKey = keyof typeof enTranslations

const translations = {
  en: enTranslations,
  zh: zhTranslations,
}

/**
 * Get translation for a given key and locale
 * Supports nested keys using dot notation: "dashboard.title"
 * Supports placeholders: "traces.itemsPending" with { count: 5 }
 */
export function getTranslation(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key itself if not found
        }
      }
    }
  }

  // If value is not a string, return the key
  if (typeof value !== "string") {
    return key
  }

  // Replace placeholders
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return paramKey in params ? String(params[paramKey]) : match
    })
  }

  return value
}

/**
 * Get all translations for a namespace
 */
export function getNamespaceTranslations(
  locale: Locale,
  namespace: string
): Record<string, any> {
  const keys = namespace.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return {}
    }
  }

  return typeof value === "object" ? value : {}
}
