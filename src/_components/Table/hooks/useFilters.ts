import { useReducer, Reducer } from 'react'
import {
  FilterActions,
  ColumnFilterState,
  Filter,
  Values,
  FilterState,
} from '../Table.d'

const filterReducer: Reducer<FilterState, FilterActions> = (
  prevState: FilterState,
  action: FilterActions,
): FilterState => {
  // Utility for updating all values' keys
  const updateSelectedValueForAll = (
    column: ColumnFilterState,
    newValue: boolean,
  ) =>
    Object.keys(prevState[action.columnName].values).reduce(
      (values: Values, key) => {
        values[key] = newValue
        return values
      },
      {},
    )

  switch (action.type) {
    case 'DESELECT_ALL':
      return {
        ...prevState,
        [action.columnName]: {
          all: true,
          values: updateSelectedValueForAll(
            prevState[action.columnName],
            false,
          ),
        },
      }
    case 'SELECT_ALL':
      return {
        ...prevState,
        [action.columnName]: {
          all: true,
          values: updateSelectedValueForAll(
            prevState[action.columnName],
            true,
          ),
        },
      }
    case 'SET_COLUMN_FILTER':
      return {
        ...prevState,
        [action.columnName]: {
          // If only one value was set previously, it means all filters are being removed; display all results
          all:
            action.value === false &&
            Object.values(
              prevState[action.columnName].values,
            ).filter(val => !!val).length === 1
              ? true
              : false,
          values: (() => {
            let otherValues = {
              ...prevState[action.columnName].values,
            }
            // If "all" was set previously, comb through all keys and set them to false
            if (prevState[action.columnName].all) {
              otherValues = {
                ...Object.keys(
                  prevState[action.columnName].values,
                ).reduce((values: Values, key) => {
                  values[key] = false
                  return values
                }, {}),
              }
            }
            return {
              ...otherValues,
              [action.filterName]: action.value,
            }
          })(),
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
   * { ...[columns]: {
   *    all: boolean,
   *    ...[values[i]]: isEngaged
   * }
   * instead of an array of filterParams, to prevent a nested comparison loop.
   * Set them to false initially
   * */
  const initialState: FilterState = fieldsWithFilteringCapability.reduce(
    (state: FilterState, filter: Filter) => {
      state[filter.name] = {
        all: true,
        values: filter.columns,
      }
      return state
    },
    {},
  )

  const [filterState, dispatchFilterAction] = useReducer(
    filterReducer,
    initialState,
  )

  return {
    filterState,
    dispatchFilterAction,
  }
}
