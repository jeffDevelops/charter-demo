import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
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
    const { getByTestId } = renderTable()

    const headings = getByTestId(
      'table_headings',
    ) as HTMLTableSectionElement

    headings.querySelectorAll('th').forEach((node, index) => {
      expect(node.innerHTML).toMatch(
        new RegExp(mockSchema[index].heading, 'i'),
      )
    })
  })

  it('renders an empty state if no data is present to match the filters', () => {
    const { getByText, getByTestId } = renderTable(
      consistentProps,
      {
        rows: [],
        progress: 100,
      },
    )

    expect(
      getByText(
        /No results matched your search and filter parameters. Please adjust your search parameters and try again./i,
      ),
    ).toBeInTheDocument()

    expect(getByTestId('empty_state')).toBeInTheDocument()
  })

  it('renders the table data according to provided data', () => {
    const { getByTestId } = renderTable()

    const body = getByTestId('table_body')

    body.querySelectorAll('tr').forEach((tr, trIndex) => {
      tr.querySelectorAll('td').forEach((td, tdIndex) => {
        // Differentiate between columns that are raw values, vs tags (which are tested in TableTags)
        if (mockSchema[tdIndex].cellDisplayOption === 'RAW') {
          expect(td.innerHTML).toMatch(
            new RegExp(
              mockData[trIndex][
                mockSchema[tdIndex].field
              ] as string,
              'i',
            ),
          )
        }
      })
    })
  })
})
