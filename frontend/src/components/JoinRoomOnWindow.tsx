import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatWindow from './ChatWindow'
import { Flex, Text } from '@mantine/core'

function JoinRoomOnWindow() {
    const {id}=useParams<{id:string}>()
    const [content,setContent]=useState<string|React.ReactNode>('')
    useEffect(()=>{
        if(!id){
            setContent('Please choose a room')
        }else{
            setContent(<ChatWindow id={id}/>)
        }
    },[setContent,id])
  return (
    <Flex w={'100%'} h={'100vh'} align={'center'} justify={'center'}>
        <Text size={!id?'xl':''}>{content}</Text>
    </Flex>
  )
}

export default JoinRoomOnWindow