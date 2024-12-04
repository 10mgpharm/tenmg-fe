import { 
    Modal, 
    ModalBody, 
    ModalBodyProps,
     ModalCloseButton, 
     ModalContent, 
     ModalContentProps, 
     ModalHeader, 
     ModalOverlay, 
     ModalProps 
    } from "@chakra-ui/react"
import React, { FC, PropsWithChildren } from "react";

interface ModalComponentProps extends PropsWithChildren<ModalProps> {
    isOpen: boolean;
    onClose(): void;
    title: string;
    modalContentStyle?: ModalContentProps;
    modalBodyStyle?: ModalBodyProps;
}

const ModalWrapper: FC<ModalComponentProps> = ({
    children,
    isOpen,
    onClose,
    title,
    modalContentStyle,
    modalBodyStyle,
    ...props
}): JSX.Element => {
  return (
    <Modal 
    isCentered 
    isOpen={isOpen} 
    onClose={onClose}
    blockScrollOnMount={true}
    motionPreset="scale"
    scrollBehavior={"inside"}
    {...props}
    >
        <ModalOverlay />
        <ModalContent
         {...modalContentStyle}
        >
            <ModalHeader>
                <h3 className='text-xl font-semibold'>{title}</h3>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody {...modalBodyStyle}>
                {children}
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default ModalWrapper