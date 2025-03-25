import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralContent, PersonalizationContent } from "@/features/setting";
import { User } from "@/services/user/interface";
import { Settings, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateUserProfile } from "./hooks";
import { toast } from "sonner";

const classTabTrigger =
  "w-full flex justify-start cursor-default select-none items-center gap-2 text-sm outline-none transition-colors [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const classTabItem = "w-full mt-2 ml-6";

export function Setting() {
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<User | null>(null);

  const { mutateAsync: mutateUserProfile } = useUpdateUserProfile();

  const handleDialogClose = () => {
    setOpen(false);

    if (!userData) {
      return;
    }

    const updateUserProfilePromise = mutateUserProfile(userData!);

    toast.promise(updateUserProfilePromise, {
      loading: "Updating user profile ...",
      success: "Updating user profile successfully",
      error: (e) => {
        console.error(e);
        return "Failed to update user profile";
      },
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) =>
          isOpen ? setOpen(true) : handleDialogClose()
        }
      >
        <DialogTrigger asChild>
          <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            <Settings />
            Setting
          </div>
        </DialogTrigger>
        <DialogContent className="w-[800px] max-w-[800px] h-[540px] flex flex-col">
          <DialogHeader className="h-[48px] items-center justify-center">
            <DialogTitle className="text-xl">Settings</DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="general"
            orientation="vertical"
            className="w-full flex"
          >
            <TabsList className="w-[240px] flex flex-col gap-2 h-fit py-2 justify-start items-start mr-2">
              <TabsTrigger value="general" className={classTabTrigger}>
                <Settings />
                General
              </TabsTrigger>
              <TabsTrigger value="personalization" className={classTabTrigger}>
                <UserIcon />
                Personalization
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className={classTabItem}>
              <GeneralContent />
            </TabsContent>
            <TabsContent value="personalization" className={classTabItem}>
              <PersonalizationContent
                setUserData={setUserData}
              ></PersonalizationContent>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
