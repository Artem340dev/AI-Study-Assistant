import { ApiChatSession } from "@/services/api";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useEffect } from "react";

export type ChatSessionProps =  React.HTMLProps<HTMLDivElement> & {
    session: ApiChatSession | undefined,
    chosen: boolean
    onChoose: (session: ApiChatSession | undefined) => void
}

export const ChatSession: React.FC<ChatSessionProps> = ({
    session,
    chosen,
    onChoose
}) => {
    return (<Button
      color="primary"
      className={clsx(
        'duration-100',
        chosen && ['py-[25px] px-[16px] bg-primary shadow-md'],
        !chosen && ['py-[25px] px-[16px] bg-white shadow-md']
      )}
      onClick={() => onChoose(session)}
    >
      <span className="flex flex-row items-center gap-[6px]">
        <span className={clsx(
          "flex flex-col items-center w-auto h-auto",
          chosen && ['text-white'],
          !chosen && ['text-black'],
        )}>
            <span className="text-medium">Session #{session?.id}</span>
        </span>
      </span>
    </Button>);
}