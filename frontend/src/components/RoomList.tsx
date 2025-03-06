import React, { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { useMediaQuery } from '@mantine/hooks';
import { useUserStore } from '../stores/userStore'
import { useMutation, useQuery } from '@apollo/client'
import { GetChatroomForUserQuery } from '../gql/graphql'
import { GET_CHATROOMS_FOR_USER } from '../graphql/queries/getChatroomsForUser'
import { useNavigate, useParams } from 'react-router-dom';
import { DELETE_CHATROOM } from '../graphql/mutations/deleteChatroom';
import { Button, Card, Flex, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
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
        </Flex>
      </Card>
    </Flex>
  )
}

export default RoomList