import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageLightboxProps {
  alt: string;
  imageUrl: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const ImageLightbox = ({
  alt,
  imageUrl,
  onOpenChange,
  open,
}: ImageLightboxProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-5xl border-white/10 bg-[hsl(var(--brand-black))] p-3 sm:p-4'>
      <DialogHeader className='sr-only'>
        <DialogTitle>{alt}</DialogTitle>
      </DialogHeader>
      <img
        src={imageUrl}
        alt={alt}
        className='max-h-[82vh] w-full rounded-lg object-contain'
      />
    </DialogContent>
  </Dialog>
);
