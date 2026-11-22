import type { ComponentType } from "react";
import {
  IconApi,
  IconBolt,
  IconBrain,
  IconBrandAws,
  IconBrandCss3,
  IconBrandGolang,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandMongodb,
  IconBrandMysql,
  IconBrandRust,
  IconBrandTypescript,
  IconChartLine,
  IconCloud,
  IconCpu,
  IconDatabase,
  IconShieldLock,
  IconStack2,
} from "@tabler/icons-react";

type Icon = ComponentType<{ size?: number; stroke?: number; className?: string }>;

const ICON: Record<string, Icon> = {
  Go: IconBrandGolang,
  TypeScript: IconBrandTypescript,
  Rust: IconBrandRust,
  JavaScript: IconBrandJavascript,
  HTML: IconBrandHtml5,
  CSS: IconBrandCss3,
  AWS: IconBrandAws,
  MySQL: IconBrandMysql,
  MongoDB: IconBrandMongodb,
  PostgreSQL: IconDatabase,
  DynamoDB: IconDatabase,
  Redis: IconDatabase,
  SQL: IconDatabase,
  gRPC: IconApi,
  MCP: IconApi,
  "JSON Schema": IconApi,
  Kafka: IconBolt,
  EventBridge: IconBolt,
  SQS: IconBolt,
  "Pub/Sub": IconBolt,
  k3s: IconCloud,
  OpenTelemetry: IconChartLine,
  Semgrep: IconShieldLock,
  Claude: IconBrain,
  Java: IconCpu,
  JVM: IconCpu,
  Netty: IconCpu,
};

/** The stack of a role as small badges, each with its brand or category icon. */
export function StackBadges({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const Glyph = ICON[item] ?? IconStack2;
        return (
          <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-raised py-1 pl-2 pr-2.5 text-meta text-fg/85">
            <Glyph size={13} stroke={1.6} className="text-muted" />
            {item}
          </li>
        );
      })}
    </ul>
  );
}
