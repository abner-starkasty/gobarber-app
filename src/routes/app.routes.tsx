import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Dashboard from '../pages/Dashboard'

export type RootStackParamList = {
  Dashboard: undefined
}

const App = createNativeStackNavigator<RootStackParamList>()

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
  </App.Navigator>
)

export default AppRoutes
