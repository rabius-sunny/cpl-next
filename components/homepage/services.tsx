'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "../common";
import ModalWrapper from "../common/ModalWrapper";
import ServiceItem from "../details/ServiceItem";

type TProps = {
  data: Services | undefined
}

export default function ServiceSection({ data = {
  title: "",
  description: "",
  items: []
} }: TProps) {
  const { title, description, items } = data
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const onOpen = (data: ServiceItem) => {
    setSelectedService(data);
  }
  const onClose = () => {
    setSelectedService(null);
  }

  return (
    <section
      id="our_services"
      className={cn("relative text-white bg-accent-foreground/70 lg:py-30 py-20")}
    >
      <div className="space-y-16 mx-auto px-4 container">
        <div className="space-y-6 max-w-4xl">
          <SectionHeading title={title} />
          <p className="text-lg">{description}</p>
        </div>

        <div className="gap-6 lg:gap-20 grid grid-cols-none sm:grid-cols-3 w-full">
          {items?.map((item, index) => (
            <div key={index} className="group relative flex flex-col space-y-4 aspect-square overflow-hidden cursor-pointer" onClick={() => onOpen(item)}>
              <Image src={item?.banner?.file || '/placeholder.webp'} alt={item?.title || ''} fill className="z-0 object-cover group-hover:scale-110 transition-all duration-1000 ease-in-out" />
              <div className="z-10 flex flex-col justify-end space-y-3.5 bg-gray-950/40 p-8 sm:p-10 lg:p-12 w-full h-full">
                <h3 className="font-medium text-3xl lg:text-4xl uppercase group-hover:tracking-widest transition-all duration-1000 ease-in-out">{item?.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>


      {selectedService &&
        <ModalWrapper open={!!selectedService} onOpen={onClose}>
          <ServiceItem item={selectedService} />
        </ModalWrapper>
      }
    </section >
  )
}
