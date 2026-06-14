"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockDashboard, mockJobs, mockCandidates } from "@/data/mock";

const typeColors: Record<string, string> = {
  candidate: "#3b82f6",
  interview: "#10b981",
  offer: "#f59e0b",
  screening: "#8b5cf6",
};

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const stats = mockDashboard;
  const candidates = mockCandidates;

  const kpiCards = [
    { title: "在招岗位", value: stats.openJobs, suffix: "个", sub: `共 ${stats.totalJobs} 个`, icon: "💼", color: "#3b82f6" },
    { title: "候选人总数", value: stats.totalCandidates, suffix: "人", sub: `今日 +${stats.todayNew}`, icon: "👥", color: "#10b981" },
    { title: "今日面试", value: stats.interviewsToday, suffix: "场", sub: `待处理 ${stats.pendingOffers} offer`, icon: "🎤", color: "#8b5cf6" },
    { title: "简历通过率", value: stats.passRate, suffix: "%", sub: `均分 ${stats.avgScreeningScore}`, icon: "📈", color: "#f59e0b" },
  ];

  const total = candidates.length || 1;
  const passed = candidates.filter(c => c.status === "passed" || c.status === "offer" || c.status === "hired").length;
  const interviewing = candidates.filter(c => c.status === "pending").length;
  const offer = candidates.filter(c => c.status === "offer").length;
  const hired = candidates.filter(c => c.status === "hired").length;
  const funnel = [
    { label: "投递", count: total, pct: 100, color: "#3b82f6" },
    { label: "初筛通过", count: passed, pct: Math.round((passed / total) * 100), color: "#6366f1" },
    { label: "面试中", count: interviewing, pct: Math.round((interviewing / total) * 100), color: "#8b5cf6" },
    { label: "Offer", count: offer, pct: Math.round((offer / total) * 100), color: "#f59e0b" },
    { label: "入职", count: hired, pct: Math.round((hired / total) * 100), color: "#10b981" },
  ];

  const topJobs = [...mockJobs].sort((a, b) => b.candidateCount - a.candidateCount).slice(0, 5);

  const todoItems = [
    { icon: "📄", title: "待处理简历", count: candidates.filter(c => c.status === "pending").length, desc: "份简历等待筛选", href: "/candidates" },
    { icon: "📅", title: "待安排面试", count: stats.interviewsToday, desc: "场面试今日待进行", href: "/interviews" },
    { icon: "📋", title: "待审批 Offer", count: stats.pendingOffers, desc: "份 Offer 等待审批", href: "/interviews" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpiCards.map((card) => (
          <div key={card.title} className="section-card card-hover" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, fontWeight: 500, whiteSpace: "nowrap" }}>{card.title}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{card.value}</span>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>{card.suffix}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{card.sub}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: card.color + "12", flexShrink: 0 }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="section-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "#111827" }}>招聘漏斗</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {funnel.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 70, fontSize: 13, color: "#475569", fontWeight: 500, flexShrink: 0 }}>{f.label}</span>
                  <div style={{ flex: 1 }}>
                    <div className="funnel-bar">
                      <div className="funnel-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                    </div>
                  </div>
                  <span style={{ width: 36, fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "right" }}>{f.count}</span>
                  <span style={{ width: 40, fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#111827" }}>热门岗位排行</h3>
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>岗位</th><th>部门</th><th>候选人</th><th>状态</th></tr>
              </thead>
              <tbody>
                {topJobs.map((j, i) => (
                  <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => router.push("/jobs")}>
                    <td style={{ fontWeight: 700, color: i < 3 ? "#3b82f6" : "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{j.title}</td>
                    <td style={{ color: "#64748b" }}>{j.department}</td>
                    <td style={{ fontWeight: 700, color: "#111827" }}>{j.candidateCount}</td>
                    <td>
                      <span className={`badge-chip ${j.status === "open" ? "status-pass" : j.status === "closed" ? "status-reject" : "status-pending"}`} style={{ fontSize: 11, padding: "2px 8px" }}>
                        {j.status === "open" ? "招聘中" : j.status === "closed" ? "已关闭" : "草稿"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="section-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#111827" }}>待办事项</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {todoItems.map((t) => (
                <div key={t.title} onClick={() => router.push(t.href)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{t.desc}</div>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6", flexShrink: 0 }}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#111827" }}>最新动态</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {stats.recentActivities.map((act, idx) => (
                <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: idx < stats.recentActivities.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div className="activity-dot" style={{ background: typeColors[act.type] || "#94a3b8", marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{act.message}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}