import { Column } from '../../_components/Table/Table.d'
import { Restaurant } from '../../_types/entities/Restaurant'
import TableTags from '../../_components/Table/TableTags'

export const restaurantSchema: Column<Restaurant>[] = [
  {
    heading: 'Name',
    field: 'name',
    key: 'name',
    cellDisplayOption: 'RAW',
    cellStyles: {
      minWidth: '300px',
    },
  },
  {
    heading: 'City',
    field: 'city',
    key: 'city',
    cellDisplayOption: 'RAW',
    filterable: true,
    cellStyles: {
      minWidth: '150px',
    },
  },
  {
    heading: 'Genres',
    field: 'genre',
    key: 'genre',
    filterable: true,
    cellDisplayOption: (row: Restaurant) => (
      <TableTags tags={row.genre.split(',')} />
    ),
    cellStyles: {
      minWidth: '300px',
    },
  },
  {
    heading: 'State',
    field: 'state',
    key: 'state',
    cellDisplayOption: 'RAW',
    cellStyles: {
      minWidth: '300px',
    },
  },
  {
    heading: 'Phone Number',
    field: 'telephone',
    key: 'telephone',
    cellDisplayOption: 'RAW',
    cellStyles: {
      minWidth: '160px',
    },
  },
]
