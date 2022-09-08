import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { BsThreeDots } from "react-icons/bs"
import { useSelector } from "react-redux"
import Comment from "../component/Comment"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Post = ({ username, body, image_url, userId, onDelete, postId }) => {
  const [comments, setComments] = useState([])

  const authSelector = useSelector((state) => state.auth)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const confirmDeleteBtnHandler = () => {
    onClose()
    onDelete()
  }

  const fecthComments = async () => {
    try {
      const response = await axiosInstance.get("/comments", {
        params: {
          postId,
          _expand: "user",
        },
      })

      setComments(response.data)
    } catch (error) {
      console.log()
    }
  }

  const renderComments = () => {
    return comments.map((val) => {
      return <Comment username={val.user.username} text={val.text} />
    })
  }

  useEffect(() => {
    fecthComments()
  })

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        let newComment = {
          text: values.comment,
          userId: authSelector.id,
          postId: postId,
        }

        await axiosInstance.post("/comments", newComment)
        fecthComments()
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <>
      <Box
        borderColor={"gray.300"}
        borderWidth="1px"
        p={"6"}
        borderRadius={"8px"}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontSize="sm" fontWeight="extrabold">
            <Link to={`/profile/${username}`}>{username || "Username"}</Link>
          </Text>
          {authSelector.id === userId ? (
            <Menu>
              <MenuButton>
                <Icon as={BsThreeDots} boxSize="20px" />
              </MenuButton>
              <MenuList>
                <MenuItem>Edit</MenuItem>
                <MenuItem onClick={onOpen}>Delete</MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </HStack>
        <Text>
          {body ||
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architectovoluptas animi quis dolore officia quia quisquam sint quas ab dicta ut mollitia laboriosam sit officiis non, voluptatem nisi facere rem."}
        </Text>
        <Image
          borderRadius="4px"
          height="200px"
          width="100%"
          objectFit="cover"
          mt="4"
          src={
            image_url ||
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80"
          }
        />
        <Text fontWeight={"bold"} fontSize={"sm"} mt="4">
          Comments
        </Text>
        <Stack>{renderComments()}</Stack>
        <form onSubmit={formik.handleSubmit}>
          <HStack mt={"3"}>
            <Input
              onChange={({ target }) =>
                formik.setFieldValue(target.name, target.value)
              }
              value={formik.values.comment}
              type={"text"}
              name="comment"
              size={"sm"}
            />
            <Button colorScheme={"facebook"} size="sm" type="submit" p="4">
              Post Comment
            </Button>
          </HStack>
        </form>
      </Box>

      <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteBtnHandler}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Post
