import styled, { css } from 'styled-components'
import { Search } from '@styled-icons/material/Search'
import { Close } from '@styled-icons/material/Close'

export const borderAnimationStyles = () => css`
  &:after {
    content: ' ';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    background-color: #229bf2;
    height: 10px;
    z-index: 0;
    border-radius: 0 0 8px 8px;
    transition: width ease-in 0.2s;
  }
`

export const Form = styled.form`
  position: relative;
  width: 100%;

  ${borderAnimationStyles()}

  &:focus-within {
    &:after {
      width: 100%;
      transition: width ease-out 0.3s;
    }
  }
`

export const Input = styled.input`
  ${borderAnimationStyles()}

  height: 48px;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  outline: none;
  box-shadow: 0 3px 7px #dce3fd;
  background-color: #fffffa;
  position: relative;
  z-index: 1;
  border: 1px solid #ecf3fd;

  &::placeholder {
    color: #b3c0e1;
    letter-spacing: 0.5px;
  }

  &:focus {
    box-shadow: inset 0 3px 7px #dce3fd;
  }
`

export const SearchInputControls = styled.div`
  position: absolute;
  z-index: 2;
  top: 7px;
  right: 16px;
`

const buttonStyles = css`
  cursor: pointer;
  fill: #b3c0e1;
  height: 18px;
  margin-top: -2px;
`

export const SearchButton = styled(Search).attrs({
  role: 'button',
})`
  ${buttonStyles}
`

export const ClearButton = styled(Close).attrs({
  role: 'button',
})`
  ${buttonStyles}
`

export const Pipe = styled.div`
  display: inline-block;
  margin: 0 16px 0 18px;
  color: #b3c0e1;
  font-size: 24px;
  user-select: none;
  font-weight: 100;
`
