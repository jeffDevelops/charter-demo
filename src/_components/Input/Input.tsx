import React, { FC, InputHTMLAttributes, FormEvent } from 'react'
import {
  Input as StyledInput,
  Form,
  SearchInputControls,
  ClearButton,
  SearchButton,
  Pipe,
} from './styled'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  clearInput(): void
  triggerSearch(): void
}

const Input: FC<InputProps> = ({
  clearInput,
  triggerSearch,
  ...props
}: InputProps) => {
  return (
    <Form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        triggerSearch()
      }}
    >
      <StyledInput {...props} />
      <SearchInputControls>
        <ClearButton onClick={clearInput} />
        <Pipe>|</Pipe>
        <SearchButton onClick={triggerSearch} />
      </SearchInputControls>
    </Form>
  )
}

export default Input
