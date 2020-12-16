import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Table, { TableProps } from './Table'
import { mockData } from './testUtils/mocks'

const consistentProps: TableProps<TestSchema> = {
  fetch: async () => Promise.resolve(mockData),
  schema: TableSchema<TestSchema>
}

const renderTable = (
  properties: TableProps = consistentProps,
  evaluatedProperties?: Partial<TableProps>,
): RenderResult => {
  // Overwrite consistent props with evaluated ones, if specified in tests
  const props = { ...properties, ...evaluatedProperties }
  return render(<Table<TestSchema> {...props} />)
}

describe('<Table />', () => {


  it('allows the user to see a table with the data returned from the API', async () => {})

})
