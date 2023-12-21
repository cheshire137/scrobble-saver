import styled from 'styled-components'
import { Box } from '@primer/react'

export default styled(Box).attrs({
  as: 'li',
  mb: 3,
  borderBottom: '1px solid',
  borderColor: 'border.default',
  pb: 3,
})`
  height: 61px;
`
