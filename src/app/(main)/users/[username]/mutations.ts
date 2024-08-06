import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editProfile } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { editUserProfileType } from "@/lib/validation";
import { PostPage } from "../../_components/for-you-posts";

export function useEditProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: editUserProfileType;
      avatar?: File;
    }) => {
      return Promise.all([
        editProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([editResponse, uploadResults]) => {
      const newAvatarUrl = uploadResults?.[0].serverData.avatarUrl || null;

      const queryFilter: QueryFilters = { queryKey: ["posts"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.userId === editResponse.data.updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...editResponse.data.updatedUser,
                      avatarUrl:
                        newAvatarUrl || editResponse.data.updatedUser.avatarUrl,
                    },
                  };
                } else {
                  return post;
                }
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({
        description: "Profile updated successfully!",
      });
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Profile edit failed. Please try again",
      });
    },
  });
  return mutation;
}
