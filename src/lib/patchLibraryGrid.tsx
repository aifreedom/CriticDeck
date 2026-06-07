import {
  afterPatch,
  findInReactTree
} from '@decky/ui'
import { routerHook } from '@decky/api'
import React from 'react'

import { LibraryScoreBadge } from '../components/LibraryScoreBadge'

// Recursively walks the React element tree and injects a LibraryScoreBadge
// into any node that looks like a game tile (has props.overview.appid or props.appid).
const patchTree = (node: any): void => {
  if (!node || typeof node !== 'object') return

  // overview.appid is a string per SteamClient types
  const rawAppid: string | undefined =
    node?.props?.overview?.appid ?? node?.props?.appid

  if (rawAppid != null) {
    const appId = typeof rawAppid === 'number' ? rawAppid : parseInt(String(rawAppid), 10)
    if (!isNaN(appId) && Array.isArray(node?.props?.children)) {
      const alreadyInjected = node.props.children.some(
        (c: any) => c?.props?.['data-criticdeck-tile'] !== undefined
      )
      if (!alreadyInjected) {
        node.props.children.push(
          <LibraryScoreBadge key={`criticdeck-tile-${appId}`} appId={appId} />
        )
      }
      // Don't recurse deeper into this tile
      return
    }
  }

  const children = node?.props?.children
  if (Array.isArray(children)) {
    for (const child of children) {
      patchTree(child)
    }
  } else if (children && typeof children === 'object') {
    patchTree(children)
  }
}

const applyRoutePatch = (route: string) => {
  return routerHook.addPatch(route, (tree: any) => {
    const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc)
    if (!routeProps) return tree

    afterPatch(routeProps, 'renderFunc', (_args: any[], ret: any) => {
      patchTree(ret)
      return ret
    })

    return tree
  })
}

export function patchLibraryGrid() {
  const libraryPatch = applyRoutePatch('/library')
  const collectionPatch = applyRoutePatch('/library/collection/:collectionid')
  return { libraryPatch, collectionPatch }
}
