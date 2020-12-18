import React from 'react'
import { Position, ProgressBar } from './styled'

interface Props {
  progress: number // integer percent value
}

const EmptyState = ({ progress }: Props) => {
  return (
    <Position>
      <ProgressBar progress={progress} />
    </Position>
  )
}

export default EmptyState
