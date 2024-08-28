import { ChatMessages } from '@/components/ChatMessages'
import { ChatSessionsPanel } from '@/components/ChatSessionsPanel'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { ChatSessionsLayout } from '@/layouts/ChatSessionsLayout'
import { useSearch } from '@/queries/useSearch'
import { ApiChatMessage, ApiChatSession, chatApi } from '@/services/api'
import { FileType } from '@/types/data.types'
import { populateDirs } from '@/utils/populateDirs.util'
import { useSearchParams } from 'next/navigation'
import { apiUtils } from '@/services/api'
import React, { useEffect, useMemo, useState } from 'react'

import { nanoid } from 'nanoid'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [appliedFilters, setAppliedFilters] = useState<FileType[]>([])
  //const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [sessions, setSessions] = useState<ApiChatSession[]>([]);
  const [generating, setGenerating] = useState(false)

  const search = useSearch(
    { query: query, filters: appliedFilters },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const fileList = useMemo(
    () => populateDirs(search.data?.files || []),
    [search.data],
  )

  const onSearch = async () => {
    search.refetch()
  }

  const applyFilter = async (filter: FileType) => {
    setAppliedFilters((appliedFilters) => [...appliedFilters, filter]);
    onSearch();
  }

  const removeFilter = async (filter: FileType) => {
    let newFilters = Array.from(appliedFilters);
    setAppliedFilters(newFilters.filter(obj => obj !== filter));
    onSearch();
  }

  const saveSession = (session: ApiChatSession) => {
    if (session.selected) setSelectedFiles(session.file_ids)
    setSessions([...sessions.filter(item => item.id !== session.id), session]);
  }

  const setMessages = (historyUpdate: ((oldHistory: ApiChatMessage[]) => ApiChatMessage[])) => {
    let newSelectedSection = sessions.find(session => session.selected);

    if (newSelectedSection !== undefined) {
      newSelectedSection.history = historyUpdate(newSelectedSection.history);
      saveSession(newSelectedSection);
    }
  }

  const onPrompt = async (prompt: string) => {
    setGenerating(true)

    setMessages((value) => [
      ...value,
      {
        role: 'user',
        message: prompt,
      },
    ])

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: sessions.find(session => session.selected)?.history,
    })

    setGenerating(false)
    setMessages((value) => [...value, message])
    setPrompt('')
  }

  useEffect(() => {
    let oldSessions: ApiChatSession[] = JSON.parse(localStorage.getItem('sessions') || '[]')
      .map((session: any): ApiChatSession => {
        session.timestamp = new Date(session.timestamp);
        return session;
      });

    console.log(JSON.stringify(oldSessions));
    
    const cSession = {
      id: Math.floor(Math.random() * 999998 + 1).toString(), 
      history: Array<ApiChatMessage>(), 
      timestamp: new Date(Date.now()),
      current: true,
      selected: true,
      file_ids: []
    }

    const updatedSessions = [...oldSessions, cSession];
    setSessions(updatedSessions);
    onSearch()
  }, [])

  useEffect(() => {
    setSelectedFiles([])
    setAppliedFilters(search?.data?.filters || []);
  }, [search.data])

  useEffect(() => {
    let selectedSession: ApiChatSession | undefined = sessions.find(session => session.selected);
    
    if (selectedSession) {
      selectedSession.file_ids = selectedFiles;
      saveSession(selectedSession);
    }
  }, [selectedFiles])

  useEffect(() => {
    const handleLeavingPage = () => {
      if (sessions) {
        localStorage.setItem('sessions', JSON.stringify(sessions.filter(session => session.history.length !== 0).map(session => apiUtils.convertDefaultChatSessionToSaved(session, selectedFiles))));   
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleLeavingPage);
    }

    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', handleLeavingPage);
        }
    };
  }, [sessions])

  return (
    <div className='flex flex-row'>
      <ChatSessionsLayout>
        <h2 className="text-xl font-semibold">Your sessions</h2>
        <ChatSessionsPanel
          sessions={sessions}
          saveSession={saveSession}
        />
      </ChatSessionsLayout>
      <ChatLayout
        messageBar={
          <MessageBar
            hide={selectedFiles.length === 0}
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={(prompt) => onPrompt(prompt)}
            loading={generating}
            disabled={generating}
          />
        }
      >
        <Search
          compact={(sessions.find(session => session.selected)?.history.length || 0) > 0}
          searching={search.isFetching}
          query={query}
          onQueryChange={(v) => setQuery(v)}
          onSearch={onSearch}
          results={fileList}
          onSelect={(selected) => setSelectedFiles(selected)}
          selectedFiles={selectedFiles}
          appliedFilters={appliedFilters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
        <ChatMessages
          className="py-[20px]"
          data={sessions.find(session => session.selected)?.history.map((msg) => ({
            role: msg.role,
            message: msg.message,
          }))}
        />
      </ChatLayout>
    </div>
  )
}
