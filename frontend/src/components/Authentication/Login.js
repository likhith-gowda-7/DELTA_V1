import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import useThemeColors from "../../hooks/useThemeColors";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { login } = ChatState();
  const c = useThemeColors();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({ title: "Please Fill all the Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/user/login", { email, password }, {
        headers: { "Content-type": "application/json" },
      });
      toast({ title: "Login Successful", status: "success", duration: 3000, isClosable: true, position: "bottom" });
      login(data);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response?.data?.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
    }
    setLoading(false);
  };

  const inputProps = {
    bg: c.inputBg, border: "1px solid", borderColor: c.inputBorder, color: c.textPrimary,
    _placeholder: { color: c.placeholderColor }, _hover: { borderColor: c.textSecondary },
    _focus: { borderColor: c.textPrimary, boxShadow: `0 0 0 1px ${c.textPrimary}` }, borderRadius: "md",
  };

  return (
    <VStack spacing="15px">
      <FormControl id="login-email" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Email Address</FormLabel>
        <Input value={email} type="email" placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)} {...inputProps} />
      </FormControl>
      <FormControl id="login-password" isRequired>
        <FormLabel color={c.labelColor} fontWeight="500">Password</FormLabel>
        <InputGroup size="md">
          <Input type={show ? "text" : "password"} placeholder="Enter password"
            value={password} onChange={(e) => setPassword(e.target.value)} {...inputProps} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}
              bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }} fontSize="xs">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button width="100%" mt={4} onClick={submitHandler} isLoading={loading}
        bg={c.btnBg} color={c.btnColor} _hover={{ bg: c.btnHover }} borderRadius="md" fontWeight="600">
        Login
      </Button>
      <Button variant="outline" width="100%" onClick={() => { setEmail("guest@example.com"); setPassword("123456"); }}
        borderColor={c.borderColor} color={c.textSecondary} _hover={{ bg: c.hoverBg }} borderRadius="md" fontWeight="500">
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
