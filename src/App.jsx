import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
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
import { login, logout, logoutEmployee } from "./redux/features/authSlice"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)
  const authSelector = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const keepUserLogin = async () => {
    try {
      setAuthCheck(true)
      const auth_id = localStorage.getItem("auth_data")

      if (!auth_id) {
        return
      }

      const response = await axiosInstance.get(`/users/${auth_id}`)

      dispatch(login(response.data))
    } catch (error) {
      console.log(error)
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
    return <div>Loading....</div>
  }

  return (
    <Box>
      {/* NavBar */}
      <Menu>
        <MenuButton as={Button}>Navigasi</MenuButton>
        <MenuList>
          <MenuItem>
            <Link to={"/"}>Home</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/profile"}>Profile</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/login"}>Login</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/register"}>Register</Link>
          </MenuItem>
        </MenuList>
      </Menu>
      {/* Akhir Navbar */}
      <Text fontSize={"4xl"} fontWeight={"bold"}>
        Hello {authSelector.username}
      </Text>
      <Button colorScheme={"red"} onClick={logoutBtnHandler}>
        Logout
      </Button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
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
