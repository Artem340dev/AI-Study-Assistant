import React, { useMemo } from 'react'
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'
import { FileType } from '@/types/data.types'
import { Button, Chip } from '@nextui-org/react'
import clsx from 'clsx'

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

const fileTypes = {
  document: 'Docs', 
  pdf: 'PDF',
  image: 'Images',
  audio: 'MP3/Audio',
  video: 'MP4/Video'
}
  
export type SearchFiltersProps = {
  appliedFilters: FileType[]
  applyFilter: (filter: FileType) => void
  removeFilter: (filter: FileType) => void
  onFormSubmit: React.FormEventHandler<HTMLFormElement>
}
  
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  appliedFilters,
  applyFilter,
  removeFilter,
  onFormSubmit
}) => {
  const changeFilter = (filter: string) => {
    if (appliedFilters.find(obj => obj === filter)) {
      removeFilter(filter as FileType);
    } else {
      applyFilter(filter as FileType);
    }
  }
  
  return (
    <form
      className='flex flex-row items-center space-x-4'
      onSubmit={onFormSubmit}
    >
      {
        Object.entries(fileTypes).map(([type, name]) => {
          const IconComponent = iconMap[type as keyof typeof iconMap];
          let isApplied = appliedFilters.find(filter => filter === type);
    
          return (<Button
            color="primary"
            className={clsx(
              'duration-100',
              isApplied && ['py-[20px] px-[16px] bg-primary shadow-md'],
              !isApplied && ['py-[20px] px-[16px] bg-white shadow-md']
            )}
            type='submit'
            onClick={() => changeFilter(type)}
          >
            <span className="flex flex-row items-center gap-[6px]">
              <IconComponent className={clsx(
                isApplied && ['fill-white'],
                !isApplied && ['fill-primary'],
              )} />
              <span className={clsx(
                "flex items-center justify-center text-foreground text-medium w-auto h-[24px]",
                isApplied && ['text-white'],
                !isApplied && ['text-black'],
              )}>
                {name}
              </span>
            </span>
          </Button>)
        })
      }
    </form>
  )
}