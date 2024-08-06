import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  src: string;
  cropAspectRatio: number;
  onCropped: (blog: Blob | null) => void;
  onClose: () => void;
}

const CropImageDialog = ({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: Props) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blog) => onCropped(blog), "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="w-full text-center text-xl">
            Crop image
          </DialogTitle>
        </DialogHeader>
        <Cropper
          ref={cropperRef}
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          className="mx-auto size-fit w-full max-w-[300px] sm:max-w-[400px]"
        />
        <DialogFooter className="gap-2">
          <Button variant={"outline"} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={"default"} onClick={crop}>
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
