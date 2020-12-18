import styled from 'styled-components'

export const Position = styled.div`
  position: absolute;
  top: 119px; /* height of the sticky header */
  width: 100%;
`

interface ProgressProps {
  progress: number
}

export const ProgressBar = styled.div<ProgressProps>`
  width: ${p => p.progress}%;
  height: 3px;
  background-color: #229bf2;
  transition: width 0.2s ease, opacity 0.2s ease;
  opacity: ${p => (p.progress === 100 ? 0 : 1)};
`
