import { ReactText } from 'react'

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
type ColumnDisplay<T extends {}> =
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

type Column<T extends {}> = ColumnData<T> & ColumnDisplay<T>

type Row<T extends {}> = T & {
  /** Columns must be identifiable for React reconciliation via a key */
  id: string
}
