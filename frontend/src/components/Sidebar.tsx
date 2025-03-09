import React, { useState } from 'react'
import logo from '../assets/logo.png'
import {
  Navbar,
  Center,
  Tooltip,
  createStyles,
  UnstyledButton,
  Stack,
  rem
}
  from '@mantine/core'
import {
  IconUser,
  IconLogout,
  IconBrandWechat,
  IconLogin
} from "@tabler/icons-react"
import { useMutation } from '@apollo/client'
import { LOGOUT_USER } from '../graphql/mutations/Logout'
import { useGeneralStore } from '../stores/generalStore';
import { useUserStore } from '../stores/userStore';
const useStyles = createStyles((theme) => {
  return {
    link: {
      width: rem(50),
      height: rem(50),
      borderRadius: theme.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      },
    },
    active: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  }
})
interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles()
  return (
    <Tooltip
      label={label}
      position="top-start"
      offset={30}
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size="1.8rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const mockdata = [{ icon: IconBrandWechat, label: "Chatrooms" }]
function Sidebar() {
  const toggleProfileSettingModal = useGeneralStore((state) => state.toggleProfileSettingsModal)
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));
  const userId = useUserStore((state) => state.id)
  const user = useUserStore((state) => state)
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal)
  const setUser = useUserStore((state) => state.setUser)
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      toggleLoginModal()
    }
  })
  const handleLogout = async () => {
    await logoutUser()
    setUser({
      id: undefined,
      fullname: '',
      avatarUrl: null,
      email: '',
    })
  }
  return (
    <Navbar className='bg-gray-50' fixed zIndex={100} w={rem(100)} p={'md'} style={{ borderRadius: "15px" }}>
      <Navbar.Section>
        <Center>
            <img className='w-11 mt-5' src={logo} alt="" />
        </Center>
      </Navbar.Section>
      <Navbar.Section grow mt={50}>
        <Stack justify='center' spacing={8}>
          {userId && links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {userId && (
            <NavbarLink
              icon={IconUser}
              label={"Profile(" + user.fullname + ")"}
              onClick={toggleProfileSettingModal}
            />
          )}

          {userId ? (
            <NavbarLink
              icon={IconLogout}
              label="Logout"
              onClick={handleLogout}
            />
          ) : (
            <NavbarLink
              icon={IconLogin}
              label="Login"
              onClick={toggleLoginModal}
            />
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  )
}

export default Sidebar