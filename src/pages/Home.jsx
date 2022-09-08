import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import * as Yup from "yup"
import Post from "../component/Post"
import { AddIcon } from "@chakra-ui/icons"
import comment from "../component/Comment"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const authSelector = useSelector((state) => state.auth)

  const posting = () => {}

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

        toast({
          position: "top",
          title: "Post success",
          status: "success",
        })

        fetchPost()
      } catch (error) {
        console.log(error)
      }
    },
    validationSchema: Yup.object({
      body: Yup.string().required().min(6),
      image_url: Yup.string().required().url(),
    }),
    validateOnChange: false,
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

      setTotalCount(response.headers["x-total-count"])

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

  const seeMoreBtnHandler = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchPost()
  }, [page])

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Heading fontWeight={"light"}>Home Page</Heading>
        {authSelector.id ? (
          <>
            <Button onClick={onOpen}>
              <AddIcon />
            </Button>
            <Stack mt={"4"} isOpen={isOpen} onClose={onClose}>
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
          </>
        ) : null}
        <Stack mt={"8"} spacing="2">
          {renderPosts()}

          {!posts.length ? (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>No posts found</AlertTitle>
            </Alert>
          ) : null}
        </Stack>
        {posts.length >= totalCount ? null : (
          <Button
            colorScheme={"linkedin"}
            width={"100%"}
            mt={"6"}
            onClick={seeMoreBtnHandler}
          >
            See More
          </Button>
        )}
      </Container>
    </Box>
  )
}
export default HomePage
