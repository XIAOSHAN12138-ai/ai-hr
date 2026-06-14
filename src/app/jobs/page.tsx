"use client";

import React, { useState, useEffect } from "react";
import { mockJobs } from "@/data/mock";
import { Job, JobStatus } from "@/lib/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "", salary: "", requirements: "" });

  useEffect(() => { setJobs(mockJobs); }, []);

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const statusLabels: Record<JobStatus, { text: string; color: string; bg: string }> = {
    open: { text: "招聘中", color: "#00a870", bg: "#e8f8ef" },
    closed: { text: "已关闭", color: "#999", bg: "#f5f5f5" },
    draft: { text: "草稿", color: "#ed7b2f", bg: "#fff8e8" },
  };

  const handleAdd = () => {
    const job: Job = {
      id: String(jobs.length + 1),
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      salary: newJob.salary,
      requirements: newJob.requirements.split(",").map((s) => s.trim()),
      status: "open",
      createdAt: new Date().toISOString().slice(0, 10),
      candidateCount: 0,
    };
    setJobs([job, ...jobs]);
    setShowModal(false);
    setNewJob({ title: "", department: "", location: "", salary: "", requirements: "" });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "open", "closed", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                background: filter === s ? "#0052d9" : "#f0f0f0",
                color: filter === s ? "#fff" : "#666",
                transition: "all 0.2s",
              }}
            >
              {s === "all" ? "全部" : statusLabels[s].text} ({s === "all" ? jobs.length : jobs.filter((j) => j.status === s).length})
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            background: "#0052d9",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ＋ 发布岗位
        </button>
      </div>

      {/* Job cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map((job) => (
          <div
            key={job.id}
            className="card-hover"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${job.status === "open" ? "#00a870" : job.status === "draft" ? "#ed7b2f" : "#ccc"}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: "#999" }}>{job.department} · {job.location}</div>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  color: statusLabels[job.status].color,
                  background: statusLabels[job.status].bg,
                }}
              >
                {statusLabels[job.status].text}
              </span>
            </div>

            <div style={{ fontSize: 15, fontWeight: 600, color: "#0052d9", marginBottom: 12 }}>{job.salary}</div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {job.requirements.map((req) => (
                <span
                  key={req}
                  style={{
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    background: "#f0f5ff",
                    color: "#0052d9",
                  }}
                >
                  {req}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
              <span style={{ fontSize: 13, color: "#999" }}>
                👥 {job.candidateCount} 位候选人
              </span>
              <span style={{ fontSize: 12, color: "#bbb" }}>发布于 {job.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: 500,
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: "#333" }}>发布新岗位</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "title", label: "岗位名称", placeholder: "如：高级前端开发工程师" },
                { key: "department", label: "所属部门", placeholder: "如：技术研发部" },
                { key: "location", label: "工作地点", placeholder: "如：北京" },
                { key: "salary", label: "薪资范围", placeholder: "如：25K-40K" },
                { key: "requirements", label: "岗位要求", placeholder: "多个要求用逗号分隔" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    value={(newJob as any)[field.key]}
                    onChange={(e) => setNewJob({ ...newJob, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #dcdcdc",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #dcdcdc", background: "#fff", cursor: "pointer", fontSize: 14 }}
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                disabled={!newJob.title}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: newJob.title ? "#0052d9" : "#ccc",
                  color: "#fff",
                  cursor: newJob.title ? "pointer" : "not-allowed",
                  fontSize: 14,
                }}
              >
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
