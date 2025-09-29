import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('provides initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('loads user from localStorage on mount', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@unifor.br',
      course: 'Ciência da Computação',
      university: 'UNIFOR',
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Wait for useEffect to complete
    act(() => {
      // Simulate async operation completion
    })

    expect(localStorageMock.getItem).toHaveBeenCalledWith('profai_user')
  })

  it('logs in user successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const userData = {
      id: '1',
      name: 'Test User',
      email: 'test@unifor.br',
      course: 'Ciência da Computação',
      university: 'UNIFOR',
    }

    act(() => {
      result.current.login(userData)
    })

    expect(result.current.user).toEqual(userData)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'profai_user',
      JSON.stringify(userData)
    )
  })

  it('logs out user successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // First login
    const userData = {
      id: '1',
      name: 'Test User',
      email: 'test@unifor.br',
      course: 'Ciência da Computação',
      university: 'UNIFOR',
    }

    act(() => {
      result.current.login(userData)
    })

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('profai_user')
  })

  it('updates user data', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const initialUser = {
      id: '1',
      name: 'Test User',
      email: 'test@unifor.br',
      course: 'Ciência da Computação',
      university: 'UNIFOR',
    }

    act(() => {
      result.current.login(initialUser)
    })

    const updatedData = { name: 'Updated Name' }

    act(() => {
      result.current.updateUser(updatedData)
    })

    expect(result.current.user).toEqual({
      ...initialUser,
      ...updatedData,
    })
  })

  it('handles invalid JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      // Simulate async operation completion
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('profai_user')
  })
})

