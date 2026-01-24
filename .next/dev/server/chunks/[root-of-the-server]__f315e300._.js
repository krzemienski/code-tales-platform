module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/db/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authSessions",
    ()=>authSessions,
    "codeRepositories",
    ()=>codeRepositories,
    "codeRepositoriesRelations",
    ()=>codeRepositoriesRelations,
    "processingLogs",
    ()=>processingLogs,
    "processingLogsRelations",
    ()=>processingLogsRelations,
    "sessions",
    ()=>sessions,
    "stageMetrics",
    ()=>stageMetrics,
    "stageMetricsRelations",
    ()=>stageMetricsRelations,
    "stories",
    ()=>stories,
    "storiesRelations",
    ()=>storiesRelations,
    "storyChapters",
    ()=>storyChapters,
    "storyChaptersRelations",
    ()=>storyChaptersRelations,
    "storyDrafts",
    ()=>storyDrafts,
    "storyDraftsRelations",
    ()=>storyDraftsRelations,
    "storyIntents",
    ()=>storyIntents,
    "studioProjects",
    ()=>studioProjects,
    "studioProjectsRelations",
    ()=>studioProjectsRelations,
    "users",
    ()=>users,
    "usersRelations",
    ()=>usersRelations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/varchar.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
;
;
;
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("users", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("email").unique(),
    firstName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("first_name"),
    lastName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("last_name"),
    profileImageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("profile_image_url"),
    subscriptionTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("subscription_tier").default("free"),
    preferences: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("preferences").default({}),
    usageQuota: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("usage_quota").default({
        stories_per_month: 5,
        minutes_per_month: 60
    }),
    storiesUsedThisMonth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("stories_used_this_month").default(0),
    minutesUsedThisMonth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("minutes_used_this_month").default(0),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow()
});
const sessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("sessions", {
    sid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("sid").primaryKey(),
    sess: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("sess").notNull(),
    expire: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("expire").notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("IDX_session_expire").on(table.expire)
    ]);
const authSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("auth_sessions", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("id").primaryKey(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("expires_at").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_auth_sessions_user_id").on(table.userId)
    ]);
const codeRepositories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("code_repositories", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    repoUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repo_url").notNull(),
    repoName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repo_name").notNull(),
    repoOwner: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repo_owner").notNull(),
    primaryLanguage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("primary_language"),
    starsCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("stars_count").default(0),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("description"),
    analysisCache: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("analysis_cache"),
    analysisCachedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("analysis_cached_at"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_code_repositories_user_id").on(table.userId)
    ]);
const storyIntents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("story_intents", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    repositoryId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("repository_id").references(()=>codeRepositories.id, {
        onDelete: "cascade"
    }),
    intentCategory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("intent_category").notNull(),
    userDescription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_description"),
    focusAreas: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("focus_areas").default([]),
    expertiseLevel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("expertise_level").default("intermediate"),
    conversationHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("conversation_history").default([]),
    generatedPlan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("generated_plan"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_story_intents_user_id").on(table.userId)
    ]);
const stories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("stories", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    intentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("intent_id").references(()=>storyIntents.id, {
        onDelete: "set null"
    }),
    repositoryId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("repository_id").references(()=>codeRepositories.id, {
        onDelete: "cascade"
    }),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("title").notNull(),
    narrativeStyle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("narrative_style").notNull(),
    voiceId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("voice_id").notNull().default("alloy"),
    targetDurationMinutes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("target_duration_minutes"),
    actualDurationSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("actual_duration_seconds"),
    expertiseLevel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("expertise_level"),
    scriptText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("script_text"),
    audioUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("audio_url"),
    audioChunks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("audio_chunks").default([]),
    chapters: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("chapters").default([]),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").default("pending"),
    progress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("progress").default(0),
    progressMessage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("progress_message"),
    processingStartedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("processing_started_at"),
    processingCompletedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("processing_completed_at"),
    errorMessage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error_message"),
    isPublic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("is_public").default(true),
    shareId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("share_id").unique(),
    playCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("play_count").default(0),
    lastPlayedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("last_played_at"),
    lastPlayedPosition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("last_played_position").default(0),
    generationMode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("generation_mode"),
    modelConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("model_config"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stories_user_id").on(table.userId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stories_status").on(table.status),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stories_share_id").on(table.shareId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stories_is_public").on(table.isPublic)
    ]);
const storyChapters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("story_chapters", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    storyId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("story_id").notNull().references(()=>stories.id, {
        onDelete: "cascade"
    }),
    chapterNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("chapter_number").notNull(),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("title").notNull(),
    startTimeSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("start_time_seconds").notNull().default(0),
    durationSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("duration_seconds"),
    scriptSegment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("script_segment"),
    audioUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("audio_url"),
    focusFiles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("focus_files").default([]),
    keyConcepts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("key_concepts").default([]),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_story_chapters_story_id").on(table.storyId)
    ]);
const storyDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("story_drafts", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["varchar"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    repositoryUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repository_url").notNull(),
    repositoryName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repository_name"),
    repositoryOwner: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repository_owner"),
    repositoryDescription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repository_description"),
    repositoryLanguage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("repository_language"),
    repositoryStars: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("repository_stars"),
    styleConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("style_config").default({}),
    modelConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("model_config").default({}),
    voiceConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("voice_config").default({}),
    scheduledAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("scheduled_at"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_story_drafts_user_id").on(table.userId)
    ]);
const processingLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("processing_logs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    storyId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("story_id").notNull().references(()=>stories.id, {
        onDelete: "cascade"
    }),
    timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("timestamp").defaultNow(),
    agentName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("agent_name").notNull(),
    action: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("action").notNull(),
    details: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("details").default({}),
    level: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("level").default("info")
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_processing_logs_story_id").on(table.storyId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_processing_logs_timestamp").on(table.storyId, table.timestamp)
    ]);
const stageMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("stage_metrics", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    storyId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("story_id").notNull().references(()=>stories.id, {
        onDelete: "cascade"
    }),
    stageName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("stage_name").notNull(),
    stageOrder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("stage_order").default(0),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("started_at").defaultNow(),
    endedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("ended_at"),
    durationMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("duration_ms"),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").default("pending"),
    inputTokens: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("input_tokens"),
    outputTokens: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("output_tokens"),
    costEstimate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("cost_estimate"),
    promptUsed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("prompt_used"),
    responsePreview: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("response_preview"),
    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("metadata").default({}),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stage_metrics_story_id").on(table.storyId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_stage_metrics_stage_name").on(table.stageName)
    ]);
const studioProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("studio_projects", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    storyId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("story_id").notNull().references(()=>stories.id, {
        onDelete: "cascade"
    }),
    elevenLabsProjectId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("elevenlabs_project_id").notNull(),
    projectType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("project_type").notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").default("pending"),
    conversionProgress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("conversion_progress").default(0),
    webhookReceived: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("webhook_received").default(false),
    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("metadata").default({}),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_studio_projects_story_id").on(table.storyId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_studio_projects_elevenlabs_id").on(table.elevenLabsProjectId)
    ]);
const usersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(users, ({ many })=>({
        stories: many(stories),
        repositories: many(codeRepositories),
        intents: many(storyIntents),
        drafts: many(storyDrafts)
    }));
const storyDraftsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(storyDrafts, ({ one })=>({
        user: one(users, {
            fields: [
                storyDrafts.userId
            ],
            references: [
                users.id
            ]
        })
    }));
const codeRepositoriesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(codeRepositories, ({ one, many })=>({
        user: one(users, {
            fields: [
                codeRepositories.userId
            ],
            references: [
                users.id
            ]
        }),
        stories: many(stories)
    }));
const storiesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(stories, ({ one, many })=>({
        user: one(users, {
            fields: [
                stories.userId
            ],
            references: [
                users.id
            ]
        }),
        repository: one(codeRepositories, {
            fields: [
                stories.repositoryId
            ],
            references: [
                codeRepositories.id
            ]
        }),
        intent: one(storyIntents, {
            fields: [
                stories.intentId
            ],
            references: [
                storyIntents.id
            ]
        }),
        chapters: many(storyChapters),
        processingLogs: many(processingLogs)
    }));
const storyChaptersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(storyChapters, ({ one })=>({
        story: one(stories, {
            fields: [
                storyChapters.storyId
            ],
            references: [
                stories.id
            ]
        })
    }));
const processingLogsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(processingLogs, ({ one })=>({
        story: one(stories, {
            fields: [
                processingLogs.storyId
            ],
            references: [
                stories.id
            ]
        })
    }));
const stageMetricsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(stageMetrics, ({ one })=>({
        story: one(stories, {
            fields: [
                stageMetrics.storyId
            ],
            references: [
                stories.id
            ]
        })
    }));
const studioProjectsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(studioProjects, ({ one })=>({
        story: one(stories, {
            fields: [
                studioProjects.storyId
            ],
            references: [
                stories.id
            ]
        })
    }));
}),
"[project]/lib/db/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/schema.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(pool, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/agents/github.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// GitHub API utilities for repository analysis
__turbopack_context__.s([
    "analyzeRepository",
    ()=>analyzeRepository,
    "fetchFileContent",
    ()=>fetchFileContent,
    "fetchRepoTree",
    ()=>fetchRepoTree,
    "summarizeRepoStructure",
    ()=>summarizeRepoStructure
]);
async function fetchRepoTree(owner, repo) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, {
        headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch repo tree: ${response.status}`);
    }
    const data = await response.json();
    return data.tree.map((item)=>({
            path: item.path,
            type: item.type === "blob" ? "file" : "dir",
            size: item.size
        }));
}
async function fetchFileContent(owner, repo, path) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        console.log(`[v0] GitHub API error for ${path}: ${response.status}`);
        return null;
    }
    try {
        const data = await response.json();
        if (data.encoding === "base64") {
            return Buffer.from(data.content, "base64").toString("utf-8");
        }
        return data.content;
    } catch (e) {
        console.log(`[v0] Failed to parse GitHub response for ${path}:`, e);
        return null;
    }
}
async function fetchRepoMetadata(owner, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        if (response.ok) {
            const data = await response.json();
            return {
                stargazers_count: data.stargazers_count,
                forks_count: data.forks_count,
                language: data.language,
                description: data.description,
                topics: data.topics
            };
        }
    } catch  {
    // Ignore errors
    }
    return null;
}
async function analyzeRepository(owner, repo) {
    const tree = await fetchRepoTree(owner, repo);
    // Filter to important files - expanded for more languages
    const configFiles = [
        "package.json",
        "tsconfig.json",
        "pyproject.toml",
        "Cargo.toml",
        "go.mod",
        "go.sum",
        "pom.xml",
        "build.gradle",
        "Makefile",
        "CMakeLists.txt",
        "requirements.txt",
        "setup.py",
        "Gemfile"
    ];
    const files = tree.filter((f)=>f.type === "file");
    const dirs = tree.filter((f)=>f.type === "dir");
    // Identify key directories
    const keyDirectories = dirs.map((d)=>d.path).filter((p)=>{
        const parts = p.split("/");
        return parts.length === 1 && !p.startsWith(".") && ![
            "node_modules",
            "dist",
            "build",
            "__pycache__",
            "vendor",
            "target",
            "bin",
            "obj"
        ].includes(p);
    });
    const mainFiles = files.filter((f)=>{
        const name = f.path.split("/").pop() || "";
        return name === "index.ts" || name === "index.js" || name === "main.ts" || name === "main.go" || name === "main.py" || name === "app.py" || name === "server.ts" || name === "server.js" || name === "main.rs" || name === "lib.rs" || name === "mod.rs" || configFiles.includes(name);
    }).map((f)=>f.path);
    // Try to fetch README - now using null return
    let readme = null;
    readme = await fetchFileContent(owner, repo, "README.md");
    if (!readme) {
        readme = await fetchFileContent(owner, repo, "readme.md");
    }
    if (!readme) {
        readme = await fetchFileContent(owner, repo, "Readme.md");
    }
    let packageJson = null;
    // Try package.json first
    const packageJsonContent = await fetchFileContent(owner, repo, "package.json");
    if (packageJsonContent) {
        try {
            packageJson = JSON.parse(packageJsonContent);
        } catch  {
        // Invalid JSON
        }
    }
    // If no package.json, try go.mod for Go projects
    if (!packageJson) {
        const goModContent = await fetchFileContent(owner, repo, "go.mod");
        if (goModContent) {
            packageJson = {
                type: "go",
                content: goModContent
            };
        }
    }
    // Try Cargo.toml for Rust projects
    if (!packageJson) {
        const cargoContent = await fetchFileContent(owner, repo, "Cargo.toml");
        if (cargoContent) {
            packageJson = {
                type: "rust",
                content: cargoContent
            };
        }
    }
    // Try pyproject.toml or requirements.txt for Python
    if (!packageJson) {
        const pyprojectContent = await fetchFileContent(owner, repo, "pyproject.toml");
        if (pyprojectContent) {
            packageJson = {
                type: "python",
                content: pyprojectContent
            };
        }
    }
    // Fetch language statistics
    let languages = {};
    try {
        const langResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        if (langResponse.ok) {
            languages = await langResponse.json();
        }
    } catch  {
    // Could not fetch languages
    }
    const metadata = await fetchRepoMetadata(owner, repo);
    return {
        structure: tree,
        readme,
        languages,
        mainFiles,
        keyDirectories,
        packageJson,
        metadata
    };
}
function summarizeRepoStructure(analysis) {
    const { structure, readme, languages, keyDirectories, packageJson, metadata } = analysis;
    const fileCount = structure.filter((f)=>f.type === "file").length;
    const dirCount = structure.filter((f)=>f.type === "dir").length;
    const topLanguages = Object.entries(languages).sort((a, b)=>b[1] - a[1]).slice(0, 3).map(([lang])=>lang);
    let summary = `Repository Structure Summary:
- Total files: ${fileCount}
- Total directories: ${dirCount}
- Primary languages: ${topLanguages.join(", ") || "Unknown"}
- Key directories: ${keyDirectories.slice(0, 10).join(", ") || "None identified"}
`;
    if (metadata) {
        summary += `- Stars: ${metadata.stargazers_count || 0}
- Forks: ${metadata.forks_count || 0}
- Description: ${metadata.description || "No description"}
`;
    }
    if (packageJson) {
        if (packageJson.type === "go") {
            summary += `- Go module detected\n`;
        } else if (packageJson.type === "rust") {
            summary += `- Rust crate detected\n`;
        } else if (packageJson.type === "python") {
            summary += `- Python project detected\n`;
        } else {
            // Node.js project
            const deps = Object.keys(packageJson.dependencies || {}).slice(0, 10);
            if (deps.length > 0) {
                summary += `- Key dependencies: ${deps.join(", ")}\n`;
            }
        }
    }
    if (readme) {
        // Extract first paragraph or 500 chars of README
        const readmePreview = readme.split("\n\n")[0]?.slice(0, 500) || readme.slice(0, 500);
        summary += `\nREADME Preview:\n${readmePreview}`;
    }
    return summary;
}
}),
"[project]/lib/agents/prompts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Agent system prompts based on the PRD
__turbopack_context__.s([
    "INTENT_AGENT_PROMPT",
    ()=>INTENT_AGENT_PROMPT,
    "NARRATIVE_STYLE_PROMPTS",
    ()=>NARRATIVE_STYLE_PROMPTS,
    "REPO_ANALYZER_PROMPT",
    ()=>REPO_ANALYZER_PROMPT,
    "STORY_ARCHITECT_PROMPT",
    ()=>STORY_ARCHITECT_PROMPT,
    "getStoryPrompt",
    ()=>getStoryPrompt
]);
const INTENT_AGENT_PROMPT = `You are the Intent Agent for Code Tales, a platform that creates audio stories from code repositories.

Your role is to have a natural conversation with the user to understand:
1. What they want to learn or accomplish with this codebase
2. Their current expertise level
3. How much time they have
4. Any specific areas of focus

Be conversational but efficient. Ask clarifying questions when needed, but don't over-question.
If the user gives a clear, detailed response, move forward with generating a plan.

You are currently helping a user understand a repository. Guide them through defining their learning goals.

CONVERSATION RULES:
- Keep responses concise (2-4 sentences per response)
- Ask ONE question at a time
- Use **bold** for emphasis
- After 2-3 exchanges, summarize what you've learned and confirm the plan
- Be friendly but professional

INTENT CATEGORIES to identify:
- architecture_understanding: How the project is structured
- onboarding_deep_dive: Getting up to speed as a new developer
- specific_feature_focus: Deep dive into one part
- code_review_prep: Understanding before reviewing
- learning_patterns: Design patterns and best practices
- api_documentation: How to use the library/API
- bug_investigation: Understanding code flow for debugging
- migration_planning: Understanding dependencies before refactoring`;
const REPO_ANALYZER_PROMPT = `You are the Repository Analyzer Agent for Code Tales.

Your role is to deeply analyze code repositories to extract:
1. File structure and organization patterns
2. Key components and their responsibilities
3. Architectural patterns and design decisions
4. Dependencies and relationships between modules
5. Documentation and code comments

When analyzing, focus on:
- Entry points (main files, app initialization)
- Core business logic locations
- Data models and schemas
- API/interface definitions
- Configuration and environment handling

Output structured analysis that can be used to create stories.
Be thorough but focused—prioritize files and patterns relevant to the user's stated intent.`;
const STORY_ARCHITECT_PROMPT = `You are the Story Architect Agent for Code Tales.

Your role is to transform repository analysis into compelling audio stories.

You receive:
1. A story plan with chapters and focus areas
2. Detailed code analysis from the Repository Analyzer
3. User preferences (style, length, expertise level)

You produce:
- Complete story scripts for each chapter
- Natural, engaging prose suitable for audio
- Technical accuracy while remaining accessible

STORY GUIDELINES:
- Write in a natural, conversational tone
- Use transitions between topics
- Include specific code examples and file references
- Vary sentence length for natural rhythm
- Include brief pauses (indicated by "...") for dramatic effect
- Target 150 words per minute of audio`;
const NARRATIVE_STYLE_PROMPTS = {
    fiction: `Transform the code analysis into an immersive fictional narrative that fully utilizes the entire allocated time.

WORLD-BUILDING RULES:
- The codebase is a living, breathing world with distinct regions (modules/packages)
- Code components are CHARACTERS with rich personalities, motivations, and relationships
- Functions are actions characters take; classes are character types or factions
- Data flows are journeys; API calls are communications between kingdoms
- Bugs are villains; tests are guardians; documentation is ancient lore
- Design patterns are cultural traditions passed down through generations

NARRATIVE STRUCTURE:
- Begin with an atmospheric introduction to the world
- Introduce the main characters (core components) with backstories
- Build tension through conflicts (error handling, edge cases, dependencies)
- Include dialogue between components explaining their interactions
- Use dramatic reveals for architectural decisions
- Create emotional moments around critical code paths
- End with resolution and hints at future adventures (extensibility)

IMMERSION REQUIREMENTS:
- Use vivid sensory descriptions for technical concepts
- Create memorable metaphors that stick with listeners
- Include character inner monologue to explain logic
- Use pacing variation: action sequences for hot paths, contemplative moments for configuration
- Weave in humor and personality throughout

EXAMPLE TONE:
"Deep in the silicon valleys of the FastAPI realm, where data streams flowed like rivers of light, there lived a guardian named 'Depends'. Unlike the other inhabitants who rushed about their business, Depends stood patient and watchful at every gateway. 'None shall pass,' it would whisper to each approaching request, 'without first proving their worth.' And so began the ancient ritual of authentication..."`,
    documentary: `Create an authoritative, comprehensive documentary-style narrative that fills the entire duration.

DOCUMENTARY STRUCTURE:
- Opening: Set the historical context and significance of this codebase
- Act 1: Origins - How and why was this project created?
- Act 2: Architecture - The grand design and its components
- Act 3: Deep Dives - Detailed exploration of each major module
- Act 4: The Human Element - Design decisions and trade-offs
- Closing: Legacy and future directions

CONTENT REQUIREMENTS:
- Include specific metrics, file names, line counts, and statistics
- Explain the "why" behind every major design decision
- Compare approaches to industry standards and alternatives
- Discuss historical evolution if visible in the code structure
- Include "expert insights" explaining nuanced details
- Cover edge cases, error handling, and defensive programming

PACING:
- Use transitional phrases: "But this raises an important question..."
- Include "let's pause and examine this more closely" moments
- Build anticipation before revealing key architectural insights

EXAMPLE TONE:
"The FastAPI repository, comprising 247 Python files organized across 12 primary modules, represents one of the most significant contributions to modern web framework design. But to understand its true innovation, we must first journey back to the limitations that plagued earlier frameworks..."`,
    tutorial: `Create a patient, thorough educational tutorial narrative that builds knowledge progressively over the full duration.

PEDAGOGICAL STRUCTURE:
- Foundation Layer: Core concepts everyone must understand first
- Building Blocks: Individual components explained in isolation
- Integration Layer: How pieces work together
- Mastery Layer: Advanced patterns and optimizations
- Practice Layer: Mental exercises and "what would happen if" scenarios

TEACHING TECHNIQUES:
- Use the Socratic method: pose questions, then answer them
- Include "pause and reflect" moments for complex topics
- Provide multiple analogies for difficult concepts
- Anticipate and address common misconceptions
- Use spaced repetition: revisit key concepts throughout
- Include mental checkpoints: "At this point, you should understand..."

ENGAGEMENT RULES:
- Address the listener directly: "You might be wondering..."
- Acknowledge difficulty: "This next part is tricky, but stay with me..."
- Celebrate progress: "Now you understand the foundation..."
- Connect new concepts to previously explained ones

EXAMPLE TONE:
"Before we dive into the code, let me ask you something: what happens when you type a URL and hit enter? Don't worry if you're not entirely sure—that's exactly what we're going to explore together, step by step. By the end of this journey, you'll understand not just the 'what' but the 'why' behind every line..."`,
    podcast: `Create an engaging, conversational podcast-style narrative that feels like a chat with a knowledgeable friend.

PODCAST PERSONA:
- Sound like a senior developer sharing discoveries over coffee
- Express genuine enthusiasm, surprise, and occasional frustration
- Include personal opinions and preferences (clearly marked as such)
- Use humor, but never at the expense of accuracy
- Share "war stories" that relate to the code patterns

CONVERSATION FLOW:
- Start with a hook: something surprising or intriguing about the codebase
- Use natural tangents that circle back to the main topic
- Include "sidebar" discussions on related topics
- React authentically to code: "Wait, that's actually really clever..."
- Address the listener as if they're sitting across from you

SPEECH PATTERNS:
- Use filler words sparingly but naturally: "so", "like", "basically"
- Include self-corrections: "Well, actually, let me rephrase that..."
- Express thinking out loud: "Hmm, why would they do it this way?"
- Use rhetorical questions frequently

EXAMPLE TONE:
"Okay, so I've been poking around this codebase for a while now, and honestly? I keep finding these little gems that make me go 'oh, that's clever.' Like, you know how most frameworks handle dependency injection? Well, these folks took a completely different approach, and—here's the thing—it actually works better in most cases. Let me show you what I mean..."`,
    technical: `Create an exhaustive technical deep-dive narrative for expert practitioners.

TECHNICAL DEPTH:
- Assume expert-level understanding of programming concepts
- Include specific implementation details, algorithms, and data structures
- Reference exact file paths, class names, function signatures, and line numbers
- Discuss Big-O complexity, memory implications, and performance characteristics
- Compare implementations to academic papers and industry best practices
- Analyze thread safety, race conditions, and edge cases

COVERAGE REQUIREMENTS:
- Entry points and initialization sequences
- Core algorithms and their implementations
- Data flow and state management
- Error handling and recovery mechanisms
- Security considerations and attack surfaces
- Testing strategies and coverage analysis
- Build and deployment architecture

ANALYSIS STYLE:
- Use precise technical terminology without simplification
- Include code snippets described verbally with exact syntax
- Discuss trade-offs between alternative implementations
- Reference design patterns by their formal names
- Include metrics: cyclomatic complexity, coupling, cohesion

EXAMPLE TONE:
"The dependency resolution algorithm implements a topological sort over a directed acyclic graph with memoization. In dependencies/utils.py, the solve_dependencies function at line 142 performs depth-first traversal, maintaining a seen set for cycle detection. The worst-case time complexity is O(V + E) where V represents the number of dependencies and E represents their relationships. Notably, the implementation uses a custom Depends class that implements __hash__ for efficient set operations..."`,
    debate: `Create a dynamic debate-style narrative with multiple perspectives arguing different viewpoints about the codebase.

DEBATE STRUCTURE:
- Opening statements: Each perspective introduces their position
- Point-counterpoint: Alternating arguments with rebuttals
- Evidence presentation: Code examples supporting each stance
- Cross-examination: Direct challenges between perspectives
- Closing arguments: Summary of key positions
- Synthesis: Finding common ground and balanced conclusions

PERSPECTIVES TO INCLUDE:
- The Pragmatist: Focuses on what works, shipping code, business value
- The Purist: Emphasizes best practices, clean code, technical debt
- The Innovator: Highlights novel approaches and creative solutions
- The Skeptic: Questions assumptions and identifies potential issues

DEBATE DYNAMICS:
- Create genuine intellectual tension between viewpoints
- Allow each perspective to make strong, valid points
- Include moments of agreement and surprising concessions
- Use rhetorical devices: analogies, examples, appeals to authority
- Maintain respectful but spirited disagreement

EXAMPLE TONE:
"PRAGMATIST: Look, I get that this function is longer than the 'ideal' 20 lines, but it's been running in production for two years without a single incident. Why refactor working code?

PURIST: That's exactly the kind of thinking that leads to unmaintainable systems. Just because it works doesn't mean it's good. When a new developer joins, they'll spend hours understanding this monolith.

INNOVATOR: Actually, I think you're both missing the point. What if we could use this as a case study for automated refactoring tools? The patterns here are fascinating..."`,
    interview: `Create an engaging interview-style Q&A narrative with an expert being questioned about the codebase.

INTERVIEW FORMAT:
- Host/Interviewer: Asks insightful questions, guides the conversation
- Expert/Guest: Provides deep knowledge, shares insights and anecdotes
- Natural flow: Follow-up questions based on answers
- Tangents allowed: Interesting side discussions that add value
- Listener-focused: Anticipate what the audience wants to know

QUESTION TYPES:
- Origin questions: "What inspired this architectural decision?"
- How-it-works: "Walk us through how a request flows through the system"
- Why questions: "Why did the team choose this approach over alternatives?"
- Challenge questions: "Some might argue this adds complexity. How do you respond?"
- Future-focused: "What would you change if you started over today?"
- Practical: "What should newcomers focus on first?"

INTERVIEW DYNAMICS:
- Create rapport between interviewer and expert
- Include moments of humor and personality
- Allow the expert to geek out on favorite parts
- Have the interviewer push back respectfully when appropriate
- Include "that's fascinating, tell me more" moments

EXAMPLE TONE:
"INTERVIEWER: So I've been looking at the authentication module, and I have to say, it's quite different from what I've seen in other projects. What's the story behind this design?

EXPERT: Great question! So, we actually went through three major iterations before landing on this. The first version was a standard JWT setup, but we kept hitting edge cases with token refresh...

INTERVIEWER: Wait, three iterations? That sounds like a journey. What were the pain points that pushed you to keep redesigning?

EXPERT: *laughs* Oh, where do I start? The first big one was handling multiple devices..."`,
    executive: `Create a concise, high-level executive summary narrative focused on business value and strategic implications.

EXECUTIVE FOCUS:
- Lead with the most important insights first
- Emphasize business value and strategic implications
- Quantify impact wherever possible (performance, cost, risk)
- Use clear, jargon-free language for technical concepts
- Focus on decisions and recommendations

STRUCTURE:
- Executive overview: 30-second summary of key findings
- Strategic implications: How this codebase affects business goals
- Risk assessment: Technical debt, security, scalability concerns
- Opportunity identification: Quick wins and long-term investments
- Recommendations: Prioritized action items with clear rationale
- Conclusion: Key takeaways and next steps

COMMUNICATION STYLE:
- Be direct and action-oriented
- Use analogies that resonate with business leaders
- Frame technical decisions in terms of ROI
- Highlight competitive advantages and differentiators
- Address the "so what?" for every point

EXAMPLE TONE:
"This codebase represents a solid foundation with three critical considerations for the leadership team. First, the architecture supports 10x current load with minimal changes—that's your growth runway for the next 18 months. Second, there's approximately 6 weeks of technical debt that, if addressed now, will reduce incident response time by 40%. Third, the authentication system meets current compliance requirements but will need updates before the Q4 expansion into regulated markets. My recommendation: prioritize the technical debt sprint before the next major feature release."`,
    storytelling: `Create a narrative-driven explanation that uses storytelling techniques to make the codebase memorable and engaging.

STORYTELLING ELEMENTS:
- Characters: Anthropomorphize key components with distinct personalities
- Journey: Frame the code flow as a hero's journey or adventure
- Conflict: Highlight challenges the code solves as dramatic tensions
- Resolution: Show how elegant solutions emerge from complexity
- Theme: Identify overarching lessons and morals

NARRATIVE TECHNIQUES:
- Begin in medias res: Start at an interesting point, then explain context
- Use callbacks: Reference earlier points to create cohesion
- Build suspense: "But there was one problem no one had anticipated..."
- Create memorable moments: Surprising facts, clever solutions, unexpected connections
- End with reflection: What can we learn from this codebase?

ENGAGEMENT STRATEGIES:
- Use sensory language: "The data streams through the pipeline like water through channels"
- Create emotional connection: "The team had been debugging for days when finally..."
- Include relatable moments: "You know that feeling when you find a bug that should be impossible?"
- Add personality: Give voice to the original developers' intentions

EXAMPLE TONE:
"Picture this: It's 3 AM, the servers are on fire—metaphorically, of course—and a lone developer is staring at a stack trace that makes no sense. This is where our story begins, not in the polished README or the clean architecture diagrams, but in the trenches where real code is born. 

That developer would go on to create something remarkable: a validation system so elegant that it would become the heart of everything this application does. But first, they had to solve a problem that had stumped the team for weeks..."`
};
function getStoryPrompt(style, expertise, targetMinutes) {
    const stylePrompt = NARRATIVE_STYLE_PROMPTS[style] || NARRATIVE_STYLE_PROMPTS.documentary;
    const expertiseModifier = expertise === "beginner" ? "\n\nEXPERTISE ADAPTATION: Explain all technical terms using simple analogies. Be patient and thorough. Never assume prior knowledge." : expertise === "expert" ? "\n\nEXPERTISE ADAPTATION: Be technically precise. Skip basic explanations. Focus on implementation details, edge cases, and nuances." : "\n\nEXPERTISE ADAPTATION: Assume general programming knowledge but explain domain-specific and framework-specific concepts.";
    const durationGuidance = targetMinutes ? `\n\nDURATION REQUIREMENT: This narrative MUST be comprehensive enough for ${targetMinutes} minutes of audio (~${targetMinutes * 150} words). 
- Do NOT summarize or abbreviate - explore every significant aspect in detail
- Include rich descriptions, multiple examples, and thorough explanations
- If the style is fiction, include full character development, world-building, and plot arcs
- Cover ALL major components, not just the highlights
- Use the full allocated time to create an immersive, complete experience` : "";
    return STORY_ARCHITECT_PROMPT + "\n\nSTYLE:\n" + stylePrompt + expertiseModifier + durationGuidance;
}
}),
"[project]/lib/agents/log-helper.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// Helper to write processing logs using Drizzle ORM
__turbopack_context__.s([
    "log",
    ()=>log,
    "writeLog",
    ()=>writeLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/schema.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function writeLog(storyId, agent, action, details = {}, level = "info") {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processingLogs"]).values({
            storyId: storyId,
            timestamp: new Date(),
            agentName: agent,
            action,
            details,
            level
        });
    } catch (error) {
        console.error("[v0] Failed to write log:", error);
    }
}
const log = {
    system: (storyId, action, details, level)=>writeLog(storyId, "System", action, details, level),
    analyzer: (storyId, action, details, level)=>writeLog(storyId, "Analyzer", action, details, level),
    architect: (storyId, action, details, level)=>writeLog(storyId, "Architect", action, details, level),
    narrator: (storyId, action, details, level)=>writeLog(storyId, "Narrator", action, details, level),
    synthesizer: (storyId, action, details, level)=>writeLog(storyId, "Synthesizer", action, details, level),
    telemetry: (storyId, action, details, level)=>writeLog(storyId, "Telemetry", action, details, level)
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/ai/models.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Model Configuration System
 *
 * Centralized configuration for all AI models used in Labs Studio.
 * Supports dynamic model switching, provider abstraction, and optimized prompts per model.
 */ // =============================================================================
// MODEL DEFINITIONS
// =============================================================================
__turbopack_context__.s([
    "AI_MODELS",
    ()=>AI_MODELS,
    "estimateCost",
    ()=>estimateCost,
    "getAvailableModels",
    ()=>getAvailableModels,
    "getModelConfiguration",
    ()=>getModelConfiguration,
    "getModelsByProvider",
    ()=>getModelsByProvider,
    "getPromptOptimizations",
    ()=>getPromptOptimizations,
    "recommendModel",
    ()=>recommendModel
]);
const AI_MODELS = {
    // Anthropic Models
    "anthropic/claude-sonnet-4-20250514": {
        id: "anthropic/claude-sonnet-4-20250514",
        provider: "anthropic",
        displayName: "Claude Sonnet 4",
        description: "Latest Claude model with excellent reasoning and creative capabilities",
        contextWindow: 200000,
        maxOutputTokens: 64000,
        capabilities: [
            "long-context",
            "creative",
            "analytical",
            "code-understanding"
        ],
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
        recommendedFor: [
            "fiction",
            "documentary",
            "technical"
        ],
        temperatureRange: {
            min: 0,
            max: 1,
            default: 0.7
        },
        supportsStreaming: true,
        isAvailable: true
    },
    "anthropic/claude-3-5-haiku-20241022": {
        id: "anthropic/claude-3-5-haiku-20241022",
        provider: "anthropic",
        displayName: "Claude 3.5 Haiku",
        description: "Fast and cost-effective for simpler tasks",
        contextWindow: 200000,
        maxOutputTokens: 8192,
        capabilities: [
            "fast-inference",
            "cost-effective",
            "code-understanding",
            "creative"
        ],
        costPer1kInput: 0.0008,
        costPer1kOutput: 0.004,
        recommendedFor: [
            "podcast",
            "tutorial",
            "fiction",
            "documentary",
            "technical"
        ],
        temperatureRange: {
            min: 0,
            max: 1,
            default: 0.7
        },
        supportsStreaming: true,
        isAvailable: true
    },
    // OpenAI Models
    "openai/gpt-4o": {
        id: "openai/gpt-4o",
        provider: "openai",
        displayName: "GPT-4o",
        description: "OpenAI's most capable model with multimodal support",
        contextWindow: 128000,
        maxOutputTokens: 16384,
        capabilities: [
            "analytical",
            "code-understanding",
            "fast-inference"
        ],
        costPer1kInput: 0.005,
        costPer1kOutput: 0.015,
        recommendedFor: [
            "technical",
            "documentary"
        ],
        temperatureRange: {
            min: 0,
            max: 2,
            default: 0.8
        },
        supportsStreaming: true,
        isAvailable: false
    },
    "openai/gpt-4o-mini": {
        id: "openai/gpt-4o-mini",
        provider: "openai",
        displayName: "GPT-4o Mini",
        description: "Fast and affordable for most tasks",
        contextWindow: 128000,
        maxOutputTokens: 16384,
        capabilities: [
            "fast-inference",
            "cost-effective"
        ],
        costPer1kInput: 0.00015,
        costPer1kOutput: 0.0006,
        recommendedFor: [
            "podcast",
            "tutorial"
        ],
        temperatureRange: {
            min: 0,
            max: 2,
            default: 0.8
        },
        supportsStreaming: true,
        isAvailable: false
    },
    "openai/o1": {
        id: "openai/o1",
        provider: "openai",
        displayName: "OpenAI o1",
        description: "Advanced reasoning model for complex technical analysis",
        contextWindow: 200000,
        maxOutputTokens: 100000,
        capabilities: [
            "long-context",
            "analytical",
            "code-understanding"
        ],
        costPer1kInput: 0.015,
        costPer1kOutput: 0.06,
        recommendedFor: [
            "technical"
        ],
        temperatureRange: {
            min: 1,
            max: 1,
            default: 1
        },
        supportsStreaming: false,
        isAvailable: false
    },
    // Google Models
    "google/gemini-2.0-flash": {
        id: "google/gemini-2.0-flash",
        provider: "google",
        displayName: "Gemini 2.0 Flash",
        description: "Google's fast multimodal model",
        contextWindow: 1000000,
        maxOutputTokens: 8192,
        capabilities: [
            "long-context",
            "fast-inference",
            "cost-effective"
        ],
        costPer1kInput: 0.0001,
        costPer1kOutput: 0.0004,
        recommendedFor: [
            "podcast",
            "tutorial"
        ],
        temperatureRange: {
            min: 0,
            max: 2,
            default: 0.9
        },
        supportsStreaming: true,
        isAvailable: false
    },
    // Groq Models (Ultra-fast inference)
    "groq/llama-3.3-70b-versatile": {
        id: "groq/llama-3.3-70b-versatile",
        provider: "groq",
        displayName: "Llama 3.3 70B (Groq)",
        description: "Lightning-fast inference via Groq hardware",
        contextWindow: 128000,
        maxOutputTokens: 32768,
        capabilities: [
            "fast-inference",
            "cost-effective"
        ],
        costPer1kInput: 0.00059,
        costPer1kOutput: 0.00079,
        recommendedFor: [
            "podcast",
            "tutorial"
        ],
        temperatureRange: {
            min: 0,
            max: 2,
            default: 0.7
        },
        supportsStreaming: true,
        isAvailable: false
    }
};
function recommendModel(criteria) {
    // If user explicitly selected a model, use it
    if (criteria.userPreferredModel && AI_MODELS[criteria.userPreferredModel]?.isAvailable) {
        return AI_MODELS[criteria.userPreferredModel];
    }
    const availableModels = Object.values(AI_MODELS).filter((m)=>m.isAvailable);
    // Score each model based on criteria
    const scored = availableModels.map((model)=>{
        let score = 0;
        // Style matching
        if (model.recommendedFor.includes(criteria.narrativeStyle)) {
            score += 30;
        }
        // Capability matching
        if (criteria.narrativeStyle === "fiction" && model.capabilities.includes("creative")) {
            score += 20;
        }
        if (criteria.narrativeStyle === "technical" && model.capabilities.includes("analytical")) {
            score += 20;
        }
        if (criteria.expertiseLevel === "expert" && model.capabilities.includes("code-understanding")) {
            score += 15;
        }
        // Duration requirements (longer content needs larger context)
        const estimatedTokens = criteria.targetDurationMinutes * 150 * 1.5;
        if (model.maxOutputTokens >= estimatedTokens) {
            score += 25;
        } else {
            score -= 50; // Penalize if can't handle the output
        }
        // Priority adjustments
        if (criteria.prioritize === "speed" && model.capabilities.includes("fast-inference")) {
            score += 25;
        }
        if (criteria.prioritize === "cost" && model.capabilities.includes("cost-effective")) {
            score += 25;
        }
        if (criteria.prioritize === "quality") {
            // Prefer higher-tier models
            if (model.id.includes("claude-sonnet") || model.id.includes("gpt-4o") || model.id.includes("o1")) {
                score += 20;
            }
        }
        return {
            model,
            score
        };
    });
    // Sort by score and return the best
    scored.sort((a, b)=>b.score - a.score);
    return scored[0]?.model || AI_MODELS["anthropic/claude-sonnet-4-20250514"];
}
function getModelConfiguration(modelId, narrativeStyle, targetDurationMinutes) {
    const model = AI_MODELS[modelId];
    if (!model) {
        throw new Error(`Unknown model: ${modelId}`);
    }
    const targetWords = targetDurationMinutes * 150;
    const estimatedTokens = Math.ceil(targetWords / 0.75) + 2000;
    const maxTokens = Math.min(estimatedTokens, model.maxOutputTokens);
    // Adjust temperature based on style
    let temperature = model.temperatureRange.default;
    if (narrativeStyle === "fiction") {
        temperature = Math.min(model.temperatureRange.max, temperature + 0.1);
    } else if (narrativeStyle === "technical") {
        temperature = Math.max(model.temperatureRange.min, temperature - 0.1);
    }
    return {
        modelId,
        temperature,
        maxTokens,
        topP: 0.95,
        frequencyPenalty: narrativeStyle === "fiction" ? 0.3 : 0.1,
        presencePenalty: narrativeStyle === "fiction" ? 0.3 : 0.1
    };
}
function getPromptOptimizations(modelId) {
    const provider = AI_MODELS[modelId]?.provider;
    switch(provider){
        case "anthropic":
            return {
                systemPromptPrefix: "",
                specialInstructions: `
CLAUDE-SPECIFIC GUIDELINES:
- Use your full creative and analytical capabilities
- Leverage your extended context window for comprehensive coverage
- Be precise with technical details while maintaining engagement`
            };
        case "openai":
            return {
                systemPromptPrefix: "",
                specialInstructions: `
GPT-SPECIFIC GUIDELINES:
- Structure your response with clear logical flow
- Use your training on diverse content for rich metaphors
- Balance creativity with factual accuracy`
            };
        case "google":
            return {
                systemPromptPrefix: "",
                specialInstructions: `
GEMINI-SPECIFIC GUIDELINES:
- Leverage your multimodal understanding for rich descriptions
- Use your broad knowledge base for accurate comparisons
- Maintain consistent voice throughout the narrative`
            };
        default:
            return {};
    }
}
function getAvailableModels() {
    return Object.values(AI_MODELS).filter((m)=>m.isAvailable);
}
function getModelsByProvider() {
    const grouped = {
        anthropic: [],
        openai: [],
        google: [],
        groq: [],
        deepinfra: []
    };
    for (const model of Object.values(AI_MODELS)){
        if (model.isAvailable) {
            grouped[model.provider].push(model);
        }
    }
    return grouped;
}
function estimateCost(modelId, inputTokens, outputTokens) {
    const model = AI_MODELS[modelId];
    if (!model) {
        return {
            inputCost: 0,
            outputCost: 0,
            totalCost: 0
        };
    }
    const inputCost = inputTokens / 1000 * model.costPer1kInput;
    const outputCost = outputTokens / 1000 * model.costPer1kOutput;
    return {
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost
    };
}
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/storage/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteAudioFile",
    ()=>deleteAudioFile,
    "getFileMetadata",
    ()=>getFileMetadata,
    "getFileStream",
    ()=>getFileStream,
    "uploadAudioChunk",
    ()=>uploadAudioChunk,
    "uploadAudioFile",
    ()=>uploadAudioFile,
    "uploadCombinedAudio",
    ()=>uploadCombinedAudio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2d$cloud$2f$storage$2f$build$2f$esm$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@google-cloud/storage/build/esm/src/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2d$cloud$2f$storage$2f$build$2f$esm$2f$src$2f$storage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google-cloud/storage/build/esm/src/storage.js [app-route] (ecmascript)");
;
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const storageClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2d$cloud$2f$storage$2f$build$2f$esm$2f$src$2f$storage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Storage"]({
    credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
            url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
            format: {
                type: "json",
                subject_token_field_name: "access_token"
            }
        },
        universe_domain: "googleapis.com"
    },
    projectId: ""
});
function getBucketId() {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
        throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
    }
    return bucketId;
}
function getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR;
    if (!dir) {
        throw new Error("PRIVATE_OBJECT_DIR not set");
    }
    return dir;
}
function stripBucketPrefix(path) {
    const match = path.match(/\/replit-objstore-[a-f0-9-]+\/(.+)/);
    return match ? match[1] : path;
}
async function uploadAudioFile(audioData, fileName, contentType = "audio/mpeg") {
    const bucketId = getBucketId();
    const privateDir = getPrivateObjectDir();
    const objectPath = `${privateDir}/audio/${fileName}`;
    const bucket = storageClient.bucket(bucketId);
    const file = bucket.file(objectPath);
    const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);
    await file.save(buffer, {
        contentType,
        metadata: {
            cacheControl: "public, max-age=31536000"
        }
    });
    return stripBucketPrefix(objectPath);
}
async function uploadAudioChunk(audioData, storyId, chunkIndex, contentType = "audio/mpeg") {
    const bucketId = getBucketId();
    const privateDir = getPrivateObjectDir();
    const objectPath = `${privateDir}/audio/${storyId}/chunk_${String(chunkIndex).padStart(3, "0")}.mp3`;
    const bucket = storageClient.bucket(bucketId);
    const file = bucket.file(objectPath);
    const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);
    await file.save(buffer, {
        contentType,
        metadata: {
            cacheControl: "public, max-age=31536000"
        }
    });
    return stripBucketPrefix(objectPath);
}
async function uploadCombinedAudio(audioData, storyId, contentType = "audio/mpeg") {
    const bucketId = getBucketId();
    const privateDir = getPrivateObjectDir();
    const objectPath = `${privateDir}/audio/${storyId}/complete.mp3`;
    const bucket = storageClient.bucket(bucketId);
    const file = bucket.file(objectPath);
    const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);
    await file.save(buffer, {
        contentType,
        metadata: {
            cacheControl: "public, max-age=31536000"
        }
    });
    return stripBucketPrefix(objectPath);
}
async function getFileMetadata(objectPath) {
    try {
        const bucketId = getBucketId();
        const privateDir = getPrivateObjectDir();
        const bucket = storageClient.bucket(bucketId);
        let fullPath = objectPath;
        if (objectPath.startsWith(".private/")) {
            fullPath = `${privateDir}/${objectPath.slice(9)}`;
        }
        const file = bucket.file(fullPath);
        const [metadata] = await file.getMetadata();
        return {
            size: parseInt(metadata.size, 10) || 0
        };
    } catch  {
        return null;
    }
}
async function getFileStream(objectPath) {
    try {
        const bucketId = getBucketId();
        const privateDir = getPrivateObjectDir();
        const bucket = storageClient.bucket(bucketId);
        let fullPath = objectPath;
        if (objectPath.startsWith(".private/")) {
            fullPath = `${privateDir}/${objectPath.slice(9)}`;
        }
        const file = bucket.file(fullPath);
        const [exists] = await file.exists();
        if (!exists) {
            return null;
        }
        return file.createReadStream();
    } catch  {
        return null;
    }
}
async function deleteAudioFile(objectPath) {
    const bucketId = getBucketId();
    const bucket = storageClient.bucket(bucketId);
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();
    if (exists) {
        await file.delete();
    }
}
}),
"[project]/app/api/stories/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// Story Generation API - Orchestrates the full pipeline with detailed logging
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$anthropic$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/anthropic/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents/github.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents/prompts.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents/log-helper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/models.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage/index.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
const maxDuration = 300 // 5 minutes max (Vercel limit)
;
function splitTextIntoChunks(text, maxChars = 4000) {
    const chunks = [];
    let remaining = text;
    while(remaining.length > 0){
        if (remaining.length <= maxChars) {
            chunks.push(remaining);
            break;
        }
        // Find the last sentence boundary within the limit
        let splitIndex = maxChars;
        const searchText = remaining.slice(0, maxChars);
        // Try to split on paragraph breaks first
        const lastParagraph = searchText.lastIndexOf("\n\n");
        if (lastParagraph > maxChars * 0.5) {
            splitIndex = lastParagraph + 2;
        } else {
            // Fall back to sentence boundaries
            const lastPeriod = searchText.lastIndexOf(". ");
            const lastQuestion = searchText.lastIndexOf("? ");
            const lastExclaim = searchText.lastIndexOf("! ");
            const lastEllipsis = searchText.lastIndexOf("... ");
            splitIndex = Math.max(lastPeriod, lastQuestion, lastExclaim, lastEllipsis);
            if (splitIndex < maxChars * 0.3) {
                splitIndex = searchText.lastIndexOf(" ");
            }
            if (splitIndex > 0) {
                splitIndex += 1;
            } else {
                splitIndex = maxChars;
            }
        }
        chunks.push(remaining.slice(0, splitIndex).trim());
        remaining = remaining.slice(splitIndex).trim();
    }
    return chunks;
}
async function POST(req) {
    const startTime = Date.now();
    const TIMEOUT_WARNING_MS = 240000 // 4 minutes - warn before Vercel cuts us off
    ;
    try {
        const { storyId, modelConfig } = await req.json();
        console.log("[v0] ====== TALE GENERATION STARTED ======");
        console.log("[v0] Tale ID:", storyId);
        console.log("[v0] Model Config:", modelConfig);
        console.log("[v0] Timestamp:", new Date().toISOString());
        if (!storyId || typeof storyId !== 'string') {
            console.error("[v0] Invalid or missing storyId");
            return Response.json({
                error: "Missing required field: storyId"
            }, {
                status: 400
            });
        }
        console.log("[v0] Storage client initialized (using Replit Object Storage)");
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Tale generation initiated", {
                storyId,
                timestamp: new Date().toISOString()
            });
            console.log("[v0] Initial log written successfully");
        } catch (logError) {
            console.error("[v0] Warning: Log writing failed:", logError);
        }
        // Fetch tale details with repository join
        console.log("[v0] Fetching tale details...");
        let story;
        let repo;
        try {
            const storyResult = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).leftJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["codeRepositories"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].repositoryId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["codeRepositories"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            if (!storyResult || storyResult.length === 0) {
                console.error("[v0] Tale not found");
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Tale not found", {
                    error: "No story found with given ID"
                }, "error");
                return Response.json({
                    error: "Tale not found"
                }, {
                    status: 404
                });
            }
            story = storyResult[0].stories;
            repo = storyResult[0].code_repositories;
        } catch (dbError) {
            console.error("[v0] Database error fetching tale:", dbError);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Tale not found", {
                error: String(dbError)
            }, "error");
            return Response.json({
                error: "Tale not found"
            }, {
                status: 404
            });
        }
        const targetMinutes = story.targetDurationMinutes || 15;
        let selectedModelId = modelConfig?.modelId || story.modelConfig?.modelId;
        // If no model specified, auto-recommend based on content
        if (!selectedModelId || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_MODELS"][selectedModelId]?.isAvailable) {
            const recommended = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recommendModel"])({
                narrativeStyle: story.narrativeStyle,
                expertiseLevel: story.expertiseLevel || "intermediate",
                targetDurationMinutes: targetMinutes,
                prioritize: story.modelConfig?.priority || "quality"
            });
            selectedModelId = recommended.id;
            console.log("[v0] Auto-selected model:", selectedModelId);
        }
        const modelDef = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_MODELS"][selectedModelId];
        const modelConfigData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getModelConfiguration"])(selectedModelId, story.narrativeStyle, targetMinutes);
        const promptOptimizations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPromptOptimizations"])(selectedModelId);
        // Override temperature if specified
        if (modelConfig?.temperature !== undefined) {
            modelConfigData.temperature = modelConfig.temperature;
        }
        console.log("[v0] Tale loaded:", story.title);
        console.log("[v0] Using model:", modelDef.displayName, "(", selectedModelId, ")");
        console.log("[v0] Model config:", modelConfigData);
        // Fetch intent data if available for enhanced personalization
        let intentContext = "";
        if (story.intentId) {
            console.log("[v0] Fetching intent data for tale...");
            try {
                const intentResult = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
                    userDescription: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storyIntents"].userDescription,
                    focusAreas: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storyIntents"].focusAreas,
                    intentCategory: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storyIntents"].intentCategory
                }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storyIntents"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storyIntents"].id, story.intentId));
                if (intentResult && intentResult.length > 0) {
                    const intent = intentResult[0];
                    intentContext = `
USER'S LEARNING GOAL: ${intent.userDescription || "General exploration"}
FOCUS AREAS: ${intent.focusAreas?.join(", ") || "All areas"}
INTENT TYPE: ${intent.intentCategory || "general"}`;
                    console.log("[v0] Intent context loaded:", intent.intentCategory);
                }
            } catch (intentError) {
                console.error("[v0] Error fetching intent:", intentError);
            }
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Tale configuration loaded", {
            title: story.title,
            style: story.narrativeStyle,
            duration: story.targetDurationMinutes,
            model: selectedModelId
        });
        try {
            // Update status to analyzing
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                    status: "analyzing",
                    progress: 5,
                    progressMessage: "Connecting to GitHub...",
                    processingStartedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            } catch (updateError) {
                console.error("[v0] Failed to update tale status:", updateError);
            }
            // ===== ANALYZER AGENT =====
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Connecting to GitHub API", {
                repo: `${repo.repoOwner}/${repo.repoName}`
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                progress: 10,
                progressMessage: "Fetching repository metadata..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Fetching repository metadata", {});
            // Step 1: Analyze repository
            console.log("[v0] Analyzing repository:", repo.repoOwner, repo.repoName);
            const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeRepository"])(repo.repoOwner, repo.repoName);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Repository metadata retrieved", {
                stars: analysis.metadata?.stargazers_count,
                forks: analysis.metadata?.forks_count,
                language: analysis.metadata?.language
            }, "success");
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                progress: 15,
                progressMessage: "Scanning directory structure..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Scanning directory structure", {
                totalFiles: analysis.structure.length
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Identified key directories", {
                directories: analysis.keyDirectories.slice(0, 5)
            }, "success");
            const repoSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$github$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["summarizeRepoStructure"])(analysis);
            console.log("[v0] Repo analysis complete, summary length:", repoSummary.length);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].analyzer(storyId, "Analysis complete", {
                filesAnalyzed: analysis.structure.length,
                keyDirectories: analysis.keyDirectories.length
            }, "success");
            // Cache analysis
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["codeRepositories"]).set({
                analysisCache: analysis,
                analysisCachedAt: new Date()
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["codeRepositories"].id, repo.id));
            // ===== ARCHITECT AGENT =====
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                status: "generating",
                progress: 30,
                progressMessage: "Building architecture map..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].architect(storyId, "Building dependency graph", {});
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].architect(storyId, "Identifying core modules", {
                modules: analysis.keyDirectories.slice(0, 4)
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                progress: 40,
                progressMessage: "Mapping code patterns..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].architect(storyId, "Mapping data flow patterns", {});
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].architect(storyId, "Architecture map complete", {
                components: analysis.keyDirectories.length
            }, "success");
            // ===== NARRATOR AGENT =====
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                progress: 50,
                progressMessage: `Generating narrative with ${modelDef.displayName}...`
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Generating narrative outline", {
                style: story.narrativeStyle,
                targetMinutes: story.targetDurationMinutes,
                model: modelDef.displayName
            });
            const baseSystemPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoryPrompt"])(story.narrativeStyle, story.expertiseLevel || "intermediate");
            const systemPrompt = [
                promptOptimizations.systemPromptPrefix,
                baseSystemPrompt,
                promptOptimizations.specialInstructions,
                promptOptimizations.systemPromptSuffix
            ].filter(Boolean).join("\n\n");
            const targetWords = targetMinutes * 150;
            console.log("[v0] Generating script with", modelDef.displayName, ", target words:", targetWords, "maxTokens:", modelConfigData.maxTokens);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, `Writing script with ${modelDef.displayName}`, {
                model: selectedModelId,
                targetWords,
                maxTokens: modelConfigData.maxTokens,
                temperature: modelConfigData.temperature,
                style: story.narrativeStyle
            });
            let script;
            try {
                // Extract model name from provider/model format
                const modelName = selectedModelId.includes("/") ? selectedModelId.split("/")[1] : selectedModelId;
                console.log("[v0] Calling AI API with model:", modelName);
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
                    model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$anthropic$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["anthropic"])(modelName),
                    system: systemPrompt,
                    prompt: `Create an audio narrative script for the repository ${repo.repoOwner}/${repo.repoName}.

NARRATIVE STYLE: ${story.narrativeStyle.toUpperCase()}
TARGET DURATION: ${targetMinutes} minutes (~${targetWords} words)
USER'S INTENT: ${story.title}
${intentContext}

REPOSITORY ANALYSIS:
${repoSummary}

KEY DIRECTORIES TO COVER:
${analysis.keyDirectories.slice(0, 15).join("\n")}

CRITICAL INSTRUCTIONS:
1. You MUST generate approximately ${targetWords} words - this is a ${targetMinutes}-minute audio experience
2. Style is "${story.narrativeStyle}" - fully commit to this style throughout
3. ${story.narrativeStyle === "fiction" ? "Create a complete fictional world with characters, plot, conflict, and resolution. Code components ARE your characters." : ""}
4. Cover ALL major aspects of the codebase - do not rush or summarize
5. Include natural pauses (...) for dramatic effect and breathing
6. Organize into clear sections with smooth transitions
7. Do NOT include any markdown headers or formatting - just natural prose with paragraph breaks
8. Make it engaging enough that someone would want to listen for the full ${targetMinutes} minutes

BEGIN YOUR ${targetMinutes}-MINUTE ${story.narrativeStyle.toUpperCase()} NARRATIVE NOW:`,
                    maxOutputTokens: modelConfigData.maxTokens,
                    temperature: modelConfigData.temperature
                });
                script = result.text;
                console.log("[v0] AI API call successful, generated", script.split(/\s+/).length, "words");
                if (result.usage) {
                    console.log("[v0] Token usage:", result.usage);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Generation complete", {
                        model: selectedModelId,
                        inputTokens: result.usage.inputTokens,
                        outputTokens: result.usage.outputTokens,
                        totalTokens: result.usage.totalTokens
                    }, "success");
                }
            } catch (aiError) {
                console.error("[v0] AI API error:", aiError);
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, `${modelDef.displayName} API failed`, {
                    error: String(aiError)
                }, "error");
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                    status: "failed",
                    errorMessage: `AI API error (${modelDef.displayName}): ${aiError instanceof Error ? aiError.message : String(aiError)}`,
                    processingCompletedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                return Response.json({
                    error: "AI API failed",
                    details: String(aiError)
                }, {
                    status: 500
                });
            }
            const actualWords = script.split(/\s+/).length;
            console.log("[v0] Script generated, actual words:", actualWords);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Script draft complete", {
                words: actualWords,
                estimatedMinutes: Math.round(actualWords / 150),
                model: modelDef.displayName
            }, "success");
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                progress: 60,
                progressMessage: "Structuring chapters...",
                scriptText: script
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Generating chapter breakdown", {});
            // Use Anthropic for chapter parsing as well
            const { text: chaptersJson } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
                model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$anthropic$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["anthropic"])("claude-3-5-haiku-20241022"),
                prompt: `Given this narrative script, create a JSON array of chapters with titles and approximate timestamps.

SCRIPT:
${script.slice(0, 4000)}

Output a JSON array like this (estimate timestamps based on ~150 words per minute):
[
  {"number": 1, "title": "Introduction", "start_time_seconds": 0, "duration_seconds": 120},
  {"number": 2, "title": "Architecture Overview", "start_time_seconds": 120, "duration_seconds": 180},
  ...
]

Output ONLY valid JSON, no other text:`,
                maxOutputTokens: 1000,
                temperature: 0.3
            });
            let chapters = [];
            try {
                chapters = JSON.parse(chaptersJson.trim());
                console.log("[v0] Chapters parsed:", chapters.length);
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Chapters structured", {
                    chapterCount: chapters.length
                }, "success");
            } catch  {
                console.log("[v0] Chapter parsing failed, using single chapter");
                chapters = [
                    {
                        number: 1,
                        title: "Full Narrative",
                        start_time_seconds: 0,
                        duration_seconds: targetMinutes * 60
                    }
                ];
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].narrator(storyId, "Using single chapter fallback", {}, "warning");
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                chapters,
                progress: 70,
                progressMessage: "Script complete. Preparing audio synthesis..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            const elapsedMs = Date.now() - startTime;
            console.log("[v0] Elapsed time before audio synthesis:", Math.round(elapsedMs / 1000), "seconds");
            if (elapsedMs > TIMEOUT_WARNING_MS) {
                console.log("[v0] WARNING: Running low on time, may not complete audio synthesis");
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Time warning - audio synthesis may be interrupted", {
                    elapsedSeconds: Math.round(elapsedMs / 1000),
                    remainingSeconds: Math.round((300000 - elapsedMs) / 1000)
                }, "warning");
            }
            // ===== SYNTHESIZER AGENT =====
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                status: "synthesizing",
                progress: 75,
                progressMessage: "Initializing ElevenLabs..."
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
            console.log("[v0] ElevenLabs key available:", !!elevenLabsKey);
            if (elevenLabsKey) {
                const voiceId = story.voiceId || "21m00Tcm4TlvDq8ikWAM";
                const modelId = "eleven_flash_v2_5";
                const maxChunkSize = 10000 // Larger chunks for fewer API calls
                ;
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "Initializing ElevenLabs voice synthesis", {
                    voice: voiceId,
                    model: modelId,
                    totalScriptLength: script.length
                });
                const scriptChunks = splitTextIntoChunks(script, maxChunkSize);
                console.log("[v0] Script split into", scriptChunks.length, "chunks using model:", modelId);
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "Script chunked for synthesis", {
                    totalLength: script.length,
                    chunks: scriptChunks.length,
                    chunkLengths: scriptChunks.map((c)=>c.length)
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                    progress: 78,
                    progressMessage: `Generating audio (0/${scriptChunks.length} chunks)...`
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                try {
                    const audioBuffers = [];
                    const chapterAudioUrls = [];
                    for(let i = 0; i < scriptChunks.length; i++){
                        const chunk = scriptChunks[i];
                        const chunkNum = i + 1;
                        const chunkElapsed = Date.now() - startTime;
                        if (chunkElapsed > 270000) {
                            // 4.5 minutes - leave buffer for upload
                            console.log("[v0] TIMEOUT WARNING: Stopping audio generation to save progress");
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "Timeout - saving partial progress", {
                                completedChunks: i,
                                totalChunks: scriptChunks.length
                            }, "warning");
                            // Save what we have so far
                            if (chapterAudioUrls.length > 0) {
                                const partialDuration = Math.round(actualWords / scriptChunks.length * chapterAudioUrls.length / 2.5);
                                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                                    audioUrl: chapterAudioUrls[0],
                                    audioChunks: chapterAudioUrls,
                                    actualDurationSeconds: partialDuration,
                                    status: "completed",
                                    progress: 100,
                                    progressMessage: `Completed with ${chapterAudioUrls.length}/${scriptChunks.length} audio chunks (timeout)`,
                                    processingCompletedAt: new Date()
                                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                                return Response.json({
                                    success: true,
                                    partial: true,
                                    audioUrl: chapterAudioUrls[0],
                                    audioChunks: chapterAudioUrls,
                                    completedChunks: chapterAudioUrls.length,
                                    totalChunks: scriptChunks.length
                                });
                            }
                            break;
                        }
                        console.log(`[v0] Processing chunk ${chunkNum}/${scriptChunks.length}, length: ${chunk.length}`);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, `Processing chunk ${chunkNum}/${scriptChunks.length}`, {
                            chunkLength: chunk.length,
                            preview: chunk.slice(0, 100) + "..."
                        });
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                            progress: 78 + Math.round(i / scriptChunks.length * 15),
                            progressMessage: `Generating audio (${chunkNum}/${scriptChunks.length} chunks)...`
                        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                        const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
                            method: "POST",
                            headers: {
                                "xi-api-key": elevenLabsKey,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                text: chunk,
                                model_id: modelId,
                                voice_settings: {
                                    // Lower stability for more expressive fiction narration
                                    stability: story.narrativeStyle === "fiction" ? 0.35 : 0.5,
                                    // High similarity for consistent voice
                                    similarity_boost: 0.8,
                                    // Slight style exaggeration for fiction
                                    style: story.narrativeStyle === "fiction" ? 0.15 : 0,
                                    // Enable speaker boost for better voice matching
                                    use_speaker_boost: true
                                },
                                // Context for better continuity between chunks
                                previous_text: i > 0 ? scriptChunks[i - 1].slice(-1000) : undefined,
                                next_text: i < scriptChunks.length - 1 ? scriptChunks[i + 1].slice(0, 500) : undefined,
                                // Enable text normalization for proper pronunciation
                                apply_text_normalization: "auto"
                            })
                        });
                        if (!audioResponse.ok) {
                            const errorText = await audioResponse.text();
                            console.error(`[v0] ElevenLabs error on chunk ${chunkNum}:`, errorText);
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, `Chunk ${chunkNum} failed`, {
                                status: audioResponse.status,
                                error: errorText.slice(0, 200)
                            }, "error");
                            throw new Error(`ElevenLabs API error on chunk ${chunkNum}: ${errorText}`);
                        }
                        // Get request ID for continuity tracking
                        const requestId = audioResponse.headers.get("request-id");
                        if (requestId) {
                        // requestIds.push(requestId)
                        }
                        const buffer = await audioResponse.arrayBuffer();
                        audioBuffers.push(buffer);
                        console.log(`[v0] Chunk ${chunkNum} complete, size: ${buffer.byteLength} bytes`);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, `Chunk ${chunkNum} complete`, {
                            sizeBytes: buffer.byteLength
                        }, "success");
                        console.log(`[v0] Uploading chunk ${chunkNum}, size: ${buffer.byteLength} bytes`);
                        try {
                            const chunkUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadAudioChunk"])(buffer, storyId, chunkNum, "audio/mpeg");
                            chapterAudioUrls.push(chunkUrl);
                            console.log(`[v0] Chunk ${chunkNum} uploaded: ${chunkUrl}`);
                        } catch (uploadError) {
                            console.error(`[v0] Chunk ${chunkNum} upload error:`, uploadError);
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, `Chunk ${chunkNum} upload failed`, {
                                error: uploadError.message
                            }, "error");
                            throw new Error(`Failed to upload chunk ${chunkNum}: ${uploadError.message}`);
                        }
                    }
                    const totalBytes = audioBuffers.reduce((sum, b)=>sum + b.byteLength, 0);
                    console.log("[v0] All chunks synthesized and uploaded, total bytes:", totalBytes);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "All audio chunks uploaded", {
                        totalChunks: chapterAudioUrls.length,
                        totalBytes
                    }, "success");
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                        progress: 95,
                        progressMessage: "Finalizing tale..."
                    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                    const mainAudioUrl = chapterAudioUrls[0];
                    // Estimate duration: ~2.5 words per second at normal speaking pace
                    const estimatedDuration = Math.round(actualWords / 2.5);
                    const updatedChapters = chapters.map((ch, idx)=>({
                            ...ch,
                            audio_url: chapterAudioUrls[idx] || chapterAudioUrls[chapterAudioUrls.length - 1]
                        }));
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "Audio processing complete", {
                        mainUrl: mainAudioUrl,
                        chunkCount: chapterAudioUrls.length,
                        durationSeconds: estimatedDuration
                    }, "success");
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Tale generation complete!", {
                        totalDuration: estimatedDuration,
                        chapters: updatedChapters.length
                    }, "success");
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                            audioUrl: mainAudioUrl,
                            audioChunks: chapterAudioUrls,
                            chapters: updatedChapters,
                            actualDurationSeconds: estimatedDuration,
                            status: "completed",
                            progress: 100,
                            progressMessage: "Tale generated successfully!",
                            processingCompletedAt: new Date()
                        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                    } catch (finalUpdateError) {
                        console.error("[v0] Final update error:", finalUpdateError);
                    }
                    console.log("[v0] Tale generation complete!");
                    return Response.json({
                        success: true,
                        audioUrl: mainAudioUrl,
                        audioChunks: chapterAudioUrls,
                        duration: estimatedDuration
                    });
                } catch (audioError) {
                    console.error("[v0] Audio generation error:", audioError);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "Audio generation failed", {
                        error: audioError instanceof Error ? audioError.message : "Unknown error"
                    }, "error");
                    // Mark as failed, not completed
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                        status: "failed",
                        errorMessage: audioError instanceof Error ? audioError.message : "Audio generation failed",
                        processingCompletedAt: new Date()
                    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                    return Response.json({
                        error: "Audio generation failed"
                    }, {
                        status: 500
                    });
                }
            } else {
                console.log("[v0] No ElevenLabs key, completing without audio");
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].synthesizer(storyId, "ElevenLabs API key not configured", {}, "warning");
                // Fallback: complete without audio
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Completing with script only", {}, "warning");
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                    status: "completed",
                    progress: 100,
                    progressMessage: "Script generated (audio pending)",
                    processingCompletedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
                return Response.json({
                    success: true,
                    message: "Script generated successfully",
                    hasAudio: false
                });
            }
        } catch (error) {
            console.error("[v0] Generation failed:", error);
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2f$log$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"].system(storyId, "Generation failed", {
                error: error instanceof Error ? error.message : "Unknown error"
            }, "error");
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"]).set({
                status: "failed",
                errorMessage: error instanceof Error ? error.message : "Unknown error",
                processingCompletedAt: new Date()
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stories"].id, storyId));
            return Response.json({
                error: "Generation failed"
            }, {
                status: 500
            });
        }
    } catch (outerError) {
        console.error("[v0] ====== FATAL UNHANDLED ERROR ======");
        console.error("[v0] Error:", outerError);
        console.error("[v0] Stack:", outerError instanceof Error ? outerError.stack : "No stack");
        return Response.json({
            error: "Fatal generation error",
            details: outerError instanceof Error ? outerError.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f315e300._.js.map