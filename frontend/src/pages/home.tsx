
import AuthOverlay from '../components/AuthOverlay'
import ProfileSetting from '../components/ProfileSetting'
import Sidebar from '../components/Sidebar'
import MainLayout from '../layouts/MainLayout'
function Home() {
  return (
    <MainLayout>
      <>
        <AuthOverlay />
        <ProfileSetting/>
        <Sidebar />
      </>
    </MainLayout>
  )
}

export default Home