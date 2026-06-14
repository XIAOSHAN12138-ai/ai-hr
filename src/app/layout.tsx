"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "tdesign-react/es/style/index.css";
import "./globals.css";

const menuItems = [
  { value: "/dashboard", label: "仪表盘", icon: "📊" },
  { value: "/jobs", label: "岗位管理", icon: "💼" },
  { value: "/candidates", label: "候选人", icon: "👥" },
  { value: "/interviews", label: "面试管理", icon: "🎤" },
  { value: "/settings", label: "系统设置", icon: "⚙️" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const basePrefix = "/ai-hr";
  const rawPath = pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || "/" : pathname;
  const activeValue = "/" + (rawPath.split("/")[1] || "dashboard");

  return (
    <html lang="zh-CN">
      <head>
        <title>AI HR 智能招聘系统</title>
        <meta name="description" content="AI驱动的智能人力资源招聘管理系统" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>" />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: collapsed ? 72 : 220,
              background: "#f8fafc",
              borderRight: "1px solid #e2e8f0",
              transition: "width 0.3s ease",
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            {/* Logo */}
            <div
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                padding: collapsed ? "0" : "0 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderBottom: "1px solid #e2e8f0",
                gap: 10,
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard")}
            >
              <span style={{ fontSize: 26 }}>🤖</span>
              {!collapsed && (
                <span style={{ color: "#111827", fontSize: 17, fontWeight: 700, whiteSpace: "nowrap" }}>
                  AI HR
                </span>
              )}
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, padding: "12px 0" }}>
              {menuItems.map((item) => {
                const isActive = activeValue === item.value;
                return (
                  <div
                    key={item.value}
                    onClick={() => router.push(item.value)}
                    className={`nav-item${isActive ? " active" : ""}${collapsed ? " collapsed" : ""}`}
                    style={{
                      justifyContent: collapsed ? "center" : "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                    {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                  </div>
                );
              })}
            </nav>

            {/* Collapse toggle */}
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTop: "1px solid #e2e8f0",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: 16,
              }}
            >
              {collapsed ? "→" : "←"}
            </div>
          </aside>

          {/* Main content */}
          <main
            style={{
              flex: 1,
              marginLeft: collapsed ? 72 : 220,
              transition: "margin-left 0.3s ease",
              minHeight: "100vh",
              background: "#f5f7fb",
            }}
          >
            {/* Top bar */}
            <header
              style={{
                height: 56,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                position: "sticky",
                top: 0,
                zIndex: 50,
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{menuItems.find((m) => m.value === activeValue)?.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
                  {menuItems.find((m) => m.value === activeValue)?.label || "AI HR 智能招聘系统"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>
                  {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 14px",
                    background: "#f1f5f9",
                    borderRadius: 20,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 18 }}>👤</span>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>HR Admin</span>
                </div>
              </div>
            </header>

            {/* Page content */}
            <div style={{ padding: 24 }}>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
