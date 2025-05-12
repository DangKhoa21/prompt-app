import { defineExtensionMessaging } from "@webext-core/messaging";
import { Tab } from "@/lib/types";

interface ProtocolMap {
  getActiveTab(): Promise<Tab>;
  replaceCurrentUrl(data: { url: string }): Promise<void>;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
