// 四个入口用同一份配方。空 node 是三台合在一起，其余三个各留一台。

const NODES = {
  tyo: "VPSTaxi-JP-TYO",
  ca: "RackNerd-US-CA",
  nyc: "LocLix-US-NYC",
};

function nodeName(node) {
  if (!node) return "";
  return NODES[node] || "";
}

function profileTitle(node) {
  return nodeName(node) || "Jailbreak";
}

function disposition(title) {
  return `attachment; filename*=UTF-8''${encodeURIComponent(title)}`;
}

function pickLinks(links, node) {
  const rows = String(links)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const name = nodeName(node);
  const picked = name
    ? rows.filter((row) => {
        const hash = row.split("#").pop() || "";
        try {
          return decodeURIComponent(hash) === name;
        } catch {
          return hash === name;
        }
      })
    : rows;
  if (!picked.length) return "";
  return `${picked.join("\n")}\n`;
}

function pickYaml(yaml, node) {
  const text = String(yaml);
  const name = nodeName(node);
  if (!name) return text.endsWith("\n") ? text : `${text}\n`;

  const proxiesAt = text.indexOf("proxies:\n");
  const groupsAt = text.indexOf("\nproxy-groups:");
  const rulesAt = text.indexOf("\nrules:");
  if (proxiesAt < 0 || groupsAt < 0 || rulesAt < 0) return "";

  const blocks = text
    .slice(proxiesAt + "proxies:\n".length, groupsAt)
    .split(/\n(?=  - name:)/)
    .map((block) => block.trimEnd())
    .filter(Boolean);
  const block = blocks.find((item) => item.includes(`name: "${name}"`) || item.includes(`name: ${name}\n`));
  if (!block) return "";

  const groups = [
    "proxy-groups:",
    "  - name: 自动",
    "    type: url-test",
    "    proxies:",
    `      - ${name}`,
    "    url: https://www.gstatic.com/generate_204",
    "    interval: 300",
    "    tolerance: 50",
    "  - name: 选择",
    "    type: select",
    "    proxies:",
    "      - 自动",
    `      - ${name}`,
    "      - DIRECT",
    "",
  ].join("\n");

  const rules = text.slice(rulesAt + 1);
  return `${text.slice(0, proxiesAt)}proxies:\n${block}\n\n${groups}${rules.endsWith("\n") ? rules : `${rules}\n`}`;
}

module.exports = { NODES, nodeName, profileTitle, disposition, pickLinks, pickYaml };
