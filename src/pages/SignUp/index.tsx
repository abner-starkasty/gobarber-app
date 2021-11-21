import React, { useCallback, useRef } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TextInput,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Button from '../../components/Button'
import Input from '../../components/Input'
import useKeyboard from '../../hooks/useKeyboard'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles'

const SignUp = () => {
  const { goBack } = useNavigation()
  const { isKeyboardVisible } = useKeyboard()

  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const formRef = useRef<FormHandles>(null)
  const handleSignUp = useCallback((data: object) => console.log(data), [])

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
