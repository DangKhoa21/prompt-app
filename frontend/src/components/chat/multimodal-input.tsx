"use client";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "@/components/icons";
import useWindowSize from "@/components/use-window-size";
import { sanitizeUIMessages } from "@/lib/utils";
import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import cx from "classnames";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import type React from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
// import { PreviewAttachment } from "./preview-attachment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BetterTooltip } from "@/components/ui/tooltip";
import { usePrompt } from "@/context/prompt-context";
import { createEnhancePrompt } from "@/services/prompt";
import { useMutation } from "@tanstack/react-query";

const suggestedActions = [
  {
    title: "Help me book a flight",
    label: "from San Francisco to London",
    action: "Help me book a flight from San Francisco to London",
  },
  {
    title: "What is the status",
    label: "of flight BA142 flying tmrw?",
    action: "What is the status of flight BA142 flying tmrw?",
  },
];

interface MultimodelInputProps {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}

export function MultimodalInput({
  //chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: MultimodelInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  // Update the textarea height each time the input value get changed
  useEffect(() => {
    adjustHeight();
  }, [input]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, attachments, setAttachments, width]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const { prompt, setPrompt } = usePrompt();
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // first effect handles setting the input
  useEffect(() => {
    const { value, isSending } = prompt;
    if (value.length) {
      setInput(value);

      if (isSending) {
        // calling submitForm() here will send the current input
        setShouldSubmit(true);
      }
    }
  }, [prompt, setInput, setPrompt]);

  // second effect handles submitting after input has been updated
  useEffect(() => {
    if (shouldSubmit && input.length) {
      if (isLoading) {
        toast.error("Please wait for the model to finish its response!");
      } else {
        submitForm();
      }
      setShouldSubmit(false);
    }
  }, [input, isLoading, shouldSubmit, submitForm]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  const enhancePromptMutation = useMutation({
    mutationFn: createEnhancePrompt,
    onSuccess: (enhancedPrompt) => {
      if (enhancedPrompt) {
        setInput(enhancedPrompt);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
        toast.success("Prompt enhanced successfully!");
      }
    },
    onError: (e) => {
      try {
        const err = JSON.parse(e.message);
        toast.error(err.message);
      } catch {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  return (
    <div className="multimodal-input relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-4 w-full px-0 mx-auto md:max-w-3xl">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <Button
                  variant="ghost"
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-muted-foreground">
                    {suggestedAction.label}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )} */}

      <Textarea
        id="chat-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-auto resize-none rounded-xl !text-base bg-muted",
          className,
        )}
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            stop();
            setMessages((messages) => sanitizeUIMessages(messages));
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>

      <BetterTooltip content="Enhance Prompt">
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-20 m-0.5 dark:border-zinc-700"
          onClick={(event) => {
            event.preventDefault();
            enhancePromptMutation.mutate(input);
          }}
          variant="outline"
          disabled={
            isLoading || enhancePromptMutation.isPending || input.length === 0
          }
        >
          <Sparkle size={14} />
        </Button>
      </BetterTooltip>
    </div>
  );
}
