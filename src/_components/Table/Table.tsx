import React, { useEffect, useMemo, useRef } from 'react'
import { PaginationOptions, Column, Row } from './Table.d'
import {
  Card,
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

interface TableProps<T extends {}> {
  paginationOptions: PaginationOptions
  schema: Column<T>[]
  rows: Row<T>[]
}

const Table = <T extends {}>({
  schema,
  rows,
  paginationOptions,
}: TableProps<Row<T>>) => {
  const {
    resultsStartIndex,
    resultsEndIndex,
    resultsCount,
    resultsPerPage,
    dispatchPageAction,
  } = usePagination(paginationOptions, rows)

  const tableRef = useRef<HTMLTableElement>(null)

  const page = useMemo(() => {
    return rows.slice(resultsStartIndex + 1, resultsEndIndex + 1)
  }, [resultsStartIndex, resultsEndIndex, rows])

  useEffect(() => {
    if (tableRef.current)
      tableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
  }, [page])

  return (
    <Card ref={tableRef}>
      <StyledTable>
        <THead>
          <TR>
            {schema.map(({ key, heading }) => (
              <TH key={key}>{heading}</TH>
            ))}
          </TR>
          <TR>
            {schema.map(({ key, heading }) => (
              <ColumnControls key={key}>
                {heading}
              </ColumnControls>
            ))}
          </TR>
        </THead>
        <tbody>
          {page.map(row => (
            <TR key={row.id}>
              {schema.map(({ field, cellDisplayOption }) => (
                <TD key={field.toString()}>
                  {cellDisplayOption === 'RAW'
                    ? row[field]
                    : cellDisplayOption(row)}
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </StyledTable>
      <Pagination>
        <PaginationButton
          disabled={resultsStartIndex === 0}
          onClick={() =>
            dispatchPageAction({
              type: 'UPDATE_PAGE',
              value: resultsStartIndex / resultsPerPage - 1,
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
              type: 'UPDATE_PAGE',
              value: resultsStartIndex / resultsPerPage + 1,
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
