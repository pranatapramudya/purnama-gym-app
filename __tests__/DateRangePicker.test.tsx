import { render, screen } from '@testing-library/react'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import React from 'react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('DateRangePicker', () => {
  it('renders the default placeholder text', () => {
    render(<DateRangePicker />)
    expect(screen.getByText('Pilih Rentang Tanggal')).toBeInTheDocument()
  })
})
