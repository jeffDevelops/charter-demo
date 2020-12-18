import styled, { css } from 'styled-components'

export const Container = styled.main`
  min-height: 100vh;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
`

export const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
  width: 100%;
  height: 45px;
`

export const P = styled.p`
  font-size: 14px;
  letter-spacing: 0.75px;
  color: #637081;
  width: auto;
`

export const ClearButton = styled.button`
  height: auto;
  padding: 0;
  margin-left: 16px;
  color: #229bf2;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;

  &:hover {
    text-decoration: underline;
  }
`
