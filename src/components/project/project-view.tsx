"use client";
import type { fragments } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Suspense, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ProjectHeader } from "../messages/message-header";
import { MessageContainer } from "../messages/message-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { FragmentView } from "../fragments/fragment-view";
import { FileExplorer } from "../fragments/file-explorer";

type Fragment = InferSelectModel<typeof fragments>;

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex min-h-0 flex-col"
        >
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<p>Loading...</p>}>
            <MessageContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-8 rounded-md border p-0">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="h-full">
              {activeFragment && <FragmentView data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="h-full min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
