import React from 'react'
import {
  Position,
  EmptyStateText,
  EmptyStateIcon,
  Row,
} from './styled'

const EmptyState = () => {
  return (
    <Position data-testid="empty_state">
      <Row>
        <EmptyStateIcon />
        <EmptyStateText>
          No results matched your search and filter parameters.
          Please adjust your search parameters and try again.
        </EmptyStateText>
      </Row>
    </Position>
  )
}

export default EmptyState
