import React from 'react'
import {
  getByPlaceholderText,
  render,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Restaurants from './Restaurants'
import { mockData } from '../../_components/Table/testUtils/mocks'

describe('<Restaurants />', () => {
  beforeEach(() =>
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    } as any),
  )

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('allows the user to search and filter', async () => {
    const SEARCH_TERM = 'Fast Casual'
    const FILTER_TERM = 'American'

    const {
      container,
      getByTestId,
      getByPlaceholderText,
      getByText,
    } = render(<Restaurants />)

    await waitFor(() => {
      expect(getByTestId('table_body')).toBeInTheDocument()
    })

    const input = getByPlaceholderText(
      /Search by name, city, or genre/i,
    )

    const searchButton = getByTestId('search_button')

    userEvent.type(input, SEARCH_TERM)
    userEvent.click(searchButton)

    // Expect an indication of the current search to be on the page
    expect(
      getByText(
        new RegExp(`Current search: "${SEARCH_TERM}"`, 'i'),
      ),
    ).toBeInTheDocument()

    // Expect the pagination to have narrowed
    expect(getByText(/Results 1 - 3 of 3/i)).toBeInTheDocument()

    // Expect the search term to be present in all results
    const body = getByTestId('table_body')
    body.querySelectorAll('tr').forEach(row => {
      const { queryByText: queryWithin } = within(row)
      expect(
        queryWithin(new RegExp(SEARCH_TERM, 'i')),
      ).not.toBeNull()
    })

    const genreFilter = (container.querySelector(
      '#select_genre',
    ) as HTMLElement).querySelector('input') as HTMLInputElement

    userEvent.type(genreFilter, FILTER_TERM)
    userEvent.type(genreFilter, '{enter}')

    await waitFor(() => {
      expect(
        getByText(/Results 1 - 1 of 1/i),
      ).toBeInTheDocument()
    })

    body.querySelectorAll('tr').forEach(row => {
      const { queryByText: queryWithin } = within(row)
      expect(
        queryWithin(new RegExp(SEARCH_TERM, 'i')),
      ).not.toBeNull()
      expect(
        queryWithin(new RegExp(FILTER_TERM, 'i')),
      ).not.toBeNull()
    })
  })
})
