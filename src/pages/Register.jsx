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
import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import { axiosInstance } from "../api"

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ username, email, password }) => {
      try {
<<<<<<< Updated upstream
        const response = await axiosInstance.post("./auth/register", {
=======
        // const emailResponse = await axiosInstance.get("./users", {
        //   params: {
        //     email: values.email,
        //   },
        // })

        // if (emailResponse.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Email has alreardy been used",
        //     status: "error",
        //   })
        //   return
        // }

        // const usernameResponse = await axiosInstance.get("./users", {
        //   params: {
        //     username: values.username,
        //   },
        // })

        // if (usernameResponse.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Username has already been used",
        //     status: "error",
        //   })
        //   return
        // }

        // let newUser = {
        //   username: values.username,
        //   email: values.email,
        //   password: values.password,
        //   role: "user",
        //   profile_picture: "",
        // }
        // await axiosInstance.post("./users", newUser)
        const response = await axiosInstance.post("/auth/register", {
>>>>>>> Stashed changes
          username,
          email,
          password,
        })
<<<<<<< Updated upstream

        // if (emailResponse.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Email has alreardy been used",
        //     status: "error",
        //   })
        //   return
        // }

        // const usernameResponse = await axiosInstance.get("./users", {
        //   params: {
        //     username: values.username,
        //   },
        // })

        // if (usernameResponse.data.length) {
        //   toast({
        //     position: "top",
        //     title: "Username has already been used",
        //     status: "error",
        //   })
        //   return
        // }

        // let newUser = {
        //   username: values.username,
        //   email: values.email,
        //   password: values.password,
        //   role: "user",
        //   profile_picture: "",
        // }
        // await axiosInstance.post("./users", newUser)

=======
>>>>>>> Stashed changes
        toast({
          title: "Registration successful",
          position: "top",
<<<<<<< Updated upstream
          description: response.data.mesagge,
=======
          title: "Registration successful",
          description: response.data.message,
>>>>>>> Stashed changes
          status: "success",
        })
      } catch (error) {
        toast({
          title: "Registration failed",
          description: error.response.data.message,
          status: "error",
        })
        console.log(error)
        toast({
          position: "top",
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      email: Yup.string().required().email(),
      password: Yup.string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain  Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
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
        <Heading fontSize={"4xl"} fontWeight={"light"} mb={"4"}>
          Register User
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
              <FormControl isInvalid={formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formik.values.email}
                  name="email"
                  onChange={formChangeHandler}
                  type={"email"}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password </FormLabel>
                <InputGroup>
                  <Input
                    value={formik.values.password}
                    name="password"
                    onChange={formChangeHandler}
                    type={"password"}
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
                  Register
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default RegisterPage
