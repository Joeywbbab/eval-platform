"use client"

import { useState, useCallback, useEffect } from "react"
import { storage } from "@/lib/storage"

export type Locale = "en" | "zh"

const LOCALE_STORAGE_KEY = "app-locale"

/**
 * Hook for managing locale state
 * Persists locale preference in localStorage
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Get saved locale or default to 'en'
    const saved = storage.get<Locale>(LOCALE_STORAGE_KEY)
    return saved || "en"
  })

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    storage.set(LOCALE_STORAGE_KEY, newLocale)
    // Optionally reload the page to apply changes
    // window.location.reload()
  }, [])

  const toggleLocale = useCallback(() => {
    const newLocale: Locale = locale === "en" ? "zh" : "en"
    setLocale(newLocale)
  }, [locale, setLocale])

  return { locale, setLocale, toggleLocale }
}
