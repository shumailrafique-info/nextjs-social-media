import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/(server)/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
