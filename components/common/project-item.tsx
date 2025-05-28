import Image from 'next/image';
import { useState } from 'react';
import ProjectItemDetails from '../details/ProjectItemDetails';
import ModalWrapper from './ModalWrapper';

type TProps = {
  item: ProjectItem
}

export default function ProjectItem({ item }: TProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const onOpen = (data: ProjectItem) => {
    setSelectedProject(data);
  }
  const onClose = () => {
    setSelectedProject(null);
  }

  return (
    <>
      <div
        onClick={() => onOpen(item)}
        className='group relative flex flex-col items-center gap-3 border rounded-3xl max-w-sm aspect-square overflow-hidden cursor-pointer'
      >
        <Image
          src={item?.banner?.file || '/placeholder.webp'}
          alt='project image'
          fill
          className='grayscale-75 group-hover:grayscale-0 w-full object-cover font-title text-lg group-hover:scale-110 transition-all duration-700 ease-in-out transform'
        />
      </div>

      {selectedProject &&
        <ModalWrapper open={!!selectedProject} onOpen={onClose}>
          <ProjectItemDetails item={selectedProject} />
        </ModalWrapper>
      }
    </>

  )
}
