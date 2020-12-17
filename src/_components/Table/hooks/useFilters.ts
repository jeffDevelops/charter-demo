import React, { useMemo, useReducer, Reducer } from 'react'

type FilterActions =
  | {
      type: 'TOGGLE_FILTER_ENGAGED'
      filter: string // Which column is being filtered?
      filterValue: string // What value is the user filtering on?
    }
  | {
      type: 'TOGGLE_ENGAGE_ALL'
      filter: string // Which column is being set to "All"?
    }

interface ValueEngaged {
  [key: string]: boolean
}

type FilterState = {
  all: boolean
  values: {
    [key: string]: ValueEngaged
  }
}

interface Filter {
  name: string // where name is the key in a row
  values: string[]
}

const filterReducer: Reducer<FilterState, FilterActions> = (
  prevState: FilterState,
  action: FilterActions,
): FilterState => {
  switch (action.type) {
    case 'TOGGLE_FILTER_ENGAGED':
      return {
        ...prevState,
        values: {
          [action.filter]: {
            ...prevState.values[action.filter],
            [action.filterValue]: !prevState.values[
              action.filter
            ][action.filterValue],
          },
        },
      }
    case 'TOGGLE_ENGAGE_ALL':
      /** Toggle the all value, which is what filtering logic should use to ignore
       *  whole filters, if 'All' selected. Maintain parity with the remainder of
       *  the state, so that toggles are all-or-nothing.
       */
      return {
        all: !prevState.all,
        values: {
          ...Object.keys(prevState.values).reduce(
            (
              newState: { [key: string]: ValueEngaged },
              columnKey,
            ) => {
              newState[columnKey] = Object.keys(
                prevState.values[columnKey],
              ).reduce(
                (newValueState: ValueEngaged, valueKey) => {
                  newValueState[valueKey] = !prevState.all
                  return newValueState
                },
                {},
              )
              return newState
            },
            {},
          ),
        },
      }
    default:
      return prevState
  }
}

/**
 * NOTE: Normally, I'd implement filtering on the back-end where it's best handled
 * at the database query level, but as there's only one endpoint, this hook
 * constructs a map of the "engaged" filters that is compared against the API
 * results. That way, filtering costs O(n) in time complexity as opposed to O(n^2)
 * when it comes time to actually "engage" the filters and filter the results--at
 * the cost of constructing the map from the options on page load.
 */
export const useFilters = (
  fieldsWithFilteringCapability: Filter[],
) => {
  /** Construct a map of:
   * { [name]: {
   *    ...[values[i]]: isEngaged
   * }
   * instead of an array of filterParams, to prevent a nested comparison loop.
   * Set them to false initially
   * */
  const initialState = {
    all: true,
    values: {
      ...fieldsWithFilteringCapability.reduce(
        (
          map: { [key: string]: ValueEngaged },
          filter: Filter,
        ) => {
          map[filter.name] = filter.values.reduce(
            (valueMap: { [key: string]: boolean }, value) => {
              valueMap[value] = true
              return valueMap
            },
            {},
          )
          return map
        },
        {},
      ),
    },
  }

  /** Even though it's a reducer with just one action, it's a better API for
   * managing changes to the filter state than having to remember to keep the
   * rest of the state intact.
   */
  const [filterState, dispatchFilterAction] = useReducer(
    filterReducer,
    initialState,
  )

  return {
    filterState,
    dispatchFilterAction,
  }
}
