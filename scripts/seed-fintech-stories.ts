/**
 * CODE TALES - FINTECH STORIES SEED SCRIPT
 * 
 * Seeds 25 financial/fintech repository stories with sci-fi themes.
 * All stories use fiction narrative style with 20-30 minute durations.
 * 
 * Run with: npx tsx scripts/seed-fintech-stories.ts
 */

import { db, stories, codeRepositories, users } from "../lib/db"
import { eq } from "drizzle-orm"

const USER_ID = "replit-codetales-tester"

const VOICE_IDS = {
  fiction: "EXAVITQu4vr4xnSDxMaL",
  rachel: "21m00Tcm4TlvDq8ikWAM",
}

interface FintechRepo {
  owner: string
  name: string
  title: string
  language: string
  description: string
}

const FINTECH_REPOS: FintechRepo[] = [
  {
    owner: "openbb-finance",
    name: "OpenBBTerminal",
    title: "Galactic Market Oracle",
    language: "Python",
    description: "Investment research platform for everyone, anywhere",
  },
  {
    owner: "drand",
    name: "drand",
    title: "Cosmic Randomness Beacon",
    language: "Go",
    description: "Distributed randomness beacon daemon",
  },
  {
    owner: "trustwallet",
    name: "wallet-core",
    title: "Interstellar Custody Vault",
    language: "C++",
    description: "Cross-platform, cross-blockchain wallet library",
  },
  {
    owner: "ignite",
    name: "cli",
    title: "Mars Chain Federation",
    language: "Go",
    description: "Ignite CLI for scaffolding sovereign blockchains",
  },
  {
    owner: "dydxprotocol",
    name: "v4-chain",
    title: "Zero-Gravity Derivatives Pit",
    language: "Go",
    description: "dYdX v4 protocol - decentralized perpetuals exchange",
  },
  {
    owner: "UMAprotocol",
    name: "protocol",
    title: "Synthetic Reality Swaps",
    language: "TypeScript",
    description: "UMA Protocol - optimistic oracle for Web3",
  },
  {
    owner: "hyperledger",
    name: "fabric",
    title: "Consortium Starships Charter",
    language: "Go",
    description: "Enterprise-grade distributed ledger framework",
  },
  {
    owner: "StellarCN",
    name: "py-stellar-base",
    title: "Photon Remittance Corridors",
    language: "Python",
    description: "Python SDK for Stellar network",
  },
  {
    owner: "stripe",
    name: "stripe-cli",
    title: "Hyperlane Payment Scouts",
    language: "Go",
    description: "Stripe CLI for local development and testing",
  },
  {
    owner: "square",
    name: "sqip",
    title: "Asteroid Bazaar Terminals",
    language: "JavaScript",
    description: "Square In-App Payments SDK examples",
  },
  {
    owner: "moov-io",
    name: "moov",
    title: "Galactic Treasury Rails",
    language: "Go",
    description: "Open-source financial infrastructure",
  },
  {
    owner: "coinbase",
    name: "kryptology",
    title: "Quantum Vault Breakers",
    language: "Go",
    description: "Coinbase's cryptographic library",
  },
  {
    owner: "QuantConnect",
    name: "Lean",
    title: "Celestial Hedge AI",
    language: "C#",
    description: "Algorithmic trading engine for backtesting and live trading",
  },
  {
    owner: "robinhood",
    name: "faust",
    title: "Nebula Event Runners",
    language: "Python",
    description: "Python Stream Processing library",
  },
  {
    owner: "algorand",
    name: "go-algorand",
    title: "Dyson-Ledger Governance",
    language: "Go",
    description: "Algorand's official implementation in Go",
  },
  {
    owner: "blockscout",
    name: "blockscout",
    title: "Explorer Probes Constellation",
    language: "Elixir",
    description: "Blockchain explorer for Ethereum-based networks",
  },
  {
    owner: "paypal",
    name: "hera",
    title: "Risk Sentry Network",
    language: "Go",
    description: "PayPal's database connection pool proxy",
  },
  {
    owner: "venmo",
    name: "business-ios",
    title: "Moon Kiosk Payments",
    language: "Python",
    description: "Venmo payment integration tools",
  },
  {
    owner: "finos",
    name: "legend",
    title: "Data Enclave Citadel",
    language: "Java",
    description: "FINOS Legend data platform for financial services",
  },
  {
    owner: "finbourne",
    name: "lusid-sdk-python",
    title: "Portfolio Stardock",
    language: "Python",
    description: "Python SDK for LUSID investment management platform",
  },
  {
    owner: "defi-wonderland",
    name: "smock",
    title: "Simulated Liquidity Holosuite",
    language: "TypeScript",
    description: "Solidity mocking library for testing smart contracts",
  },
  {
    owner: "smartcontractkit",
    name: "chainlink",
    title: "Oracle Constellations",
    language: "Go",
    description: "Chainlink decentralized oracle network",
  },
  {
    owner: "terra-money",
    name: "classic-core",
    title: "Terraform Credit System",
    language: "Go",
    description: "Terra Classic blockchain core",
  },
  {
    owner: "makerdao",
    name: "dss",
    title: "Stablecraft Guild Saga",
    language: "Solidity",
    description: "Multi-Collateral Dai smart contracts",
  },
  {
    owner: "compound-finance",
    name: "compound-protocol",
    title: "Lending Ark Armada",
    language: "Solidity",
    description: "Compound Protocol - decentralized lending protocol",
  },
]

async function ensureTestUserExists() {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, USER_ID))
    .limit(1)

  if (existingUser.length === 0) {
    console.log("Creating test user...")
    await db.insert(users).values({
      id: USER_ID,
      email: "codetales-tester@test.replit.com",
      firstName: "CodeTales",
      lastName: "Tester",
      subscriptionTier: "premium",
    })
    console.log("✓ Test user created")
  } else {
    console.log("✓ Test user already exists")
  }
}

async function seedFintechStories() {
  console.log("====== CODE TALES: FINTECH STORIES SEED ======\n")
  
  await ensureTestUserExists()
  
  console.log(`\nSeeding ${FINTECH_REPOS.length} fintech repositories and stories...\n`)

  const createdItems: Array<{ repo: any; story: any }> = []

  for (let i = 0; i < FINTECH_REPOS.length; i++) {
    const repo = FINTECH_REPOS[i]
    const generationMode = i % 2 === 0 ? "hybrid" : "studio"
    const targetDuration = 20 + (i % 11)

    console.log(`\n[${i + 1}/${FINTECH_REPOS.length}] ${repo.owner}/${repo.name}`)
    console.log(`  Title: "${repo.title}"`)
    console.log(`  Language: ${repo.language}`)
    console.log(`  Generation Mode: ${generationMode}`)
    console.log(`  Duration: ${targetDuration} minutes`)

    try {
      const [createdRepo] = await db
        .insert(codeRepositories)
        .values({
          userId: USER_ID,
          repoUrl: `https://github.com/${repo.owner}/${repo.name}`,
          repoName: repo.name,
          repoOwner: repo.owner,
          primaryLanguage: repo.language,
          description: repo.description,
          starsCount: Math.floor(Math.random() * 10000) + 500,
        })
        .returning()

      console.log(`  ✓ Repository created: ${createdRepo.id}`)

      const [createdStory] = await db
        .insert(stories)
        .values({
          userId: USER_ID,
          repositoryId: createdRepo.id,
          title: repo.title,
          narrativeStyle: "fiction",
          expertiseLevel: "intermediate",
          targetDurationMinutes: targetDuration,
          voiceId: VOICE_IDS.fiction,
          status: "pending",
          progress: 0,
          progressMessage: "Queued for generation...",
          isPublic: true,
          generationMode: generationMode,
        })
        .returning()

      console.log(`  ✓ Story created: ${createdStory.id}`)

      createdItems.push({ repo: createdRepo, story: createdStory })
    } catch (error) {
      console.error(`  ✗ Error:`, error)
    }
  }

  console.log("\n\n====== SEED COMPLETE ======")
  console.log(`Created ${createdItems.length} repositories and stories\n`)

  console.log("STORIES SUMMARY:")
  console.log("-".repeat(80))
  
  for (const { repo, story } of createdItems) {
    console.log(`${story.title}`)
    console.log(`  Repo: ${repo.repoOwner}/${repo.repoName} (${repo.primaryLanguage})`)
    console.log(`  Story ID: ${story.id}`)
    console.log(`  Mode: ${story.generationMode} | Duration: ${story.targetDurationMinutes}min`)
    console.log(`  URL: /story/${story.id}`)
    console.log("")
  }

  console.log("-".repeat(80))
  console.log(`Total: ${createdItems.length} stories ready for generation`)
  console.log(`Hybrid mode: ${createdItems.filter(x => x.story.generationMode === "hybrid").length}`)
  console.log(`Studio mode: ${createdItems.filter(x => x.story.generationMode === "studio").length}`)
}

seedFintechStories()
  .then(() => {
    console.log("\n✓ Seed script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n✗ Seed script failed:", error)
    process.exit(1)
  })
