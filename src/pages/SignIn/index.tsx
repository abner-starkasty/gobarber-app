import React from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Feather'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { RootStackParamList } from '../../routes'
import useKeyboard from '../../hooks/useKeyboard'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPasswordButton,
  ForgotPasswordButtonText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles'

type SignInScreenProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>

const SignIn = () => {
  const { isKeyboardVisible } = useKeyboard()
  const { navigate } = useNavigation<SignInScreenProp>()

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container $isKeyboardVisible={isKeyboardVisible}>
            <Image source={logoImg} />

            <View>
              <Title>Login</Title>
            </View>

            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Password" />

            <Button onPress={() => console.log('Cliquei')}>Enter</Button>

            <ForgotPasswordButton onPress={() => {}}>
              <ForgotPasswordButtonText>
                Forgot my Password
              </ForgotPasswordButtonText>
            </ForgotPasswordButton>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Create an Account</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn
