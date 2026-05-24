import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import useThemeColors from "../../hooks/useThemeColors";

const Signup = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();
  const { login } = ChatState();
  const c = useThemeColors();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const inputProps = {
    bg: c.inputBg, border: "1px solid", borderColor: c.inputBorder, color: c.textPrimary,
    _placeholder: { color: c.placeholderColor }, _hover: { borderColor: c.textSecondary },
    _focus: { borderColor: c.textPrimary, boxShadow: `0 0 0 1px ${c.textPrimary}` }, borderRadius: "md",
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({ title: "Please Fill all the Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({ title: "Passwords Do Not Match", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setPicLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/user", { name, email, password, pic }, {
        headers: { "Content-type": "application/json" },
      });
      toast({ title: "Registration Successful", status: "success", duration: 3000, isClosable: true, position: "bottom" });
      login(data);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response?.data?.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({ title: "Please Select an Image!", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", { method: "post", body: data })
        .then((res) => res.json())
        .then((data) => { setPic(data.url.toString()); setPicLoading(false); })
        .catch(() => setPicLoading(false));
    } else {
      toast({ title: "Please Select an Image!", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="first-name" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Name</FormLabel>
        <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} {...inputProps} />
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Email Address</FormLabel>
        <Input type="email" placeholder="Enter Your Email Address" onChange={(e) => setEmail(e.target.value)} {...inputProps} />
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Password</FormLabel>
        <InputGroup size="md">
          <Input type={show ? "text" : "password"} placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)} {...inputProps} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}
              bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }} fontSize="xs">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input type={show ? "text" : "password"} placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)} {...inputProps} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}
              bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }} fontSize="xs">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel color={c.labelColor} fontWeight="500">Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}
          bg={c.inputBg} border="1px solid" borderColor={c.inputBorder} color={c.textSecondary} borderRadius="md" />
      </FormControl>
      <Button width="100%" mt={4} onClick={submitHandler} isLoading={picLoading}
        bg={c.btnBg} color={c.btnColor} _hover={{ bg: c.btnHover }} borderRadius="md" fontWeight="600">
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
