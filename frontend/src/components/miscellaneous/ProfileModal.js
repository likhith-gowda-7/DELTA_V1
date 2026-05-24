import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, IconButton, Text, Image,
} from "@chakra-ui/react";
import useThemeColors from "../../hooks/useThemeColors";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const c = useThemeColors();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}
          bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }} borderRadius="md" />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" bg={c.modalBg} border="1px solid" borderColor={c.borderColor}
          color={c.textPrimary} boxShadow="lg" borderRadius="lg">
          <ModalHeader fontSize="32px" fontWeight="700" display="flex" justifyContent="center">
            {user.name}
          </ModalHeader>
          <ModalCloseButton color={c.textSecondary} _hover={{ color: c.textPrimary }} />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name}
              border="2px solid" borderColor={c.borderColor} />
            <Text fontSize={{ base: "24px", md: "26px" }} color={c.textSecondary}>{user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} bg={c.btnBg} color={c.btnColor}
              _hover={{ bg: c.btnHover }} borderRadius="md">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
