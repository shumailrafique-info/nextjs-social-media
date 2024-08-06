"use client";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import React, { useState } from "react";

export interface Attachement {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachements, setAttachements] = useState<Attachement[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          }
        );
      });
      setAttachements((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachements((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name == a.file.name);
          if (!uploadResult) return a;
          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        })
      );
    },
    onUploadError(e) {
      console.log(e);
      setAttachements((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  const handleStartUpload = async (files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the prev upload to finish.",
      });
      return;
    }
    if (attachements.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can't upload more than 5 attachemnts for one post.",
      });
      return;
    }

    startUpload(files);
  };

  const removeAttachment = (fileName: string) => {
    setAttachements((prev) => prev.filter((a) => a.file.name !== fileName));
  };

  const reset = () => {
    setAttachements([]);
    setUploadProgress(undefined);
  };

  return {
    startUpload: handleStartUpload,
    attachements,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
};

export default useMediaUpload;
