"use client";

import React, { useEffect, useMemo, useState } from "react";
import { mockCandidates, mockQuestions } from "@/data/mock";
import { Candidate, CandidateStatus, ScreeningResult } from "@/lib/types";

function scoreToFive(score: number) {
  return Math.round((score / 20) * 10) / 10;
}

function fiveColor(value: number) {
  if (value >= 4.5) return "#059669";
  if (value >= 4.0) return "#0284c7";
  if (value >= 3.5) return "#d97706";
  return "#dc2626";
}

function fiveLabel(value: number) {
  if (value >= 4.5) return "优秀";
  if (value >= 4.0) return "良好";
  if (value >= 3.5) return "待定";
  if (value >= 3.0) return "一般";
  return "淘汰";
}

function statusLabel(status: CandidateStatus) {
  if (status === "passed") return "通过";
  if (status === "pending") return "待定";
  if (status === "rejected") return "淘汰";
  if (status === "offer") return "录用";
  return "已入职";
}

function statusColor(status: CandidateStatus) {
  if (status === "passed") return "#059669";"use client";

import React, { useEffect, useMemo, useState } from "react";
import { mockCandidates, mockQuestions } from "@/data/mock";
import { Candidate, CandidateStatus, ScreeningResult } from "@/lib/types";

function scoreToFive(score: number) {
  return Math.round((score / 20) * 10) / 10;
}

function fiveColor(value: number) {
  if (value >= 4.5) return "#059669";
  if (value >= 4.0) return "#0284c7";
  if (value >= 3.5) return "#d97706";
  return "#dc2626";
}

function fiveLabel(value: number) {
  if (value >= 4.5) return "优秀";
  if (value >= 4.0) return "良好";
  if (value >= 3.5) return "待定";
  if (value >= 3.0) return "一般";
  return "淘汰";
}

function statusLabel(status: CandidateStatus) {
  if (status === "passed") return "通过";
  if (status === "pending") return "待定";
  if (status === "rejected") return "淘汰";
  if (status === "offer") return "录用";
  return "已入职";
}

function statusColor(status: CandidateStatus) {
  if (status === "passed") return "#059669";
  if (status === "pending") return "#d97706";
  if (status === "rejected") return "#dc2626";
  if (status === "offer") return "#4f46e5";
  return "#0284c7";
}

function statusBg(status: CandidateStatus) {
  if (status === "passed") return "#ecfdf5";
  if (status === "pending") return "#fffbeb";
  if (status === "rejected") return "#fef2f2";
  if (status === "offer") return "#eef2ff";
  return "#f0f9ff";
}

function scoreTier(value: number) {
  if (value >= 4.5) return "excellent";
  if (value >= 4.0) return "good";
  if (value >= 3.5) return "watch";
  return "weak";
}

function buildAdvice(candidate: Candidate, screening?: ScreeningResult | null) {
  const five = scoreToFive(candidate.score);
  const tier = scoreTier(five);
  const hard = screening?.hardScore ?? candidate.score;
  const soft = screening?.softScore ?? candidate.score;
  const missing = screening?.details.skills.missing ?? [];
  const educationVerified = screening?.details.education.verified ?? false;
  const salaryNote = screening?.details.salary.note ?? "";

  const aiMap: Record<string, string> = {\n    excellent: AI 建议：综合评分 ，硬性  分、软性  分，当前候选人不仅整体高于岗位阈值，且在  上缺口有限。建议直接推进到终面或高管面，重点考察长期稳定性、发展意愿和团队融入，并尽快锁定 offer 节奏，避免流失。,
    excellent: `AI 建议：综合评分 ${five}，硬性 ${hard} 分、软性 ${soft} 分，属于高潜力候选人。建议直接推进到终面或高管面，重点考察稳定性与长期发展意愿，并尽快锁定 offer 节奏，避免流失。`,
    good: `AI 建议：综合评分 ${five}，整体匹配度较好，但 ${missing.length ? missing.join("、") : "岗位关键能力细节"} 还需要进一步验证。建议安排二轮结构化面试，重点核验项目深度、实际贡献和落地能力，避免只停留在简历层面。`,
    watch: `AI 建议：综合评分 ${five}，硬性条件与软性表现存在波动，尤其是在 ${missing.length ? missing.join("、") : "岗位关键能力"} 上证据不足。建议围绕这些缺口安排补充面试或实操测试，必要时增加案例演练，避免因表达一般误判高潜力候选人。`,
    weak: `AI 建议：综合评分 ${five}，与当前岗位匹配度明显不足，且 ${missing.length ? missing.join("、") : "关键能力缺口"} 较大，暂不建议继续推进当前岗位流程。可结合候选人其他优势，推荐至更匹配的岗位或转入人才库持续观察。`,
  };

  const hrMap: Record<string, string> = {
    excellent: `HR 建议：该候选人质量明显高于当前批次平均水平，且期望薪资与预算之间仍有可谈空间${salaryNote ? "（" + salaryNote + "）" : ""}。建议缩短流程，优先安排终面，并同步准备岗位卖点和薪资方案，降低流失风险。`,
    good: `HR 建议：候选人基本面扎实，建议继续推进二面，同时重点确认职业稳定性、团队协作方式和薪资预期，${salaryNote ? salaryNote : "避免后续因预期差异产生风险"}。`,
    watch: `HR 建议：当前信息不足以形成高置信判断，建议重点核实 ${educationVerified ? "学历虽已核验，但项目经历和关键成果" : "学历背景、经历真实性以及关键项目细节"}，避免误判高潜力但表达一般的候选人。`,
    weak: `HR 建议：该候选人暂不符合当前岗位优先级，建议由招聘同事给出明确淘汰原因，并形成可检索标签，便于未来合适岗位再次激活，避免重复沟通和误筛。`,
  };

  return { ai: aiMap[tier], hr: hrMap[tier], tier };
}

function buildEvaluationBlock(candidate: Candidate, screening?: ScreeningResult | null) {
  const five = scoreToFive(candidate.score);
  const tier = scoreTier(five);
  const hard = screening?.hardScore ?? candidate.score;
  const soft = screening?.softScore ?? candidate.score;
  const experienceNote = screening?.details.experience.note ?? "";
  const potentialNote = screening?.details.potential.note ?? "";

  const abilityScore = Math.round(hard * 0.6 + candidate.score * 0.4);
  const personalityScore = Math.round(soft * 0.6 + Math.min(100, candidate.score + 5) * 0.4);
  const emotionScore = Math.round(Math.min(100, soft + 6) * 0.55 + Math.min(100, candidate.score + 4) * 0.45);

  const abilityComment =
    abilityScore >= 80
      ? `${candidate.name} 在岗位关键能力上表现突出，${experienceNote || "项目经历与当前岗位匹配度较高"}。`
      : abilityScore >= 65
        ? `${candidate.name} 具备基本胜任力，但 ${experienceNote || "在复杂场景和深度实践上仍需进一步验证"}。`
        : `${candidate.name} 的能力与岗位要求存在明显差距，${experienceNote || "短期内难以独立承担核心任务"}。`;

  const personalityComment =
    personalityScore >= 80
      ? "沟通成熟，逻辑清晰，具备较强自驱力与合作意识，适合复杂团队协作场景。"
      : personalityScore >= 65
        ? "整体职业表现稳定，表达尚可，但在主动性、结构化沟通和自我复盘方面仍有提升空间。"
        : "性格特质与当前岗位匹配度一般，建议在后续面试中进一步观察抗压能力与协作方式。";

  const emotionComment =
    emotionScore >= 80
      ? `${candidate.name} 当前展现出较强的稳定性与正向动机，${potentialNote || "对岗位认可度较高"}，适合快速推进流程。`
      : emotionScore >= 65
        ? `${candidate.name} 的求职动机基本明确，但 ${potentialNote || "对岗位挑战和成长路径的理解还需进一步澄清"}。`
        : `${candidate.name} 在动机或稳定性上存在一定风险，建议重点确认职业诉求、管理期待和未来 1-2 年规划。`;

  const decisionFromStatus: Record<CandidateStatus, "pass" | "pending" | "reject"> = { passed: "pass", pending: "pending", rejected: "reject", offer: "pass", hired: "pass" };  const finalDecision = decisionFromStatus[selected?.status ?? candidate.status] ?? (tier === "excellent" ? "pass" : tier === "watch" || tier === "good" ? "pending" : "reject");

  const { ai, hr } = buildAdvice(candidate, screening);

  return {
    overallScore: Math.round((abilityScore + personalityScore + emotionScore) / 3),
    ability: { score: abilityScore, comment: abilityComment },
    personality: { score: personalityScore, comment: personalityComment },
    emotion: { score: emotionScore, comment: emotionComment },
    aiSuggestion: ai,
    hrSuggestion: hr,
    finalDecision,
  };
}

const mockRecordingNotes: Record<string, Record<string, string>> = {
  first: "候选人表达流畅，对核心项目经历描述较完整，但缺少量化结果，需要在后续面试中重点追问具体指标和复盘经验。",
  second: "候选人展示了较强的跨团队协作能力，对复杂问题拆解较清晰，但在优先级取舍和风险预判上仍需进一步验证。",
  final: "候选人对岗位理解到位，职业规划清晰，稳定性和薪资预期相对合理，建议结合业务需求决定是否进入 offer 阶段。",
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | CandidateStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [detailTab, setDetailTab] = useState<"screening" | "questions" | "recording" | "evaluation">("screening");
  const [round, setRound] = useState<"first" | "second" | "final">("first");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCandidates(mockCandidates);
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search && !c.name.includes(search) && !c.jobTitle.includes(search)) return false;
      return true;
    });
  }, [candidates, statusFilter, search]);

  if (!mounted) return null;

  const selectedScreening = selected?.screeningResult ?? null;
  const selectedEvaluation = selected ? buildEvaluationBlock(selected, selectedScreening) : null;
  const selectedFive = selected ? scoreToFive(selected.score) : 0;
  const selectedQuestions = mockQuestions.slice(0, 5);

  return (
    <div>
      {selected && selectedEvaluation && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => {
                setSelected(null);
                setDetailTab("screening");
              }}
              style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 500 }}
            >
              ← 返回列表
            </button>
            <div style={{ fontSize: 13, color: "#64748b" }}>候选人详情</div>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 36 }}>{selected.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  {selected.jobTitle} · {selected.education} · {selected.experience}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: fiveColor(selectedFive) }}>{selectedFive}</div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    color: statusColor(selected.status),
                    background: statusBg(selected.status),
                  }}
                >
                  {statusLabel(selected.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>筛选结论</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>总分</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{selected.score}</div>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>硬性条件</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#0284c7" }}>{selectedScreening?.hardScore ?? "-"}</div>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>软性素质</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#8b5cf6" }}>{selectedScreening?.softScore ?? "-"}</div>
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${statusColor(selected.status)}`, background: statusBg(selected.status) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, color: selectedEvaluation.finalDecision === "pass" ? "#059669" : selectedEvaluation.finalDecision === "reject" ? "#dc2626" : "#d97706" }}>{selectedEvaluation.finalDecision === "pass" ? "推荐通过" : selectedEvaluation.finalDecision === "reject" ? "建议淘汰" : "需补面观察"}</span>
                <span style={{ fontSize: 13, color: "#111827" }}>
                  五分制 {selectedFive}（{fiveLabel(selectedFive)}）
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#334155" }}>
                {selectedEvaluation.aiSuggestion}
              </div>
            </div>
          </div>

          <div className="tab-bar" style={{ marginBottom: 16 }}>
            {(
              [
                { key: "screening", label: "简历筛选" },
                { key: "questions", label: "面试题库" },
                { key: "recording", label: "面试录音" },
                { key: "evaluation", label: "AI评估与决策" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                className={`tab-item ${detailTab === t.key ? "active" : ""}`}
                onClick={() => setDetailTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {detailTab === "screening" && selectedScreening && (
            <div className="section-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>简历核验结果</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>根据硬性条件、技能匹配与潜力维度综合评估</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: fiveColor(selectedFive) }}>{selectedFive}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{fiveLabel(selectedFive)}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "学历", score: selectedScreening.details.education.score, note: selectedScreening.details.education.note, verified: selectedScreening.details.education.verified },
                  { label: "经验", score: selectedScreening.details.experience.score, note: selectedScreening.details.experience.note },
                  { label: "技能", score: selectedScreening.details.skills.score, note: `匹配：${selectedScreening.details.skills.matched.join("、")}；缺口：${selectedScreening.details.skills.missing.join("、")}` },
                  { label: "薪资", score: selectedScreening.details.salary.score, note: selectedScreening.details.salary.note },
                  { label: "潜力", score: selectedScreening.details.potential.score, note: selectedScreening.details.potential.note },
                ].map((item) => (
                  <div key={item.label} style={{ padding: 14, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {item.label}
                        {"verified" in item && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: item.verified ? "#059669" : "#d97706", fontWeight: 600 }}>
                            {item.verified ? "已核验" : "待核验"}
                          </span>
                        )}
                      </div>
                      <span style={{ fontWeight: 700, color: item.score >= 75 ? "#059669" : item.score >= 60 ? "#d97706" : "#dc2626" }}>{item.score}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === "questions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {selectedQuestions.map((q) => (
                <div key={q.id} className="section-card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{q.question}</div>
                    <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: "#4f46e5", background: "#eef2ff" }}>{q.category}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div style={{ padding: 12, borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>优秀回答</div>
                      <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{q.goodAnswer}</div>
                    </div>
                    <div style={{ padding: 12, borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>中等回答</div>
                      <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{q.mediumAnswer}</div>
                    </div>
                    <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>较差回答</div>
                      <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{q.poorAnswer}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#f8fafc", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                    面试建议：{q.tips}
                  </div>
                </div>
              ))}
            </div>
          )}

          {detailTab === "recording" && (
            <div className="section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>面试录音与笔记</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>查看不同轮次的面试记录与关键观察</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {([
                    { key: "first", label: "第1轮" },
                    { key: "second", label: "第2轮" },
                    { key: "final", label: "终面" },
                  ] as const).map((r) => (
                    <button
                      key={r.key}
                      className={`pill ${round === r.key ? "active" : ""}`}
                      onClick={() => setRound(r.key)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>录音概览</div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.8 }}>
                  {round === "first" && "一面重点考察基础能力、岗位认知与项目经历，录音显示候选人对自身职责边界理解较清晰。"}
                  {round === "second" && "二面重点考察问题拆解、跨团队协作和复盘能力，录音中可进一步关注其主导项目的深度和结果。"}
                  {round === "final" && "终面重点考察稳定性、职业诉求和价值观匹配，录音更适合用于 HR 复核和最终决策。"}
                </div>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>面试笔记</div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.8 }}>
                  {mockRecordingNotes[round]}
                </div>
              </div>
            </div>
          )}

          {detailTab === "evaluation" && selectedEvaluation && (
            <div className="section-card">
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: selectedEvaluation.overallScore >= 80 ? "#059669" : selectedEvaluation.overallScore >= 65 ? "#d97706" : "#dc2626" }}>
                  {selectedEvaluation.overallScore}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>AI+人工综合评分</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[{ label: "能力评估", data: selectedEvaluation.ability }, { label: "性格特质", data: selectedEvaluation.personality }, { label: "情绪需求", data: selectedEvaluation.emotion }].map((dim) => (
                  <div key={dim.label} style={{ padding: 14, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{dim.label}</span>
                      <span style={{ fontWeight: 700, color: dim.data.score >= 80 ? "#059669" : dim.data.score >= 65 ? "#d97706" : "#dc2626" }}>{dim.data.score}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{dim.data.comment}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 14, borderRadius: 10, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", marginBottom: 6 }}>🤖 AI建议</div>
                  <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{selectedEvaluation.aiSuggestion}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", marginBottom: 6 }}>👤 HR建议</div>
                  <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{selectedEvaluation.hrSuggestion}</div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: 14,
                  borderRadius: 10,
                  background: selectedEvaluation.finalDecision === "pass" ? "#ecfdf5" : selectedEvaluation.finalDecision === "reject" ? "#fef2f2" : "#fffbeb",
                  border: `1px solid ${selectedEvaluation.finalDecision === "pass" ? "#bbf7d0" : selectedEvaluation.finalDecision === "reject" ? "#fecaca" : "#fde68a"}`,
                }}
              >
                <span style={{ fontWeight: 700, color: selectedEvaluation.finalDecision === "pass" ? "#059669" : selectedEvaluation.finalDecision === "reject" ? "#dc2626" : "#d97706" }}>
                  最终判断：
                  {selectedEvaluation.finalDecision === "pass" ? "✅ 推荐通过" : selectedEvaluation.finalDecision === "reject" ? "❌ 不推荐录用" : "⏳ 需补面观察"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!selected && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>候选人管理</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="按姓名或岗位搜索"
              style={{ width: 260, padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", background: "#fff" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
            {(["all", "passed", "pending", "rejected", "offer", "hired"] as const).map((s) => (
              <button key={s} className={`pill ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s === "all" ? "全部" : statusLabel(s)}
              </button>
            ))}
          </div>
          <div className="section-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>候选人</th>
                  <th>应聘岗位</th>
                  <th>学历</th>
                  <th>经验</th>
                  <th>五分制</th>
                  <th>筛选结论</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const five = scoreToFive(c.score);
                  return (
                    <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{c.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#475569" }}>{c.jobTitle}</td>
                      <td style={{ color: "#475569" }}>{c.education}</td>
                      <td style={{ color: "#475569" }}>{c.experience}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: fiveColor(five) }}>{five}</span>
                        <span style={{ marginLeft: 8, fontSize: 11, color: "#94a3b8" }}>{fiveLabel(five)}</span>
                      </td>
                      <td>
                        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: statusColor(c.status), background: statusBg(c.status) }}>
                          {statusLabel(c.status)}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, color: statusColor(c.status), background: statusBg(c.status) }}>
                          {statusLabel(c.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

