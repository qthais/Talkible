import React, { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { useMediaQuery } from '@mantine/hooks';
import { useUserStore } from '../stores/userStore'
import { useMutation, useQuery } from '@apollo/client'
import { GetChatroomForUserQuery } from '../gql/graphql'
import { GET_CHATROOMS_FOR_USER } from '../graphql/queries/getChatroomsForUser'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DELETE_CHATROOM } from '../graphql/mutations/deleteChatroom';
import { Button, Card, Flex, Group, Loader, ScrollArea, Text } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import OverlappingAvatar from './OverlappingAvatar';
function RoomList() {
  const toggleCreateRoomModal = useGeneralStore((state) => state.toggleCreateRoomModal)
  const userId = useUserStore((state) => state.id)
  const navigate = useNavigate()
  const [activeRoomId, setActiveRoomId] = useState<number | null>(parseInt(useParams<{ id: string }>().id || "0"))
  const isSmallDevice = useMediaQuery("(max-width:768px")
  const defaultTextStyle: React.CSSProperties = {
    textOverflow: isSmallDevice ? 'unset' : 'ellipsis',
    whiteSpace: isSmallDevice ? 'unset' : 'nowrap',
    overflow: isSmallDevice ? 'unset' : 'hidden'
  }
  const defaultFlexStyle: React.CSSProperties = {
    maxWidth: isSmallDevice ? 'unset' : '200px'
  }
  const { data, loading, error } = useQuery<GetChatroomForUserQuery>(
    GET_CHATROOMS_FOR_USER,
    {
      variables: {
        userId: userId
      }
    })
  const [deleteChatroom] = useMutation(DELETE_CHATROOM, {
    variables: {
      chatroomId: activeRoomId
    },
    refetchQueries: [
      {
        query: GET_CHATROOMS_FOR_USER,
        variables: {
          userId: userId
        }
      }
    ],
    onCompleted: (data) => {
      navigate('/')
    }
  })
  return (
    <Flex
      direction={"row"}
      w={isSmallDevice ? "calc(100%-100px)" : "550px"}
      h={"100vh"}
      ml={"100px"}
    >
      <Card shadow='md' w={"100%"} p={0}>
        <Flex direction={'column'} align={'start'} w={'100%'}>
          <Group position='apart' w={'100%'} style={{ width: "100%" }} mb={'md'} mt={'md'}>
            <Button onClick={toggleCreateRoomModal} variant='light' leftIcon={<IconPlus />}>
              Create a room
            </Button>
          </Group>
          <ScrollArea h={'83vh'} w={'100%'}>
            <Flex direction={'column'}>
              <Flex justify={'center'} align={'center'} h={'100%'} mih={'75px'}>
                {
                  loading && (
                    <Flex align={'center'}>
                      <Loader mr={'md'} />
                      <Text c={'dimmed'} italic>
                        Loading...
                      </Text>
                    </Flex>

                  )
                }
              </Flex>
              {
                data?.getChatroomsForUser.map((chatroom) => (
                  <Link
                    style={
                      {
                        transition: 'background-color 0.3s',
                        cursor: 'pointer'
                      }
                    }
                    to={`/chatrooms/${chatroom.id}`}
                    key={chatroom.id}
                    onClick={() => setActiveRoomId(parseInt(chatroom.id || '0'))}
                  >
                    <Card
                      style={
                        activeRoomId === parseInt(chatroom.id || '0')
                          ? { backgroundColor: '#f0f1f1' }
                          : undefined
                      }
                      mih={120}
                      py={'md'}
                      withBorder
                      shadow='md'
                    >
                      <Flex justify={'space-around'}>
                        {chatroom.users && (
                          <Flex align={'center'}>
                            <OverlappingAvatar users={chatroom.users} />
                          </Flex>
                        )}
                        {chatroom.messages && chatroom.messages.length > 0 ? (
                          <Flex
                            style={defaultFlexStyle}
                            direction={'column'}
                            align={'start'}
                            w={'100%'}
                            h={'100%'}
                          >
                            <Flex w={'100%'} h={'100%'} align={'end'} justify={'end'}>
                              <Button
                                p={0}
                                variant='light'
                                color='red'
                                onClick={() => deleteChatroom()}
                              >
                                <IconX />
                              </Button>
                            </Flex>
                            <Flex
                              direction={'column'}

                            >
                              <Text size={'lg'} style={defaultTextStyle}>{chatroom.name}</Text>
                              <Text style={defaultTextStyle}>{chatroom.messages[0].content}</Text>
                              <Text c={'dimmed'} style={defaultTextStyle}>{new Date(chatroom.messages[0].createdAt).toLocaleString()}</Text>
                            </Flex>
                          </Flex>
                        ) : (
                          <Flex align={'center'} justify={'center'}>
                            <Text italic c={'dimmed'}>
                              No Messages
                            </Text>
                          </Flex>
                        )
                        }
                      </Flex>
                    </Card>
                  </Link>
                ))
              }
            </Flex>
          </ScrollArea>
        </Flex>
      </Card>
    </Flex>
  )
}

export default RoomList