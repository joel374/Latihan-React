import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
          toast({ title: "Credentials don't match", status: "error" })
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
    <Box>
      <Text fontSize={"4xl"} fontWeight={"bold"}>
        Login
      </Text>
      <Container>
        <Box padding="6" border={"1px solid black"} borderRadius="8px">
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Login
          </Text>

          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel>
                  Username
                  <Input
                    value={formik.values.username}
                    name="username"
                    onChange={formChangeHandler}
                  />
                  <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                </FormLabel>
              </FormControl>

              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>
                  Password
                  <Input
                    value={formik.values.password}
                    name="password"
                    onChange={formChangeHandler}
                    type={"password"}
                  />
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormLabel>
              </FormControl>
              <Button colorScheme={"teal"} type={"submit"}>
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}
export default LoginPage
