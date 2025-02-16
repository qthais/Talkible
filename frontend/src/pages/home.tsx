
import AuthOverlay from '../components/AuthOverlay'
import ProtectRoutes from '../components/ProtectRoutes'
import Sidebar from '../components/Sidebar'
import MainLayout from '../layouts/MainLayout'
function Home() {
  return (
    <MainLayout>
      <>
      <AuthOverlay/>
        <Sidebar />
        HomePage
      </>
    </MainLayout>
  )
}

export default Home