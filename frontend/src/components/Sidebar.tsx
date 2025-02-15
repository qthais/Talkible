import React from 'react'
import{
  Center,
  Tooltip,
  createStyles,
  UnstyledButton,
  Stack,
  rem
} 
from '@mantine/core'
import { useMutation } from '@apollo/client'
import { LOGOUT_USER } from '../graphql/mutations/Logout'
const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },
  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
    },
  },
}));

function Sidebar() {
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar