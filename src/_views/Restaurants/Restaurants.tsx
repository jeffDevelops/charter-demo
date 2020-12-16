import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
import Table from '../../_components/Table/Table'
import { Restaurant } from '../../_types/entities/Restaurant'
import { restaurantSchema } from './restaurantSchema'
import { Container } from './styled'
import Select from 'react-select'

const Restaurants = () => {
  const [loading, setLoading] = useState(false)
  const [restaurants, setRestaurants] = useState<
    Restaurant[] | null
  >(null)
  const [search, setSearch] = useState('')

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

  const mockAPI = useCallback(() => {}, [])

  console.log({ sorted })

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
  }, [])

  if (loading) return <>Loading...</>
  if (!sorted) return null

  return (
    <Container>
      <Input
        id="search_input"
        name="search"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />
      <Table<Restaurant>
        schema={restaurantSchema}
        filterableColumns={['state', 'genre']}
        searchableColumns={['name', 'city', 'genre']}
        paginationOptions={{
          initialPage: 0,
          initialResultsPerPage: 10,
        }}
        rows={sorted}
      />
    </Container>
  )
}

export default Restaurants
