import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    messages: [],
    users : [],
    selectedUser :null,
    isUsersLoading:false,
    isMessageLoading:false,


    getUsers: async () => {
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading:false});
        }
    },

    getMessages: async (userId) => {
        set({isMessageLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})

            await MessageSeen(userId);

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessageLoading:false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    listeningToMessage: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(data) => {
            set({
                messages: [...get().messages,data]
            })
        })

        socket.on("messageSeen",() => {
            const updatedMessages = get().messages.map(msg => {
                return msg.senderId === useAuthStore.getState().authUser._id ? {...msg,isSeen:true}: msg;
            })
            set({messages:updatedMessages})
        })

    },

    unListeningToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageSeen")
    },

    setSelectedUser: async (selectedUser) => {
        set({selectedUser})
        console.log(selectedUser);
    },

    markSeen: async (userId) => {
        try {
            await axiosInstance.put(`/messages/${userId}`)
        } catch (error) {
            toast.error("something broke")
        }
    }

}))