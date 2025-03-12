import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import JoinRoomOnWindow from './components/JoinRoomOnWindow.tsx';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { AUTH_CHECK } from './graphql/queries/authCheck.ts';
import { LoadingOverlay } from '@mantine/core';
import { useGeneralStore } from './stores/generalStore.ts';
import { AuthCheckQuery } from './gql/graphql.ts';
import { useUserStore } from './stores/userStore.ts';
import { Toaster } from "react-hot-toast";
export default function App() {
    const toggleModalLogin = useGeneralStore((state) => state.toggleLoginModal);
    const setUser=useUserStore((state)=>state.setUser)
    const { data:authCheckdata, loading:authCheckLoading } = useQuery<AuthCheckQuery>(AUTH_CHECK, {
        onError:(err)=>{
            toggleModalLogin();
            setUser({
                id: undefined,
                fullname: '',
                avatarUrl: null,
                email: '',
              })
        }
    });
    useEffect(()=>{
        console.log(authCheckdata)
    },[authCheckdata])
    if(authCheckLoading){
        return(
            <LoadingOverlay visible overlayBlur={2}/>
        )
    }
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="chatrooms/:id" element={<JoinRoomOnWindow />} />
                </Route>
            </Routes>
        </BrowserRouter>
        <Toaster/>
        </>
        
    );
}
