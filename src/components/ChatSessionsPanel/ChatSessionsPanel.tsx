import { ApiChatSession } from "@/services/api"
import { ChatSession } from "../ChatSession/ChatSession"
import { useEffect, useMemo } from "react"
import { Divider } from "@nextui-org/react"

export type ChatSessionsPanelProps = React.HTMLProps<HTMLDivElement> & {
    saveSession: (session: ApiChatSession) => void
    sessions: ApiChatSession[]
}

export const ChatSessionsPanel: React.FC<ChatSessionsPanelProps> = ({
    sessions,
    saveSession
}) => {
    // const map: ApiChatSession[][] = useMemo(() => {
    //     return Object.values(sessions
    //         .filter(session => session.id !== sessions.find(session => session.current)?.id)
    //         .map((session) => [session.timestamp, session])
    //         .reduce((acc, [timestamp, session]: Array<Date | ApiChatSession>) => {
    //             const timestampKey = (timestamp as Date).toDateString();

    //             if (!acc[timestampKey]) {
    //                 acc[timestampKey] = [];
    //             }

    //             acc[timestampKey].push(session as ApiChatSession);
    //             return acc;
    //         }, {} as Record<string, ApiChatSession[]>));
    // }, [sessions])

    const convertSessions = (sessions: ApiChatSession[]): ApiChatSession[][] => {
        return Object.values(sessions
            .filter(session => session.id !== sessions.find(session => session.current)?.id)
            .sort((session1, session2) => session1.timestamp.getTime() - session2.timestamp.getTime())
            .map((session) => [session.timestamp, session])
            .reduce((array, [timestamp, session]: Array<Date | ApiChatSession>) => {
                const timestampKey = (timestamp as Date).toDateString();

                if (!array[timestampKey]) {
                    array[timestampKey] = [];
                }

                array[timestampKey].push(session as ApiChatSession);
                return array;
        }, {} as Record<string, ApiChatSession[]>));
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span>Current session</span>
                <ChatSession 
                    session={sessions.find(session => session.current)}
                    chosen={sessions.find(session => session.selected)?.id === sessions.find(session => session.current)?.id}
                    onChoose={(value) => {
                        let selectedSession = sessions.find(session => session.selected);
                        if (selectedSession) {
                            let newSelectedSection = selectedSession;
                            newSelectedSection.selected = false;
                            saveSession(newSelectedSection);
                        }

                        if (value) {
                            value.selected = true;
                            saveSession(value);
                        }
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                {convertSessions(sessions).map((groupedSessions: ApiChatSession[]) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <Divider />
                            <div className="flex flex-col gap-2">
                                <span>{groupedSessions[0].timestamp.toDateString()}</span>
                                {groupedSessions.map((session: ApiChatSession) => {
                                    return <ChatSession 
                                        session={session}
                                        chosen={session.id === sessions.find(session => session.selected)?.id}
                                        onChoose={(value: ApiChatSession | undefined) => {
                                            let selectedSession = sessions.find(session => session.selected);
                                            if (selectedSession) {
                                                let newSelectedSection = selectedSession;
                                                newSelectedSection.selected = false;
                                                saveSession(newSelectedSection);
                                            }
                
                                            if (value) {
                                                value.selected = true;
                                                saveSession(value);
                                            }
                                        }}
                                    />
                                })}
                            </div>
                        </div>
                    );
                })}
                {/* {sessions.filter(session => session.id !== sessions.find(session => session.current)?.id).map(session => {
                    return <ChatSession 
                        session={session}
                        chosen={session.id === sessions.find(session => session.selected)?.id}
                        onChoose={(value: ApiChatSession | undefined) => {
                            let selectedSession = sessions.find(session => session.selected);
                            if (selectedSession) {
                                let newSelectedSection = selectedSession;
                                newSelectedSection.selected = false;
                                saveSession(newSelectedSection);
                            }

                            if (value) {
                                value.selected = true;
                                saveSession(value);
                            }
                        }}
                    />
                })} */}
            </div>
        </div>
    )
}