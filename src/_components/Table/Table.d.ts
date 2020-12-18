import { ReactText } from 'react'
import { CSSProperties } from 'styled-components'

interface PaginationOptions {
  /** Allow user to specify which results page they'd like to see initially (i.e., with URL query params) */
  initialPage: number
  /** Allow user to specify how many results are displayed on the page */
  initialResultsPerPage: number
}

interface ColumnData<T extends {}> {
  /** User-friendly column heading  */
  heading: string
  /** How the Table component derives the value for a cell from each object */
  field: keyof T
  /** Columns must be identifiable for React reconciliation via a key */
  key: string
}

/** Display raw value vs. custom component */
type ColumnCellDisplay<T extends {}> =
  | {
      /** Whether to use a raw string or number value (this union discrimination)
       * or a custom component (the other union discrimintation) */
      cellDisplayOption: 'RAW'
      /** How to format the raw data - if undefined, display the value directly */
      formatter?(row: T): ReactText
    }
  | {
      /** Whether to use a raw string or number value (previous union discrimination)
       * or render a custom component (this union discrimintation) -- in which case
       * formatting is relegated to the rendered component */
      cellDisplayOption(row: T): JSX.Element
    }

interface ColumnHeaderDisplay {
  /** Whether to display filter controls; not displayed if undefined */
  filterable?: boolean
}

type CellStyles = { cellStyles: CSSProperties }

type Column<T extends {}> = ColumnData<T> &
  ColumnCellDisplay<T> &
  ColumnHeaderDisplay &
  CellStyles

type Row<T extends {}> = T & {
  /** Columns must be identifiable for React reconciliation via a key */
  id: string
}

export type FilterActions =
  | {
      type: 'DESELECT_ALL'
      columnName: string
    }
  | {
      type: 'SELECT_ALL'
      columnName: string
    }
  | {
      type: 'SET_COLUMN_FILTER'
      columnName: string
      filterName: string
      value: boolean
    }

export interface Values {
  [key: string]: boolean
}

export interface ColumnFilterState {
  all: boolean
  values: Values
}

export type FilterState = {
  [columnName: string]: ColumnFilterState
}

export interface Filter {
  name: string // where name is the key in a row
  columns: Values
}
