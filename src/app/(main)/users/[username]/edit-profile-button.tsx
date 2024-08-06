"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./edit-profile-dialog";

interface Props {
  user: userData;
}

const EditProfileButton = ({ user }: Props) => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => setShowPopUp((prev) => true)}
      >
        Edit Profile
      </Button>
      {showPopUp && (
        <EditProfileDialog
          user={user}
          open={showPopUp}
          onOpenChange={setShowPopUp}
        />
      )}
    </>
  );
};

export default EditProfileButton;
