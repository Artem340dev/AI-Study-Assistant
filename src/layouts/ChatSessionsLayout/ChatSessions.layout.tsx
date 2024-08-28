import clsx from 'clsx'
import React from 'react'

export type ChatSessionsLayoutProps = React.HTMLProps<HTMLDivElement> & {
}

export const ChatSessionsLayout: React.FC<ChatSessionsLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={clsx('w-[20%] h-screen bg-[#EEEEEE] overflow-hidden', className)} {...props}>
      <div
        className={clsx('w-full h-full container mx-auto flex flex-col', className)}
      >
        <div className="flex-grow flex-shrink-0 pt-[40px] overflow-hidden flex flex-col">
          <div className="mt-1"></div>
          <div className="overflow-auto overflow-x-hidden flex-grow h-0 ps-4 pe-4">
            <div className='w-full flex flex-col gap-4'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
