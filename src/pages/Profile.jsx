import {
  Avatar,
  Box,
  Container,
  HStack,
  Stack,
  Text,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, Navigate } from "react-router-dom"
import { axiosInstance } from "../api"
import Post from "../component/Post"

const ProfilePage = () => {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})

  const authSelector = useSelector((state) => state.auth)

  const params = useParams()

  const toast = useToast()

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          username: params.username,
        },
      })
      setUser(response.data[0])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          userId: user.id,
          _expand: "user",
        },
      })
      setPosts(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`)

      fetchPosts()
      toast({ title: "Post deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.User.username}
          caption={val.caption}
          image_url={val.image_url}
          userId={val.UserId}
          onDelete={() => deleteBtnHandler(val.id)}
          postId={val.id}
        />
      )
    })
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])
  useEffect(() => {
    fetchPosts()
  }, [user.id])

  if (params.username === authSelector.username) {
    return <Navigate replace to="/my-profile" />
  }

  return (
    <Box backgroundColor={"#fafafa"} mt={"23"}>
      <Container maxW={"container.md"} py="4" pb={"10"} mt="4">
        <Box
          borderColor={"gray.300"}
          borderWidth="1px"
          p={"6"}
          borderRadius={"8px"}
        >
          <Box mt={"4"}>
            <Stack>
              <HStack gap={"10"}>
                <Wrap>
                  <WrapItem>
                    <Avatar
                      size="2xl"
                      name={user.username}
                      // src="https://images.unsplash.com/photo-1508185140592-283327020902?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                    />
                  </WrapItem>
                </Wrap>
                <Stack>
                  <Text fontSize={"3xl"} fontWeight="bold">
                    {user.username}
                  </Text>
                  <Text fontSize={"2xl"}>{user.email}</Text>
                  <Text fontSize={"2xl"} fontWeight="light">
                    {user.role}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          </Box>
        </Box>
        <Stack mt={"5"} spacing="5">
          {renderPosts()}
        </Stack>
      </Container>
    </Box>
  )
}
export default ProfilePage
