import { useReducer, Reducer, useEffect } from 'react'
import { Row, PaginationOptions } from '../Table.d'

interface PageState {
  resultsPerPage: number
  resultsStartIndex: number
  resultsEndIndex: number
  resultsCount: number
}

type PageAction =
  | {
      /* Consolidate all of the logic for managing the page in one action */
      type: 'UPDATE_PAGE'
      value: number
    }
  | {
      /* Expose an action to reset the pagination upon changes to searches / filters */
      type: 'RESET_PAGE'
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

const paginationReducer: Reducer<PageState, PageAction> = <
  T extends {}
>(
  prevState: PageState,
  action: PageAction,
) => {
  switch (action.type) {
    case 'UPDATE_PAGE':
      return {
        ...prevState,
        resultsStartIndex:
          prevState.resultsPerPage * action.value,
        resultsEndIndex:
          prevState.resultsPerPage * action.value +
          prevState.resultsPerPage,
        resultsCount: prevState.resultsCount,
      }
    case 'UPDATE_PAGE_SIZE':
      return {
        ...prevState,
        resultsEndIndex: Math.min(
          prevState.resultsStartIndex + action.value,
          prevState.resultsCount,
        ),
      }
    case 'RESET_PAGE':
      return {
        ...prevState,
        resultsStartIndex: 0,
        resultsEndIndex: Math.min(
          0 + prevState.resultsPerPage,
          prevState.resultsCount,
        ),
      }
    default:
      return prevState
  }
}

export const usePagination = <T extends {}>(
  options: PaginationOptions,
  rows: Row<T>[],
) => {
  const [pageState, dispatchPageAction] = useReducer(
    paginationReducer,
    initialState(options, rows),
  )

  // If the resultsCount changes, reset the pagination
  useEffect(() => {
    dispatchPageAction({ type: 'RESET_PAGE' })
  }, [rows.length])

  return {
    ...pageState,
    dispatchPageAction,
  }
}
