import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

type TProps = {
  title?: string
  content: React.ReactNode
  open: boolean
  onClose: () => void
}

export default function GlobalDialog({ title, content, open, onClose }: TProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {title ? (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      ) : null}
      <DialogContent>
        <div>{content}</div>
      </DialogContent>
    </Dialog>
  )
}
