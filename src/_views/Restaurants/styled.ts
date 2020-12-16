import styled from 'styled-components'

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

export const Input = styled.input`
  height: 36px;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  outline: none;
  box-shadow: 0 3px 7px #dce3fd;

  &::placeholder {
    color: #b3c0e1;
  }
`
