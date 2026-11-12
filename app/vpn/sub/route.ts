import { NextResponse } from "next/server";
import { sameSecret } from "../../../lib/vpn";

export const dynamic = "force-dynamic";

function clientOf(request: Request) {
  const asked = new URL(request.url).searchParams.get("client");
  if (asked === "clash" || asked === "rocket") return asked;
  const ua = request.headers.get("user-agent") || "";
  if (/shadowrocket/i.test(ua)) return "rocket";
  if (/clash|mihomo|stash/i.test(ua)) return "clash";
  return "";
}

export function GET(request: Request) {
  const token = process.env.VPN_SUB_TOKEN || "";
  const given = new URL(request.url).searchParams.get("t") || "";
  if (!sameSecret(given, token)) {
    return new NextResponse("unauthorized", { status: 401, headers: { "cache-control": "no-store" } });
  }

  const client = clientOf(request);
  if (client === "clash") {
    const yaml = process.env.VPN_CLASH_YAML || "";
    if (!yaml) return new NextResponse("not configured", { status: 503, headers: { "cache-control": "no-store" } });
    return new NextResponse(yaml, {
      headers: {
        "content-type": "text/yaml; charset=utf-8",
        "content-disposition": 'attachment; filename="nodes.yaml"',
        "cache-control": "no-store",
        "profile-update-interval": "24",
      },
    });
  }

  if (client === "rocket") {
    const links = process.env.VPN_NODE_LINKS || "";
    if (!links) return new NextResponse("not configured", { status: 503, headers: { "cache-control": "no-store" } });
    const body = Buffer.from(`${links.trim()}\n`, "utf8").toString("base64");
    return new NextResponse(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "profile-update-interval": "24",
      },
    });
  }

  return new NextResponse("unauthorized", { status: 401, headers: { "cache-control": "no-store" } });
}
