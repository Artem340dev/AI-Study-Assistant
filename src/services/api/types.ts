export type ApiChatMessage = {
  role: 'assistant' | 'user'
  message: string
}

export type SavedApiChatSession = {
  id: string
  history: ApiChatMessage[]
  timestamp: Date
  file_ids: string[]
}

export type ApiChatSession = {
  id: string
  history: ApiChatMessage[]
  timestamp: Date
  file_ids: string[]

  selected?: boolean
  current?: boolean
}