import React from 'react'
import { User } from '../gql/graphql'
import { Avatar, Tooltip } from '@mantine/core'

function OverlappingAvatar({users}:{users:User[]}) {
  const remainingUsers=users.length>3?users.slice(3):[]
  const remainingNames=remainingUsers.map((user)=>user.fullname).join(', ')
  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Avatar.Group spacing={'xl'}>
        <>
        {users.slice(0,3).map((user)=>{
          return(
            <Tooltip key={user.id} label={user.fullname}>
              <Avatar
              src={user.avatarUrl||null}
              radius={'xl'}
              alt={user.fullname}
              />
            </Tooltip>
          )
        })}
        {users.length>3&&(
          <Tooltip label={remainingNames}>
            <Avatar size={'md'} radius={'xl'} children={`+${users.length-3}`} />
          </Tooltip>
        )}
        </>
      </Avatar.Group>
    </Tooltip.Group>
  )
}

export default OverlappingAvatar