import { useMutation, useQuery, useSubscription } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { EnterChatroomMutation, GetUserOfChatroomQuery, LeaveChatroomMutation, LiveUsersInChatRoomSubscription, SendMessageMutation, User, UserStartedTypingMutationMutation, UserStartedTypingSubscription, UserStoppedTypingMutationMutation, UserStoppedTypingSubscription } from '../gql/graphql'
import { SEND_MESSAGE } from '../graphql/mutations/sendMessages'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { USER_STARTED_TYPING_MUTATION } from '../graphql/mutations/UserStartedTyping'
import { USER_STOPPED_TYPING_MUTATION } from '../graphql/mutations/UserStoppedTyping'
import { useMediaQuery } from '@mantine/hooks'
import { ENTER_CHATROOM } from '../graphql/mutations/EnterChatroom'
import { LEAVE_CHATROOM } from '../graphql/mutations/LeaveChatroom'
import { LIVE_USERS_SUBSCRIPTION } from '../graphql/subscriptions/LiveUsers'
import { USER_STARTED_TYPING_SUBSCRIPTION } from '../graphql/subscriptions/UserStartedTypingSubscription'
import { USER_STOPPED_TYPING_SUBSCRIPTION } from '../graphql/subscriptions/UserStoppedTypingSubscription'
import { GET_USERS_OF_CHATROOM } from '../graphql/queries/GetUsersOfChatroom'
import { Avatar, Card, Divider, Flex, List, Text } from '@mantine/core'
import OverlappingAvatar from './OverlappingAvatar'
function ChatWindow() {
  const [messageContent, setMessageContent] = useState('')
  const [sendMessage, { data: sendMessageData }] = useMutation<SendMessageMutation>(SEND_MESSAGE)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      const file = acceptedFile[0]
      if (file) {
        setSelectedFile(file)
      }
    }
  })
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null
  const { id } = useParams<{ id: string }>()
  const user = useUserStore((state) => state.id)
  const {
    data: typingData,
    loading: typingLoading,
    error: typingError
  } = useSubscription<UserStartedTypingSubscription>(USER_STARTED_TYPING_SUBSCRIPTION, {
    variables: {
      chatroomId: parseInt(id!),
      userId: user.id
    }
  })
  const {
    data: stoppedTypingData,
    loading: stoppedTypingLoading,
    error: stoppedTypingError
  } = useSubscription<UserStoppedTypingSubscription>(USER_STOPPED_TYPING_SUBSCRIPTION, {
    variables: {
      chatroomId: parseInt(id!),
      userId: user.id
    }
  })
  const [userStartedTypingMutation, {
    data: dataStartedTyping,
    loading: loadingStartedTyping,
    error: errorStartedTyping
  }] = useMutation<UserStartedTypingMutationMutation>(USER_STARTED_TYPING_MUTATION, {
    onCompleted: () => {
      console.log('User started typing')
    },
    variables: {
      chatroomId: parseInt(id!)
    }
  })
  const [userStoppedTypingMutation] = useMutation<UserStoppedTypingMutationMutation>(USER_STOPPED_TYPING_MUTATION, {
    onCompleted: () => {
      console.log('User stopped typing')
    },
    variables: {
      chatroomId: parseInt(id!)
    }
  })
  const [typingUsers, setTypingUsers] = useState<User[]>([])
  useEffect(() => {
    const user = typingData?.userStartedTyping
    if (user && user.id) {
      setTypingUsers((prevUsers) => {
        if (!prevUsers.find((u) => u.id === user.id)) {
          return [...prevUsers, user]
        }
        return prevUsers
      })
    }
  }, [typingData])
  const typingTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({})
  useEffect(() => {
    const user = stoppedTypingData?.userStoppedTyping
    if (user && user.id) {
      clearTimeout(typingTimeoutRef.current[user.id])
      setTypingUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
    }
  }, [stoppedTypingData])
  const userId = useUserStore((state) => state.id)
  const handleUserStartedTyping = async () => {
    await userStartedTypingMutation()
    if (userId && typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId])

    }
    if (userId) {
      typingTimeoutRef.current[userId] = setTimeout(async () => {
        setTypingUsers((prevUsers) => {
          prevUsers.filter(user => user.id !== userId)
        })
      }, 5000)
    }
  }
  const isSmallDevice = useMediaQuery('(max-width:768px')
  const {
    data: liveUsersData,
    loading: liveUsersLoading,
    error: liveUsersError
  } = useSubscription<LiveUsersInChatRoomSubscription>(LIVE_USERS_SUBSCRIPTION, {
    variables: {
      chatroomId: parseInt(id!)
    },
    onData: (data) => {
      console.log("Live Users Data Updated:", data); // Debugging
    }
  })
  const [liveUsers, setLiveUsers] = useState<User[]>([])
  useEffect(() => {
    if (liveUsersData?.liveUsersInChatroom) {
      setLiveUsers(liveUsersData?.liveUsersInChatroom)
    }
  }, [liveUsersData])
  const [enterChatroom] = useMutation<EnterChatroomMutation>(ENTER_CHATROOM)
  const [leaveChatroom] = useMutation<LeaveChatroomMutation>(LEAVE_CHATROOM)
  const chatroomId = parseInt(id!)
  const handleEnter = async () => {
    try {
      const res = await enterChatroom({ variables: { chatroomId } })
      if (res.data?.enterChatroom) {
        console.log('Successfully entered chatroom!')
      }
    } catch (err) {
      console.log('Error entering chatroom', err)
    }
  }
  const handleLeave = async () => {
    try {
      const res = await leaveChatroom({ variables: { chatroomId } })
      if (res.data?.leaveChatroom) {
        console.log('Successfully leaving chatroom!')
      }
    } catch (err) {
      console.log('Error leaving chatroom', err)
    }
  }
  const [isUserPartOfChatroom, setIsUserPartOfChatroom] = useState<() => boolean | undefined>()
  const { data: dataUsersOfChatroom } = useQuery<GetUserOfChatroomQuery>(GET_USERS_OF_CHATROOM, {
    variables: {
      chatroomId: chatroomId
    }
  })
  useEffect(() => {
    setIsUserPartOfChatroom(() => dataUsersOfChatroom?.getUsersOfChatroom.some((u) => u.id == userId))
  }, [dataUsersOfChatroom?.getUsersOfChatroom, userId])
  useEffect(() => {
    handleEnter()
    if (liveUsersData?.liveUsersInChatroom) {
      setLiveUsers(liveUsersData.liveUsersInChatroom)
      setIsUserPartOfChatroom(() =>
        dataUsersOfChatroom?.getUsersOfChatroom.some((u) => u.id === userId)
      )
    }
    return ()=>{
      handleLeave()
    }
  }, [chatroomId])
  useEffect(() => {
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, []);
  return (
    <Flex
      justify={'center'}
      ml={isSmallDevice ? '100px' : '0'}
      w={isSmallDevice ? 'calc(100vw-100px)' : '1000px'}
      h={'100vh'}
    >
      {!liveUsersLoading && isUserPartOfChatroom ? (
        <Card withBorder shadow='md' p={0} w={'100%'}>
          <Flex direction={'column'} pos={'relative'} h={'100%'} w={'100%'}>
            <Flex direction={'column'} bg={'#f1f1f0'}>
              <Flex
                direction={'row'}
                justify={'space-around'}
                align={'center'}
                my={'sm'}
              >
                <Flex direction={'column'} align={'start'}>
                  <Text mb={'xs'} c={'dimmed'} italic>
                    Chat with
                  </Text>
                  {dataUsersOfChatroom?.getUsersOfChatroom && (
                    <OverlappingAvatar users={dataUsersOfChatroom.getUsersOfChatroom} />
                  )}
                </Flex>
                <Flex
                  direction={'column'}
                  justify={'space-around'}
                  align={'start'}
                >
                  <List w={150}>
                    <Text mb={'xs'} c={'dimmed'} italic>
                      Live users
                    </Text>
                    {liveUsersData?.liveUsersInChatroom?.map((user) => (
                      <Flex
                        key={user.id}
                        pos={'relative'}
                        w={25}
                        h={25}
                        my={'xs'}
                      >
                        <Avatar radius={'xl'} size={25} src={user.avatarUrl ? user.avatarUrl : null} />
                        <Flex
                          pos={'absolute'}
                          bottom={0}
                          right={0}
                          w={10}
                          h={10}
                          bg={'green'}
                          style={{
                            borderRadius: 10
                          }}
                        ></Flex>
                        <Text ml={'sm'}>{user.fullname}</Text>
                      </Flex>
                    ))}
                  </List>
                </Flex>
              </Flex>
              <Divider size={'sm'} w={'100%'}/>
            </Flex>
          </Flex>
        </Card>
      ) : <></>}
    </Flex>
  )
}

export default ChatWindow