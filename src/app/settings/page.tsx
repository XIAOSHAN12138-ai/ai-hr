"use client";

import React, { useState } from "react";
import { defaultSettings } from "@/data/mock";
import { Settings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const weightLabels: Record<keyof Settings["weights"], { label: string; icon: string; desc: string }> = {
    education: { label: "学历背景", icon: "🎓", desc: "学历层次、院校等级、专业匹配度" },
    experience: { label: "工作经验", icon: "💼", desc: "工作年限、相关经验、项目经历" },
    skills: { label: "技能匹配", icon: "⚡", desc: "硬技能、软技能与岗位要求的匹配度" },
    salary: { label: "薪资合理", icon: "💰", desc: "期望薪资与预算范围的匹配度" },
    potential: { label: "发展潜力", icon: "🚀", desc: "学习能力、成长空间、稳定性评估" },
  };

  const totalWeight = Object.values(settings.weights).reduce((a, b) => a + b, 0);

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Save toast */}
      {saved && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          padding: "12px 24px", borderRadius: 10, background: "#00a870", color: "#fff",
          fontSize: 14, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,168,112,0.3)",
        }}>
          ✅ 设置已保存
        </div>
      )}

      {/* Scoring weights */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#333" }}>⚖️ 评分权重配置</h3>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>调整各维度在总分中的占比（当前总计: {totalWeight}%）</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(settings.weights).map(([key, value]) => {
            const config = weightLabels[key as keyof Settings["weights"]];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 200, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{config.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{config.label}</div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>{config.desc}</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={value}
                    onChange={(e) => setSettings({ ...settings, weights: { ...settings.weights, [key]: Number(e.target.value) } })}
                    style={{ flex: 1, height: 6, cursor: "pointer", accentColor: "#0052d9" }}
                  />
                  <span style={{ width: 48, textAlign: "right", fontSize: 16, fontWeight: 700, color: "#0052d9" }}>{value}%</span>
                </div>
              </div>
            );
          })}
        </div>
        {totalWeight !== 100 && (
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "#fff8e8", fontSize: 12, color: "#ed7b2f" }}>
            ⚠️ 权重总计应为100%，当前为 {totalWeight}%，请调整
          </div>
        )}
      </div>

      {/* Thresholds */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#333" }}>📊 筛选阈值设置</h3>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>设置自动分类的分数线</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ padding: 20, borderRadius: 10, background: "#e8f8ef", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#00a870", fontWeight: 600, marginBottom: 8 }}>✅ 通过线</div>
            <input
              type="number"
              value={settings.thresholds.pass}
              onChange={(e) => setSettings({ ...settings, thresholds: { ...settings.thresholds, pass: Number(e.target.value) } })}
              style={{ width: 80, padding: "8px 12px", borderRadius: 8, border: "2px solid #00a870", fontSize: 24, fontWeight: 700, textAlign: "center", outline: "none", color: "#00a870", background: "#fff" }}
            />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>≥ 此分数自动标记通过</div>
          </div>
          <div style={{ padding: 20, borderRadius: 10, background: "#ffe8e8", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#e34d59", fontWeight: 600, marginBottom: 8 }}>❌ 淘汰线</div>
            <input
              type="number"
              value={settings.thresholds.reject}
              onChange={(e) => setSettings({ ...settings, thresholds: { ...settings.thresholds, reject: Number(e.target.value) } })}
              style={{ width: 80, padding: "8px 12px", borderRadius: 8, border: "2px solid #e34d59", fontSize: 24, fontWeight: 700, textAlign: "center", outline: "none", color: "#e34d59", background: "#fff" }}
            />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>&lt; 此分数自动标记淘汰</div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#333" }}>🔧 功能开关</h3>

        {[
          { key: "autoScreening" as const, title: "自动筛选", desc: "新简历投递后自动进行AI评分和分类" },
          { key: "aiAssistance" as const, title: "AI辅助决策", desc: "在面试评估和录用决策中启用AI建议" },
        ].map((toggle) => (
          <div
            key={toggle.key}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0", borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>{toggle.title}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{toggle.desc}</div>
            </div>
            <div
              onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
              style={{
                width: 48, height: 26, borderRadius: 13, cursor: "pointer",
                background: settings[toggle.key] ? "#0052d9" : "#dcdcdc",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 2, left: settings[toggle.key] ? 24 : 2,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #0052d9, #003eb3)", color: "#fff",
          fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,82,217,0.3)",
        }}
      >
        💾 保存所有设置
      </button>
    </div>
  );
}
