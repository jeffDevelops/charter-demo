import { Column } from '../../_components/Table/Table.d'
import { Restaurant } from '../../_types/entities/Restaurant'
import TableTags from '../../_components/Table/TableTags'

export const restaurantSchema: Column<Restaurant>[] = [
  {
    heading: 'Name',
    field: 'name',
    key: 'name',
    cellDisplayOption: 'RAW',
  },
  {
    heading: 'City',
    field: 'city',
    key: 'city',
    cellDisplayOption: 'RAW',
  },
  {
    heading: 'State',
    field: 'state',
    key: 'state',
    cellDisplayOption: 'RAW',
  },
  {
    heading: 'Phone Number',
    field: 'telephone',
    key: 'telephone',
    cellDisplayOption: 'RAW',
  },
  {
    heading: 'Genres',
    field: 'genre',
    key: 'genre',
    cellDisplayOption: (row: Restaurant) => (
      <TableTags tags={row.genre.split(',')} />
    ),
  },
]
