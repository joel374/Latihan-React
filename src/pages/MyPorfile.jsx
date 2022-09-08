import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import Post from "../component/Post"

const MyPorfile = () => {
  const authSelector = useSelector((state) => state.auth)

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)

  const toast = useToast()

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _expand: "user",
          _sort: "id",
          _order: "desc",
          _page: page,
          userId: authSelector.id,
        },
      })

      if (page === 1) {
        setPosts(response.data)
      } else {
        setPosts([...posts, ...response.data])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`)
      fetchPost()
      toast({ position: "top", title: "Post deleted", status: "info" })
    } catch (error) {
      console.log(error)
    }
  }

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.user.username}
          body={val.body}
          image_url={val.image_url}
          userId={val.userId}
          onDelete={() => {
            deleteBtnHandler(val.id)
          }}
          postId={val.id}
        ></Post>
      )
    })
  }

  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Text fontSize={"4xl"} fontWeight={"light"}>
          My Profile
        </Text>
        <Box mt={"4"}>
          <Stack>
            <HStack gap={"10"}>
              <Wrap>
                <WrapItem>
                  <Avatar size="2xl" name={authSelector.username} />
                </WrapItem>
              </Wrap>
              <Stack>
                <Text fontSize={"3xl"} fontWeight="bold">
                  {authSelector.username}
                </Text>
                <Text fontSize={"2xl"}>{authSelector.email}</Text>
                <Text fontSize={"2xl"} fontWeight="light">
                  {authSelector.role}
                </Text>
              </Stack>
            </HStack>
          </Stack>
          <Button width={"100%"} mt={"8"}>
            Edit
          </Button>

          <Stack>
            {/* <FormControl>
              <FormLabel>Username</FormLabel>
              <Input defaultValue={authSelector.username} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input defaultValue={authSelector.email} />
            </FormControl>
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Input defaultValue={authSelector.username} />
            </FormControl> */}
          </Stack>
          <Stack mt={"8"} spacing="2">
            {renderPosts()}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default MyPorfile
