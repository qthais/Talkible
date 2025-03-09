import { useMutation, useQuery, useSubscription } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { EnterChatroomMutation, GetMessagesForChatroomQuery, GetUserOfChatroomQuery, LeaveChatroomMutation, LiveUsersInChatRoomSubscription, Message, SendMessageMutation, User, UserStartedTypingMutationMutation, UserStartedTypingSubscription, UserStoppedTypingMutationMutation, UserStoppedTypingSubscription } from '../gql/graphql'
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
import { Avatar, Button, Card, Divider, Flex, Image, List, ScrollArea, Text, TextInput, Tooltip } from '@mantine/core'
import OverlappingAvatar from './OverlappingAvatar'
import { GET_MESSAGES_FOR_CHATROOM } from '../graphql/queries/getMessagesForChatroom'
import MessageBubble from './MessageBubble'
import { IconMichelinBibGourmand } from '@tabler/icons-react'
import { GET_CHATROOMS_FOR_USER } from '../graphql/queries/getChatroomsForUser'
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
  const userId = useUserStore((state) => state.id)
  const {
    data: typingData,
    loading: typingLoading,
    error: typingError
  } = useSubscription<UserStartedTypingSubscription>(USER_STARTED_TYPING_SUBSCRIPTION, {
    variables: {
      chatroomId: parseInt(id!),
      userId: userId
    }
  })
  const {
    data: stoppedTypingData,
    loading: stoppedTypingLoading,
    error: stoppedTypingError
  } = useSubscription<UserStoppedTypingSubscription>(USER_STOPPED_TYPING_SUBSCRIPTION, {
    variables: {
      chatroomId: parseInt(id!),
      userId: userId
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

  const handleUserStartedTyping = async () => {
    await userStartedTypingMutation()
    if (userId && typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId])

    }
    if (userId) {
      typingTimeoutRef.current[userId] = setTimeout(async () => {
        setTypingUsers((prevUsers) => 
          prevUsers.filter(user => user.id !== userId)
        )
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
    return () => {
      handleLeave()
    }
  }, [chatroomId])
  useEffect(() => {
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, []);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const { data, loading, error } = useQuery<GetMessagesForChatroomQuery>(
    GET_MESSAGES_FOR_CHATROOM,
    {
      variables: {
        chatroomId: chatroomId
      }
    }
  )
  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    if (data?.getMessagesForChatroom) {
      console.log(data.getMessagesForChatroom)
      setMessages(data.getMessagesForChatroom)
    }
  }, [data])
  const handleSendMessage=async()=>{
    try{
      await sendMessage({
        variables:{
          chatroomId,
          content:messageContent,
          image:selectedFile
        },
        refetchQueries:[
          {
            query:GET_CHATROOMS_FOR_USER,
            variables:{
              userId
            }
          }
        ]
      })
      setMessageContent('')
      setSelectedFile(null)
    }catch(err){
      console.log(err.message)
    }
  }
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
              <Divider size={'sm'} w={'100%'} />
            </Flex>
            <ScrollArea
              viewportRef={scrollAreaRef}
              h={'70vh'}
              offsetScrollbars
              type='always'
              w={'100%'}
              p={'md'}
            >
              {loading ? (<Text italic c={'dimmed'}>Loading...</Text>) : (
                <>
                  {
                    messages?.map((msg) => {
                      console.log(msg)
                      return (
                        <MessageBubble key={msg.id} message={msg} currentUserId={userId} />
                      )
                    })
                  }
                </>
              )}
            </ScrollArea>
            <Flex
              style={
                {
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: '#f1f1f0'
                }
              }
              direction={'column'}
              bottom={0}
              align={'start'}
            >
              <Divider size={'sm'} w={'100%'} />
              <Flex
                w={'100%'}
                mx={'md'}
                my={'xs'}
                align={'center'}
                justify={'center'}
                direction={'column'}
                pos={'relative'}
                p={'sm'}
              >
                <Flex
                  pos={'absolute'}
                  bottom={50}
                  direction={'row'}
                  align={'center'}
                  bg={'#f1f1f0'}
                  style={{
                    borderRadius: 5,
                    boxShadow: '8px 8px 5px 0px #000',
                  }}
                  p={typingUsers?.length === 0 ? 0 : 'sm'}
                >
                  <Avatar.Group>
                    {typingUsers.map((user) => (
                      <Tooltip key={user.id} label={user.fullname}>
                        <Avatar
                          radius={'xl'}
                          src={user.avatarUrl ? user.avatarUrl : null}
                        />
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                  {typingUsers.length > 0 && (
                    <Text italic c='dimmed'>
                      is typing...
                    </Text>
                  )}
                </Flex>
                <Flex w={'100%'} mx={'md'} align={'center'} justify={'center'}>
                  <Flex {...getRootProps()} align={'center'} >
                    {selectedFile&&(
                      <Image
                      mr={'md'}
                      width={50}
                      height={50}
                      src={previewUrl}
                      alt='Preview'
                      radius={'md'}
                      />
                    )}
                    <Button leftIcon={(<IconMichelinBibGourmand/>)}></Button>
                    <input {...getInputProps()}/>
                  </Flex>
                  <TextInput
                  onKeyDown={handleUserStartedTyping}
                  style={{flex:0.7}}
                  value={messageContent}
                  onChange={(e)=>setMessageContent(e.currentTarget.value)}
                  placeholder='Type your message...'
                  rightSection={
                    <Button
                    onClick={handleSendMessage}
                    color='blue'
                    leftIcon={<IconMichelinBibGourmand/>}
                    >
                      
                      Send
                    </Button>
                  }
                  />

                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ) : <></>}
    </Flex>
  )
}

export default ChatWindow