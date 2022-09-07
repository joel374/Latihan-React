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
import { BsThreeDots } from "react-icons/bs"
import { useSelector } from "react-redux"
const Post = ({ username, body, image_url, userId }) => {
  const authSelector = useSelector((state) => state.auth)
  return (
    <Box
      borderColor={"gray.300"}
      borderWidth="1px"
      p={"6"}
      borderRadius={"8px"}
    >
      <HStack justifyContent={"space-between"}>
        <Text fontSize={"sm"} fontWeight="bold">
          {username || "Username"}
        </Text>
        {/*  */}
        {authSelector.id === userId ? (
          <Menu>
            <MenuButton>
              <Icon as={BsThreeDots} boxSize="20px" />
            </MenuButton>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        ) : null}
        {/*  */}
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
      ></Image>
    </Box>
  )
}

export default Post
