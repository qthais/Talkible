
import { Flex } from '@mantine/core'
import AuthOverlay from '../components/AuthOverlay'
import ProfileSetting from '../components/ProfileSetting'
import ProtectRoutes from '../components/ProtectRoutes'
import RoomList from '../components/RoomList'
import Sidebar from '../components/Sidebar'
import MainLayout from '../layouts/MainLayout'
import AddChatroom from '../components/AddChatroom'
import { Outlet } from 'react-router-dom'
import { useGeneralStore } from '../stores/generalStore'
function Home() {
  const chatroomId = useGeneralStore((state) => state.chatroomId); // 
  return (
    <MainLayout>
      <>
        <AuthOverlay />
        <ProfileSetting/>
        <Sidebar />
        <ProtectRoutes>
          <AddChatroom chatroomId={chatroomId!}/>
          <Flex direction={{base:"column",md:"row"}} w={"100vw"}>
          <RoomList/>
          <Outlet/>
          </Flex>
        </ProtectRoutes>
      </>
    </MainLayout>
  )
}

export default Home