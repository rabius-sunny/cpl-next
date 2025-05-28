import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type ModalWrapperProps = {
    children: React.ReactNode
    trigger?: string | React.ReactNode
    onOpen?: () => void
    open?: boolean
    className?: string
    title?: string

}


export default function ModalWrapper({ children, title, trigger, onOpen, open = false }: ModalWrapperProps) {
    return (
        <Dialog open={open} onOpenChange={onOpen}>
            {/* {trigger && <DialogTrigger className="bg-white px-6 py-2 rounded-lg text-gray-800 text-lg">{trigger}</DialogTrigger>} */}
            <DialogContent className="w-full lg:w-2/3 sm:max-w-7xl max-h-[calc(100vh-4rem)] overflow-y-scroll">
                <DialogTitle>{title}</DialogTitle>
                <div className="relative">{children}</div>
            </DialogContent>
        </Dialog>
    )
}
