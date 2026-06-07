import {
  afterPatch,
  createReactTreePatcher,
  findInReactTree
} from '@decky/ui'
import { routerHook } from '@decky/api'
import React, { ReactElement } from 'react'

import { LibraryScoreBadge } from '../components/LibraryScoreBadge'

const makePatchHandler = () =>
  createReactTreePatcher(
    [
      (root: any) =>
        findInReactTree(
          root,
          (node: any) =>
            Array.isArray(node?.props?.children) &&
            node.props.children.some(
              (child: any) =>
                typeof child?.props?.overview?.appid === 'number' ||
                typeof child?.props?.appid === 'number'
            )
        )
    ],
    (_nodes: Array<Record<string, unknown>>, ret?: ReactElement) => {
      if (!ret) return ret

      const processChild = (child: any): any => {
        if (!child || typeof child !== 'object') return child

        const appid: number | undefined =
          child.props?.overview?.appid ?? child.props?.appid

        if (typeof appid !== 'number') return child

        // Avoid duplicate injection
        const alreadyInjected = Array.isArray(child.props?.children)
          ? child.props.children.some(
              (c: any) => c?.props?.['data-criticdeck-tile'] !== undefined
            )
          : false
        if (alreadyInjected) return child

        const badge = <LibraryScoreBadge key={`criticdeck-tile-${appid}`} appId={appid} />

        if (Array.isArray(child.props?.children)) {
          return React.cloneElement(child, {}, ...child.props.children, badge)
        }
        return React.cloneElement(child, {}, child.props?.children, badge)
      }

      // Walk ret to find the game grid container and inject into each tile
      const gridContainer = findInReactTree(
        ret,
        (node: any) =>
          Array.isArray(node?.props?.children) &&
          node.props.children.some(
            (child: any) =>
              typeof child?.props?.overview?.appid === 'number' ||
              typeof child?.props?.appid === 'number'
          )
      )
      if (!gridContainer) return ret

      gridContainer.props.children = gridContainer.props.children.map(processChild)
      return ret
    }
  )

const applyRoutePatch = (route: string) => {
  return routerHook.addPatch(route, (tree: any) => {
    const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc)
    if (!routeProps) return tree
    afterPatch(routeProps, 'renderFunc', makePatchHandler())
    return tree
  })
}

export function patchLibraryGrid() {
  const libraryPatch = applyRoutePatch('/library')
  const collectionPatch = applyRoutePatch('/library/collection/:collectionid')
  return { libraryPatch, collectionPatch }
}
