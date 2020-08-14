import React from 'react'

import { pascalize } from 'sm-commons/utils/str'

const Empty = () => <p>Your SliceZone is empty!</p>
export default ({ registry = {}, slices, resolver = () => null }) => {
  if (!slices || !slices.length) {
    return process.env.NODE_ENV !== 'production' ? <Empty /> : null
  }

  return slices.map((slice, i) => {
    const slice_type = slice.slice_type
    const sliceName = pascalize(slice_type)
    const maybeRegister = registry[sliceName]

    if (!maybeRegister) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`No component was registered for slice of type "${slice.slice_type}"`)
      }
      return null
    }

    const Component = typeof maybeRegister === 'object' ? resolver({ ...maybeRegister, slice, i }) : maybeRegister
    if (Component) {
      return <Component key={`slice-${i + 1}`} slice={slice}  i={i} />
    }
    return null
  })

}
