import { create } from 'zustand'

interface Todo {
    id: number
    text: string
    completed: boolean
}

interface TodoStore {
    todos: Todo[]
    loading: boolean
    error: string | null
    addTodo: (text: string) => Promise<void>
    toggleTodo: (id: number) => Promise<void>
    deleteTodo: (id: number) => Promise<void>
}

export const useTodoStore = create<TodoStore>()((set) => ({
    todos: [],
    loading: false,
    error: null,

    addTodo: async (text: string) => {
        set({ loading: true, error: null })
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            const newTodo: Todo = {
                id: Date.now(),
                text,
                completed: false,
            }
            set((state) => ({
                todos: [...state.todos, newTodo],
                loading: false,
            }))
        } catch (error) {
            set({ error: 'Failed to add todo', loading: false })
        }
    },

    toggleTodo: async (id: number) => {
        set({ loading: true, error: null })
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            set((state) => ({
                todos: state.todos.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
                loading: false,
            }))
        } catch (error) {
            set({ error: 'Failed to toggle todo', loading: false })
        }
    },

    deleteTodo: async (id: number) => {
        set({ loading: true, error: null })
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            set((state) => ({
                todos: state.todos.filter((todo) => todo.id !== id),
                loading: false,
            }))
        } catch (error) {
            set({ error: 'Failed to delete todo', loading: false })
        }
    },
}))
