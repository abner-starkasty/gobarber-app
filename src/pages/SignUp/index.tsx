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
import Icon from 'react-native-vector-icons/Feather'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import Button from '../../components/Button'
import Input from '../../components/Input'

import useKeyboard from '../../hooks/useKeyboard'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp = () => {
  const { goBack } = useNavigation()
  const { isKeyboardVisible } = useKeyboard()

  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const formRef = useRef<FormHandles>(null)

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.post('/users', data)

        Alert.alert(
          'Registration successful!',
          'You already can do your login on GoBarber!',
        )

        goBack()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as any)
          formRef.current?.setErrors(errors)

          return
        }

        console.log((err as any).response.data)

        Alert.alert(
          'Registration Error',
          'An error occurred while registering, try again.',
        )
      }
    },
    [goBack],
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
              <Title>Create your account</Title>
            </View>

            <Form
              ref={formRef}
              onSubmit={handleSignUp}
              style={{ width: '100%' }}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
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
                Register
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton onPress={() => goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInButtonText>Back to Login</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  )
}

export default SignUp
