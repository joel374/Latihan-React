import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import { BsThreeDots } from "react-icons/bs"
import Post from "../component/Post"
import { useEffect, useState } from "react"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)

  const authSelector = useSelector((state) => state.auth)
  const toast = useToast()
  const formik = useFormik({
    initialValues: {
      body: "",
      image_url: "",
    },
    onSubmit: async (values) => {
      try {
        let newPosts = {
          body: values.body,
          image_url: values.image_url,
          userId: authSelector.id,
        }

        await axiosInstance.post("/posts", newPosts)

        formik.setFieldValue("body", "")
        formik.setFieldValue("image_url", "")
        toast({ title: "Post success", status: "success" })
        fetchPost()
      } catch (error) {
        console.log(error)
      }
    },
  })

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _expand: "user",
          _sort: "id",
          _order: "desc",
          _limit: "2",
          _page: page,
        },
      })

      setPosts(response.data)
    } catch (err) {
      console.log(err)
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
        ></Post>
      )
    })
  }

  const seeMoreBtnHandler = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchPost()
  }, [page])

  return (
    <Container maxW={"container.md"} py="4" pb={"10"}>
      <Heading>Home Page</Heading>
      {authSelector.id === 0 ? null : (
        <Stack>
          <Textarea
            placeholder="Insert your caption here"
            value={formik.values.body}
            onChange={inputChangeHandler}
            name="body"
          />
          <HStack>
            <Input
              value={formik.values.image_url}
              onChange={inputChangeHandler}
              placeholder="Insert image URL"
              name="image_url"
            />
            <Button
              onClick={formik.handleSubmit}
              isDisabled={formik.isSubmitting}
              colorScheme={"twitter"}
            >
              Post
            </Button>
          </HStack>
        </Stack>
      )}
      {/* batas atas */}
      {/* batas bawah */}
      <Stack mt={"8"}>{renderPosts()}</Stack>
      <Button
        colorScheme={"linkedin"}
        width={"100%"}
        mt={"6"}
        onClick={seeMoreBtnHandler}
      >
        See More
      </Button>
      <Stack></Stack>
    </Container>
  )
}
export default HomePage
