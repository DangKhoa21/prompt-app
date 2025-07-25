import { appConfig } from "@/config/app.config";
import { motion } from "framer-motion";
import Link from "next/link";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-xs sm:max-w-xl md:max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-1 md:p-6 flex flex-col gap-8 leading-relaxed text-center">
        <p>
          Hello! Welcome to{" "}
          <Link className="font-semibold underline underline-offset-4" href="/">
            PromptApp
          </Link>{" "}
          - a prompt templates app built with Nest.js, Next.js and the AI SDK by
          Vercel, where you can create, share your own prompt templates and save
          your time when prompting with AI models.
        </p>
        <p>
          You can start exploring our project more by visiting our{" "}
          <Link
            className="font-semibold underline underline-offset-4"
            href={appConfig.links.github}
            target="_blank"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
