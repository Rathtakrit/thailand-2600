import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { Scores, Verdict } from "../scoring";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    name: text("name").notNull(),
    image: text("image"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("users_provider_account").on(t.provider, t.providerAccountId)],
);

export const problems = pgTable("problems", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  cat: text("cat").notNull(),
  region: text("region").notNull(),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  example: boolean("example").notNull().default(false),
  createdAt: createdAt(),
});

export const solutions = pgTable("solutions", {
  id: text("id").primaryKey(),
  problemId: text("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  /** The pitch's picture, if it has one (an uploaded file). */
  imageId: text("image_id").references(() => files.id, { onDelete: "set null" }),
  /** AI judging: "none" (not asked), "pending", "done", "refused" or "failed". */
  aiStatus: text("ai_status").notNull().default("none"),
  ai: jsonb("ai").$type<Verdict>(),
  aiAt: timestamp("ai_at", { withTimezone: true }),
  createdAt: createdAt(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  solutionId: text("solution_id").notNull().references(() => solutions.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/** One row per person who liked a solution. */
export const likes = pgTable(
  "likes",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    solutionId: text("solution_id").notNull().references(() => solutions.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.solutionId] })],
);

/** One row per person who said "I see this problem too". */
export const votes = pgTable(
  "votes",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    problemId: text("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemId] })],
);

/** One person's own six scores for a solution. Each counts as one vote beside the AI judge's three. */
export const reviews = pgTable(
  "reviews",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    solutionId: text("solution_id").notNull().references(() => solutions.id, { onDelete: "cascade" }),
    scores: jsonb("scores").$type<Scores>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.solutionId] })],
);

/** Saved translations of a problem, solution (with its verdict) or comment, so each is translated once. */
export const translations = pgTable(
  "translations",
  {
    kind: text("kind").notNull(),
    refId: text("ref_id").notNull(),
    lang: text("lang").notNull(),
    data: jsonb("data").$type<Record<string, string>>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.kind, t.refId, t.lang] })],
);

/** One row per AI call a person triggers, for the daily limits. */
export const aiCalls = pgTable(
  "ai_calls",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("ai_calls_user_kind").on(t.userId, t.kind, t.createdAt)],
);

/** One uploaded picture or 3D model. The bytes live in file storage (lib/storage.ts) under the same id. */
export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("files_owner_created").on(t.ownerId, t.createdAt)],
);
