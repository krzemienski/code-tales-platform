import { db, users, stories, codeRepositories, processingLogs, storyChapters, storyIntents } from "./index";
import { eq, desc, and, sql } from "drizzle-orm";
import type { User, Story, CodeRepository, ProcessingLog, InsertStory, InsertCodeRepository, InsertProcessingLog } from "./schema";

// Database client that replaces Supabase operations
export const dbClient = {
  // User operations
  users: {
    async getById(id: string): Promise<User | null> {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || null;
    },

    async getByEmail(email: string): Promise<User | null> {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || null;
    },

    async upsert(userData: Partial<User> & { id: string }): Promise<User> {
      const [user] = await db
        .insert(users)
        .values(userData as any)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    },

    async update(id: string, data: Partial<User>): Promise<User | null> {
      const [user] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user || null;
    },
  },

  // Story operations
  stories: {
    async getById(id: string): Promise<Story | null> {
      const [story] = await db.select().from(stories).where(eq(stories.id, id));
      return story || null;
    },

    async getByUserId(userId: string): Promise<Story[]> {
      return db.select().from(stories).where(eq(stories.userId, userId)).orderBy(desc(stories.createdAt));
    },

    async getPublicStories(limit: number = 12): Promise<(Story & { code_repositories: CodeRepository | null })[]> {
      const result = await db
        .select()
        .from(stories)
        .leftJoin(codeRepositories, eq(stories.repositoryId, codeRepositories.id))
        .where(and(eq(stories.status, "completed"), eq(stories.isPublic, true)))
        .orderBy(desc(stories.playCount))
        .limit(limit);

      return result.map((r) => ({
        ...r.stories,
        code_repositories: r.code_repositories,
      }));
    },

    async create(storyData: InsertStory): Promise<Story> {
      const [story] = await db.insert(stories).values(storyData).returning();
      return story;
    },

    async update(id: string, data: Partial<Story>): Promise<Story | null> {
      const [story] = await db
        .update(stories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(stories.id, id))
        .returning();
      return story || null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.delete(stories).where(eq(stories.id, id));
      return true;
    },

    async incrementPlayCount(id: string): Promise<void> {
      await db
        .update(stories)
        .set({
          playCount: sql`${stories.playCount} + 1`,
          lastPlayedAt: new Date(),
        })
        .where(eq(stories.id, id));
    },
  },

  // Repository operations
  repositories: {
    async getById(id: string): Promise<CodeRepository | null> {
      const [repo] = await db.select().from(codeRepositories).where(eq(codeRepositories.id, id));
      return repo || null;
    },

    async getByUrl(userId: string, repoUrl: string): Promise<CodeRepository | null> {
      const [repo] = await db
        .select()
        .from(codeRepositories)
        .where(and(eq(codeRepositories.userId, userId), eq(codeRepositories.repoUrl, repoUrl)));
      return repo || null;
    },

    async getByUserId(userId: string): Promise<CodeRepository[]> {
      return db.select().from(codeRepositories).where(eq(codeRepositories.userId, userId));
    },

    async create(repoData: InsertCodeRepository): Promise<CodeRepository> {
      const [repo] = await db.insert(codeRepositories).values(repoData).returning();
      return repo;
    },

    async update(id: string, data: Partial<CodeRepository>): Promise<CodeRepository | null> {
      const [repo] = await db
        .update(codeRepositories)
        .set(data)
        .where(eq(codeRepositories.id, id))
        .returning();
      return repo || null;
    },
  },

  // Processing logs operations
  processingLogs: {
    async getByStoryId(storyId: string): Promise<ProcessingLog[]> {
      return db
        .select()
        .from(processingLogs)
        .where(eq(processingLogs.storyId, storyId))
        .orderBy(desc(processingLogs.timestamp));
    },

    async create(logData: InsertProcessingLog): Promise<ProcessingLog> {
      const [log] = await db.insert(processingLogs).values(logData).returning();
      return log;
    },
  },
};

export default dbClient;
