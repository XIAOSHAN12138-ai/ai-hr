"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { mockCandidates, mockJobs } from "@/data/mock";
import { Candidate, CandidateStatus, Job, JobStatus, ScreeningResult } from "@/lib/types";

interface UploadedResume {
  name: string;
  size: string;
  analysis: ResumeAnalysis;
  added: boolean;
}

interface ResumeAnalysis {
  matchScore: number;
  matchLevel: "优秀" | "良好" | "一般" | "不匹配";
  matchedCount: number;
  missingCount: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestion: string;
  strengths: string[];
  risks: string[];
  hrSuggestion: string;
}

function statusLabel(status: JobStatus) {
  if (status === "open") return "招聘中";
  if (status === "closed") return "已关闭";
  return "草稿";
}

function statusColor(status: JobStatus) {
  if (status === "open") return "#059669";
  if (status === "closed") return "#475569";
  return "#d97706";
}

function statusBg(status: JobStatus) {
  if (status === "open") return "#ecfdf5";
  if (status === "closed") return "#f1f5f9";
  return "#fffbeb";
}

function formatSize(bytes: number) {
  if (bytes <= 0) return "0KB";
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${Math.round(kb)}KB`;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function shuffleWithSeed(seed: number, items: string[]) {
  const result = [...items];
  let current = seed;
  for (let index = result.length - 1; index > 0; index--) {
    current = (current * 48271 + 13) % 2147483647;
    const target = current % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function buildResumeAnalysis(job: Job, resumeName: string, resumeSize: number): ResumeAnalysis {
  const seed = hashString(`${job.id}-${resumeName}-${resumeSize}`);
  const baseScore = 58 + (seed % 33);
  const matchScore = Math.min(98, Math.max(42, baseScore));
  const matchLevel = matchScore >= 90 ? "优秀" : matchScore >= 75 ? "良好" : matchScore >= 60 ? "一般" : "不匹配";
  const matchedSkills = shuffleWithSeed(seed, job.requirements).slice(0, Math.min(job.requirements.length, 2 + (seed % 3)));
  const missingSkills = shuffleWithSeed(seed * 2 + 7, ["性能优化", "系统设计", "团队管理", "跨团队协作", "项目复盘", "数据分析", "架构能力", "业务理解"]).slice(0, 1 + (seed % 2));
  const strengthsPool = [
    `${resumeName.replace(/\.[^/.]+$/, "")} 的项目经历与岗位方向契合度较高`,
    `近似背景候选人在 ${job.department} 有过可迁移经验`,
    `技术栈与当前岗位要求重叠较多，具备快速上手基础`,
    `简历中展示了较强的业务落地意识`,
    `过往经历显示出较好的稳定性和成长轨迹`,
  ];
  const risksPool = [
    "需要进一步核实薪资预期与预算之间的匹配度",
    "管理幅度与当前岗位要求可能存在差距",
    "需要在面试阶段验证跨团队协作经验",
    "部分经历描述缺少量化结果，建议追问关键指标",
    "当前信息不足以判断长期稳定性和发展意愿",
  ];
  const suggestionMap: Record<string, string> = {
    "优秀": `建议优先安排一面，重点核验 ${job.title} 的核心项目深度和落地成果。`,
    "良好": `建议先做结构化电话面试，重点补全关键能力与项目指标信息。`,
    "一般": `建议谨慎推进，优先围绕缺口领域安排补充面试或笔试。`,
    "不匹配": `建议暂不安排面试，可转入人才库并设置后续跟踪提醒。`,
  };
  const hrMap: Record<string, string> = {
    "优秀": `从 HR 视角看，${resumeName.replace(/\.[^/.]+$/, "")} 的综合画像优于多数同批次简历，建议尽快推进，并同步准备岗位卖点和面试排期。`,
    "良好": `基本面扎实，但仍需确认职业稳定性、薪资预期与到岗时间，避免后续流程反复。`,
    "一般": `建议招聘同事先与用人方确认岗位硬性优先级，再决定是否安排面试。`,
    "不匹配": `该简历与当前岗位优先级不匹配，不建议消耗面试资源，更适合进入人才库或转岗推荐。`,
  };

  return {
    matchScore,
    matchLevel,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    matchedSkills,
    missingSkills,
    suggestion: suggestionMap[matchLevel],
    strengths: shuffleWithSeed(seed + 3, strengthsPool).slice(0, 2),
    risks: shuffleWithSeed(seed + 9, risksPool).slice(0, 2),
    hrSuggestion: hrMap[matchLevel],
  };
}

function matchStatusFromScore(score: number): CandidateStatus {
  if (score >= 90) return "passed";
  if (score >= 75) return "pending";
  return "rejected";
}

function buildScreeningFromAnalysis(job: Job, name: string, analysis: ResumeAnalysis): ScreeningResult {
  const hardScore = Math.min(100, Math.max(50, analysis.matchScore + 2));
  const softScore = Math.min(100, Math.max(45, analysis.matchScore - 3));
  const totalScore = Math.round((hardScore * 0.6 + softScore * 0.4) * 10) / 10;
  return {
    hardScore,
    softScore,
    totalScore,
    level: totalScore >= 75 ? "pass" : totalScore >= 60 ? "pending" : "reject",
    details: {
      education: { score: Math.min(100, Math.max(60, hardScore - 4)), verified: analysis.matchScore >= 80, note: analysis.matchScore >= 80 ? "学历信息已核验，优先保留" : "学历信息待进一步核验" },
      experience: { score: Math.min(100, Math.max(55, analysis.matchScore + 1)), note: analysis.strengths[0] || "经历与岗位相关性需要进一步确认" },
      skills: { score: Math.min(100, Math.max(55, analysis.matchScore + 3)), matched: analysis.matchedSkills, missing: analysis.missingSkills },
      salary: { score: Math.min(100, Math.max(55, analysis.matchScore - 2)), note: analysis.risks[0] || "当前薪资信息有限，需要后续确认" },
      potential: { score: Math.min(100, Math.max(60, analysis.matchScore + 5)), note: analysis.strengths[1] || "整体潜力需要结合面试进一步评估" },
    },
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "", salary: "", requirements: "" });
  const [uploadedResumes, setUploadedResumes] = useState<Record<string, UploadedResume[]>>({});
  const [analyzingKey, setAnalyzingKey] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setJobs(mockJobs);
    setCandidates(mockCandidates);
  }, []);

  const filtered = useMemo(() => {
    return filter === "all" ? jobs : jobs.filter((job) => job.status === filter);
  }, [jobs, filter]);

  const targetJob = useMemo(() => {
    return selectedJob ? jobs.find((job) => job.id === selectedJob.id) ?? selectedJob : null;
  }, [jobs, selectedJob]);

  const targetResumes = useMemo(() => {
    if (!targetJob) return [];
    return uploadedResumes[targetJob.id] ?? [];
  }, [uploadedResumes, targetJob]);

  const handleAddJob = () => {
    if (!newJob.title || !newJob.department || !newJob.location || !newJob.salary) return;
    const job: Job = {
      id: String(jobs.length + 1),
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      salary: newJob.salary,
      requirements: newJob.requirements.split(/[,，\n]+/).map((item) => item.trim()).filter(Boolean),
      status: "open",
      createdAt: new Date().toISOString().slice(0, 10),
      candidateCount: 0,
    };
    setJobs((prev) => [job, ...prev]);
    setNewJob({ title: "", department: "", location: "", salary: "", requirements: "" });
    setShowModal(false);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!targetJob) return;
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const jobId = targetJob.id;
    setAnalyzingKey(jobId);

    setTimeout(() => {
      setUploadedResumes((prev) => {
        const current = prev[jobId] ?? [];
        const nextResumes = files.map((file) => ({
          name: file.name,
          size: formatSize(file.size),
          analysis: buildResumeAnalysis(targetJob, file.name, file.size),
          added: false,
        }));
        return { ...prev, [jobId]: [...current, ...nextResumes] };
      });
      setAnalyzingKey((prev) => (prev === jobId ? null : prev));
    }, 600);

    event.target.value = "";
  };

  const handleAddCandidate = (job: Job, resume: UploadedResume, index: number) => {
    const existing = candidates.find((candidate) => candidate.name === resume.name.replace(/\.[^/.]+$/, "") && candidate.jobId === job.id);
    if (existing) {
      setAddedNotice(`候选人 ${existing.name} 已存在于当前岗位候选人列表`);
      setTimeout(() => setAddedNotice(null), 2200);
      return;
    }
    const analysis = resume.analysis;
    const status = matchStatusFromScore(analysis.matchScore);
    const screeningResult = buildScreeningFromAnalysis(job, resume.name, analysis);
    const nextCandidate: Candidate = {
      id: `uploaded-${job.id}-${Date.now()}-${index}`,
      name: resume.name.replace(/\.[^/.]+$/, ""),
      email: `${resume.name.replace(/\.[^/.]+$/, "").toLowerCase()}@example.com`,
      phone: "待补充",
      jobId: job.id,
      jobTitle: job.title,
      status,
      score: screeningResult.totalScore,
      education: "待确认",
      experience: "待确认",
      skills: analysis.matchedSkills,
      currentSalary: "待确认",
      expectedSalary: "待确认",
      avatar: "📄",
      screeningResult,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCandidates((prev) => [nextCandidate, ...prev]);
    setUploadedResumes((prev) => {
      const current = prev[job.id] ?? [];
      const next = current.map((item, idx) => (idx === index ? { ...item, added: true } : item));
      return { ...prev, [job.id]: next };
    });
    setAddedNotice(`已将 ${nextCandidate.name} 添加到候选人列表`);
    setTimeout(() => setAddedNotice(null), 2200);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>岗位管理</div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + 新增岗位
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["all", "open", "closed", "draft"] as const).map((status) => (
          <button key={status} className={`pill ${filter === status ? "active" : ""}`} onClick={() => setFilter(status)}>
            {status === "all" ? "全部" : statusLabel(status)}
          </button>
        ))}
      </div>

      {addedNotice && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#065f46", fontSize: 13 }}>
          {addedNotice}
        </div>
      )}

      {selectedJob && targetJob ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => setSelectedJob(null)}
              style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 500 }}
            >
              ← 返回岗位列表
            </button>
            <div style={{ fontSize: 13, color: "#64748b" }}>岗位详情</div>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{targetJob.title}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                  {targetJob.department} · {targetJob.location} · {targetJob.salary}
                </div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: statusColor(targetJob.status), background: statusBg(targetJob.status) }}>
                {statusLabel(targetJob.status)}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {targetJob.requirements.map((req) => (
                <span key={req} style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>简历上传与分析</div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
                  上传简历后，将基于当前岗位要求生成差异化分析结果，并支持将候选人加入候选人列表
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" multiple style={{ display: "none" }} onChange={handleUpload} />
                <button className="btn-primary" onClick={() => fileRef.current?.click()}>{analyzingKey === targetJob.id ? "分析中..." : "上传简历"}</button>
              </div>
            </div>

            {!targetResumes.length ? (
              <div style={{ padding: 32, borderRadius: 12, background: "#f8fafc", border: "1px dashed #e2e8f0", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                暂无已上传简历，上传后即可查看分析结果与添加候选人入口
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {targetResumes.map((resume, index) => (
                  <div key={`${resume.name}-${index}`} style={{ padding: 16, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{resume.name}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#94a3b8" }}>{resume.size} · 上传于 {new Date().toLocaleDateString("zh-CN")}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: resume.analysis.matchScore >= 90 ? "#059669" : resume.analysis.matchScore >= 75 ? "#0284c7" : resume.analysis.matchScore >= 60 ? "#d97706" : "#dc2626" }}>{resume.analysis.matchScore}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{resume.analysis.matchLevel}</div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>匹配能力</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7 }}>
                          {resume.analysis.matchedSkills.length ? resume.analysis.matchedSkills.join("、") : "暂无明确匹配项"}
                        </div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>缺口能力</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7 }}>
                          {resume.analysis.missingSkills.length ? resume.analysis.missingSkills.join("、") : "暂无明显短板"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>AI 建议</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7 }}>{resume.analysis.suggestion}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", marginBottom: 6 }}>HR 建议</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7 }}>{resume.analysis.hrSuggestion}</div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>匹配项数量</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{resume.analysis.matchedCount}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>缺口项数量</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#d97706" }}>{resume.analysis.missingCount}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", marginBottom: 6 }}>推荐状态</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: resume.analysis.matchScore >= 90 ? "#059669" : resume.analysis.matchScore >= 75 ? "#d97706" : "#dc2626" }}>
                          {resume.analysis.matchScore >= 90 ? "推荐通过" : resume.analysis.matchScore >= 75 ? "建议观察" : "暂不推荐"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>优势</div>
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#334155", lineHeight: 1.8 }}>
                          {resume.analysis.strengths.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>风险</div>
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#334155", lineHeight: 1.8 }}>
                          {resume.analysis.risks.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {resume.added ? "该简历已添加至候选人列表" : "分析完成后可将该简历对应的候选人加入候选人列表"}
                      </div>
                      <button
                        className={resume.added ? "btn-secondary" : "btn-primary"}
                        onClick={() => handleAddCandidate(targetJob, resume, index)}
                      >
                        {resume.added ? "已添加候选人" : "添加到候选人列表"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
          {filtered.map((job) => (
            <div key={job.id} className="section-card" style={{ cursor: "pointer" }} onClick={() => setSelectedJob(job)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{job.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                    {job.department} · {job.location}
                  </div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: statusColor(job.status), background: statusBg(job.status) }}>
                  {statusLabel(job.status)}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {job.requirements.slice(0, 3).map((req) => (
                  <span key={req} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 11, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>
                    {req}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>候选人：{job.candidateCount}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>薪资：{job.salary}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ width: 520, background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>新增岗位</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input value={newJob.title} onChange={(e) => setNewJob((prev) => ({ ...prev, title: e.target.value }))} placeholder="岗位名称" style={inputStyle} />
              <input value={newJob.department} onChange={(e) => setNewJob((prev) => ({ ...prev, department: e.target.value }))} placeholder="所属部门" style={inputStyle} />
              <input value={newJob.location} onChange={(e) => setNewJob((prev) => ({ ...prev, location: e.target.value }))} placeholder="工作地点" style={inputStyle} />
              <input value={newJob.salary} onChange={(e) => setNewJob((prev) => ({ ...prev, salary: e.target.value }))} placeholder="薪资范围" style={inputStyle} />
            </div>
            <textarea value={newJob.requirements} onChange={(e) => setNewJob((prev) => ({ ...prev, requirements: e.target.value }))} placeholder="岗位要求，多个要求用逗号或换行分隔" style={{ ...inputStyle, minHeight: 100, marginTop: 12, width: "100%", resize: "vertical" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn-primary" onClick={handleAddJob}>确认新增</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 13,
  outline: "none",
  background: "#fff",
  color: "#111827",
};