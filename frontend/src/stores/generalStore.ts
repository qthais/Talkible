import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GeneralState{
    isProfileSettingsModalOpen:boolean
    isLoginModalOpen:boolean
    isCreateRoomModalOpen:boolean,
    toggleProfileSettingsModal:()=>void
    toggleLoginModal:()=>void
    toggleCreateRoomModal: (chatroomId?: number | null) => void;
    closeCreateRoomModal:()=>void
    chatroomId: number | null;
}

export const useGeneralStore= create<GeneralState>()(
    persist(
        (set)=>({
            isProfileSettingsModalOpen:false,
            isLoginModalOpen:false,
            isCreateRoomModalOpen:false,
            chatroomId: null,
            toggleProfileSettingsModal:()=>{
                set((state)=>({
                    isProfileSettingsModalOpen:!state.isProfileSettingsModalOpen
                }))
            },
            toggleLoginModal:()=>{
                set((state)=>({
                    isLoginModalOpen:!state.isLoginModalOpen,
                }))
            },
            toggleCreateRoomModal:(chatroomId = null)=>{
                set((state)=>({
                    isCreateRoomModalOpen:!state.isCreateRoomModalOpen,
                    chatroomId
                }))
            },
            closeCreateRoomModal: () => {
                set(() => ({
                    isCreateRoomModalOpen: false,
                    chatroomId: null, // ✅ Reset chatroomId when closing modal
                }));
            },
        }),
        {
            name: 'general-store'
        }
    )
)

