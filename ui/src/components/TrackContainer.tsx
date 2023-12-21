import styled from 'styled-components'
import { ActionList, Box } from '@primer/react'
import deepmerge from 'deepmerge'

const styleAttrs = {
  mb: 3,
  borderBottom: '1px solid',
  borderColor: 'border.default',
  pb: 3,
}

export const TrackContainerBox = styled(Box).attrs(deepmerge(styleAttrs, {
  as: 'li',
}))`
  height: 61px;
`

export const TrackContainerActionListItem = styled(ActionList.Item).attrs({
  sx: styleAttrs,
})`
  height: 61px;
`
