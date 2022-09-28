import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { text } from "@fortawesome/fontawesome-svg-core"
import { useFormik } from "formik"
import { useState } from "react"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { login } from "../redux/features/authSlice"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const toast = useToast()

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    onSubmit: async ({ usernameOrEmail, password }) => {
      try {
<<<<<<< Updated upstream
=======
        // const response = await axiosInstance.get("/users", {
        //   params: {
        //     usernameOrEmail: values.usernameOrEmail,
        //     password: values.password,
        //   },
        // })
        // if (!response.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Credentials don't match",
        //     status: "error",
        //   })
        //   return
        // }

>>>>>>> Stashed changes
        const response = await axiosInstance.post("/auth/login", {
          usernameOrEmail,
          password,
        })

<<<<<<< Updated upstream
        // if (!response.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Credentials don't match",
        //     status: "error",
        //   })
        //   return
        // }

        localStorage.setItem("auth_token", response.data.token)
        dispatch(
          login({
            username: response.data.data.username,
            email: response.data.data.email,
            id: response.data.data.id,
          })
        )
        toast({
          title: "Login successful",
=======
        localStorage.setItem("auth_token", response.data.token)
        dispatch(
          login({
            username: response.data.data.username,
            email: response.data.data.email,
            id: response.data.data.id,
          })
        )

        toast({
          position: "top",
          title: "Registration Success",
>>>>>>> Stashed changes
          description: response.data.message,
          status: "success",
        })
      } catch (error) {
        console.log(error)
        toast({
<<<<<<< Updated upstream
          status: "error",
          title: "Login failed",
          description: error.response.data.message,
=======
          position: "top",
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
>>>>>>> Stashed changes
        })
      }
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required().min(3),
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
              <FormControl isInvalid={formik.errors.usernameOrEmail}>
<<<<<<< Updated upstream
                <FormLabel>Username Or Email</FormLabel>
=======
                <FormLabel>usernameOrEmail</FormLabel>
>>>>>>> Stashed changes
                <Input
                  value={formik.values.usernameOrEmail}
                  name="usernameOrEmail"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formik.errors.usernameOrEmail}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password </FormLabel>
                <InputGroup>
                  <Input
                    value={formik.values.password}
                    name="password"
                    onChange={formChangeHandler}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement width="56px" mr="4px">
                    <Button onClick={togglePassword} height="28px" size="sm">
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
