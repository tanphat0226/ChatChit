import type { ThemeState } from '@/types/store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			isDarkMode: false,
			toggleTheme: () => {
				const newValue = !get().isDarkMode

				set({ isDarkMode: newValue })

				if (newValue) {
					document.documentElement.classList.add('dark')
				} else {
					document.documentElement.classList.remove('dark')
				}
			},
			setTheme: (dark: boolean) => {
				set({ isDarkMode: dark })

				if (dark) {
					document.documentElement.classList.add('dark')
				} else {
					document.documentElement.classList.remove('dark')
				}
			},
		}),
		{
			name: 'theme-storage',
		}
	)
)
