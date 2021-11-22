import React, { useCallback, useRef } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TextInput,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Feather'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import Button from '../../components/Button'
import Input from '../../components/Input'

import useKeyboard from '../../hooks/useKeyboard'
import { useAuth } from '../../hooks/auth'

import { RootStackParamList } from '../../routes'
import getValidationErrors from '../../utils/getValidationErrors'

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

interface SignInFormData {
  email: string
  password: string
}

const SignIn = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)

  const { isKeyboardVisible } = useKeyboard()
  const { navigate } = useNavigation<SignInScreenProp>()
  const { signIn, user } = useAuth()

  console.log(user)

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await signIn({
          email: data.email,
          password: data.password,
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as any)
          console.log(errors)
          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Authentication Error',
          'There was an error logging in, check your credentials.',
        )
      }
    },
    [signIn],
  )

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
            <Form
              ref={formRef}
              onSubmit={handleSignIn}
              style={{ width: '100%' }}
            >
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Enter
              </Button>
            </Form>

            <ForgotPasswordButton onPress={() => {}}>
              <ForgotPasswordButtonText>
                Forgot my Password
              </ForgotPasswordButtonText>
            </ForgotPasswordButton>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#d4c5b1" />
        <CreateAccountButtonText>Create an Account</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn
