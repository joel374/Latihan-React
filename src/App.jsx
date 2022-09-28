import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
  Icon,
  Flex,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Avatar,
  Spinner,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, Link } from "react-router-dom"
import { axiosInstance } from "./api"
import GuestRoute from "./component/GuesRoute"
import ProtectedRoute from "./component/ProtectedRoute"
import Dashboard1 from "./pages/admin/Dashboard1"
import Dashboard2 from "./pages/admin/Dashboard2"
import HomePage from "./pages/Home"
import LoginPage from "./pages/Login"
import ProfilePage from "./pages/Profile"
import RegisterPage from "./pages/Register"
import NotFoundPage from "./pages/404"
import { login, logout } from "./redux/features/authSlice"
import { AddIcon } from "@chakra-ui/icons"
import MyPorfile from "./pages/MyPorfile"
import NewPost from "./component/NewPost"
import "./App.css"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)
  const [loginBtn, setLoginBtn] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const authSelector = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const keepUserLogin = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token")

      if (!auth_token) {
        setAuthCheck(true)
        return
      }

      const response = await axiosInstance.get(`/auth/refresh-token`, {
        headers: {
          authorization: `Bearer ${auth_token}`,
        },
      })

      dispatch(login(response.data.data))
      localStorage.setItem("auth_token", response.data.token)
      setAuthCheck(true)
    } catch (error) {
      console.log(error)
      setAuthCheck(true)
    }
  }

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token")
    dispatch(logout())
  }

  const renderAdminRoutes = () => {
    if (authSelector.role === "admin") {
      return (
        <>
          <Route path="/admin/dashboard1" element={<Dashboard1 />} />
          <Route path="/admin/dashboard2" element={<Dashboard2 />} />
        </>
      )
    }
  }

  useEffect(() => {
    keepUserLogin()
  }, [])

  if (!authCheck) {
    return (
      <Box alignContent={"center"}>
        <Spinner
          thickness="4px"
          speed="0.35s"
          emptyColor="gray.200"
          color="teal"
          size="xl"
        />
      </Box>
    )
  }

  return (
    <Box backgroundColor={"#fafafa"}>
      <Box
        backgroundColor={"teal"}
        position="fixed"
        opacity={"0.9"}
        // filter="blur(1px)"
        right={"0"}
        top={"0"}
        left="0"
        zIndex={"999"}
        borderBottom="1px solid"
        borderBottomColor={"#006666"}
      >
        <Container maxW={"container.lg"}>
          <Grid templateColumns={"repeat(3, 1fr)"} gap="2" p="3" color="white">
            <GridItem>
              <Text fontSize={"3xl"} fontWeight={"semibold"}>
                Igeh
              </Text>
            </GridItem>
            <GridItem padding="1px"></GridItem>
            <GridItem display="flex" justifyContent={"end"} padding="7px">
              {authSelector.id ? (
                <>
                  <Button
                    onClick={onOpen}
                    bgColor="teal"
                    border={"3px solid"}
                    size="md"
                    _hover={"teal"}
                  >
                    <AddIcon />
                  </Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalCloseButton />
                      <ModalBody p={10}>
                        <NewPost />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </>
              ) : null}
              <Button
                mr={"2"}
                ml="2"
                backgroundColor={"teal"}
                border={"3px solid "}
                _hover="teal"
              >
                <Link to={"/"}>Home</Link>
              </Button>

              {authSelector.id ? null : (
                <Button
                  colorScheme={"#008080"}
                  border={"3px solid white"}
                  // size={"lg"}
                >
                  <Link to={"/login"}>Login</Link>
                </Button>
              )}
              {!authSelector.id ? (
                <Button
                  colorScheme={"#008080"}
                  border={"3px solid white"}
                  ml="2"
                  // size={"lg"}
                >
                  <Link to={"/register"}>Register</Link>
                </Button>
              ) : (
                <Button
                  colorScheme={"#008080"}
                  border={"3px solid white"}
                  onClick={logoutBtnHandler}
                  // size={"lg"}
                >
                  Logout
                </Button>
              )}
              {authSelector.id ? (
                <Box ml={"2"} my="auto">
                  <Link to={"/my-profile/"}>
                    <Avatar size={"sm"} name={authSelector.username} />
                  </Link>
                </Box>
              ) : null}
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyPorfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        {renderAdminRoutes()}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  )
}
export default App
