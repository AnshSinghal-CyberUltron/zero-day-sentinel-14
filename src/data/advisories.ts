export type Ecosystem = "npm" | "docker" | "mcp" | "huggingface";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Advisory {
  id: string;
  ecosystem: Ecosystem;
  packageName: string;
  version: string;
  severity: Severity;
  title: string;
  summary: string;
  cwe: string;
  discoveredAt: string;
  status: "DISCLOSED" | "EMBARGOED" | "PATCHED";
  downloads?: string;
  vector: string;
}

export const ECOSYSTEM_LABEL: Record<Ecosystem, string> = {
  npm: "NPM",
  docker: "DOCKER",
  mcp: "MCP",
  huggingface: "HUGGING FACE",
};

export const advisories: Advisory[] = [
  {
    id: "ZDS-2025-0142",
    ecosystem: "npm",
    packageName: "fast-stream-parser",
    version: "<= 4.2.1",
    severity: "CRITICAL",
    title: "Prototype pollution via crafted JSON chunk",
    summary:
      "Unsanitized property assignment during streamed JSON parsing allows a remote attacker to mutate Object.prototype, leading to RCE in Express middleware contexts.",
    cwe: "CWE-1321",
    discoveredAt: "2025-04-14",
    status: "DISCLOSED",
    downloads: "3.1M / wk",
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
  },
  {
    id: "ZDS-2025-0141",
    ecosystem: "huggingface",
    packageName: "openllm/whisper-turbo-quant",
    version: "snapshot 8a1f",
    severity: "HIGH",
    title: "Pickle deserialization backdoor in tokenizer.bin",
    summary:
      "Hidden __reduce__ payload spawns reverse shell on first .from_pretrained() call. Confirmed live in 4 mirror forks.",
    cwe: "CWE-502",
    discoveredAt: "2025-04-13",
    status: "DISCLOSED",
    downloads: "48K dl",
    vector: "AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
  },
  {
    id: "ZDS-2025-0140",
    ecosystem: "docker",
    packageName: "library/redis:7.4-alpine",
    version: "digest a91b…",
    severity: "HIGH",
    title: "World-writable /var/run permits LPE in sidecar pattern",
    summary:
      "Default permissions on the runtime directory allow any container sharing the IPC namespace to escalate to redis user and pivot.",
    cwe: "CWE-732",
    discoveredAt: "2025-04-11",
    status: "PATCHED",
    downloads: "1B+ pulls",
    vector: "AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L",
  },
  {
    id: "ZDS-2025-0139",
    ecosystem: "mcp",
    packageName: "@acme/mcp-filesystem",
    version: "0.7.0 – 0.9.2",
    severity: "CRITICAL",
    title: "Path traversal in tool/read_file allows host FS read",
    summary:
      "The read_file MCP tool fails to canonicalize paths before its allowlist check. A model-issued '../' escape exfiltrates SSH keys and .env from the host.",
    cwe: "CWE-22",
    discoveredAt: "2025-04-10",
    status: "DISCLOSED",
    vector: "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N",
  },
  {
    id: "ZDS-2025-0138",
    ecosystem: "npm",
    packageName: "tinycolor-utils",
    version: "1.0.0 – 1.3.4",
    severity: "MEDIUM",
    title: "Typo-squat shipping postinstall miner",
    summary:
      "Package mimics 'tinycolor2' by 1 char. Postinstall script downloads xmrig binary keyed to repo CI environment variables.",
    cwe: "CWE-506",
    discoveredAt: "2025-04-08",
    status: "DISCLOSED",
    downloads: "12K / wk",
    vector: "AV:L/AC:L/PR:N/UI:R/S:U/C:L/I:H/A:L",
  },
  {
    id: "ZDS-2025-0137",
    ecosystem: "mcp",
    packageName: "browser-control-mcp",
    version: "= 1.2.0",
    severity: "HIGH",
    title: "Prompt-injectable cookie exfiltration",
    summary:
      "MCP server returns full document.cookie when LLM is convinced via injected page content. No origin filtering on cookie tool surface.",
    cwe: "CWE-200",
    discoveredAt: "2025-04-06",
    status: "EMBARGOED",
    vector: "AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N",
  },
  {
    id: "ZDS-2025-0136",
    ecosystem: "huggingface",
    packageName: "anon/diffusers-checkpoint-pack",
    version: "v3",
    severity: "MEDIUM",
    title: "Embedded Lambda layer phones home with tokenizer prompts",
    summary:
      "Custom forward() hook POSTs every prompt + completion to attacker-controlled endpoint. Triggers only after 100 inferences.",
    cwe: "CWE-359",
    discoveredAt: "2025-04-04",
    status: "DISCLOSED",
    downloads: "9.3K dl",
    vector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
  },
  {
    id: "ZDS-2025-0135",
    ecosystem: "docker",
    packageName: "bitnami/postgresql:16",
    version: "16.2.0-debian-12",
    severity: "LOW",
    title: "Default entrypoint logs PG password to stdout on retry",
    summary:
      "Connection retry loop accidentally echoes POSTGRES_PASSWORD into container logs aggregated by most cloud providers.",
    cwe: "CWE-532",
    discoveredAt: "2025-04-02",
    status: "PATCHED",
    downloads: "500M+ pulls",
    vector: "AV:L/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N",
  },
];

export const stats = {
  totalDisclosed: 142,
  ecosystems: 4,
  packagesScanned: "11.4M",
  meanTimeToDisclose: "6.2d",
};
