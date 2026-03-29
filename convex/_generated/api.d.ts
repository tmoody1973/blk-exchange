/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as achievements from "../achievements.js";
import type * as articles from "../articles.js";
import type * as challenges from "../challenges.js";
import type * as claude_answerQuestion from "../claude/answerQuestion.js";
import type * as claude_generateDebrief from "../claude/generateDebrief.js";
import type * as claude_gradePortfolio from "../claude/gradePortfolio.js";
import type * as companyStates from "../companyStates.js";
import type * as crons from "../crons.js";
import type * as curriculumDebt from "../curriculumDebt.js";
import type * as eventScheduler from "../eventScheduler.js";
import type * as events from "../events.js";
import type * as glossary from "../glossary.js";
import type * as groq_classifyArticle from "../groq/classifyArticle.js";
import type * as groq_generateFictionalEvent from "../groq/generateFictionalEvent.js";
import type * as groq_marketCommentary from "../groq/marketCommentary.js";
import type * as holdings from "../holdings.js";
import type * as http from "../http.js";
import type * as leaderboards from "../leaderboards.js";
import type * as market from "../market.js";
import type * as news_firecrawl from "../news/firecrawl.js";
import type * as news_perplexity from "../news/perplexity.js";
import type * as news_scheduler from "../news/scheduler.js";
import type * as onboarding from "../onboarding.js";
import type * as players from "../players.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as sessions from "../sessions.js";
import type * as trades from "../trades.js";
import type * as vault from "../vault.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  articles: typeof articles;
  challenges: typeof challenges;
  "claude/answerQuestion": typeof claude_answerQuestion;
  "claude/generateDebrief": typeof claude_generateDebrief;
  "claude/gradePortfolio": typeof claude_gradePortfolio;
  companyStates: typeof companyStates;
  crons: typeof crons;
  curriculumDebt: typeof curriculumDebt;
  eventScheduler: typeof eventScheduler;
  events: typeof events;
  glossary: typeof glossary;
  "groq/classifyArticle": typeof groq_classifyArticle;
  "groq/generateFictionalEvent": typeof groq_generateFictionalEvent;
  "groq/marketCommentary": typeof groq_marketCommentary;
  holdings: typeof holdings;
  http: typeof http;
  leaderboards: typeof leaderboards;
  market: typeof market;
  "news/firecrawl": typeof news_firecrawl;
  "news/perplexity": typeof news_perplexity;
  "news/scheduler": typeof news_scheduler;
  onboarding: typeof onboarding;
  players: typeof players;
  seed: typeof seed;
  seedData: typeof seedData;
  sessions: typeof sessions;
  trades: typeof trades;
  vault: typeof vault;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
