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
import * as Yup from "yup"
import { axiosInstance } from "../api"

const RegisterPage = () => {
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const emailResponse = await axiosInstance.get("./users", {
          params: {
            email: values.email,
          },
        })
        console.log(emailResponse.data)

        if (emailResponse.data.length) {
          toast({ title: "Email has alreard been used", status: "error" })
          return
        }

        const usernameResponse = await axiosInstance.get("./users", {
          params: {
            username: values.username,
          },
        })
        console.log(usernameResponse.data)

        if (usernameResponse.data.length) {
          toast({ title: "Username has already been used", status: "error" })
          return
        }

        let newUser = {
          username: values.username,
          email: values.email,
          password: values.password,
          role: "user",
        }
        await axiosInstance.post("./users", newUser)

        toast({ title: "Registration successfukl", status: "success" })
      } catch (error) {
        console.log(error)
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      email: Yup.string().required().email(),
      password: Yup.string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
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
        Register Page
      </Text>
      <Container>
        <Box padding="6" border={"1px solid black"} borderRadius="8px">
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Register User
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
              <FormControl isInvalid={formik.errors.email}>
                <FormLabel>
                  Email
                  <Input
                    value={formik.values.email}
                    name="email"
                    onChange={formChangeHandler}
                    type={"email"}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
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
export default RegisterPage
