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
import Select from './Select/Select'
import EmptyState from './EmptyState/EmptyState'
import LoadingState from './LoadingState/LoadingState'
import { useScrollToEffect } from './hooks/useScrollToEffect'

export interface TableProps<T extends {}> {
  paginationOptions: PaginationOptions
  filterOptions: {
    filterState: FilterState
    dispatchFilterAction: Dispatch<FilterActions>
  }
  schema: Column<T>[]
  rows: Row<T>[]
  progress: number // integer percentage value
}

const Table = <T extends {}>({
  schema,
  rows,
  paginationOptions,
  filterOptions,
  progress,
}: TableProps<Row<T>>) => {
  const {
    resultsStartIndex,
    resultsEndIndex,
    resultsCount,
    resultsPerPage,
    dispatchPageAction,
  } = usePagination(paginationOptions, rows)

  const tableRef = useRef<HTMLTableElement>(null)

  // If the pagination page changes, scroll to the top of the page
  useScrollToEffect(tableRef, [
    resultsStartIndex,
    resultsEndIndex,
  ])

  const page = useMemo(() => {
    return rows.slice(resultsStartIndex, resultsEndIndex) // slice end of range is non-inclusive
  }, [resultsStartIndex, resultsEndIndex, rows])

  return (
    <Card ref={tableRef}>
      <Scrollable>
        <StyledTable>
          <THead>
            <TR data-testid="table_headings">
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

                // If "All", no filter values are selected; otherwise derive state from individual values
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
                      dispatchFilterAction={
                        filterOptions.dispatchFilterAction
                      }
                      filterState={filterOptions.filterState}
                      field={field}
                      value={value}
                    />
                  </ColumnControls>
                )
              })}
            </TR>
            <TR />
          </THead>
          <tbody data-testid="table_body">
            {page.map(row => {
              return (
                <TR
                  key={row.id}
                  incompletePage={page.length !== resultsPerPage}
                >
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
        <LoadingState progress={progress} />
        {progress === 100 && resultsCount === 0 && (
          <EmptyState />
        )}
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
          Results{' '}
          {resultsCount === 0 ? 0 : resultsStartIndex + 1} -{' '}
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
