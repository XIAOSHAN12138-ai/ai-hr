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

  const activeValue = "/" + (pathname.split("/")[1] || "dashboard");

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
              background: "linear-gradient(180deg, #001529 0%, #002140 100%)",
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
                padding: "0 16px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                gap: 10,
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard")}
            >
              <span style={{ fontSize: 28 }}>🤖</span>
              {!collapsed && (
                <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 44,
                      padding: collapsed ? "0 24px" : "0 20px",
                      margin: "2px 8px",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: isActive ? "#0052d9" : "transparent",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                      justifyContent: collapsed ? "center" : "flex-start",
                      gap: 10,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {!collapsed && <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{item.label}</span>}
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
                borderTop: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                color: "rgba(255,255,255,0.45)",
                fontSize: 18,
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
              background: "#f5f6fa",
            }}
          >
            {/* Top bar */}
            <header
              style={{
                height: 56,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 0,
                zIndex: 50,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "#666" }}>
                  {menuItems.find((m) => m.value === activeValue)?.icon}
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                  {menuItems.find((m) => m.value === activeValue)?.label || "AI HR 智能招聘系统"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "#999" }}>
                  {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 12px",
                    background: "#f5f6fa",
                    borderRadius: 20,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 20 }}>👤</span>
                  <span style={{ fontSize: 13, color: "#333" }}>HR Admin</span>
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
