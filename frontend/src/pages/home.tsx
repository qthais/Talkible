
import { Flex } from '@mantine/core'
import AuthOverlay from '../components/AuthOverlay'
import ProfileSetting from '../components/ProfileSetting'
import ProtectRoutes from '../components/ProtectRoutes'
import RoomList from '../components/RoomList'
import Sidebar from '../components/Sidebar'
import MainLayout from '../layouts/MainLayout'
import AddChatroom from '../components/AddChatroom'
import JoinRoomOnWindow from '../components/JoinRoomOnWindow'
function Home() {
  return (
    <MainLayout>
      <>
        <AuthOverlay />
        <ProfileSetting/>
        <Sidebar />
        <ProtectRoutes>
          <AddChatroom/>
          <Flex direction={{base:"column",sm:"row"}} w={"100vw"}>
          <RoomList/>
          <JoinRoomOnWindow/>
          </Flex>
        </ProtectRoutes>
      </>
    </MainLayout>
  )
}

export default Home