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

const LoginPage = () => {
  const toast = useToast()
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {},
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
