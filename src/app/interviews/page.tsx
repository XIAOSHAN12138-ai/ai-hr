"use client";

import React, { useState, useEffect } from "react";
import { mockInterviews, mockOffers, mockReviews } from "@/data/mock";
import { Interview, OfferRecord, ReviewRecord } from "@/lib/types";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [tab, setTab] = useState<"interviews" | "offers" | "reviews">("interviews");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showNewInterview, setShowNewInterview] = useState(false);

  useEffect(() => {
    setInterviews(mockInterviews);
    setOffers(mockOffers);
    setReviews(mockReviews);
  }, []);

  const roundLabels: Record<string, string> = { first: "一面", second: "二面", final: "终面" };
  const roundColors: Record<string, string> = { first: "#0052d9", second: "#7c3aed", final: "#e34d59" };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {[
          { key: "interviews", label: "🎤 面试管理" },
          { key: "offers", label: "📋 录用管理" },
          { key: "reviews", label: "📊 面试官复盘" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              flex: 1, padding: "14px 20px", border: "none",
              background: tab === t.key ? "#0052d9" : "transparent",
              color: tab === t.key ? "#fff" : "#666",
              fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Interviews Tab */}
      {tab === "interviews" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              onClick={() => setShowNewInterview(true)}
              style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0052d9", color: "#fff", fontSize: 14, cursor: "pointer" }}
            >
              ＋ 安排面试
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {interviews.map((intv) => (
              <div
                key={intv.id}
                className="card-hover"
                onClick={() => setSelectedInterview(intv)}
                style={{
                  background: "#fff", borderRadius: 12, padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft: `4px solid ${roundColors[intv.round]}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{intv.candidateName}</div>
                    <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{intv.jobTitle}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: roundColors[intv.round], background: `${roundColors[intv.round]}15` }}>
                    {roundLabels[intv.round]}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#666" }}>
                  <div>📅 {intv.scheduledAt}</div>
                  <div>👤 面试官：{intv.interviewer}</div>
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
                    color: intv.status === "completed" ? "#00a870" : intv.status === "cancelled" ? "#e34d59" : "#0052d9",
                    background: intv.status === "completed" ? "#e8f8ef" : intv.status === "cancelled" ? "#ffe8e8" : "#e8f4ff",
                  }}>
                    {intv.status === "completed" ? "已完成" : intv.status === "cancelled" ? "已取消" : "待进行"}
                  </span>
                  {intv.evaluation && (
                    <span className={`score-badge ${intv.evaluation.overallScore >= 75 ? "score-high" : "score-mid"}`} style={{ width: 36, height: 36, fontSize: 13 }}>
                      {intv.evaluation.overallScore}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers Tab */}
      {tab === "offers" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>📋 录用谈判助手</h3>
            <p style={{ fontSize: 13, color: "#999" }}>面试通过后自动纳入录用名单，AI提供薪资谈判建议和风险预判</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {offers.map((offer) => (
              <div key={offer.id} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{offer.candidateName}</div>
                    <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{offer.jobTitle} · 建议薪资 {offer.proposedSalary}</div>
                  </div>
                  <span style={{
                    padding: "4px 14px", borderRadius: 12, fontSize: 12, fontWeight: 500,
                    color: offer.status === "accepted" ? "#00a870" : offer.status === "negotiating" ? "#ed7b2f" : offer.status === "rejected" ? "#e34d59" : "#0052d9",
                    background: offer.status === "accepted" ? "#e8f8ef" : offer.status === "negotiating" ? "#fff8e8" : offer.status === "rejected" ? "#ffe8e8" : "#e8f4ff",
                  }}>
                    {offer.status === "accepted" ? "已接受" : offer.status === "negotiating" ? "谈判中" : offer.status === "rejected" ? "已拒绝" : "待回复"}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: 16, borderRadius: 10, background: "#f0f5ff" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0052d9", marginBottom: 8 }}>💡 谈判建议</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{offer.negotiationAdvice}</div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 10, background: "#fff8e8" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ed7b2f", marginBottom: 8 }}>⚠️ 风险预判</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{offer.riskAssessment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {tab === "reviews" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>📊 面试官复盘优化</h3>
            <p style={{ fontSize: 13, color: "#999" }}>AI分析面试官表现，生成复盘建议，帮助提升面试能力和评估准确性</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>
                    {review.interviewer.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{review.interviewer}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>面试 {review.interviewCount} 场</div>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div className={`score-badge ${review.averageScore >= 80 ? "score-high" : "score-mid"}`} style={{ width: 64, height: 64, fontSize: 20, margin: "0 auto" }}>
                    {review.averageScore}
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>平均评分</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#00a870", marginBottom: 6 }}>✅ 优势</div>
                  {review.strengths.map((s) => (
                    <div key={s} style={{ fontSize: 12, color: "#666", padding: "3px 0", paddingLeft: 10, borderLeft: "2px solid #00a870", marginBottom: 4 }}>{s}</div>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ed7b2f", marginBottom: 6 }}>📈 改进方向</div>
                  {review.improvements.map((s) => (
                    <div key={s} style={{ fontSize: 12, color: "#666", padding: "3px 0", paddingLeft: 10, borderLeft: "2px solid #ed7b2f", marginBottom: 4 }}>{s}</div>
                  ))}
                </div>

                <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f0f5ff", fontSize: 12, color: "#0052d9", lineHeight: 1.6 }}>
                  🤖 <strong>AI建议：</strong>{review.aiSuggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetail interview={selectedInterview} onClose={() => setSelectedInterview(null)} />
      )}

      {/* New Interview Modal */}
      {showNewInterview && (
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setShowNewInterview(false)}
        >
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: "#333" }}>安排新面试</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["候选人", "面试轮次", "面试时间", "面试官"].map((label) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>{label}</label>
                  <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #dcdcdc", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowNewInterview(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #dcdcdc", background: "#fff", cursor: "pointer", fontSize: 14 }}>取消</button>
              <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0052d9", color: "#fff", cursor: "pointer", fontSize: 14 }}>确认安排</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewDetail({ interview: intv, onClose }: { interview: Interview; onClose: () => void }) {
  const [notes, setNotes] = useState(intv.notes || "");
  const [recording, setRecording] = useState(false);
  const ev = intv.evaluation;

  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end", zIndex: 1000 }}
      onClick={onClose}
    >
      <div style={{ width: 600, background: "#fff", height: "100%", overflow: "auto", padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333" }}>{intv.candidateName} - {intv.jobTitle}</div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{intv.scheduledAt} · {intv.interviewer}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999" }}>✕</button>
        </div>

        {/* Recording section */}
        <div style={{ marginBottom: 24, padding: 20, borderRadius: 12, background: recording ? "#ffe8e8" : "#f8f9fa", border: `1px solid ${recording ? "#e34d59" : "#eee"}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>🎙️ 面试录音</span>
            <button
              onClick={() => setRecording(!recording)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: recording ? "#e34d59" : "#0052d9", color: "#fff",
              }}
            >
              {recording ? "⏹ 停止录音" : "⏺ 开始录音"}
            </button>
          </div>
          {recording && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#e34d59" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e34d59", animation: "pulse 1s infinite" }}></span>
              录音中... AI正在实时转录分析
            </div>
          )}
          {!recording && <div style={{ fontSize: 13, color: "#999" }}>点击开始录音，AI将自动转录并辅助分析</div>}
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>📝 面试笔记</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录面试过程中的关键观察..."
            style={{ width: "100%", height: 120, padding: 12, borderRadius: 8, border: "1px solid #dcdcdc", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>

        {/* Evaluation */}
        {ev && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 16 }}>📊 AI+人工综合评估</div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div className={`score-badge ${ev.overallScore >= 75 ? "score-high" : "score-mid"}`} style={{ width: 72, height: 72, fontSize: 24, margin: "0 auto" }}>
                {ev.overallScore}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 6 }}>综合评分</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {[
                { label: "能力评估", data: ev.ability, icon: "💪" },
                { label: "性格特质", data: ev.personality, icon: "🧠" },
                { label: "情绪需求", data: ev.emotion, icon: "❤️" },
              ].map((dim) => (
                <div key={dim.label} style={{ padding: 14, borderRadius: 10, background: "#f8f9fa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{dim.icon} {dim.label}</span>
                    <span className={`score-badge ${dim.data.score >= 75 ? "score-high" : "score-mid"}`} style={{ width: 32, height: 32, fontSize: 12 }}>
                      {dim.data.score}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{dim.data.comment}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 14, borderRadius: 10, background: "#e8f4ff" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0052d9", marginBottom: 6 }}>🤖 AI建议</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{ev.aiSuggestion}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: "#f0e8ff" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed", marginBottom: 6 }}>👤 HR建议</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{ev.hrSuggestion}</div>
              </div>
            </div>

            <div style={{ textAlign: "center", padding: 12, borderRadius: 10, background: ev.finalDecision === "pass" ? "#e8f8ef" : ev.finalDecision === "reject" ? "#ffe8e8" : "#fff8e8" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: ev.finalDecision === "pass" ? "#00a870" : ev.finalDecision === "reject" ? "#e34d59" : "#ed7b2f" }}>
                最终判断：{ev.finalDecision === "pass" ? "✅ 通过" : ev.finalDecision === "reject" ? "❌ 不通过" : "⏳ 待定"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
