import React from 'react'

import Button from '../../components/Button'

import { useAuth } from '../../hooks/auth'

import { Container } from './styles'

interface DashboardProps {
  children: React.ReactNode
}

const Dashboard = () => {
  const { signOut } = useAuth()
  return (
    <Container
      style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }}
    >
      <Button onPress={signOut}>Sair</Button>
    </Container>
  )
}

export default Dashboard
