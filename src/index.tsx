import React from 'react'
import { definePlugin, staticClasses } from '@decky/ui'
import { routerHook } from '@decky/api'
import { FaStar } from 'react-icons/fa'

import SettingsPanel from './components/Settings'
import { patchLibraryApp } from './lib/patchLibraryApp'
import { patchLibraryGrid } from './lib/patchLibraryGrid'

export default definePlugin(() => {
  const libraryPatch = patchLibraryApp()
  const { libraryPatch: gridPatch, collectionPatch } = patchLibraryGrid()

  return {
    title: <div className={staticClasses.Title}>CriticDeck</div>,
    icon: <FaStar />,
    content: <SettingsPanel />,
    onDismount() {
      routerHook.removePatch('/library/app/:appid', libraryPatch)
      routerHook.removePatch('/library', gridPatch)
      routerHook.removePatch('/library/collection/:collectionid', collectionPatch)
    }
  }
})
