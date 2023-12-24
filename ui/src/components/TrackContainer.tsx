import styled from 'styled-components'
import { ActionList, Box } from '@primer/react'

const height = '73px'

export const TrackContainerBox = styled(Box).attrs({
  as: 'li',
})`
  display: flex;
  align-items: center;
  height: ${height};
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[2]};
  :not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border.default};
  }
`

export const TrackContainerActionListItem = styled(ActionList.Item)`
  display: flex;
  align-items: center;
  height: ${height};
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[2]};
  border-radius: 0;
  :not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border.default};
  }
`
