import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex flex-col h-full items-center p-8 space-y-6">
      <div className="w-full flex items-start gap-4">
        <Skeleton className="rounded-full w-16 h-16" />
        <div className="grow h-full flex flex-col justify-between">
          <Skeleton className="h-4 w-1/4 rounded-sm" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
      <Separator />
      {/* chat messages */}
      <div className="flex-1 max-h-full overflow-y-scroll w-full">
        <div className="flex flex-col flex-auto h-full">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full justify-end">
                <div className="grid grid-cols-12 gap-y-1">
                  <div className="col-start-6 col-end-13 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative mr-2 text-sm bg-primary/10 text-black p-2 border border-border rounded-xl">
                        <Skeleton className=" w-[450px] h-[100px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative mr-2 text-sm bg-primary/10 text-black p-2 border border-border rounded-xl">
                        <Skeleton className=" w-[150px] h-[20px]" />
                      </div>
                    </div>
                  </div>

                  {/* my messages */}
                  <div className="col-start-1 col-end-8 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton className="w-[40px] h-[40px] rounded-full" />
                      </div>
                      <div className="relative ml-3 text-sm bg-background/20 p-2 border border-border rounded-xl">
                        <Skeleton className=" w-[150px] h-[20px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative mr-2 text-sm bg-primary/10 text-black p-2 border border-border rounded-xl">
                        <Skeleton className=" w-[70px] h-[20px]" />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 rounded-lg">
                    <div className="flex flex-row items-end">
                      <div className="relative h-10 w-10">
                        <Skeleton className="w-[40px] h-[40px] rounded-full" />
                      </div>
                      <div className="relative ml-3 text-sm bg-background/20 p-2 border border-border rounded-xl">
                        <Skeleton className=" w-[350px] h-[120px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Skeleton className="w-full h-20" />
    </div>
  );
};

export default loading;
