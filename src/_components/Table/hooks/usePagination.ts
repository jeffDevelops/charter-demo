import { useReducer, Reducer, useEffect, useMemo } from 'react'
import { Row, PaginationOptions } from '../Table.d'

interface PageState {
  resultsPerPage: number
  resultsStartIndex: number
  resultsEndIndex: number
  resultsCount: number
}

type PageAction<T extends {}> =
  | {
      type: 'INCREMENT'
    }
  | {
      type: 'DECREMENT'
    }
  | {
      /* Expose an action to reset the pagination upon changes to searches / filters */
      type: 'RESET_PAGE'
      rows: Row<T>[]
    }
  | {
      /* TODO: (Stretch goal) Allow the user to change the page size */
      type: 'UPDATE_PAGE_SIZE'
      value: number
    }

/**
 *  Resiliently compute the initial state based on
 *  potentially unreliable parameters, such as
 *  from the URL, which could be malformed or shared
 *  after data has been added/removed.
 */
const initialState = <T extends {}>(
  options: PaginationOptions,
  rows: Row<T>[],
): PageState => ({
  resultsStartIndex: (() => {
    const firstIndex =
      options.initialPage * options.initialResultsPerPage
    if (rows.length < firstIndex) {
      const possiblePages =
        rows.length / options.initialResultsPerPage
      /**
       * If the possible pages is an integer with no remainder,
       * one page must be subtracted to the last page--otherwise
       * it's a partial last page
       */
      return possiblePages / Math.floor(possiblePages) === 1
        ? possiblePages - 1
        : Math.floor(possiblePages)
    }
    return (
      options.initialPage * options.initialResultsPerPage || 0
    )
  })(),
  resultsEndIndex: (() => {
    const lastIndex =
      options.initialPage * options.initialResultsPerPage +
      options.initialResultsPerPage
    if (rows.length < lastIndex) return rows.length
    return lastIndex
  })(),
  resultsPerPage: options.initialResultsPerPage,
  resultsCount: rows.length,
})

export const usePagination = <T extends {}>(
  options: PaginationOptions,
  rows: Row<T>[],
) => {
  const paginationReducer: Reducer<PageState, PageAction<T>> = <
    T extends {}
  >(
    prevState: PageState,
    action: PageAction<T>,
  ) => {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...prevState,
          resultsStartIndex:
            prevState.resultsStartIndex +
            prevState.resultsPerPage,
          resultsEndIndex: Math.min(
            prevState.resultsEndIndex + prevState.resultsPerPage,
            prevState.resultsCount,
          ),
        }
      case 'DECREMENT':
        const resultsStartIndex =
          prevState.resultsStartIndex - prevState.resultsPerPage
        return {
          ...prevState,
          resultsStartIndex,
          resultsEndIndex:
            resultsStartIndex + prevState.resultsPerPage,
        }
      case 'RESET_PAGE':
        return {
          ...prevState,
          resultsStartIndex: 0,
          resultsEndIndex: Math.min(
            prevState.resultsPerPage,
            action.rows.length,
          ),
          resultsCount: action.rows.length,
        }
      default:
        return prevState
    }
  }
  const [pageState, dispatchPageAction] = useReducer(
    paginationReducer,
    initialState(options, rows),
  )

  useEffect(() => {
    dispatchPageAction({
      type: 'RESET_PAGE',
      rows,
    })
  }, [rows])

  return {
    ...pageState,
    dispatchPageAction,
  }
}
