"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userData } from "@/lib/types";
import { editUserProfileSchema, editUserProfileType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditProfileMutation } from "./mutations";
import { Textarea } from "@/components/ui/textarea";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import CropImageDialog from "@/app/_components/crop-image-dialog";
import Resizer from "react-image-file-resizer";

interface Props {
  user: userData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ open, onOpenChange, user }: Props) => {
  const form = useForm<editUserProfileType>({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const [croppedImage, setCroppedImage] = useState<Blob | null>();

  const mutaion = useEditProfileMutation();

  async function onSubmit(values: editUserProfileType) {
    const newAvatar = croppedImage
      ? new File([croppedImage], `avatar_${user.id}.webp`)
      : undefined;
    mutaion.mutate(
      { values, avatar: newAvatar },
      {
        onSuccess: () => {
          setCroppedImage(null);
          onOpenChange(false);
        },
      }
    );
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="w-full text-center text-2xl">
              Edit profile
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 w-full">
            <div className="mb-2 space-y-2">
              <Label>Avatar</Label>
              <AvatarInput
                src={
                  croppedImage
                    ? URL.createObjectURL(croppedImage)
                    : user.avatarUrl || ""
                }
                onImageCropped={setCroppedImage}
              />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">
                        Display Name*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Display Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">
                        Bio*
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write about yourself..."
                          className="max-h-[110px] min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={mutaion.isPending}
                    loadingText="Saving"
                    type="submit"
                    disabled={mutaion.isPending}
                    variant={"default"}
                  >
                    Save chages
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileDialog;

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blog: Blob | null) => void;
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelect = (image: File | undefined) => {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file"
    );
    //CropImage
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelect(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        type="button"
        className="group relative block"
      >
        {src ? (
          <Image
            src={src}
            alt={"User Avatar"}
            width={150}
            className="mx-auto size-32 overflow-hidden rounded-full"
            height={150}
          />
        ) : (
          <div className="mx-auto flex size-[128px] items-center justify-center rounded-full border border-[black]/40 dark:border-primary/20">
            <User className="shrink-0" size={80} />
          </div>
        )}
        <span className="absolute bottom-[2px] right-[2px] m-auto flex size-9 items-center justify-center rounded-full bg-black bg-opacity-40 text-white transition duration-200 group-hover:bg-opacity-25">
          <Camera size={18} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          onCropped={onImageCropped}
          cropAspectRatio={1}
        />
      )}
    </>
  );
};
