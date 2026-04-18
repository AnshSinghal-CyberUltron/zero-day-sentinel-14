export type Ecosystem = "npm" | "docker" | "mcp" | "huggingface";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type AdvisoryStatus = "DISCLOSED" | "EMBARGOED" | "PATCHED";

export const ECOSYSTEM_LABEL: Record<Ecosystem, string> = {
  npm: "npm",
  docker: "Docker",
  mcp: "MCP",
  huggingface: "Hugging Face",
};

export const ECOSYSTEM_SHORT: Record<Ecosystem, string> = {
  npm: "NPM",
  docker: "DOCKER",
  mcp: "MCP",
  huggingface: "HF",
};

export const ECOSYSTEM_GLYPH: Record<Ecosystem, string> = {
  npm: "▲",
  docker: "◆",
  mcp: "✦",
  huggingface: "☷",
};

export interface Artifact {
  slug: string; // url-safe, unique within ecosystem
  ecosystem: Ecosystem;
  name: string;
  version: string;
  publisher: string;
  downloads: number; // weekly or total — see formatDownloads
  downloadsPeriod: "wk" | "total" | "dl";
  aiConfidence: number; // 0–100
  zeroDayIds: string[]; // refs Advisory.id
  lastScanned: string; // ISO date
  description: string;
  firstSeen: string;
}

export interface Advisory {
  id: string; // ZDS-YYYY-NNNN
  ecosystem: Ecosystem;
  affectedSlugs: string[]; // refs Artifact.slug
  severity: Severity;
  title: string;
  summary: string;
  cwe: string;
  cvss: number;
  vector: string;
  aiConfidence: number;
  discoveredAt: string;
  status: AdvisoryStatus;
  poc?: string;
}

export interface EcosystemStats {
  ecosystem: Ecosystem;
  scannedToday: number;
  scannedTotal: number;
  zeroDaysFound: number;
  zeroDaysToday: number;
  avgConfidence: number;
  lastScan: string;
}

// ---------- ARTIFACTS ----------
export const artifacts: Artifact[] = [
  // npm
  {
    slug: "fast-stream-parser",
    ecosystem: "npm",
    name: "fast-stream-parser",
    version: "4.2.1",
    publisher: "stream-labs",
    downloads: 3_100_000,
    downloadsPeriod: "wk",
    aiConfidence: 97,
    zeroDayIds: ["ZDS-2025-0142"],
    lastScanned: "2025-04-14T08:12:00Z",
    description: "Streaming JSON / NDJSON parser with backpressure support.",
    firstSeen: "2019-08-02",
  },
  {
    slug: "tinycolor-utils",
    ecosystem: "npm",
    name: "tinycolor-utils",
    version: "1.3.4",
    publisher: "anon-89412",
    downloads: 12_400,
    downloadsPeriod: "wk",
    aiConfidence: 88,
    zeroDayIds: ["ZDS-2025-0138"],
    lastScanned: "2025-04-08T11:02:00Z",
    description: "Color helpers — typo-squat of tinycolor2.",
    firstSeen: "2025-03-29",
  },
  {
    slug: "express-jwt-shim",
    ecosystem: "npm",
    name: "express-jwt-shim",
    version: "2.0.7",
    publisher: "midware-co",
    downloads: 412_000,
    downloadsPeriod: "wk",
    aiConfidence: 74,
    zeroDayIds: ["ZDS-2025-0133"],
    lastScanned: "2025-04-12T03:10:00Z",
    description: "Drop-in JWT verification middleware for Express.",
    firstSeen: "2021-11-14",
  },
  {
    slug: "node-archive-x",
    ecosystem: "npm",
    name: "node-archive-x",
    version: "0.9.1",
    publisher: "archive-x",
    downloads: 88_000,
    downloadsPeriod: "wk",
    aiConfidence: 91,
    zeroDayIds: ["ZDS-2025-0131"],
    lastScanned: "2025-04-09T17:55:00Z",
    description: "Tar/zip extraction with streaming API.",
    firstSeen: "2020-04-19",
  },

  // docker
  {
    slug: "library-redis-7-4-alpine",
    ecosystem: "docker",
    name: "library/redis",
    version: "7.4-alpine",
    publisher: "Docker Official",
    downloads: 1_000_000_000,
    downloadsPeriod: "total",
    aiConfidence: 82,
    zeroDayIds: ["ZDS-2025-0140"],
    lastScanned: "2025-04-11T09:00:00Z",
    description: "Official Redis image, Alpine variant.",
    firstSeen: "2014-08-19",
  },
  {
    slug: "bitnami-postgresql-16",
    ecosystem: "docker",
    name: "bitnami/postgresql",
    version: "16.2.0-debian-12",
    publisher: "Bitnami",
    downloads: 500_000_000,
    downloadsPeriod: "total",
    aiConfidence: 69,
    zeroDayIds: ["ZDS-2025-0135"],
    lastScanned: "2025-04-02T22:31:00Z",
    description: "Production-ready PostgreSQL container by Bitnami.",
    firstSeen: "2017-02-10",
  },
  {
    slug: "anon-build-toolchain-latest",
    ecosystem: "docker",
    name: "anon/build-toolchain",
    version: "latest",
    publisher: "anon-pub",
    downloads: 1_240_000,
    downloadsPeriod: "total",
    aiConfidence: 94,
    zeroDayIds: ["ZDS-2025-0129"],
    lastScanned: "2025-04-07T14:20:00Z",
    description: "All-in-one build toolchain image.",
    firstSeen: "2024-11-02",
  },

  // mcp
  {
    slug: "acme-mcp-filesystem",
    ecosystem: "mcp",
    name: "@acme/mcp-filesystem",
    version: "0.9.2",
    publisher: "acme",
    downloads: 18_400,
    downloadsPeriod: "wk",
    aiConfidence: 96,
    zeroDayIds: ["ZDS-2025-0139"],
    lastScanned: "2025-04-10T12:00:00Z",
    description: "MCP server exposing local filesystem read/write tools.",
    firstSeen: "2024-09-12",
  },
  {
    slug: "browser-control-mcp",
    ecosystem: "mcp",
    name: "browser-control-mcp",
    version: "1.2.0",
    publisher: "browser-tools",
    downloads: 6_900,
    downloadsPeriod: "wk",
    aiConfidence: 89,
    zeroDayIds: ["ZDS-2025-0137"],
    lastScanned: "2025-04-06T18:30:00Z",
    description: "MCP server for headless browser control.",
    firstSeen: "2024-12-01",
  },
  {
    slug: "mcp-shell-runner",
    ecosystem: "mcp",
    name: "mcp-shell-runner",
    version: "0.4.0",
    publisher: "shellnet",
    downloads: 4_100,
    downloadsPeriod: "wk",
    aiConfidence: 92,
    zeroDayIds: ["ZDS-2025-0128"],
    lastScanned: "2025-04-05T10:10:00Z",
    description: "MCP server exposing shell commands as tools.",
    firstSeen: "2025-01-21",
  },

  // huggingface
  {
    slug: "openllm-whisper-turbo-quant",
    ecosystem: "huggingface",
    name: "openllm/whisper-turbo-quant",
    version: "snapshot-8a1f",
    publisher: "openllm",
    downloads: 48_000,
    downloadsPeriod: "dl",
    aiConfidence: 95,
    zeroDayIds: ["ZDS-2025-0141"],
    lastScanned: "2025-04-13T07:45:00Z",
    description: "Quantized Whisper Turbo for CPU inference.",
    firstSeen: "2025-02-08",
  },
  {
    slug: "anon-diffusers-checkpoint-pack",
    ecosystem: "huggingface",
    name: "anon/diffusers-checkpoint-pack",
    version: "v3",
    publisher: "anon",
    downloads: 9_300,
    downloadsPeriod: "dl",
    aiConfidence: 81,
    zeroDayIds: ["ZDS-2025-0136"],
    lastScanned: "2025-04-04T13:00:00Z",
    description: "Bundle of curated SD checkpoints.",
    firstSeen: "2025-01-10",
  },
  {
    slug: "redteam-llama-3-uncensored",
    ecosystem: "huggingface",
    name: "redteam/llama-3-uncensored",
    version: "ggml-q4",
    publisher: "redteam",
    downloads: 220_000,
    downloadsPeriod: "dl",
    aiConfidence: 78,
    zeroDayIds: ["ZDS-2025-0127"],
    lastScanned: "2025-04-03T09:00:00Z",
    description: "Fine-tuned Llama 3 variant.",
    firstSeen: "2024-11-30",
  },
];

// ---------- ADVISORIES ----------
export const advisories: Advisory[] = [
  {
    id: "ZDS-2025-0142",
    ecosystem: "npm",
    affectedSlugs: ["fast-stream-parser"],
    severity: "CRITICAL",
    title: "Prototype pollution via crafted JSON chunk",
    summary:
      "Unsanitized property assignment during streamed JSON parsing allows a remote attacker to mutate Object.prototype, leading to RCE in Express middleware contexts.",
    cwe: "CWE-1321",
    cvss: 9.8,
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    aiConfidence: 97,
    discoveredAt: "2025-04-14",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0141",
    ecosystem: "huggingface",
    affectedSlugs: ["openllm-whisper-turbo-quant"],
    severity: "HIGH",
    title: "Pickle deserialization backdoor in tokenizer.bin",
    summary:
      "Hidden __reduce__ payload spawns reverse shell on first .from_pretrained() call. Confirmed in 4 mirror forks.",
    cwe: "CWE-502",
    cvss: 8.4,
    vector: "AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    aiConfidence: 95,
    discoveredAt: "2025-04-13",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0140",
    ecosystem: "docker",
    affectedSlugs: ["library-redis-7-4-alpine"],
    severity: "HIGH",
    title: "World-writable /var/run permits LPE in sidecar pattern",
    summary:
      "Default permissions on the runtime directory allow any container sharing the IPC namespace to escalate to redis user.",
    cwe: "CWE-732",
    cvss: 7.8,
    vector: "AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L",
    aiConfidence: 82,
    discoveredAt: "2025-04-11",
    status: "PATCHED",
  },
  {
    id: "ZDS-2025-0139",
    ecosystem: "mcp",
    affectedSlugs: ["acme-mcp-filesystem"],
    severity: "CRITICAL",
    title: "Path traversal in tool/read_file allows host FS read",
    summary:
      "The read_file MCP tool fails to canonicalize paths before its allowlist check. A model-issued '../' escape exfiltrates SSH keys and .env from the host.",
    cwe: "CWE-22",
    cvss: 9.4,
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N",
    aiConfidence: 96,
    discoveredAt: "2025-04-10",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0138",
    ecosystem: "npm",
    affectedSlugs: ["tinycolor-utils"],
    severity: "MEDIUM",
    title: "Typo-squat shipping postinstall miner",
    summary:
      "Package mimics 'tinycolor2' by 1 char. Postinstall script downloads xmrig binary keyed to repo CI environment variables.",
    cwe: "CWE-506",
    cvss: 6.3,
    vector: "AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:H/A:L",
    aiConfidence: 88,
    discoveredAt: "2025-04-08",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0137",
    ecosystem: "mcp",
    affectedSlugs: ["browser-control-mcp"],
    severity: "HIGH",
    title: "Prompt-injectable cookie exfiltration",
    summary:
      "MCP server returns full document.cookie when LLM is convinced via injected page content. No origin filtering.",
    cwe: "CWE-200",
    cvss: 7.4,
    vector: "AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N",
    aiConfidence: 89,
    discoveredAt: "2025-04-06",
    status: "EMBARGOED",
  },
  {
    id: "ZDS-2025-0136",
    ecosystem: "huggingface",
    affectedSlugs: ["anon-diffusers-checkpoint-pack"],
    severity: "MEDIUM",
    title: "Embedded Lambda layer phones home with prompts",
    summary:
      "Custom forward() hook POSTs every prompt + completion to attacker-controlled endpoint. Triggers after 100 inferences.",
    cwe: "CWE-359",
    cvss: 6.1,
    vector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
    aiConfidence: 81,
    discoveredAt: "2025-04-04",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0135",
    ecosystem: "docker",
    affectedSlugs: ["bitnami-postgresql-16"],
    severity: "LOW",
    title: "Default entrypoint logs PG password to stdout on retry",
    summary:
      "Connection retry loop accidentally echoes POSTGRES_PASSWORD into container logs aggregated by most cloud providers.",
    cwe: "CWE-532",
    cvss: 3.7,
    vector: "AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N",
    aiConfidence: 69,
    discoveredAt: "2025-04-02",
    status: "PATCHED",
  },
  {
    id: "ZDS-2025-0133",
    ecosystem: "npm",
    affectedSlugs: ["express-jwt-shim"],
    severity: "HIGH",
    title: "JWT 'none' algorithm accepted under fallback path",
    summary:
      "When the configured algorithm list is empty (a common misuse), the shim falls back to 'none', allowing forged tokens.",
    cwe: "CWE-327",
    cvss: 8.1,
    vector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
    aiConfidence: 74,
    discoveredAt: "2025-03-30",
    status: "PATCHED",
  },
  {
    id: "ZDS-2025-0131",
    ecosystem: "npm",
    affectedSlugs: ["node-archive-x"],
    severity: "HIGH",
    title: "Zip-slip path traversal during extraction",
    summary:
      "Entries with absolute or '../' paths are written outside the destination dir, enabling arbitrary file write.",
    cwe: "CWE-22",
    cvss: 8.0,
    vector: "AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:H",
    aiConfidence: 91,
    discoveredAt: "2025-03-26",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0129",
    ecosystem: "docker",
    affectedSlugs: ["anon-build-toolchain-latest"],
    severity: "CRITICAL",
    title: "Embedded SSH key in /root/.ssh grants pull-time backdoor",
    summary:
      "Image ships with a pre-authorized public key; any host that mounts ~/.ssh from the container inherits the backdoor.",
    cwe: "CWE-798",
    cvss: 9.6,
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    aiConfidence: 94,
    discoveredAt: "2025-03-22",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0128",
    ecosystem: "mcp",
    affectedSlugs: ["mcp-shell-runner"],
    severity: "CRITICAL",
    title: "Unbounded shell tool with no allowlist",
    summary:
      "The exec tool passes the model-supplied command directly to /bin/sh -c with no allowlist or sandbox.",
    cwe: "CWE-78",
    cvss: 9.9,
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    aiConfidence: 92,
    discoveredAt: "2025-03-19",
    status: "DISCLOSED",
  },
  {
    id: "ZDS-2025-0127",
    ecosystem: "huggingface",
    affectedSlugs: ["redteam-llama-3-uncensored"],
    severity: "MEDIUM",
    title: "Custom code in modeling_*.py auto-executed on trust_remote_code",
    summary:
      "Arbitrary Python in the modeling module exfiltrates HF_TOKEN environment variable on first import.",
    cwe: "CWE-94",
    cvss: 6.8,
    vector: "AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N",
    aiConfidence: 78,
    discoveredAt: "2025-03-18",
    status: "DISCLOSED",
  },
];

// ---------- LOOKUPS ----------
export const advisoryById = new Map(advisories.map((a) => [a.id, a]));
export const artifactBySlug = new Map(
  artifacts.map((a) => [`${a.ecosystem}:${a.slug}`, a]),
);

export function getArtifact(eco: Ecosystem, slug: string): Artifact | undefined {
  return artifactBySlug.get(`${eco}:${slug}`);
}

export function getAdvisoriesForArtifact(eco: Ecosystem, slug: string): Advisory[] {
  return advisories.filter(
    (a) => a.ecosystem === eco && a.affectedSlugs.includes(slug),
  );
}

export function getArtifactsForAdvisory(adv: Advisory): Artifact[] {
  return adv.affectedSlugs
    .map((s) => getArtifact(adv.ecosystem, s))
    .filter((x): x is Artifact => Boolean(x));
}

export function getArtifactsByEcosystem(eco: Ecosystem): Artifact[] {
  return artifacts.filter((a) => a.ecosystem === eco);
}

export function getAdvisoriesByEcosystem(eco: Ecosystem): Advisory[] {
  return advisories.filter((a) => a.ecosystem === eco);
}

// ---------- STATS ----------
const SCAN_TOTALS: Record<Ecosystem, { total: number; today: number }> = {
  npm: { total: 8_412_330, today: 14_220 },
  docker: { total: 2_104_902, today: 6_180 },
  mcp: { total: 1_842, today: 24 },
  huggingface: { total: 412_088, today: 1_905 },
};

export const ecosystemStats: EcosystemStats[] = (
  Object.keys(ECOSYSTEM_LABEL) as Ecosystem[]
).map((eco) => {
  const advs = getAdvisoriesByEcosystem(eco);
  const today = "2025-04-14";
  const arts = getArtifactsByEcosystem(eco);
  const avg =
    arts.length === 0
      ? 0
      : Math.round(arts.reduce((s, a) => s + a.aiConfidence, 0) / arts.length);
  return {
    ecosystem: eco,
    scannedToday: SCAN_TOTALS[eco].today,
    scannedTotal: SCAN_TOTALS[eco].total,
    zeroDaysFound: advs.length,
    zeroDaysToday: advs.filter((a) => a.discoveredAt === today).length,
    avgConfidence: avg,
    lastScan: arts.reduce<string>(
      (latest, a) => (a.lastScanned > latest ? a.lastScanned : latest),
      "",
    ),
  };
});

export const globalStats = {
  scannedToday: ecosystemStats.reduce((s, e) => s + e.scannedToday, 0),
  scannedTotal: ecosystemStats.reduce((s, e) => s + e.scannedTotal, 0),
  zeroDaysFound: advisories.length,
  zeroDaysToday: advisories.filter((a) => a.discoveredAt === "2025-04-14").length,
  avgConfidence: Math.round(
    artifacts.reduce((s, a) => s + a.aiConfidence, 0) / artifacts.length,
  ),
};

// ---------- FORMATTERS ----------
export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDownloads(a: Artifact): string {
  const n = formatNumber(a.downloads);
  const suffix =
    a.downloadsPeriod === "wk" ? "/wk" : a.downloadsPeriod === "dl" ? " dl" : " pulls";
  return `${n}${suffix}`;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date("2025-04-14T12:00:00Z").getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
