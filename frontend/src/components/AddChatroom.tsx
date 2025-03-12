import { useEffect, useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { Button, Group, Modal, MultiSelect, Stepper, TextInput } from '@mantine/core'
import { useMutation, useQuery } from '@apollo/client'
import { AddUsersToChatroomMutation, Chatroom, CreateChatroomMutation, SearchUsersQuery, SendMessageMutation } from '../gql/graphql'
import { CREATE_CHATROOM } from '../graphql/mutations/createChatroom'
import { useForm } from '@mantine/form'
import { SEARCH_USER } from '../graphql/queries/SearchUser.s'
import { ADD_USERS_TO_CHATROOM } from '../graphql/mutations/AddUsersToChatroom'
import { IconPlus } from '@tabler/icons-react'
import { SEND_MESSAGE } from '../graphql/mutations/sendMessages'
import { useUserStore } from '../stores/userStore'
import { GET_CHATROOMS_FOR_USER } from '../graphql/queries/getChatroomsForUser'


function AddChatroom({ chatroomId }: { chatroomId?: number }) {
    const user=useUserStore()
    const [active, setActive] = useState(chatroomId ? 2 : 1);
    const [highestStepVisited, setHighestStepVisited] = useState(active)
    const isCreateRoomModalOpen = useGeneralStore((state) => state.isCreateRoomModalOpen)
    const toggleCreateRoomModal = useGeneralStore((state) => state.toggleCreateRoomModal)
    const closeCreateRoomModal = useGeneralStore((state) => state.closeCreateRoomModal)
    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > 2 || nextStep < 0
        if (isOutOfBounds) {
            return
        }
        setActive(nextStep)
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
    }

    const [createChatroom, { loading }] = useMutation<CreateChatroomMutation>(CREATE_CHATROOM)
    const form = useForm({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value: string) => value.trim().length >= 3 ? null : "Name must be at least 3 characters!"
        }
    })
    const [newlyCreatedChatroom, setNewlyCreatedChatroom] = useState<Chatroom | null>(null)
    const handleCreateChatroom = async () => {
        await createChatroom({
            variables: {
                name: form.values.name
            },
            onCompleted: (data) => {
                setNewlyCreatedChatroom(data.createChatroom)
                handleStepChange(active + 1)
            },
            onError: (err) => {
                console.log(err)
                form.setErrors({
                    name: err.graphQLErrors[0].extensions?.name as string,
                })
            },
            refetchQueries: ['getChatroomsForUser']
        })
    }
    const [searchTerm, setSearchTerm] = useState('')
    const [sendMessage, { data: sendMessageData }] = useMutation<SendMessageMutation>(SEND_MESSAGE)
    const { data, refetch } = useQuery<SearchUsersQuery>(SEARCH_USER, {
        variables: { fullname: searchTerm }
    })
    const [addUsersToChatroom, { data:chatroomData }] = useMutation<AddUsersToChatroomMutation>(ADD_USERS_TO_CHATROOM, {
        refetchQueries: ['getChatroomsForUser'],
    })
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const handleAddUsersToChatroom = async () => {
        await addUsersToChatroom({
            variables: {
                chatroomId: chatroomId ? chatroomId : newlyCreatedChatroom?.id ? parseInt(newlyCreatedChatroom.id) : null,
                userIds: selectedUsers.map((userId) => parseInt(userId))
            },
            onCompleted: () => {
                handleStepChange(1)
                handleSendMessage('join')
                closeCreateRoomModal()
                setSelectedUsers([])
                setNewlyCreatedChatroom(null)
                form.reset()
            },
            onError: (err) => {
                form.setErrors({
                    name: err.graphQLErrors[0].extensions?.name as string,
                })
            }
        })
    }
    const handleSendMessage = async (action: string) => {
        for(const memberId of selectedUsers){
            const userData = selectItems.find((item) => item.value == memberId);
            const username = userData ? userData.label : `User ${memberId}`;
            try {
                await sendMessage({
                    variables: {
                        chatroomId: chatroomId,
                        content: `${username} ${action} the room`,
                        systemMessage: true
                    },
                    refetchQueries: [
                        {
                            query: GET_CHATROOMS_FOR_USER,
                            variables: {
                                userId:user.id
                            }
                        }
                    ]
                })
            } catch (err) {
                console.log(err.message)
            }
        }
    }
    let debounceTimeout: NodeJS.Timeout
    const handleSearchChange = (term: string) => {
        setSearchTerm(term)
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            refetch()
        }, 300)
    }
    type SelectItem = {
        label: string
        value: string
    }
    const selectItems: SelectItem[] = data?.searchUsers?.map((user) => ({
        label: user.fullname,
        value: String(user.id)
    })) || []
    useEffect(() => {
        setActive(chatroomId ? 2 : 1);
    }, [chatroomId]);
    return (
        <Modal opened={isCreateRoomModalOpen} onClose={closeCreateRoomModal}>
            <Stepper
                active={active}
                onStepClick={setActive}
                breakpoint={'sm'}
            >
                <Stepper.Step label='First step' description='Create Chatroom'>
                    <div>Create a Chatroom</div>
                </Stepper.Step>
                <Stepper.Step label='Second step' description='Add members'>
                    <form onSubmit={form.onSubmit(() => handleCreateChatroom())}>
                        <TextInput
                            placeholder='Chatroom name'
                            label='Chatroom name'
                            error={form.errors.name}
                            {...form.getInputProps('name')}
                        />
                        <Button mt={'md'} type='submit'>Create room</Button>
                    </form>
                </Stepper.Step>
                <Stepper.Completed>
                    <MultiSelect
                        onSearchChange={(value) => { 
                            handleSearchChange(value) }}
                        nothingFound='No users found'
                        searchable
                        pb={'xl'}
                        data={selectItems}
                        label='Choose the members you want to add'
                        placeholder='Pick all the users'
                        onChange={(values) => {
                            setSelectedUsers(values)
                        }}
                    />
                </Stepper.Completed>
            </Stepper>
            <Group mt={'xl'}>
                <Button variant='default' onClick={() => handleStepChange(active - 1)}>Back</Button>
                {
                    selectedUsers.length > 0 && (
                        <Button
                            onClick={handleAddUsersToChatroom}
                            color='blue'
                            leftIcon={<IconPlus />}
                            loading={loading}
                        >
                            Add Users
                        </Button>
                    )
                }
            </Group>

        </Modal>
    )
}

export default AddChatroom