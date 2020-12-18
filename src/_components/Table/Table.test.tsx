import React, { RefObject } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect'
import Table, { TableProps } from './Table'
import { mockData, mockSchema } from './testUtils/mocks'
import { TestSchema } from './testUtils/types'
import { useScrollToEffect } from './hooks/useScrollToEffect'

const consistentProps: TableProps<TestSchema> = {
  progress: 0,
  schema: mockSchema,
  rows: mockData,
  paginationOptions: {
    initialResultsPerPage: 5,
    initialPage: 0,
  },
  filterOptions: {
    dispatchFilterAction: jest.fn(),
    filterState: {
      state: {
        all: true,
        values: {
          CO: true,
          CA: true,
        },
      },
    },
  },
}

const renderTable = (
  properties: TableProps<TestSchema> = consistentProps,
  evaluatedProperties?: Partial<TableProps<TestSchema>>,
): RenderResult => {
  // Overwrite consistent props with evaluated ones, if specified in tests
  const props = { ...properties, ...evaluatedProperties }
  return render(<Table<TestSchema> {...props} />)
}

describe('<Table />', () => {
  it('scrolls to the top of the results when specified dependencies change', () => {
    const ref: any = {
      current: {
        scrollTo: jest.fn(),
      },
    }
    const deps = ['dep1', 'dep2']
    renderHook(() => useScrollToEffect(ref, deps))
    expect(ref.current.scrollTo).toHaveBeenCalledTimes(1)
  })

  it('renders the table headers according to the provided schema', () => {
    const { getByTestId, queryByText } = renderTable()

    const headings = getByTestId(
      'table_headings',
    ) as HTMLTableSectionElement

    headings.querySelectorAll('th').forEach((node, index) => {
      expect(node.innerHTML).toMatch(
        new RegExp(mockSchema[index].heading, 'i'),
      )
    })
  })
})
