import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
import Table from '../../_components/Table/Table'
import { Restaurant } from '../../_types/entities/Restaurant'
import { restaurantSchema } from './restaurantSchema'
import { Container, P } from './styled'
import Input from '../../_components/Input/Input'
import { useFilters } from '../../_components/Table/hooks/useFilters'
import { GENRES } from './config/FilterableGenres'
import { STATES } from './config/FilterableStates'

const Restaurants = () => {
  const [loading, setLoading] = useState(false)
  const [restaurants, setRestaurants] = useState<
    Restaurant[] | null
  >(null)

  // Search input value; could be different than...
  const [search, setSearch] = useState('')
  // ...the current search, until the user clicks the search button / hits Enter key again
  const [currentSearch, setCurrentSearch] = useState('')
  // The fully processed results
  const [results, setResults] = useState<Restaurant[] | null>(
    null,
  )

  const fetchRestaurants = useCallback(async () => {
    setLoading(true)
    return fetch(
      'https://code-challenge.spectrumtoolbox.com/api/restaurants',
      {
        headers: {
          Authorization: 'Api-Key q3MNxtfep8Gt',
        },
      },
    )
  }, [])

  /** NOTE:
   *  There was not documentation on how to use the API, and so I was not able
   *  to sort/filter according to best practices at the ORM / database layer. Normally,
   *  I'd delegate sort order / filter to the database query, and the responsibility of the
   *  client-side would be to merely specify the sort-order the user wants
   *  Therefore, I'm not spending time on optimizing the sort algorithm beyond
   *  the browser's implementation.
   */
  const sorted = useMemo(() => {
    if (!restaurants) return null
    return restaurants.sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [restaurants])

  // On mount, fetch the restaurants for the first time
  useEffect(() => {
    // Used to prevent SetStateActions if component unmounted
    let mounted = true

    if (mounted) {
      fetchRestaurants()
        .then(async response => {
          const data = await response.json()

          if (mounted && data) {
            setRestaurants(data)
          }
        })
        .catch(error => console.error(error))
        .finally(() => mounted && setLoading(false))
    }

    // Toggle mounted in cleanup function
    return () => {
      mounted = false
    }
  }, [fetchRestaurants])

  /** Manage filter state */
  const { filterState, dispatchFilterAction } = useFilters([
    {
      name: 'genre',
      columns: GENRES,
    },
    {
      name: 'state',
      columns: STATES,
    },
  ])

  /** Processing logic for filtering / searching belongs on the server, but
   * for this exercise, it's abstracted away from the actual table component
   * so that it can be used for different resources
   */
  const processResults = useCallback(() => {
    if (!sorted) return []

    // Create a case-insensitive search pattern, allowing for partial-word matches
    const searchPattern =
      currentSearch.trim() === ''
        ? null
        : new RegExp(currentSearch.trim(), 'gi')

    const filtered = sorted.filter(row => {
      let satisfiesSearch = true
      let satisfiesFilters = true

      // Search
      if (!!searchPattern) {
        satisfiesSearch =
          !!row.name.toLowerCase().match(searchPattern) ||
          !!row.city.toLowerCase().match(searchPattern) ||
          !!row.genre.toLowerCase().match(searchPattern)
      }

      // Filter
      // State: per row, use the filter map to check whether that row's state's filter has been "engaged"
      const satisfiesStateFilter =
        filterState.state.values[row.state]

      // Genre: because of the string structure of this data, we can search each row's string for all of the "engaged" filters in the filterState
      const engagedGenres = Object.keys(
        filterState.genre.values,
      ).filter(key => filterState.genre.values[key])

      const allEngagedGenresIncluded = engagedGenres.every(
        filter => {
          const pattern = new RegExp(filter, 'gi')
          return !!row.genre.match(pattern)
        },
      )

      const satisfiesGenreFilter =
        filterState.genre.all || allEngagedGenresIncluded

      satisfiesFilters =
        satisfiesStateFilter && satisfiesGenreFilter

      return satisfiesSearch && satisfiesFilters
    })

    return filtered
  }, [currentSearch, sorted, filterState])

  useEffect(() => {
    setResults(processResults())
  }, [filterState, currentSearch, sorted, processResults])

  if (loading) return <>Loading...</>
  if (!results) return null

  return (
    <Container>
      <Input
        clearInput={() => {
          setSearch('')
          setCurrentSearch('')
        }}
        triggerSearch={() => {
          setCurrentSearch(search)
        }}
        placeholder="Search by name, city, or genre"
        id="search_input"
        name="search"
        value={search}
        autoComplete="off"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />
      <P>
        {currentSearch && `Current search: "${currentSearch}"`}
      </P>
      <Table<Restaurant>
        filterOptions={{
          filterState,
          dispatchFilterAction,
        }}
        schema={restaurantSchema}
        paginationOptions={{
          initialPage: 0,
          initialResultsPerPage: 10,
        }}
        rows={results}
      />
    </Container>
  )
}

export default Restaurants
