import styled from 'styled-components'
import { KeyboardArrowRight } from '@styled-icons/material/KeyboardArrowRight'

export const Card = styled.section`
  width: 100%;
  max-height: 700px;
  max-width: 1000px;
  box-shadow: 0 3px 7px #dce3fd;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid #ecf3fd;
`

export const Scrollable = styled.div`
  overflow: overlay;
  height: 700px;
  padding-bottom: 80px;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  ::-webkit-scrollbar-track:horizontal {
    background: #fffffa;
  }
  ::-webkit-scrollbar:horizontal {
    height: 8px;
  }
  ::-webkit-scrollbar:vertical {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    border: 2px solid white;
    border-radius: 4px;
    background-color: #dce3fd;
  }
`

export const THead = styled.thead`
  border-bottom: 2px solid #ecf3fd;
`
export const TH = styled.th`
  border-style: none;
  position: sticky;
  top: 0;
  padding: 16px;
  letter-spacing: 0.75px;
  font-weight: 500;
  font-size: 14px;
  background-color: #fffffa;
  box-shadow: 0 1px 0px #ecf3fd; /* border is collapsed from overall border-collapse, so simulate one with a box-shadow */
`

export const ColumnControls = styled.th`
  border-style: none;
  position: sticky;
  top: 49px;
  padding: 16px;
  letter-spacing: 0.75px;
  font-weight: 500;
  font-size: 14px;
  background-color: #fffffa;
  box-shadow: 0 1px 0px #ecf3fd; /* border is collapsed from overall border-collapse, so simulate one with a box-shadow */
  z-index: 1;
`

export const TD = styled.td`
  border: 2px solid #ecf3fd;
  padding: 16px;

  /* Remove borders from sides, so that they're flush with card */
  &:first-of-type,
  &:last-of-type {
    border-left: 0px solid;
    border-right: 0px solid;
  }
`

export const TR = styled.tr<{ incompletePage?: boolean }>`
  background-color: #fffffa;

  &:nth-child(odd) {
    background-color: #fcfcfc;
  }
  /* If not an incomplete page, remove borders from bottom row, so that they're flush with card */
  &:last-of-type ${TD} {
    ${p => !p.incompletePage && `border-bottom: 0px;`}
  }
`

export const Pagination = styled.div`
  height: 80px;
  background-color: #fffffa;
  position: sticky;
  bottom: 6px;
  width: 100%;
  border-top: 2px solid #ecf3fd;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
`

export const Table = styled.table`
  display: table;
  border-collapse: collapse;
  margin: 0 auto;
  color: #637081;
  max-width: 100%;
  min-width: 100%;
  overflow: auto;
`

export const PaginationButton = styled.button<{
  disabled: boolean
}>`
  outline: none;
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  padding: 4px 8px 5px;
  background-color: ${p => (p.disabled ? '#fcffff' : '#fffffa')};
  border: 2px solid #ecf3fd;

  &:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-of-type {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

export const PaginationInfo = styled.div`
  display: inline-block;
  border-top: 2px solid #ecf3fd;
  border-bottom: 2px solid #ecf3fd;
  width: auto;
  padding: 0 16px;
  color: #637081;
  font-size: 14px;
  letter-spacing: 0.5px;
  padding: 4px 16px;
  min-height: 29.05px;
  height: 29.05px;
`

export const LeftChevron = styled(KeyboardArrowRight)<{
  disabled: boolean
}>`
  fill: ${p => (p.disabled ? '#b3c0e1' : '#637081')};
  width: 15px;
  transform: rotateZ(180deg);
`

export const RightChevron = styled(KeyboardArrowRight)<{
  disabled: boolean
}>`
  fill: ${p => (p.disabled ? '#b3c0e1' : '#637081')};
  width: 15px;
`
