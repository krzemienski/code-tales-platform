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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/generation/elevenlabs-studio.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ElevenLabs Studio API Integration for Full Production Pipeline
// Documentation: https://elevenlabs.io/docs/api-reference/studio
__turbopack_context__.s([
    "DURATION_PRESETS",
    ()=>DURATION_PRESETS,
    "QUALITY_PRESETS",
    ()=>QUALITY_PRESETS,
    "RECOMMENDED_VOICE_PAIRS",
    ()=>RECOMMENDED_VOICE_PAIRS,
    "convertChapter",
    ()=>convertChapter,
    "createAudiobookProject",
    ()=>createAudiobookProject,
    "createGenFMPodcast",
    ()=>createGenFMPodcast,
    "createStudioProject",
    ()=>createStudioProject,
    "downloadProjectAudio",
    ()=>downloadProjectAudio,
    "getChapterSnapshots",
    ()=>getChapterSnapshots,
    "getProjectChapters",
    ()=>getProjectChapters,
    "getProjectStatus",
    ()=>getProjectStatus,
    "getVoicePreview",
    ()=>getVoicePreview,
    "listModels",
    ()=>listModels,
    "listProjects",
    ()=>listProjects,
    "listVoices",
    ()=>listVoices,
    "streamChapterAudio",
    ()=>streamChapterAudio,
    "waitForProjectCompletion",
    ()=>waitForProjectCompletion
]);
const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";
// =====================================================
// API FUNCTIONS
// =====================================================
function getApiKey() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        throw new Error("ELEVENLABS_API_KEY not configured");
    }
    return apiKey;
}
async function createGenFMPodcast(content, config, callbackUrl) {
    const apiKey = getApiKey();
    const mode = config.hosts.guest ? {
        type: "conversation",
        conversation: {
            host_voice_id: config.hosts.main,
            guest_voice_id: config.hosts.guest
        }
    } : {
        type: "bulletin",
        bulletin: {
            voice_id: config.hosts.main
        }
    };
    const request = {
        model_id: "eleven_flash_v2_5",
        mode,
        source: {
            type: "text",
            text: content
        },
        quality_preset: config.qualityPreset || "high",
        duration_scale: config.duration || "default",
        language: config.language || "en",
        intro: config.intro,
        outro: config.outro,
        instructions_prompt: config.instructionsPrompt,
        callback_url: callbackUrl,
        apply_text_normalization: "auto"
    };
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/podcasts`, {
        method: "POST",
        headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create GenFM podcast: ${response.status} - ${error}`);
    }
    const data = await response.json();
    return data.project;
}
async function createAudiobookProject(name, content, config, callbackUrl) {
    const apiKey = getApiKey();
    const request = {
        name,
        from_content: content,
        default_paragraph_voice_id: config.hosts.main,
        default_title_voice_id: config.hosts.main,
        default_model_id: "eleven_multilingual_v2",
        quality_preset: config.qualityPreset || "high",
        language: config.language || "en",
        fiction: true,
        volume_normalization: true,
        callback_url: callbackUrl
    };
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects`, {
        method: "POST",
        headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create audiobook project: ${response.status} - ${error}`);
    }
    return response.json();
}
async function createStudioProject(name, content, config, callbackUrl) {
    if (config.format === "podcast") {
        return createGenFMPodcast(content, config, callbackUrl);
    }
    return createAudiobookProject(name, content, config, callbackUrl);
}
async function getProjectStatus(projectId) {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get project status: ${response.status} - ${error}`);
    }
    return response.json();
}
async function listProjects() {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to list projects: ${response.status} - ${error}`);
    }
    return response.json();
}
async function getProjectChapters(projectId) {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get project chapters: ${response.status} - ${error}`);
    }
    return response.json();
}
async function getChapterSnapshots(projectId, chapterId) {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/snapshots`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get chapter snapshots: ${response.status} - ${error}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.snapshots || [];
}
async function streamChapterAudio(projectId, chapterId, snapshotId) {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/snapshots/${snapshotId}/stream`, {
        method: "POST",
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to stream chapter audio: ${response.status} - ${error}`);
    }
    return response.arrayBuffer();
}
async function convertChapter(projectId, chapterId) {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/convert`, {
        method: "POST",
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to convert chapter: ${response.status} - ${error}`);
    }
}
async function waitForProjectCompletion(projectId, maxWaitMs = 600000, pollIntervalMs = 5000, onProgress) {
    const startTime = Date.now();
    while(Date.now() - startTime < maxWaitMs){
        const project = await getProjectStatus(projectId);
        onProgress?.(project);
        if (project.state === "ready" || project.state === "completed" || project.can_be_downloaded) {
            return project;
        }
        if (project.state === "default" && project.can_be_downloaded) {
            return project;
        }
        await new Promise((resolve)=>setTimeout(resolve, pollIntervalMs));
    }
    throw new Error(`Studio project timed out after ${maxWaitMs}ms`);
}
async function downloadProjectAudio(projectId) {
    const { chapters } = await getProjectChapters(projectId);
    const audioChunks = [];
    for (const chapter of chapters){
        if (chapter.state === "ready" || chapter.state === "default") {
            try {
                const snapshots = await getChapterSnapshots(projectId, chapter.chapter_id);
                if (snapshots && snapshots.length > 0) {
                    const latestSnapshot = snapshots[snapshots.length - 1];
                    const audio = await streamChapterAudio(projectId, chapter.chapter_id, latestSnapshot.chapter_snapshot_id);
                    audioChunks.push({
                        chapterId: chapter.chapter_id,
                        audio
                    });
                }
            } catch (error) {
                console.error(`Failed to download chapter ${chapter.chapter_id}:`, error);
            }
        }
    }
    return audioChunks;
}
async function listVoices() {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/voices`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to list voices: ${response.status} - ${error}`);
    }
    return response.json();
}
async function listModels() {
    const apiKey = getApiKey();
    const response = await fetch(`${ELEVENLABS_API_BASE}/models`, {
        headers: {
            "xi-api-key": apiKey
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to list models: ${response.status} - ${error}`);
    }
    return response.json();
}
async function getVoicePreview(voiceId) {
    const { voices } = await listVoices();
    const voice = voices.find((v)=>v.voice_id === voiceId);
    return voice?.preview_url || null;
}
const RECOMMENDED_VOICE_PAIRS = {
    tech_podcast: {
        host: {
            id: "21m00Tcm4TlvDq8ikWAM",
            name: "Rachel"
        },
        guest: {
            id: "AZnzlk1XvdvUeBnXmlld",
            name: "Domi"
        },
        description: "Professional tech discussion with female voices"
    },
    documentary: {
        host: {
            id: "ErXwobaYiN019PkySvjV",
            name: "Antoni"
        },
        guest: {
            id: "TxGEqnHWrfWFTfGW9XjX",
            name: "Josh"
        },
        description: "Documentary-style narration with male voices"
    },
    casual_chat: {
        host: {
            id: "pNInz6obpgDQGcFmaJgB",
            name: "Adam"
        },
        guest: {
            id: "EXAVITQu4vr4xnSDxMaL",
            name: "Bella"
        },
        description: "Casual, friendly conversation style"
    },
    educational: {
        host: {
            id: "yoZ06aMxZJJ28mfd3POQ",
            name: "Sam"
        },
        guest: {
            id: "21m00Tcm4TlvDq8ikWAM",
            name: "Rachel"
        },
        description: "Educational content with expert tone"
    }
};
const QUALITY_PRESETS = {
    standard: {
        id: "standard",
        name: "Standard",
        description: "128kbps, 44.1kHz - Good for most uses",
        cost: "1x"
    },
    high: {
        id: "high",
        name: "High Quality",
        description: "192kbps, 44.1kHz - Improved audio quality",
        cost: "1.2x"
    },
    ultra: {
        id: "ultra",
        name: "Ultra Quality",
        description: "192kbps, 44.1kHz - Highest quality processing",
        cost: "1.5x"
    },
    ultra_lossless: {
        id: "ultra_lossless",
        name: "Ultra Lossless",
        description: "705.6kbps, 44.1kHz - Lossless quality for archival",
        cost: "2x"
    }
};
const DURATION_PRESETS = {
    short: {
        id: "short",
        name: "Short",
        description: "Under 3 minutes - Quick overview"
    },
    default: {
        id: "default",
        name: "Standard",
        description: "3-7 minutes - Balanced coverage"
    },
    long: {
        id: "long",
        name: "Long",
        description: "7+ minutes - Detailed exploration"
    }
};
}),
"[project]/app/api/voices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generation$2f$elevenlabs$2d$studio$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generation/elevenlabs-studio.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const { voices } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generation$2f$elevenlabs$2d$studio$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listVoices"])();
        const categorizedVoices = {
            recommended: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generation$2f$elevenlabs$2d$studio$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RECOMMENDED_VOICE_PAIRS"]).map(([key, pair])=>({
                    id: key,
                    name: pair.description,
                    host: pair.host,
                    guest: pair.guest
                })),
            all: voices.map((v)=>({
                    id: v.voice_id,
                    name: v.name,
                    category: v.category,
                    description: v.description,
                    previewUrl: v.preview_url,
                    labels: v.labels
                }))
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(categorizedVoices);
    } catch (error) {
        console.error("[voices] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            recommended: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generation$2f$elevenlabs$2d$studio$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RECOMMENDED_VOICE_PAIRS"]).map(([key, pair])=>({
                    id: key,
                    name: pair.description,
                    host: pair.host,
                    guest: pair.guest
                })),
            all: [],
            error: error instanceof Error ? error.message : "Failed to fetch voices"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b19935e._.js.map