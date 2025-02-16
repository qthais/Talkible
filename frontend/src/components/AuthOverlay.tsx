import React from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { Modal } from '@mantine/core'

function AuthOverlay() {
  const isLoginModalOpen=useGeneralStore((state)=>state.isLoginModalOpen)
  const toggleLoginModal=useGeneralStore((state)=>state.toggleLoginModal)
  return (
    <Modal centered opened={isLoginModalOpen} onClose={toggleLoginModal} >
      AuthOverLay
    </Modal>
  )
}

export default AuthOverlay