import PromptCarousel from "@/components/details/prompt-carousel";
import PromptDetail from "@/components/details/prompt-detail";
import UserDetail from "@/components/details/user-detail";
import { MarketHeader } from "@/components/marketplace/market-header";
import { getIdFromDetailURL } from "@/lib/utils";
import { PromptCard } from "@/services/prompt/interface";
import { LoadingSpinner } from "@/components/icons";
import { Suspense } from "react";
import PromptCarousels from "@/components/details/prompt-carousels";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { promptId, creatorId } = getIdFromDetailURL(slug);

  const prompts: PromptCard[] = [
    {
      id: "1a2b3c4d",
      title: "Welcome Message Template",
      description: "A friendly welcome message for new users.",
      stringTemplate: "Hello {{username}}, welcome to our platform!",
      creatorId: "user001",
      createdAt: new Date("2024-11-01T10:00:00Z"),
      updatedAt: new Date("2024-11-02T08:30:00Z"),
      creator: {
        id: "user001",
        username: "alice",
      },
      hasStarred: true,
      starCount: 12,
    },
    {
      id: "2b3c4d5e",
      title: "Password Reset Notification",
      description: "Template for sending password reset emails.",
      stringTemplate:
        "Hi {{username}}, click here to reset your password: {{reset_link}}",
      creatorId: "user002",
      createdAt: new Date("2024-11-05T14:45:00Z"),
      updatedAt: new Date("2024-11-06T12:10:00Z"),
      creator: {
        id: "user002",
        username: "bob",
      },
      hasStarred: false,
      starCount: 5,
    },
    {
      id: "3c4d5e6f",
      title: "Order Confirmation",
      description: "Template for confirming a user's order.",
      stringTemplate:
        "Thank you {{username}}! Your order #{{order_id}} has been confirmed.",
      creatorId: "user001",
      createdAt: new Date("2024-11-10T09:15:00Z"),
      updatedAt: new Date("2024-11-10T10:00:00Z"),
      creator: {
        id: "user001",
        username: "alice",
      },
      hasStarred: true,
      starCount: 20,
    },
    {
      id: "4d5e6f7g",
      title: "Shipping Notification",
      description: "Notify users when their order is shipped.",
      stringTemplate:
        "Your order #{{order_id}} has been shipped. Track here: {{tracking_link}}",
      creatorId: "user003",
      createdAt: new Date("2024-11-12T11:20:00Z"),
      updatedAt: new Date("2024-11-13T15:00:00Z"),
      creator: {
        id: "user003",
        username: "charlie",
      },
      hasStarred: false,
      starCount: 8,
    },
    {
      id: "5e6f7g8h",
      title: "Account Deletion Confirmation",
      description: "Confirmation message for account deletion.",
      stringTemplate:
        "Hi {{username}}, your account has been successfully deleted.",
      creatorId: "user002",
      createdAt: new Date("2024-11-15T16:00:00Z"),
      updatedAt: new Date("2024-11-16T10:30:00Z"),
      creator: {
        id: "user002",
        username: "bob",
      },
      hasStarred: true,
      starCount: 10,
    },
    {
      id: "6f7g8h9i",
      title: "Subscription Renewal Reminder",
      description: "Reminder for users to renew subscriptions.",
      stringTemplate:
        "Hi {{username}}, your subscription will expire on {{expiry_date}}. Renew now!",
      creatorId: "user004",
      createdAt: new Date("2024-11-18T13:00:00Z"),
      updatedAt: new Date("2024-11-19T09:20:00Z"),
      creator: {
        id: "user004",
        username: "diana",
      },
      hasStarred: false,
      starCount: 6,
    },
    {
      id: "7g8h9i0j",
      title: "Feedback Request",
      description: "Request feedback from users post-purchase.",
      stringTemplate:
        "Hi {{username}}, we'd love to hear your feedback on your recent purchase!",
      creatorId: "user001",
      createdAt: new Date("2024-11-20T08:40:00Z"),
      updatedAt: new Date("2024-11-21T10:10:00Z"),
      creator: {
        id: "user001",
        username: "alice",
      },
      hasStarred: true,
      starCount: 17,
    },
    {
      id: "8h9i0j1k",
      title: "Trial Ending Soon",
      description: "Notify users about trial expiration.",
      stringTemplate:
        "Hi {{username}}, your free trial ends in {{days_left}} days. Upgrade now!",
      creatorId: "user003",
      createdAt: new Date("2024-11-22T17:30:00Z"),
      updatedAt: new Date("2024-11-23T14:00:00Z"),
      creator: {
        id: "user003",
        username: "charlie",
      },
      hasStarred: false,
      starCount: 4,
    },
    {
      id: "9i0j1k2l",
      title: "Invoice Available",
      description: "Inform users about new invoices.",
      stringTemplate:
        "Dear {{username}}, your invoice for {{month}} is now available. View it here: {{invoice_link}}",
      creatorId: "user004",
      createdAt: new Date("2024-11-24T12:25:00Z"),
      updatedAt: new Date("2024-11-25T09:00:00Z"),
      creator: {
        id: "user004",
        username: "diana",
      },
      hasStarred: false,
      starCount: 9,
    },
    {
      id: "0j1k2l3m",
      title: "Promotional Offer",
      description: "Promotional message with discount details.",
      stringTemplate:
        "Hey {{username}}, enjoy {{discount_percentage}} off your next order! Use code {{promo_code}}.",
      creatorId: "user002",
      createdAt: new Date("2024-11-26T18:45:00Z"),
      updatedAt: new Date("2024-11-27T11:15:00Z"),
      creator: {
        id: "user002",
        username: "bob",
      },
      hasStarred: true,
      starCount: 13,
    },
  ];

  return (
    <>
      <MarketHeader></MarketHeader>
      <div className="flex flex-col gap-12 p-1 md:p-4">
        <div className="flex gap-2 flex-col lg:flex-row">
          <PromptDetail
            promptId={promptId}
            className="md:basis-2/3"
          ></PromptDetail>
          <UserDetail userId={creatorId} className="md:basis-1/3"></UserDetail>
        </div>
        <PromptCarousel
          label="Related prompts"
          prompts={shuffleArray(prompts)}
        ></PromptCarousel>
        <PromptCarousel
          label="Same authur"
          prompts={shuffleArray(prompts)}
        ></PromptCarousel>
        <PromptCarousel
          label="Top sellings"
          prompts={shuffleArray(prompts)}
        ></PromptCarousel>
        <PromptCarousel
          label="Maybe you will like"
          prompts={shuffleArray(prompts)}
        ></PromptCarousel>
      </div>
      {/* <div className="flex-1 bg-background"> */}
      {/**/}
      {/*   <div className="max-w-6xl mx-auto"> */}
      {/*     <Suspense fallback={<LoadingSpinner />}> */}
      {/*       <PromptCarousels promptId={promptId} /> */}
      {/*     </Suspense> */}
      {/*   </div> */}
      {/* </div> */}
    </>
  );
}
