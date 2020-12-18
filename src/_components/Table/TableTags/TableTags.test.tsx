import React from 'react'
import { render } from '@testing-library/react'
import TableTags from '../TableTags/TableTags'

const TEST_TAGS = ['Sushi', 'Ethiopian', 'Sicilian']

describe('<TableTags />', () => {
  it('renders the tags according to provided props', () => {
    const { getByText } = render(<TableTags tags={TEST_TAGS} />)

    TEST_TAGS.forEach(tag => {
      expect(getByText(tag)).toBeInTheDocument()
    })
  })
})
