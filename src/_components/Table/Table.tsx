import React, {
  useEffect,
  useRef,
  Dispatch,
  useMemo,
} from 'react'
import {
  PaginationOptions,
  Column,
  Row,
  FilterState,
  FilterActions,
} from './Table.d'
import {
  Card,
  Scrollable,
  Table as StyledTable,
  THead,
  TH,
  ColumnControls,
  TR,
  TD,
  Pagination,
  PaginationButton,
  PaginationInfo,
  LeftChevron,
  RightChevron,
} from './styled'
import { usePagination } from './hooks/usePagination'
import Select from 'react-select'

interface TableProps<T extends {}> {
  paginationOptions: PaginationOptions
  filterOptions: {
    filterState: FilterState
    dispatchFilterAction: Dispatch<FilterActions>
  }
  schema: Column<T>[]
  rows: Row<T>[]
}

const Table = <T extends {}>({
  schema,
  rows,
  paginationOptions,
  filterOptions,
}: TableProps<Row<T>>) => {
  const {
    resultsStartIndex,
    resultsEndIndex,
    resultsCount,
    dispatchPageAction,
  } = usePagination(paginationOptions, rows)

  const tableRef = useRef<HTMLTableElement>(null)

  // If the pagination page changes, scroll to the top of the page
  useEffect(() => {
    if (tableRef.current)
      tableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
  }, [resultsStartIndex, resultsEndIndex])

  const page = useMemo(() => {
    return rows.slice(resultsStartIndex, resultsEndIndex) // slice end of range is non-inclusive
  }, [resultsStartIndex, resultsEndIndex, rows])

  return (
    <Card ref={tableRef}>
      <Scrollable>
        <StyledTable>
          <THead>
            <TR>
              {schema.map(({ key, heading, cellStyles }) => (
                <TH style={cellStyles} key={key}>
                  {heading}
                </TH>
              ))}
            </TR>
            <TR>
              {schema.map(({ key, field }) => {
                if (!filterOptions.filterState[field as string])
                  return <ColumnControls key={field as string} />

                const value = filterOptions.filterState[
                  field as string
                ].all
                  ? []
                  : Object.keys(
                      filterOptions.filterState[field as string]
                        .values,
                    ).reduce(
                      (
                        acc: {
                          label: string
                          value: string
                        }[],
                        key,
                      ) => {
                        if (
                          filterOptions.filterState[
                            field as string
                          ].values[key]
                        ) {
                          acc.push({
                            label: key,
                            value: key,
                          })
                        }
                        return acc
                      },
                      [],
                    )

                return (
                  <ColumnControls key={key}>
                    <Select
                      isMulti
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
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SELECT_ALL',
                                  columnName: field as string,
                                },
                              )
                            } else {
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SET_COLUMN_FILTER',
                                  columnName: field as string,
                                  filterName,
                                  value: true,
                                },
                              )
                            }
                          }
                          case 'remove-value': {
                            if (state === null) {
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SELECT_ALL',
                                  columnName: field as string,
                                },
                              )
                            } else {
                              const filterName = (action.removedValue as {
                                label: string
                                value: string
                              }).value
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SET_COLUMN_FILTER',
                                  columnName: field as string,
                                  filterName,
                                  value: false,
                                },
                              )
                            }
                          }
                          case 'pop-value':
                          case 'deselect-option': {
                            if (state === null) {
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SELECT_ALL',
                                  columnName: field as string,
                                },
                              )
                            } else {
                              const filterName = (action.option as {
                                label: string
                                value: string
                              }).value
                              return filterOptions.dispatchFilterAction(
                                {
                                  type: 'SET_COLUMN_FILTER',
                                  columnName: field as string,
                                  filterName,
                                  value: false,
                                },
                              )
                            }
                          }
                          case 'clear':
                            return filterOptions.dispatchFilterAction(
                              {
                                type: 'SELECT_ALL',
                                columnName: field as string,
                              },
                            )
                          default:
                            throw new Error(
                              `Unhandled react-select action type: ${action.action}`,
                            )
                        }
                      }}
                      options={[
                        ...Object.keys(
                          filterOptions.filterState[
                            field as string
                          ].values,
                        ).map(option => ({
                          label: option,
                          value: option,
                        })),
                      ]}
                    />
                  </ColumnControls>
                )
              })}
            </TR>

            <TR />
          </THead>
          <tbody>
            {page.map(row => {
              return (
                <TR key={row.id}>
                  {schema.map(({ field, cellDisplayOption }) => (
                    <TD key={field.toString()}>
                      {cellDisplayOption === 'RAW'
                        ? row[field]
                        : cellDisplayOption(row)}
                    </TD>
                  ))}
                </TR>
              )
            })}
          </tbody>
        </StyledTable>
      </Scrollable>
      <Pagination>
        <PaginationButton
          disabled={resultsStartIndex === 0}
          onClick={() =>
            dispatchPageAction({
              type: 'DECREMENT',
            })
          }
        >
          <LeftChevron disabled={resultsStartIndex === 0} />
        </PaginationButton>
        <PaginationInfo>
          Results {resultsStartIndex + 1} -{' '}
          {Math.min(resultsEndIndex, resultsCount)} of{' '}
          {resultsCount}
        </PaginationInfo>
        <PaginationButton
          disabled={
            Math.min(resultsEndIndex, rows.length) ===
            rows.length
          }
          onClick={() =>
            dispatchPageAction({
              type: 'INCREMENT',
            })
          }
        >
          <RightChevron
            disabled={
              Math.min(resultsEndIndex, rows.length) ===
              rows.length
            }
          />
        </PaginationButton>
      </Pagination>
    </Card>
  )
}

export default Table
