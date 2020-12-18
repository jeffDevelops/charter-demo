import React, { FC, Dispatch } from 'react'
import ReactSelect, { ValueType, Theme } from 'react-select'
import { FilterActions, FilterState } from '../Table.d'

interface Props<T extends {}> {
  dispatchFilterAction: Dispatch<FilterActions>
  filterState: FilterState
  value: ValueType<
    {
      label: string
      value: string
    },
    true
  >
  field: 'id' | keyof T // Which column this instance of Select is displaying for
}

const Select = <T extends {}>({
  dispatchFilterAction,
  filterState,
  value,
  field,
}: Props<T>) => {
  const theme = (theme: Theme) => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary25: '#ecf3fd',
      primary: '#229bf2',
      neutral5: '#ecf3fd',
      neutral10: '#ecf3fd',
      neutral20: '#b3c0e1',
    },
  })

  return (
    <ReactSelect
      isMulti
      theme={theme}
      placeholder="All"
      defaultValue={[]}
      value={value}
      onChange={(state, action) => {
        switch (action.action) {
          case 'select-option': {
            const filterName = (action.option as {
              label: string
              value: string
            }).value

            if (filterName === 'ALL') {
              return dispatchFilterAction({
                type: 'SELECT_ALL',
                columnName: field as string,
              })
            } else {
              return dispatchFilterAction({
                type: 'SET_COLUMN_FILTER',
                columnName: field as string,
                filterName,
                value: true,
              })
            }
          }
          case 'remove-value': {
            if (state === null) {
              return dispatchFilterAction({
                type: 'SELECT_ALL',
                columnName: field as string,
              })
            } else {
              const filterName = (action.removedValue as {
                label: string
                value: string
              }).value
              return dispatchFilterAction({
                type: 'SET_COLUMN_FILTER',
                columnName: field as string,
                filterName,
                value: false,
              })
            }
          }
          case 'pop-value':
          case 'deselect-option': {
            if (state === null) {
              return dispatchFilterAction({
                type: 'SELECT_ALL',
                columnName: field as string,
              })
            } else {
              const filterName = (action.option as {
                label: string
                value: string
              }).value
              return dispatchFilterAction({
                type: 'SET_COLUMN_FILTER',
                columnName: field as string,
                filterName,
                value: false,
              })
            }
          }
          case 'clear':
            return dispatchFilterAction({
              type: 'SELECT_ALL',
              columnName: field as string,
            })
          default:
            throw new Error(
              `Unhandled react-select action type: ${action.action}`,
            )
        }
      }}
      options={[
        ...Object.keys(filterState[field as string].values).map(
          option => ({
            label: option,
            value: option,
          }),
        ),
      ]}
    />
  )
}

export default Select
