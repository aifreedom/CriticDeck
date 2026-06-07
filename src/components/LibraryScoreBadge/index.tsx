import React, { useEffect, useRef, useState } from 'react'

import { useMetacriticScore } from '../../hooks/useMetacriticScore'
import { useSettings } from '../../hooks/useSettings'
import { toneForScore } from '../../lib/scoreTone'
import { ensureTileBadgeStyle } from './style'

declare const appStore: {
  GetAppOverviewByGameID(id: number): { display_name?: string } | undefined
}

interface LibraryScoreBadgeProps {
  appId: number
}

export const LibraryScoreBadge = ({ appId }: LibraryScoreBadgeProps) => {
  const { settings } = useSettings()
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ensureTileBadgeStyle()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const title = isVisible
    ? appStore?.GetAppOverviewByGameID?.(appId)?.display_name
    : undefined

  const { data } = useMetacriticScore(settings.showLibraryBadges && isVisible ? title : null)

  if (!settings.showLibraryBadges) {
    return <div ref={ref} data-criticdeck-tile />
  }

  const tone = toneForScore(data?.score)

  return (
    <div ref={ref} data-criticdeck-tile style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {data?.score != null && (
        <div className="criticdeck-tile-badge" data-tone={tone}>
          {data.score}
        </div>
      )}
    </div>
  )
}
