"use client";

import React, { useState, useEffect } from "react";
import { mockCandidates, mockQuestions } from "@/data/mock";
import { Candidate, CandidateStatus, InterviewQuestion } from "@/lib/types";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | CandidateStatus>("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"list" | "screening" | "questions">("list");

  useEffect(() => { setCandidates(mockCandidates); }, []);

  const filtered = candidates.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.name.includes(search) && !c.jobTitle.includes(search)) return false;
    return true;
  });

  const statusConfig: Record<CandidateStatus, { label: string; cls: string }> = {
    passed: { label: "通过", cls: "status-pass" },
    pending: { label: "待定", cls: "status-pending" },
    rejected: { label: "淘汰", cls: "status-reject" },
    offer: { label: "录用", cls: "status-offer" },
    hired: { label: "已入职", cls: "status-hired" },
  };

  const getScoreClass = (score: number) => (score >= 75 ? "score-high" : score >= 60 ? "score-mid" : "score-low");

  const groupedQuestions: Record<string, InterviewQuestion[]> = {};
  mockQuestions.forEach((q) => {
    if (!groupedQuestions[q.category]) groupedQuestions[q.category] = [];
    groupedQuestions[q.category].push(q);
  });

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {[
          { key: "list", label: "📋 候选人列表", count: candidates.length },
          { key: "screening", label: "🔍 智能筛选", count: null },
          { key: "questions", label: "📝 面试题库", count: mockQuestions.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              flex: 1,
              padding: "14px 20px",
              border: "none",
              background: tab === t.key ? "#0052d9" : "transparent",
              color: tab === t.key ? "#fff" : "#666",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t.label} {t.count !== null && `(${t.count})`}
          </button>
        ))}
      </div>

      {/* List Tab */}
      {tab === "list" && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 搜索候选人姓名或岗位..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #dcdcdc",
                fontSize: 14,
                outline: "none",
                background: "#fff",
              }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "passed", "pending", "rejected", "offer"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    background: statusFilter === s ? "#0052d9" : "#f0f0f0",
                    color: statusFilter === s ? "#fff" : "#666",
                  }}
                >
                  {s === "all" ? "全部" : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafbfc" }}>
                  {["候选人", "应聘岗位", "学历", "经验", "筛选分数", "状态", "操作"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 500, color: "#999", borderBottom: "1px solid #f0f0f0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    style={{ cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    onClick={() => setSelected(c)}
                  >
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{c.avatar}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "#bbb" }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#555", borderBottom: "1px solid #f5f5f5" }}>{c.jobTitle}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#555", borderBottom: "1px solid #f5f5f5" }}>{c.education}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#555", borderBottom: "1px solid #f5f5f5" }}>{c.experience}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                      <span className={`score-badge ${getScoreClass(c.score)}`} style={{ width: 40, height: 40, fontSize: 14 }}>
                        {c.score}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                      <span className={statusConfig[c.status].cls} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                        {statusConfig[c.status].label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                        style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #0052d9", background: "transparent", color: "#0052d9", fontSize: 12, cursor: "pointer" }}
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screening Tab */}
      {tab === "screening" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#333" }}>🔍 AI智能筛选引擎</h3>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>系统根据硬性条件（学历、经验、技能、薪资）和个人素养（学习能力、沟通能力、稳定性）自动评分，支持自定义权重。</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0052d9", color: "#fff", fontSize: 14, cursor: "pointer" }}>
                🚀 批量筛选全部候选人
              </button>
              <button style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #dcdcdc", background: "#fff", color: "#555", fontSize: 14, cursor: "pointer" }}>
                📄 导出筛选报告
              </button>
            </div>
          </div>

          {/* Screening results grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {["pass", "pending", "reject"].map((level) => {
              const items = candidates.filter((c) => c.screeningResult?.level === level);
              const levelConfig: Record<string, { title: string; color: string; icon: string }> = {
                pass: { title: "通过", color: "#00a870", icon: "✅" },
                pending: { title: "待定", color: "#ed7b2f", icon: "⏳" },
                reject: { title: "淘汰", color: "#e34d59", icon: "❌" },
              };
              return (
                <div key={level} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 18 }}>{levelConfig[level].icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: levelConfig[level].color }}>{levelConfig[level].title}</span>
                    <span style={{ fontSize: 12, color: "#999", marginLeft: "auto" }}>{items.length}人</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelected(c)}
                        style={{
                          padding: "12px",
                          borderRadius: 8,
                          border: "1px solid #f0f0f0",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: "#fafbfc",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 20 }}>{c.avatar}</span>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</span>
                          </div>
                          <span className={`score-badge ${getScoreClass(c.screeningResult?.totalScore || 0)}`} style={{ width: 36, height: 36, fontSize: 13 }}>
                            {c.screeningResult?.totalScore}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#999" }}>{c.jobTitle}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: "#666", background: "#f0f5ff", padding: "2px 6px", borderRadius: 4 }}>
                            硬性 {c.screeningResult?.hardScore}
                          </span>
                          <span style={{ fontSize: 11, color: "#666", background: "#f5f0ff", padding: "2px 6px", borderRadius: 4 }}>
                            素养 {c.screeningResult?.softScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {tab === "questions" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#333" }}>📝 AI面试题库</h3>
                <p style={{ fontSize: 13, color: "#999" }}>包含破冰、自我介绍、离职动机、情景模拟等题型，每道题配优中差回答参考</p>
              </div>
              <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0052d9", color: "#fff", fontSize: 14, cursor: "pointer" }}>
                🤖 AI生成新题
              </button>
            </div>
          </div>

          {Object.entries(groupedQuestions).map(([category, questions]) => (
            <div key={category} style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0052d9", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 20, background: "#0052d9", borderRadius: 2, display: "inline-block" }}></span>
                {category}
              </h4>
              {questions.map((q, idx) => (
                <QuestionCard key={q.id} question={q} index={idx + 1} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selected && (
        <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function QuestionCard({ question: q, index }: { question: InterviewQuestion; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ marginBottom: 16, border: "1px solid #f0f0f0", borderRadius: 10, overflow: "hidden" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: expanded ? "#f8f9ff" : "#fafbfc" }}
      >
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#0052d9", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {index}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#333", flex: 1 }}>{q.question}</span>
        <span style={{ fontSize: 12, color: "#bbb" }}>{expanded ? "收起 ▲" : "展开 ▼"}</span>
      </div>
      {expanded && (
        <div style={{ padding: "16px 16px 16px 50px", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "✅ 优秀回答", text: q.goodAnswer, color: "#00a870", bg: "#e8f8ef" },
              { label: "🟡 中等回答", text: q.mediumAnswer, color: "#ed7b2f", bg: "#fff8e8" },
              { label: "❌ 较差回答", text: q.poorAnswer, color: "#e34d59", bg: "#ffe8e8" },
            ].map((a) => (
              <div key={a.label} style={{ padding: "10px 12px", borderRadius: 8, background: a.bg }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: a.color, marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{a.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f0f5ff", fontSize: 13, color: "#0052d9" }}>
            💡 <strong>面试官提示：</strong>{q.tips}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateDetail({ candidate: c, onClose }: { candidate: Candidate; onClose: () => void }) {
  const sr = c.screeningResult;
  const dimensions = sr ? [
    { label: "学历背景", score: sr.details.education.score, note: sr.details.education.note, verified: sr.details.education.verified },
    { label: "工作经验", score: sr.details.experience.score, note: sr.details.experience.note },
    { label: "技能匹配", score: sr.details.skills.score, note: `匹配: ${sr.details.skills.matched.join(", ")}; 缺失: ${sr.details.skills.missing.join(", ")}` },
    { label: "薪资合理", score: sr.details.salary.score, note: sr.details.salary.note },
    { label: "发展潜力", score: sr.details.potential.score, note: sr.details.potential.note },
  ] : [];

  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ width: 560, background: "#fff", height: "100%", overflow: "auto", padding: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 48 }}>{c.avatar}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#333" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{c.jobTitle}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999" }}>✕</button>
        </div>

        {/* Basic info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "邮箱", value: c.email },
            { label: "手机", value: c.phone },
            { label: "学历", value: c.education },
            { label: "经验", value: c.experience },
            { label: "当前薪资", value: c.currentSalary },
            { label: "期望薪资", value: c.expectedSalary },
          ].map((info) => (
            <div key={info.label} style={{ padding: "10px 12px", background: "#f8f9fa", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>{info.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>{info.value}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>技能标签</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {c.skills.map((s) => (
              <span key={s} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, background: "#f0f5ff", color: "#0052d9", fontWeight: 500 }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Screening Result */}
        {sr && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 12 }}>AI筛选评分</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div className={`score-badge ${sr.totalScore >= 75 ? "score-high" : sr.totalScore >= 60 ? "score-mid" : "score-low"}`} style={{ width: 56, height: 56, fontSize: 18 }}>
                  {sr.totalScore}
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>总分</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="score-badge score-high" style={{ width: 56, height: 56, fontSize: 18 }}>{sr.hardScore}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>硬性条件</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="score-badge score-mid" style={{ width: 56, height: 56, fontSize: 18 }}>{sr.softScore}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>个人素养</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dimensions.map((dim) => (
                <div key={dim.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 70, fontSize: 12, color: "#666", flexShrink: 0 }}>{dim.label}</span>
                  <div style={{ flex: 1, height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${dim.score}%`, height: "100%", borderRadius: 4, background: dim.score >= 75 ? "#00a870" : dim.score >= 60 ? "#ed7b2f" : "#e34d59" }} />
                  </div>
                  <span style={{ width: 30, fontSize: 12, fontWeight: 600, color: "#333", textAlign: "right" }}>{dim.score}</span>
                  {dim.verified !== undefined && (
                    <span style={{ fontSize: 11, color: dim.verified ? "#00a870" : "#e34d59" }}>
                      {dim.verified ? "✓已核验" : "✗未核验"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: "10px 12px", background: "#f8f9fa", borderRadius: 8, fontSize: 12, color: "#666", lineHeight: 1.6 }}>
              <strong>详细说明：</strong><br />
              {dimensions.map((d) => `【${d.label}】${d.note}`).join("；")}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#00a870", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            ✅ 标记通过
          </button>
          <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#ed7b2f", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            ⏳ 标记待定
          </button>
          <button style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#e34d59", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            ❌ 标记淘汰
          </button>
        </div>
      </div>
    </div>
  );
}
