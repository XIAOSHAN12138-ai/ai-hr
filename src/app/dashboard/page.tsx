"use client";

import React, { useState, useEffect } from "react";
import { mockDashboard } from "@/data/mock";
import { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    setStats(mockDashboard);
  }, []);

  if (!stats) return <div style={{ padding: 40, textAlign: "center", color: "#999" }}>加载中...</div>;

  const statCards = [
    { title: "在招岗位", value: stats.openJobs, total: stats.totalJobs, suffix: "个", icon: "💼", gradient: "gradient-blue" },
    { title: "候选人总数", value: stats.totalCandidates, total: null, suffix: "人", icon: "👥", gradient: "gradient-green" },
    { title: "今日新增", value: stats.todayNew, total: null, suffix: "人", icon: "📈", gradient: "gradient-orange" },
    { title: "今日面试", value: stats.interviewsToday, total: null, suffix: "场", icon: "🎤", gradient: "gradient-purple" },
  ];

  const activityColors: Record<string, string> = {
    candidate: "#0052d9",
    interview: "#00a870",
    offer: "#ed7b2f",
    screening: "#7c3aed",
  };

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
        {statCards.map((card) => (
          <div
            key={card.title}
            className="card-hover"
            style={{
              borderRadius: 12,
              padding: "24px 20px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>{card.title}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#333", lineHeight: 1 }}>
                  {card.value}
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#999", marginLeft: 4 }}>{card.suffix}</span>
                </div>
                {card.total !== null && (
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>共 {card.total} 个岗位</div>
                )}
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  background: "linear-gradient(135deg, rgba(0,82,217,0.1), rgba(0,82,217,0.05))",
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Pass rate & avg score */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#333" }}>筛选数据概览</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div className="score-badge score-high" style={{ margin: "0 auto 12px", width: 72, height: 72, fontSize: 22 }}>
                {stats.passRate}%
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>简历通过率</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="score-badge score-mid" style={{ margin: "0 auto 12px", width: 72, height: 72, fontSize: 22 }}>
                {stats.avgScreeningScore}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>平均筛选得分</div>
            </div>
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8f9fa", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#666" }}>待处理Offer</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#ed7b2f" }}>{stats.pendingOffers} 份</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#666" }}>本周面试完成</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#00a870" }}>12 场</span>
            </div>
          </div>
        </div>

        {/* Recent activities */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#333" }}>最新动态</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {stats.recentActivities.map((activity, idx) => (
              <div
                key={activity.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "12px 0",
                  borderBottom: idx < stats.recentActivities.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div
                  className="activity-dot"
                  style={{
                    background: activityColors[activity.type] || "#ccc",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{activity.message}</div>
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#333" }}>快捷操作</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: "📋", title: "发布新岗位", desc: "快速创建招聘需求", href: "/jobs" },
            { icon: "🔍", title: "简历筛选", desc: "AI智能评分排序", href: "/candidates" },
            { icon: "📝", title: "安排面试", desc: "管理面试日程", href: "/interviews" },
            { icon: "📊", title: "生成报告", desc: "导出招聘数据报表", href: "/dashboard" },
          ].map((action) => (
            <div
              key={action.title}
              className="card-hover"
              style={{
                padding: 20,
                borderRadius: 10,
                border: "1px solid #eee",
                textAlign: "center",
                background: "#fafbfc",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{action.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 4 }}>{action.title}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{action.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
