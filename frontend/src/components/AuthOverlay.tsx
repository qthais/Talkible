import React, { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { Button, Col, Grid, Group, Modal, Paper, Text, TextInput } from '@mantine/core'
import { GraphQLErrorExtensions, validate } from 'graphql'
import { useUserStore } from '../stores/userStore'
import { useMutation } from '@apollo/client'
import { isEmail, useForm } from '@mantine/form'
import { REGISTER_USER } from '../graphql/mutations/Register'
import { LOGIN_USER } from '../graphql/mutations/Login'
import toast from 'react-hot-toast'
function AuthOverlay() {
  const isLoginModalOpen = useGeneralStore((state) => state.isLoginModalOpen)
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal)
  const [isRegister, setIsRegister] = useState(true)
  const toggleForm = () => {
    setIsRegister(!isRegister)
  }


  const Register = () => {
    const form = useForm({
      initialValues: {
        fullname: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      validate: {
        fullname: (value: string) =>
          value.trim().length >= 3 ? null : "Username must be at least 3 characters!",
        email: (value: string) => (value.includes("@") ? null : 'Invalid email!'),
        password: (value: string) =>
          value.trim().length >= 3 ? null : 'Password must be at least 3 characters',
        confirmPassword: (value: string, values) =>
          value.trim().length >= 3 && value === values.password ? null : 'Password do not match!'
      }
    })
    const setUser = useUserStore((state) => state.setUser)
    const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({})
    const [registerUser, { loading }] = useMutation(REGISTER_USER)
    const handleRegister = async () => {
      setErrors({})
      await registerUser({
        variables: {
          email: form.values.email,
          password: form.values.password,
          fullname: form.values.fullname,
          confirmPassword: form.values.confirmPassword
        },
        onCompleted: (data) => {
          toast.success('Register successfully!')
          setErrors({})
          if (data?.register.user) {
            setUser({
              id: data?.register.user.id,
              email: data?.register.user.email,
              fullname: data?.register.user.fullname
            }
            )
            toggleLoginModal()
          }
        }
      }).catch((err) => {
        setErrors(err.graphQLErrors[0].GraphQLErrorExtensions)
        useGeneralStore.setState({ isLoginModalOpen: true })
      })

    }

    return (
      <Paper radius={'md'}>
        <Text className='italic font-medium text-xl md:text-3xl' align='center' size={'xl'}>Register</Text>
        <form className='px-4' onSubmit={form.onSubmit(() => {
          handleRegister()
        })}>
          <Grid mt={20}>
            <Col span={12} >
              <TextInput
                radius={'md'}
                className='focus:ring'
                label='Fullname'
                placeholder='Choose a fullname'
                {...form.getInputProps('fullname')}
                error={form.errors.fullname || (errors?.fullname as string)}
              />
            </Col>
            <Col span={12} >
              <TextInput
                radius={'md'}
                autoComplete='off'
                label='Email'
                placeholder='Enter your email'
                {...form.getInputProps('email')}
                error={form.errors.email || (errors?.email as string)}
              />
            </Col>
            <Col span={12} >
              <TextInput
                radius={'md'}
                label='Password'
                type='password'
                placeholder='Enter your password'
                {...form.getInputProps('password')}
                error={form.errors.password || (errors?.password as string)}
              />
            </Col>
            <Col span={12} >
              <TextInput
                radius={'md'}
                label='Confirm password'
                type='password'
                placeholder='Confirm your password'
                {...form.getInputProps('confirmPassword')}
                error={form.errors.confirmPassword || (errors?.confirmPassword as string)}
              />
            </Col>
            <Col span={12}>
              <Button variant='link' className='italic' onClick={toggleForm} pl={0}>
                Already registered?&nbsp; <span className='text-sky-600'>Login</span>
              </Button>
            </Col>
          </Grid>
          <Group position='right' className='mt-4'>
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              variant='outline' color='blue'
              type='submit'
              disabled={loading}>
              Register
            </Button>
            <Button className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition' variant='outline' color='red'>Cancel</Button>
          </Group>
        </form>
      </Paper>
    )
  }
  const Login = () => {
    const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER)
    const setUser = useUserStore((state) => state.setUser)
    const [errors, setErrors] = useState<GraphQLErrorExtensions>({})
    const [invalidCredentials, setInvalidCredentials] = useState('')
    const form = useForm({
      initialValues: {
        email: '',
        password: '',
      },
      validate: {
        email: (value: string) => (value.includes("@") ? null : 'Invalid email!'),
        password: (value: string) =>
          value.trim().length >= 3 ? null : 'Password must be at least 3 characters',
      }
    })
    const handleLogin = async () => {
      await loginUser({
        variables: {
          email: form.values.email,
          password: form.values.password,
        },
        onCompleted: (data) => {
          setErrors({})
          toast.success('Login success fully!')
          if (data?.login.user) {
            setUser({
              id: data?.login.user.id,
              email: data?.login.user.email,
              fullname: data?.login.user.fullname,
              avatarUrl: data?.login.user.avatarUrl
            })
            toggleLoginModal()
          }
        }
      }).catch((err) => {
        console.log(err.graphQLErrors, "ERROR")
        setErrors(err.graphQLErrors[0].extensions)
        if (err.graphQLErrors[0].extensions.invalidCredentials) {
          setInvalidCredentials(err.graphQLErrors[0].extensions.invalidCredentials)
        }
        useGeneralStore.setState({ isLoginModalOpen: true })
      })
    }

    return (
      <Paper radius={'md'}>
        <Text className='italic font-medium text-xl md:text-3xl' align="center" size="xl">
          Login
        </Text>
        <form className='px-4'
          onSubmit={form.onSubmit(() => {
            handleLogin()
          })}
        >
          <Grid style={{ marginTop: 20 }}>
            <Col span={12} >
              <TextInput
                radius={'md'}
                className='focus:ring'
                autoComplete="off"
                label="Email"
                placeholder="Enter your email"
                {...form.getInputProps("email")}
                error={form.errors.email || (errors?.email as string)}
              />
            </Col>
            <Col span={12} >
              <TextInput
                radius={'md'}
                autoComplete="off"
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...form.getInputProps("password")}
                error={form.errors.password || (errors?.password as string)}
              />
            </Col>
            {/* Not registered yet? then render register component. use something like a text, not a button */}
            <Col span={12} >
              <Text color="red">{invalidCredentials}</Text>
            </Col>
            <Col span={12}>
              <Button pl={0} variant="link" onClick={toggleForm}>
                Not registered yet?&nbsp; <span className='text-sky-600'>Register</span>
              </Button>
            </Col>
          </Grid>
          {/* buttons: login or cancel */}
          <Group position="right" className='mt-4' style={{ marginTop: 20 }}>
            <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              variant="outline"
              color="blue"
              type="submit"
              disabled={loading}
            >
              Login
            </Button>
            <Button
            className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
             variant="outline" 
             color="red" 
             onClick={toggleLoginModal}>
              Cancel
            </Button>
          </Group>
        </form>
      </Paper>
    )
  }
  return (
    <Modal style={{borderRadius:100}} centered opened={isLoginModalOpen} onClose={toggleLoginModal} >
      {isRegister ? <Register /> : <Login />}
    </Modal>
  )
}
export default AuthOverlay