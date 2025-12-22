'use client'

import { Moon, Sun } from 'lucide-react'
import * as React from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import AddFriendModal from '../chat/AddFriendModal'
import CreateNewChat from '../chat/CreateNewChat'
import DirectMessageList from '../chat/DirectMessageList'
import GroupChatList from '../chat/GroupChatList'
import NewGroupChatModal from '../chat/NewGroupChatModal'
import { Switch } from '../ui/switch'
import { useThemeStore } from '@/stores/useThemeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { NavUser } from './nav-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { isDarkMode, toggleTheme } = useThemeStore()
	const { user } = useAuthStore()
	return (
		<Sidebar variant='inset' {...props}>
			{/* Header */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							asChild
							className='bg-gradient-primary'
						>
							<a href='#'>
								<div className='flex w-full items-center px-2 justify-between'>
									<h1 className='text-xl font-semibold text-white'>
										ChatChit
									</h1>
									<div className='flex items-center gap-2'>
										<Sun className='size-4 text-white/80' />
										<Switch
											checked={isDarkMode}
											onCheckedChange={toggleTheme}
											className='data-[state=checked]:bg-background/80'
										/>
										<Moon className='size-4 text-white/80' />
									</div>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Content */}
			<SidebarContent className='beautiful-scrollbar'>
				{/* New Chat */}
				<SidebarGroup>
					<SidebarGroupContent>
						<CreateNewChat />
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Groups */}
				<SidebarGroup>
					<SidebarGroupLabel className='uppercase'>
						Groups
					</SidebarGroupLabel>

					<SidebarGroupAction
						title='New Group Chat'
						className='cursor-pointer'
					>
						<NewGroupChatModal />
					</SidebarGroupAction>
					<SidebarGroupContent>
						<GroupChatList />
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Direct Message */}
				<SidebarGroup>
					<SidebarGroupLabel className='uppercase'>
						Friends
					</SidebarGroupLabel>

					<SidebarGroupAction
						title='Add Friend'
						className='cursor-pointer'
					>
						<AddFriendModal />
					</SidebarGroupAction>
					<SidebarGroupContent>
						<DirectMessageList />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
		</Sidebar>
	)
}
