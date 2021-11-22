/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

interface IAuthData {
  token: string
  user: Record<string, unknown>
}

interface ISignInCredentials {
  email: string
  password: string
}

interface IAuthContextData {
  user: Record<string, unknown>
  isSigned: boolean
  signIn: (credentials: ISignInCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<IAuthData>({} as IAuthData)
  const [isSigned, setIsSigned] = useState(false)

  useEffect(() => {
    async function loadStorageData() {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ])

      if (token[1] && user[1]) {
        setAuthData({ token: token[1], user: JSON.parse(user[1]) })
        setIsSigned(true)
      }
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<any>('sessions', {
      email,
      password,
    })

    const { token, user } = response.data

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ])

    setAuthData({ token, user })
    setIsSigned(true)
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user'])

    setAuthData({} as IAuthData)
    setIsSigned(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user: authData.user, isSigned, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = (): IAuthContextData => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
