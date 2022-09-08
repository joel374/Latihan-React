import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { login } from "../redux/features/authSlice"

const LoginPage = () => {
  const toast = useToast()

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.get("/users", {
          params: {
            username: values.username,
            password: values.password,
          },
        })

        if (!response.data.length) {
          toast({
            position: "top",
            title: "Credentials don't match",
            status: "error",
          })
          return
        }

        localStorage.setItem("auth_data", response.data[0].id)
        dispatch(login(response.data[0]))
      } catch (error) {
        console.log(error)
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      password: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Heading fontSize={"4xl"} fontWeight={"light"} mb="4">
          Login
        </Heading>
        <Box padding="6" width={"600px"} mx={"auto"}>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formik.values.username}
                  name="username"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password </FormLabel>
                <Input
                  value={formik.values.password}
                  name="password"
                  onChange={formChangeHandler}
                  type={"password"}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Box py={"3"}>
                <Button colorScheme={"teal"} type={"submit"}>
                  Login
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}
export default LoginPage
