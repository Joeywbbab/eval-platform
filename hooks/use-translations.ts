"use client"

import { useCallback } from "react"
import { useLocale } from "./use-locale"
import { getTranslation, getNamespaceTranslations } from "@/lib/translations"

/**
 * Hook for accessing translations
 * @param namespace - Optional namespace to scope translations (e.g., "dashboard", "traces")
 * @returns Translation function
 *
 * @example
 * const t = useTranslations()
 * t("common.loading") // "Loading..." or "加载中..."
 *
 * @example
 * const t = useTranslations("dashboard")
 * t("title") // "Dashboard" or "仪表盘"
 * t("itemsPending", { count: 5 }) // "5 items pending" or "5 个待处理项"
 */
export function useTranslations(namespace?: string) {
  const { locale } = useLocale()

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return getTranslation(locale, fullKey, params)
    },
    [locale, namespace]
  )

  return t
}

/**
 * Hook for accessing all translations in a namespace
 * Useful for mapping over translated values
 *
 * @example
 * const translations = useNamespaceTranslations("dashboard")
 * translations.title // "Dashboard" or "仪表盘"
 */
export function useNamespaceTranslations(namespace: string) {
  const { locale } = useLocale()
  return getNamespaceTranslations(locale, namespace)
}
