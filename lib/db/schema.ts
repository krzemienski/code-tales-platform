import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  uuid, 
  integer, 
  boolean, 
  jsonb,
  index 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (Replit Auth compatible)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  preferences: jsonb("preferences").default({}),
  usageQuota: jsonb("usage_quota").default({ stories_per_month: 5, minutes_per_month: 60 }),
  storiesUsedThisMonth: integer("stories_used_this_month").default(0),
  minutesUsedThisMonth: integer("minutes_used_this_month").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table for Express connect-pg-simple (legacy)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Auth sessions table for Next.js signed sessions
export const authSessions = pgTable(
  "auth_sessions",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("idx_auth_sessions_user_id").on(table.userId)]
);

// Code repositories table
export const codeRepositories = pgTable(
  "code_repositories",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    repoUrl: text("repo_url").notNull(),
    repoName: text("repo_name").notNull(),
    repoOwner: text("repo_owner").notNull(),
    primaryLanguage: text("primary_language"),
    starsCount: integer("stars_count").default(0),
    description: text("description"),
    analysisCache: jsonb("analysis_cache"),
    analysisCachedAt: timestamp("analysis_cached_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("idx_code_repositories_user_id").on(table.userId)]
);

// Story intents table
export const storyIntents = pgTable(
  "story_intents",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    repositoryId: uuid("repository_id").references(() => codeRepositories.id, { onDelete: "cascade" }),
    intentCategory: text("intent_category").notNull(),
    userDescription: text("user_description"),
    focusAreas: jsonb("focus_areas").default([]),
    expertiseLevel: text("expertise_level").default("intermediate"),
    conversationHistory: jsonb("conversation_history").default([]),
    generatedPlan: jsonb("generated_plan"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("idx_story_intents_user_id").on(table.userId)]
);

// Stories table
export const stories = pgTable(
  "stories",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    intentId: uuid("intent_id").references(() => storyIntents.id, { onDelete: "set null" }),
    repositoryId: uuid("repository_id").references(() => codeRepositories.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    narrativeStyle: text("narrative_style").notNull(),
    voiceId: text("voice_id").notNull().default("alloy"),
    targetDurationMinutes: integer("target_duration_minutes"),
    actualDurationSeconds: integer("actual_duration_seconds"),
    expertiseLevel: text("expertise_level"),
    scriptText: text("script_text"),
    audioUrl: text("audio_url"),
    audioChunks: jsonb("audio_chunks").default([]),
    chapters: jsonb("chapters").default([]),
    status: text("status").default("pending"),
    progress: integer("progress").default(0),
    progressMessage: text("progress_message"),
    processingStartedAt: timestamp("processing_started_at"),
    processingCompletedAt: timestamp("processing_completed_at"),
    errorMessage: text("error_message"),
    isPublic: boolean("is_public").default(true),
    shareId: text("share_id").unique(),
    playCount: integer("play_count").default(0),
    lastPlayedAt: timestamp("last_played_at"),
    lastPlayedPosition: integer("last_played_position").default(0),
    generationMode: text("generation_mode"),
    modelConfig: jsonb("model_config"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_stories_user_id").on(table.userId),
    index("idx_stories_status").on(table.status),
    index("idx_stories_share_id").on(table.shareId),
    index("idx_stories_is_public").on(table.isPublic),
  ]
);

// Story chapters table
export const storyChapters = pgTable(
  "story_chapters",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    storyId: uuid("story_id").notNull().references(() => stories.id, { onDelete: "cascade" }),
    chapterNumber: integer("chapter_number").notNull(),
    title: text("title").notNull(),
    startTimeSeconds: integer("start_time_seconds").notNull().default(0),
    durationSeconds: integer("duration_seconds"),
    scriptSegment: text("script_segment"),
    audioUrl: text("audio_url"),
    focusFiles: jsonb("focus_files").default([]),
    keyConcepts: jsonb("key_concepts").default([]),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("idx_story_chapters_story_id").on(table.storyId)]
);

// Story drafts table
export const storyDrafts = pgTable(
  "story_drafts",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    repositoryUrl: text("repository_url").notNull(),
    repositoryName: text("repository_name"),
    repositoryOwner: text("repository_owner"),
    repositoryDescription: text("repository_description"),
    repositoryLanguage: text("repository_language"),
    repositoryStars: integer("repository_stars"),
    styleConfig: jsonb("style_config").default({}),
    modelConfig: jsonb("model_config").default({}),
    voiceConfig: jsonb("voice_config").default({}),
    scheduledAt: timestamp("scheduled_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_story_drafts_user_id").on(table.userId)]
);

// Processing logs table
export const processingLogs = pgTable(
  "processing_logs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    storyId: uuid("story_id").notNull().references(() => stories.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp").defaultNow(),
    agentName: text("agent_name").notNull(),
    action: text("action").notNull(),
    details: jsonb("details").default({}),
    level: text("level").default("info"),
  },
  (table) => [
    index("idx_processing_logs_story_id").on(table.storyId),
    index("idx_processing_logs_timestamp").on(table.storyId, table.timestamp),
  ]
);

// Stage metrics table for pipeline visibility
export const stageMetrics = pgTable(
  "stage_metrics",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    storyId: uuid("story_id").notNull().references(() => stories.id, { onDelete: "cascade" }),
    stageName: text("stage_name").notNull(),
    stageOrder: integer("stage_order").default(0),
    startedAt: timestamp("started_at").defaultNow(),
    endedAt: timestamp("ended_at"),
    durationMs: integer("duration_ms"),
    status: text("status").default("pending"),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    costEstimate: text("cost_estimate"),
    promptUsed: text("prompt_used"),
    responsePreview: text("response_preview"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_stage_metrics_story_id").on(table.storyId),
    index("idx_stage_metrics_stage_name").on(table.stageName),
  ]
);

// ElevenLabs Studio projects table
export const studioProjects = pgTable(
  "studio_projects",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    storyId: uuid("story_id").notNull().references(() => stories.id, { onDelete: "cascade" }),
    elevenLabsProjectId: text("elevenlabs_project_id").notNull(),
    projectType: text("project_type").notNull(),
    status: text("status").default("pending"),
    conversionProgress: integer("conversion_progress").default(0),
    webhookReceived: boolean("webhook_received").default(false),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_studio_projects_story_id").on(table.storyId),
    index("idx_studio_projects_elevenlabs_id").on(table.elevenLabsProjectId),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  stories: many(stories),
  repositories: many(codeRepositories),
  intents: many(storyIntents),
  drafts: many(storyDrafts),
}));

export const storyDraftsRelations = relations(storyDrafts, ({ one }) => ({
  user: one(users, {
    fields: [storyDrafts.userId],
    references: [users.id],
  }),
}));

export const codeRepositoriesRelations = relations(codeRepositories, ({ one, many }) => ({
  user: one(users, {
    fields: [codeRepositories.userId],
    references: [users.id],
  }),
  stories: many(stories),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
  repository: one(codeRepositories, {
    fields: [stories.repositoryId],
    references: [codeRepositories.id],
  }),
  intent: one(storyIntents, {
    fields: [stories.intentId],
    references: [storyIntents.id],
  }),
  chapters: many(storyChapters),
  processingLogs: many(processingLogs),
}));

export const storyChaptersRelations = relations(storyChapters, ({ one }) => ({
  story: one(stories, {
    fields: [storyChapters.storyId],
    references: [stories.id],
  }),
}));

export const processingLogsRelations = relations(processingLogs, ({ one }) => ({
  story: one(stories, {
    fields: [processingLogs.storyId],
    references: [stories.id],
  }),
}));

export const stageMetricsRelations = relations(stageMetrics, ({ one }) => ({
  story: one(stories, {
    fields: [stageMetrics.storyId],
    references: [stories.id],
  }),
}));

export const studioProjectsRelations = relations(studioProjects, ({ one }) => ({
  story: one(stories, {
    fields: [studioProjects.storyId],
    references: [stories.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type CodeRepository = typeof codeRepositories.$inferSelect;
export type InsertCodeRepository = typeof codeRepositories.$inferInsert;
export type ProcessingLog = typeof processingLogs.$inferSelect;
export type InsertProcessingLog = typeof processingLogs.$inferInsert;
export type StoryDraft = typeof storyDrafts.$inferSelect;
export type InsertStoryDraft = typeof storyDrafts.$inferInsert;
export type StageMetric = typeof stageMetrics.$inferSelect;
export type InsertStageMetric = typeof stageMetrics.$inferInsert;
export type StudioProject = typeof studioProjects.$inferSelect;
export type InsertStudioProject = typeof studioProjects.$inferInsert;
