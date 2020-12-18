import styled from 'styled-components'
import { SearchOff } from '@styled-icons/material/SearchOff'

export const Position = styled.div`
  position: absolute;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
`

export const Row = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  width: 100%;
`

export const EmptyStateText = styled.p`
  letter-spacing: 0.75px;
  color: #a3b0c1;
  max-width: 475px;
  line-height: 24px;
  margin: 0;
`

export const EmptyStateIcon = styled(SearchOff)`
  width: 64px;
  height: 48px;
  fill: #a3b0c1;
  margin-right: 16px;
  margin-left: 48px;
`
