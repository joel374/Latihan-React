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
import { ChevronDownIcon, ChevronUpIcon, HamburgerIcon } from "@chakra-ui/icons"
import MyPorfile from "./pages/MyPorfile"
// import { HamburgerIcon } from "react-icons"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)
  const [loginBtn, setLoginBtn] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const authSelector = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const keepUserLogin = async () => {
    try {
      const auth_id = localStorage.getItem("auth_data")

      if (!auth_id) {
        setAuthCheck(true)
        return
      }

      const response = await axiosInstance.get(`/users/${auth_id}`)

      dispatch(login(response.data))
      setAuthCheck(true)
    } catch (error) {
      console.log(error)
      setAuthCheck(true)
    }
  }

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_data")
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
    return <Text>Loading</Text>
  }

  return (
    <Box>
      <Grid
        templateColumns={"repeat(3, 1fr)"}
        gap="2"
        p="3"
        backgroundColor={"teal"}
        color="white"
      >
        <GridItem w="auto" alignItems={"end"} padding="5px">
          <Menu isOpen={isOpen}>
            <MenuButton
              // variant="ghost"
              mx={1}
              py={[1, 2, 2]}
              px={4}
              borderRadius={5}
              // _hover={{ bg: "grey" }}
              aria-label="Courses"
              fontWeight="normal"
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
              // border={"3px solid white"}
            >
              <HamburgerIcon w={"6"} h={"6"} />
              {/* {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} */}
            </MenuButton>
            <MenuList
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
              color="black"
            >
              <MenuItem>
                <Link to={"/"}>Home</Link>
              </MenuItem>
              <MenuItem>
                <Link to={"/profile"}>Profile</Link>
              </MenuItem>
              {/* <MenuItem>Menu Item 3</MenuItem> */}
            </MenuList>
          </Menu>
        </GridItem>
        <GridItem padding="1px">
          <Text fontSize={"3xl"} fontWeight={"semibold"} textAlign="center">
            Igeh
          </Text>
        </GridItem>
        <GridItem display="flex" justifyContent={"end"} padding="7px">
          <Text fontSize="2xl" marginRight={"10px"} fontWeight="semibold">
            {authSelector.username}
          </Text>
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
              ml="10px"
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
        </GridItem>
      </Grid>

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
