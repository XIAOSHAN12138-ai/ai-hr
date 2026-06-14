"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockCandidates, mockJobs } from "@/data/mock";
import { Candidate, CandidateStatus, Job, JobStatus, ScreeningResult } from "@/lib/types";

interface UploadedResume { name: string; size: string; analysis: ResumeAnalysis; added: boolean }
interface ResumeAnalysis { matchScore: number; matchLevel: string; matchedCount: number; missingCount: number; matchedSkills: string[]; missingSkills: string[]; suggestion: string; strengths: string[]; risks: string[]; hrSuggestion: string }

function jobStatusLabel(s: JobStatus) { return s === "open" ? "招聘中" : s === "closed" ? "已关闭" : "草稿" }
function jobStatusColor(s: JobStatus) { return s === "open" ? "#059669" : s === "closed" ? "#475569" : "#d97706" }
function jobStatusBg(s: JobStatus) { return s === "open" ? "#ecfdf5" : s === "closed" ? "#f1f5f9" : "#fffbeb" }
function candStatusLabel(s: CandidateStatus) { if(s==="passed")return "通过"; if(s==="pending")return "待定"; if(s==="rejected")return "淘汰"; if(s==="offer")return "录用"; return "已入职" }
function candStatusColor(s: CandidateStatus) { if(s==="passed")return "#059669"; if(s==="pending")return "#d97706"; if(s==="rejected")return "#dc2626"; if(s==="offer")return "#4f46e5"; return "#0284c7" }
function candStatusBg(s: CandidateStatus) { if(s==="passed")return "#ecfdf5"; if(s==="pending")return "#fffbeb"; if(s==="rejected")return "#fef2f2"; if(s==="offer")return "#eef2ff"; return "#f0f9ff" }
function scoreToFive(score: number) { return Math.round((score / 20) * 10) / 10 }
function fiveColor(v: number) { if(v>=4.5)return "#059669"; if(v>=4.0)return "#0284c7"; if(v>=3.5)return "#d97706"; return "#dc2626" }
function fiveLabel(v: number) { if(v>=4.5)return "优秀"; if(v>=4.0)return "良好"; if(v>=3.5)return "待定"; if(v>=3.0)return "一般"; return "淘汰" }
function formatSize(b: number) { if(b<=0)return "0KB"; const kb=b/1024; return kb>=1024?`${(kb/1024).toFixed(1)}MB`:`${Math.round(kb)}KB` }
function hashStr(v: string) { let h=0; for(let i=0;i<v.length;i++)h=(h*31+v.charCodeAt(i))|0; return Math.abs(h) }
function shuffle(seed: number, items: string[]) { const r=[...items]; let c=seed; for(let i=r.length-1;i>0;i--){c=(c*48271+13)%2147483647;const t=c%(i+1);[r[i],r[t]]=[r[t],r[i]]} return r }

function buildResumeAnalysis(job: Job, name: string, size: number): ResumeAnalysis {
  const seed = hashStr(`${job.id}-${name}-${size}`);
  const matchScore = Math.min(98, Math.max(42, 58 + (seed % 33)));
  const matchLevel = matchScore >= 90 ? "优秀" : matchScore >= 75 ? "良好" : matchScore >= 60 ? "一般" : "不匹配";
  const matchedSkills = shuffle(seed, job.requirements).slice(0, Math.min(job.requirements.length, 2 + (seed % 3)));
  const missingSkills = shuffle(seed * 2 + 7, ["性能优化","系统设计","团队管理","跨团队协作","项目复盘","数据分析","架构能力","业务理解"]).slice(0, 1 + (seed % 2));
  const suggMap: Record<string, string> = { "优秀": `建议优先安排一面，重点核验 ${job.title} 的核心项目深度和落地成果。`, "良好": `建议先做结构化电话面试，重点补全关键能力与项目指标信息。`, "一般": `建议谨慎推进，优先围绕缺口领域安排补充面试或笔试。`, "不匹配": `建议暂不安排面试，可转入人才库并设置后续跟踪提醒。` };
  const hrMap: Record<string, string> = { "优秀": `综合画像优于多数同批次简历，建议尽快推进，同步准备岗位卖点和面试排期。`, "良好": `基本面扎实，但仍需确认职业稳定性、薪资预期与到岗时间。`, "一般": `建议招聘同事先与用人方确认岗位硬性优先级，再决定是否安排面试。`, "不匹配": `该简历与当前岗位优先级不匹配，更适合进入人才库或转岗推荐。` };
  return { matchScore, matchLevel, matchedCount: matchedSkills.length, missingCount: missingSkills.length, matchedSkills, missingSkills, suggestion: suggMap[matchLevel], strengths: shuffle(seed+3, [`${name.replace(/\.[^/.]+$/,"")} 的项目经历与岗位方向契合度较高`,`技术栈与当前岗位要求重叠较多`,`过往经历显示出较好的稳定性和成长轨迹`]).slice(0,2), risks: shuffle(seed+9, ["需要进一步核实薪资预期","部分经历描述缺少量化结果","当前信息不足以判断长期稳定性"]).slice(0,2), hrSuggestion: hrMap[matchLevel] };
}

function buildScreeningFromAnalysis(job: Job, name: string, analysis: ResumeAnalysis): ScreeningResult {
  const hard = Math.min(100, Math.max(50, analysis.matchScore + 2));
  const soft = Math.min(100, Math.max(45, analysis.matchScore - 3));
  const total = Math.round((hard * 0.6 + soft * 0.4) * 10) / 10;
  return { hardScore: hard, softScore: soft, totalScore: total, level: total >= 75 ? "pass" : total >= 60 ? "pending" : "reject", details: { education: { score: Math.min(100,Math.max(60,hard-4)), verified: analysis.matchScore>=80, note: analysis.matchScore>=80?"学历信息已核验":"学历信息待核验" }, experience: { score: Math.min(100,Math.max(55,analysis.matchScore+1)), note: analysis.strengths[0]||"经历需要进一步确认" }, skills: { score: Math.min(100,Math.max(55,analysis.matchScore+3)), matched: analysis.matchedSkills, missing: analysis.missingSkills }, salary: { score: Math.min(100,Math.max(55,analysis.matchScore-2)), note: analysis.risks[0]||"薪资信息有限" }, potential: { score: Math.min(100,Math.max(60,analysis.matchScore+5)), note: analysis.strengths[1]||"潜力需面试评估" } } };
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "", salary: "", requirements: "" });
  const [uploadedResumes, setUploadedResumes] = useState<Record<string, UploadedResume[]>>({});
  const [analyzingKey, setAnalyzingKey] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { setJobs(mockJobs); setCandidates(mockCandidates); }, []);

  const filtered = useMemo(() => filter === "all" ? jobs : jobs.filter(j => j.status === filter), [jobs, filter]);
  const targetJob = useMemo(() => selectedJob ? jobs.find(j => j.id === selectedJob.id) ?? selectedJob : null, [jobs, selectedJob]);
  const targetResumes = useMemo(() => targetJob ? (uploadedResumes[targetJob.id] ?? []) : [], [uploadedResumes, targetJob]);
  const jobCandidates = useMemo(() => {
    if (!targetJob) return [];
    let list = candidates.filter(c => c.jobId === targetJob.id);
    if (candidateSearch) list = list.filter(c => c.name.includes(candidateSearch) || c.jobTitle.includes(candidateSearch));
    return list;
  }, [candidates, targetJob, candidateSearch]);

  const handleAddJob = () => {
    if (!newJob.title || !newJob.department || !newJob.location || !newJob.salary) return;
    const job: Job = { id: String(jobs.length + 1), title: newJob.title, department: newJob.department, location: newJob.location, salary: newJob.salary, requirements: newJob.requirements.split(/[,，\n]+/).map(s => s.trim()).filter(Boolean), status: "open", createdAt: new Date().toISOString().slice(0, 10), candidateCount: 0 };
    setJobs(prev => [job, ...prev]); setShowModal(false); setNewJob({ title: "", department: "", location: "", salary: "", requirements: "" });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!targetJob) return;
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAnalyzingKey(targetJob.id);
    setTimeout(() => {
      setUploadedResumes(prev => { const cur = prev[targetJob.id] ?? []; const next = files.map(f => ({ name: f.name, size: formatSize(f.size), analysis: buildResumeAnalysis(targetJob, f.name, f.size), added: false })); return { ...prev, [targetJob.id]: [...cur, ...next] }; });
      setAnalyzingKey(p => p === targetJob.id ? null : p);
    }, 600);
    e.target.value = "";
  };

  const handleAddCandidate = (job: Job, resume: UploadedResume, idx: number) => {
    const existing = candidates.find(c => c.name === resume.name.replace(/\.[^/.]+$/, "") && c.jobId === job.id);
    if (existing) { setAddedNotice(`候选人 ${existing.name} 已存在`); setTimeout(() => setAddedNotice(null), 2200); return; }
    const analysis = resume.analysis;
    const status: CandidateStatus = analysis.matchScore >= 90 ? "passed" : analysis.matchScore >= 75 ? "pending" : "rejected";
    const screening = buildScreeningFromAnalysis(job, resume.name, analysis);
    const nc: Candidate = { id: `uploaded-${job.id}-${Date.now()}-${idx}`, name: resume.name.replace(/\.[^/.]+$/, ""), email: `${resume.name.replace(/\.[^/.]+$/, "").toLowerCase()}@example.com`, phone: "待补充", jobId: job.id, jobTitle: job.title, status, score: screening.totalScore, education: "待确认", experience: "待确认", skills: analysis.matchedSkills, currentSalary: "待确认", expectedSalary: "待确认", avatar: "📄", screeningResult: screening, createdAt: new Date().toISOString().slice(0, 10) };
    setCandidates(prev => [nc, ...prev]);
    setUploadedResumes(prev => { const cur = prev[job.id] ?? []; return { ...prev, [job.id]: cur.map((r, i) => i === idx ? { ...r, added: true } : r) }; });
    setAddedNotice(`已将 ${nc.name} 添加到候选人列表`); setTimeout(() => setAddedNotice(null), 2200);
  };

  const handleViewCandidate = (c: Candidate) => {
    // Store candidate id in sessionStorage so candidates page can open it
    sessionStorage.setItem("openCandidateId", c.id);
    router.push("/candidates");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>岗位管理</div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ 新增岗位</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["all", "open", "closed", "draft"] as const).map(s => (
          <button key={s} className={`pill ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
            {s === "all" ? "全部" : jobStatusLabel(s)}
          </button>
        ))}
      </div>

      {addedNotice && <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#065f46", fontSize: 13 }}>{addedNotice}</div>}

      {selectedJob && targetJob ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setSelectedJob(null)} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 500 }}>← 返回岗位列表</button>
            <div style={{ fontSize: 13, color: "#64748b" }}>岗位详情</div>
          </div>

          {/* Job info card */}
          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{targetJob.title}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>{targetJob.department} · {targetJob.location} · {targetJob.salary}</div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: jobStatusColor(targetJob.status), background: jobStatusBg(targetJob.status) }}>{jobStatusLabel(targetJob.status)}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {targetJob.requirements.map(r => <span key={r} style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>{r}</span>)}
            </div>
          </div>

          {/* Candidate list for this job */}
          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>岗位候选人</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>共 {jobCandidates.length} 位候选人，点击可查看详情</div>
              </div>
              <input value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)} placeholder="搜索候选人" style={{ width: 200, padding: "7px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", background: "#fff" }} />
            </div>
            {jobCandidates.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>暂无候选人</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {jobCandidates.map(c => {
                  const five = scoreToFive(c.score);
                  return (
                    <div key={c.id} onClick={() => handleViewCandidate(c)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}>
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{c.avatar}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{c.education} · {c.experience}</div>
                      </div>
                      <div style={{ textAlign: "center", flexShrink: 0, minWidth: 60 }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: fiveColor(five) }}>{five}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{fiveLabel(five)}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: candStatusColor(c.status), background: candStatusBg(c.status), flexShrink: 0 }}>{candStatusLabel(c.status)}</span>
                      <span style={{ fontSize: 13, color: "#94a3b8", flexShrink: 0 }}>→</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resume upload & analysis */}
          <div className="section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>简历上传与分析</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>上传简历后生成差异化分析结果，可将候选人加入列表</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" multiple style={{ display: "none" }} onChange={handleUpload} />
                <button className="btn-primary" onClick={() => fileRef.current?.click()}>{analyzingKey === targetJob.id ? "分析中..." : "上传简历"}</button>
              </div>
            </div>
            {!targetResumes.length ? (
              <div style={{ padding: 32, borderRadius: 12, background: "#f8fafc", border: "1px dashed #e2e8f0", textAlign: "center", color: "#64748b", fontSize: 13 }}>暂无已上传简历</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {targetResumes.map((resume, index) => (
                  <div key={`${resume.name}-${index}`} style={{ padding: 16, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{resume.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{resume.size}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: resume.analysis.matchScore >= 90 ? "#059669" : resume.analysis.matchScore >= 75 ? "#0284c7" : resume.analysis.matchScore >= 60 ? "#d97706" : "#dc2626" }}>{resume.analysis.matchScore}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{resume.analysis.matchLevel}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>匹配能力</div>
                        <div style={{ fontSize: 12, color: "#334155" }}>{resume.analysis.matchedSkills.join("、") || "暂无"}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>缺口能力</div>
                        <div style={{ fontSize: 12, color: "#334155" }}>{resume.analysis.missingSkills.join("、") || "暂无"}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 6 }}>AI 建议</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{resume.analysis.suggestion}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", marginBottom: 6 }}>HR 建议</div>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{resume.analysis.hrSuggestion}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{resume.added ? "已添加至候选人列表" : "分析完成后可添加到候选人列表"}</div>
                      <button className={resume.added ? "btn-secondary" : "btn-primary"} onClick={() => handleAddCandidate(targetJob, resume, index)}>{resume.added ? "已添加" : "添加到候选人列表"}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
          {filtered.map(job => (
            <div key={job.id} className="section-card" style={{ cursor: "pointer" }} onClick={() => setSelectedJob(job)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{job.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>{job.department} · {job.location}</div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: jobStatusColor(job.status), background: jobStatusBg(job.status) }}>{jobStatusLabel(job.status)}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {job.requirements.slice(0, 3).map(r => <span key={r} style={{ padding: "3px 8px", borderRadius: 999, fontSize: 11, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>{r}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>候选人：{candidates.filter(c => c.jobId === job.id).length}</div>
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
              <input value={newJob.title} onChange={e => setNewJob(p => ({...p, title: e.target.value}))} placeholder="岗位名称" style={inputStyle} />
              <input value={newJob.department} onChange={e => setNewJob(p => ({...p, department: e.target.value}))} placeholder="所属部门" style={inputStyle} />
              <input value={newJob.location} onChange={e => setNewJob(p => ({...p, location: e.target.value}))} placeholder="工作地点" style={inputStyle} />
              <input value={newJob.salary} onChange={e => setNewJob(p => ({...p, salary: e.target.value}))} placeholder="薪资范围" style={inputStyle} />
            </div>
            <textarea value={newJob.requirements} onChange={e => setNewJob(p => ({...p, requirements: e.target.value}))} placeholder="岗位要求，逗号或换行分隔" style={{...inputStyle, minHeight: 100, marginTop: 12, width: "100%", resize: "vertical" as const}} />
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

const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", background: "#fff", color: "#111827" };