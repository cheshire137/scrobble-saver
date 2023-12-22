import styled from 'styled-components'
import { ActionList, Box } from '@primer/react'

export const TrackContainerBox = styled(Box).attrs({
  as: 'li',
})`
  height: 61px;
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  margin-bottom: ${props => props.theme.space[3]};
  padding-bottom: ${props => props.theme.space[3]};
`

export const TrackContainerActionListItem = styled(ActionList.Item)`
  height: 61px;
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  margin-bottom: ${props => props.theme.space[3]};
  padding-bottom: ${props => props.theme.space[3]};
`
