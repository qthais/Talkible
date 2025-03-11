import React from 'react'
import { Message } from '../gql/graphql'
import { Avatar, Flex, Image, Paper, Text, useMantineTheme } from '@mantine/core'
interface MessageProps{
  message:Message
  currentUserId:number
}

const MessageBubble:React.FC<MessageProps>=({message,currentUserId})=>{
  const theme=useMantineTheme()
  if (message.systemMessage) {
    return (
      <Flex justify={"center"} align={"center"} my={10}>
        <Text color="gray" italic>
          {message.content}
        </Text>
      </Flex>
    );
  }
  if(!message?.user?.id) return null
  const isSentBycurrentUser=message.user.id===currentUserId
  return(
    <Flex
    justify={isSentBycurrentUser?'flex-end':'flex-start'}
    align={'center'}
    m={'md'}
    mb={10}
    >
      {!isSentBycurrentUser&&(
        <Avatar
        radius={'xl'}
        src={message.user.avatarUrl||null}
        alt={message.user.fullname}
        />
      )}
      <Flex maw={'70%'} direction={'column'} justify={'center'} align={'center'}>
        <Paper
        p={'md'}
        style={{
          marginLeft:isSentBycurrentUser?0:10,
          marginRight:isSentBycurrentUser?10:0,
          backgroundColor:isSentBycurrentUser?theme.colors.blue[6]:'#f1f1f1',
          color:isSentBycurrentUser?'#fff':'inherit',
          borderRadius:10
        }}
        >
          {message.content}
          {message.imageUrl&&(
            <Image
            my={10}
            width={250}
            height={250}
            fit='cover'
            src={import.meta.env.VITE_BASE_URL+message.imageUrl}
            />
          )}
          <Text
          style={isSentBycurrentUser?{color:'#e0e0e4'}:{color:'gray'}}
          >{new Date(message.createdAt).toLocaleString()}</Text>
        </Paper>
      </Flex>
    </Flex>
  )
}

export default MessageBubble