import { TestSchema } from './types'
import { Column } from '../Table.d'
import TableTags from '../TableTags/TableTags'

export const mockSchema: Column<TestSchema>[] = [
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
    cellDisplayOption: (row: TestSchema) => (
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

export const mockData: TestSchema[] = [
  {
    id: '1',
    name: 'Chipotle',
    city: 'Denver',
    state: 'CO',
    telephone: '1234567890',
    attire: 'Casual',
    genre: 'Fast casual,Tex Mex',
    mustTry: 'Carne asada',
  },
  {
    id: '2',
    name: 'Cafe Mexicali',
    city: 'Fort Collins',
    state: 'CO',
    telephone: '0987654321',
    attire: 'Casual',
    genre: 'Fast casual,Tex Mex',
    mustTry: 'Sweet pork with creamy habenero sauce',
  },
  {
    id: '3',
    name: 'Sushi Den',
    city: 'Denver',
    state: 'CO',
    telephone: '0987654321',
    attire: 'Business casual',
    genre: 'Sushi,Japanese',
    mustTry: 'Everything',
  },
  {
    id: '4',
    name: "Lucile's",
    city: 'Denver',
    state: 'CO',
    telephone: '0987654321',
    attire: 'Casual',
    genre: 'Breakfast,Brunch,Lunch,Creole',
    mustTry: 'Eggs Pontchartrain',
  },
  {
    id: '5',
    name: 'Larkburger',
    city: 'Denver',
    state: 'CO',
    telephone: '1234567890',
    attire: 'Casual',
    genre: 'American,Burger joint,Fast casual',
    mustTry: 'Portabello mushroom burger with onion rings',
  },
  {
    id: '6',
    name: 'Denver Biscuit Company',
    city: 'Denver',
    state: 'CO',
    telephone: '0987654321',
    attire: 'Casual',
    genre: 'Breakfast,Brunch',
    mustTry:
      'Almond Tres Leches French Toast (with peppered bacon on the side)',
  },
  {
    id: '7',
    name: 'Denver Biscuit Company',
    city: 'Denver',
    state: 'CO',
    telephone: '0987654321',
    attire: 'Casual',
    genre: 'Breakfast,Brunch',
    mustTry: 'The Franklin',
  },
]
