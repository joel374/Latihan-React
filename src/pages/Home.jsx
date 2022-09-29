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
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import * as Yup from "yup"
import Post from "../component/Post"
import { AddIcon } from "@chakra-ui/icons"
import comment from "../component/Comment"
import "../App.css"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const inputFileRef = useRef(null)

  const authSelector = useSelector((state) => state.auth)

  const toast = useToast()

  // const formik = useFormik({
  //   initialValues: {
  //     body: "",
  //     post_image: null,
  //   },
  //   onSubmit: async (values) => {
  //     try {
  //       let newPost = new FormData()

  //       newPost.append("body", values.body)
  //       newPost.append("post_image", values.post_image)

  //       await axiosInstance.post("/posts", newPost)

  //       formik.setFieldValue("body", "")
  //       formik.setFieldValue("post_image", null)

  //       toast({
  //         position: "top",
  //         title: "Post success",
  //         status: "success",
  //       })

  //       fetchPost()
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  // validationSchema: Yup.object({
  //   body: Yup.string().required().min(6),
  //   image_url: Yup.string().required().url(),
  // }),
  // validateOnChange: false,
  // })

  // const inputChangeHandler = ({ target }) => {
  //   const { name, value } = target

  //   formik.setFieldValue(name, value)
  // }

  const fetchPost = async () => {
    try {
      // const response = await axiosInstance.get(
      //   "/post"
      //   // {
      //   //   params: {
      //   //     _expand: "user",
      //   //     _sort: "id",
      //   //     _order: "desc",
      //   //     _limit: "2",
      //   //     _page: page,
      //   //   },
      //   // }
      // )
      // setTotalCount(response.headers["x-total-count"])
      // if (page === 1) {
      //   setPosts(response.data)
      // } else {
      //   setPosts([...posts, ...response.data])
      // }
      const response = await axiosInstance.get("/posts", {
        params: {
          _limit: 2,
          _page: page,
          _sortDir: "DESC",
        },
      })

      setTotalCount(response.data.dataCount)

      if (page === 1) {
        setPosts(response.data.data)
      } else {
        setPosts([...posts, ...response.data.data])
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

  const seeMoreBtnHandler = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchPost()
  }, [page])

  return (
    <Box mt={"12"} className="background">
      <Container maxW={"container.md"} py="4" pb={"10"}>
        {/* <HStack>
          <Input
            ref={inputFileRef}
            display={"none"}
            onChange={(event) => {
              formik.setFieldValue("post_image", event.target.files[0])
            }}
            name="post_image"
            type="file"
            accept="image/*"
          />
          <Button
            onClick={() => {
              inputFileRef.current.click()
            }}
            width="100%"
          >
            {formik?.values?.post_image?.name || "Upload Image"}
            status: "error", title: "Login failed", description:
            err.response.data.message,{" "}
          </Button>
          <Button
            onClick={formik.handleSubmit}
            isDisabled={formik.isSubmitting}
            colorScheme="twitter"
          >
            Post
          </Button>
        </HStack> */}

        <Stack mt={"8"} spacing="4">
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
            colorScheme={"teal"}
            width={"100%"}
            mt={"6"}
            onClick={seeMoreBtnHandler}
            id="font"
          >
            See More
          </Button>
        )}
      </Container>
    </Box>
  )
}
export default HomePage
