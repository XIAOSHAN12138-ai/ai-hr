import { Job, Candidate, Interview, OfferRecord, ReviewRecord, DashboardStats, InterviewQuestion, Settings } from '@/lib/types';

export const mockJobs: Job[] = [
  {
    id: '1', title: '高级前端开发工程师', department: '技术研发部', location: '北京', salary: '25K-40K',
    requirements: ['5年以上前端经验', '精通 React/Vue', 'TypeScript', '大型项目经验'],
    status: 'open', createdAt: '2025-06-10', candidateCount: 23,
  },
  {
    id: '2', title: 'AI算法工程师', department: 'AI研究院', location: '上海', salary: '35K-55K',
    requirements: ['硕士及以上', '深度学习', 'NLP/CV经验', 'Python/PyTorch'],
    status: 'open', createdAt: '2025-06-08', candidateCount: 15,
  },
  {
    id: '3', title: '产品经理', department: '产品部', location: '深圳', salary: '20K-35K',
    requirements: ['3年以上产品经验', 'B端产品', '数据分析能力', '项目管理'],
    status: 'open', createdAt: '2025-06-05', candidateCount: 31,
  },
  {
    id: '4', title: 'UI/UX设计师', department: '设计部', location: '杭州', salary: '18K-30K',
    requirements: ['3年以上设计经验', 'Figma/Sketch', '设计系统', '用户体验研究'],
    status: 'open', createdAt: '2025-06-03', candidateCount: 18,
  },
  {
    id: '5', title: '后端开发工程师', department: '技术研发部', location: '北京', salary: '22K-38K',
    requirements: ['Java/Go', '微服务架构', '分布式系统', '数据库优化'],
    status: 'closed', createdAt: '2025-05-20', candidateCount: 42,
  },
];

const names = ['张三丰', '李明远', '王思琪', '赵雨晴', '刘浩然', '陈晓华', '杨小丽', '黄文博', '周天宇', '吴佳怡',
  '林思远', '孙博文', '胡晓明', '朱雨晨', '马文静', '郭佳欣', '何志强', '高雪梅', '罗文龙', '梁晓燕',
  '宋子豪', '唐雨萱', '许文杰', '邓晓红', '冯子轩', '曹雨欣', '彭文静', '曾子涵', '萧雨萱', '田文博'];
const avatars = ['🧑‍💻', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨', '👨‍🏫', '👩‍🏫', '🧑‍💼',
  '👨‍⚕️', '👩‍⚕️', '🧑‍🔬', '🧑‍🎨', '👨‍🍳', '👩‍🍳', '🧑‍🏫', '🧑‍⚕️', '👨‍🎤', '👩‍🎤'];
const statuses: Array<'passed' | 'pending' | 'rejected' | 'offer' | 'hired'> = ['passed', 'pending', 'rejected', 'offer', 'hired'];
const educations = ['清华大学 本科', '北京大学 硕士', '浙江大学 本科', '复旦大学 硕士', '上海交通大学 博士', '南京大学 本科', '华中科技大学 硕士', '中山大学 本科'];
const experiences = ['3年', '5年', '7年', '2年', '8年', '4年', '6年', '10年'];
const skillSets = [
  ['React', 'TypeScript', 'Node.js', 'Next.js'],
  ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
  ['Figma', 'Sketch', 'Adobe XD', '用户研究'],
  ['产品设计', '数据分析', 'SQL', 'Axure'],
  ['Java', 'Spring', 'MySQL', 'Redis'],
  ['Go', 'Kubernetes', 'Docker', '微服务'],
  ['Vue', 'Webpack', 'Sass', 'Git'],
  ['Flutter', 'Dart', 'iOS', 'Android'],
];

export const mockCandidates: Candidate[] = names.map((name, i) => {
  const jobIdx = i % mockJobs.length;
  const score = Math.floor(Math.random() * 40) + 55;
  return {
    id: String(i + 1),
    name,
    email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    jobId: mockJobs[jobIdx].id,
    jobTitle: mockJobs[jobIdx].title,
    status: statuses[i % statuses.length],
    score,
    education: educations[i % educations.length],
    experience: experiences[i % experiences.length],
    skills: skillSets[i % skillSets.length],
    currentSalary: `${15 + Math.floor(Math.random() * 20)}K`,
    expectedSalary: `${20 + Math.floor(Math.random() * 25)}K`,
    avatar: avatars[i % avatars.length],
    screeningResult: {
      hardScore: Math.floor(Math.random() * 20) + 60,
      softScore: Math.floor(Math.random() * 20) + 55,
      totalScore: score,
      level: score >= 75 ? 'pass' : score >= 60 ? 'pending' : 'reject',
      details: {
        education: { score: Math.floor(Math.random() * 30) + 65, verified: Math.random() > 0.3, note: '学历信息已核验' },
        experience: { score: Math.floor(Math.random() * 30) + 60, note: '工作经验符合岗位要求' },
        skills: { score: Math.floor(Math.random() * 30) + 65, matched: skillSets[i % skillSets.length].slice(0, 2), missing: ['性能优化'] },
        salary: { score: Math.floor(Math.random() * 30) + 60, note: '期望薪资在预算范围内' },
        potential: { score: Math.floor(Math.random() * 30) + 65, note: '学习能力较强' },
      },
    },
    createdAt: `2025-06-${String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')}`,
  };
});

export const mockInterviews: Interview[] = [
  { id: '1', candidateId: '1', candidateName: '张三丰', jobId: '1', jobTitle: '高级前端开发工程师', round: 'first', scheduledAt: '2025-06-15 14:00', interviewer: '李总监', status: 'completed', notes: '候选人技术基础扎实，沟通能力强', evaluation: { overallScore: 85, ability: { score: 88, comment: '技术能力突出，代码规范良好' }, personality: { score: 82, comment: '性格开朗，团队协作意识强' }, emotion: { score: 80, comment: '情绪稳定，抗压能力较好' }, aiSuggestion: '建议录用，技术能力与岗位匹配度高', hrSuggestion: '同意录用，建议适当提高薪资', finalDecision: 'pass' } },
  { id: '2', candidateId: '2', candidateName: '李明远', jobId: '2', jobTitle: 'AI算法工程师', round: 'first', scheduledAt: '2025-06-15 10:00', interviewer: '王主任', status: 'completed', evaluation: { overallScore: 72, ability: { score: 75, comment: '算法基础较好，但项目经验稍显不足' }, personality: { score: 70, comment: '较为内向，但思维严谨' }, emotion: { score: 68, comment: '面对压力问题时有些紧张' }, aiSuggestion: '建议二面进一步评估项目实战能力', hrSuggestion: '同意二面安排', finalDecision: 'pending' } },
  { id: '3', candidateId: '3', candidateName: '王思琪', jobId: '3', jobTitle: '产品经理', round: 'second', scheduledAt: '2025-06-16 15:00', interviewer: '张经理', status: 'scheduled' },
  { id: '4', candidateId: '4', candidateName: '赵雨晴', jobId: '4', jobTitle: 'UI/UX设计师', round: 'first', scheduledAt: '2025-06-16 10:00', interviewer: '刘设计总监', status: 'scheduled' },
  { id: '5', candidateId: '5', candidateName: '刘浩然', jobId: '1', jobTitle: '高级前端开发工程师', round: 'first', scheduledAt: '2025-06-17 14:00', interviewer: '李总监', status: 'scheduled' },
  { id: '6', candidateId: '6', candidateName: '陈晓华', jobId: '2', jobTitle: 'AI算法工程师', round: 'final', scheduledAt: '2025-06-18 10:00', interviewer: 'CTO', status: 'scheduled' },
];

export const mockOffers: OfferRecord[] = [
  { id: '1', candidateId: '7', candidateName: '杨小丽', jobTitle: '高级前端开发工程师', proposedSalary: '32K', status: 'pending', negotiationAdvice: '候选人当前薪资28K，期望35K。建议首次报价30K，绩效奖金+2K，年16薪，预计可接受。', riskAssessment: '竞争对手已给出33K offer，需尽快决策。候选人对技术氛围关注度高。', createdAt: '2025-06-14' },
  { id: '2', candidateId: '8', candidateName: '黄文博', jobTitle: 'AI算法工程师', proposedSalary: '45K', status: 'negotiating', negotiationAdvice: '候选人期望50K，当前42K。建议报价43K+期权，强调成长空间和技术挑战。', riskAssessment: '低风险，候选人对AI方向兴趣浓厚。', createdAt: '2025-06-13' },
];

export const mockReviews: ReviewRecord[] = [
  { id: '1', interviewer: '李总监', interviewCount: 28, averageScore: 82, strengths: ['技术问题深度好', '候选人体验佳'], improvements: ['可加强行为面试技巧', '评估维度可更均衡'], aiSuggestion: '建议参加"结构化面试"培训，学习STAR法则评估候选人行为能力。' },
  { id: '2', interviewer: '王主任', interviewCount: 15, averageScore: 78, strengths: ['问题设计合理', '时间把控好'], improvements: ['评估偏技术，软技能关注不足', '可增加情景模拟环节'], aiSuggestion: '建议增加"压力测试"和"团队协作"评估维度，参考公司面试手册中的情景题库。' },
  { id: '3', interviewer: '张经理', interviewCount: 22, averageScore: 85, strengths: ['综合评估全面', '沟通引导能力强'], improvements: ['可减少引导性提问', '记录更详细些'], aiSuggestion: '表现优秀，建议作为面试导师辅导新人面试官。' },
];

export const mockQuestions: InterviewQuestion[] = [
  { id: '1', category: '破冰暖场', question: '请简单介绍一下你自己，以及为什么对我们公司/这个岗位感兴趣？', goodAnswer: '能清晰介绍职业背景，表达对公司业务/文化的了解，说明岗位匹配度和个人职业规划。', mediumAnswer: '能介绍基本情况，但对公司的了解较浅，岗位匹配说明不够具体。', poorAnswer: '介绍混乱，没有提及公司或岗位，明显是海投状态。', tips: '观察候选人的表达能力和准备工作，注意是否做了功课。' },
  { id: '2', category: '离职动机', question: '你离开上一家公司的主要原因是什么？', goodAnswer: '坦诚但不抱怨，说明职业发展需求、寻求新挑战等积极原因。', mediumAnswer: '给出合理原因但细节模糊，或有轻微负面情绪。', poorAnswer: '大量抱怨前公司/领导，缺乏自我反思。', tips: '关注候选人的情绪管理和成熟度。' },
  { id: '3', category: '情景模拟', question: '如果项目临近截止日期，但团队遇到了重大技术难题，你会怎么处理？', goodAnswer: '能提出系统性方案：评估影响、制定Plan B、沟通协调、资源调配、复盘总结。', mediumAnswer: '能提出基本解决方案，但缺乏优先级排序和沟通策略。', poorAnswer: '只说"加班"或"找领导"，缺乏独立思考。', tips: '评估问题解决能力和压力管理能力。' },
  { id: '4', category: '专业能力', question: '请描述一个你主导的最有挑战性的项目，你在其中扮演什么角色？', goodAnswer: '能详细描述项目背景、挑战、个人贡献和成果，有数据支撑。', mediumAnswer: '能描述项目但个人贡献不够突出，缺乏量化成果。', poorAnswer: '描述模糊，无法说明具体贡献或学到什么。', tips: '深入了解候选人的实际能力和贡献度。' },
  { id: '5', category: '团队协作', question: '描述一次你和同事产生分歧的经历，你是怎么解决的？', goodAnswer: '能描述分歧场景，强调倾听理解、求同存异、达成共识的过程。', mediumAnswer: '能描述但解决方案较被动，或最终结果不够理想。', poorAnswer: '表现出回避冲突或过于强势，缺乏协作意识。', tips: '评估情商和团队合作能力。' },
  { id: '6', category: '自我认知', question: '你认为自己最大的优势和需要改进的地方分别是什么？', goodAnswer: '优势有具体案例支撑，不足真实且有改进计划。', mediumAnswer: '能说出优势和不足，但缺乏具体例子或改进措施。', poorAnswer: '优势夸大其词，不足回避或说"没有"。', tips: '观察自我认知的成熟度。' },
  { id: '7', category: '压力测试', question: '如果你的直属领导给你安排了一项你完全不同意的任务，你会怎么做？', goodAnswer: '先理解意图，再提出建设性建议，如果仍被要求执行则全力完成并记录风险。', mediumAnswer: '会执行但可能带着情绪，或过于服从不提意见。', poorAnswer: '直接拒绝或无条件服从，缺乏判断力。', tips: '评估向上管理能力和职业成熟度。' },
  { id: '8', category: '职业规划', question: '你未来3-5年的职业规划是什么？', goodAnswer: '规划清晰且与公司发展有交集，展现成长意愿和稳定性。', mediumAnswer: '有规划但较模糊，与岗位关联度一般。', poorAnswer: '没有规划，或规划与岗位完全不匹配。', tips: '评估候选人的稳定性和长期价值。' },
];

export const mockDashboard: DashboardStats = {
  totalJobs: 5,
  openJobs: 4,
  totalCandidates: 30,
  todayNew: 5,
  interviewsToday: 3,
  pendingOffers: 2,
  passRate: 68,
  avgScreeningScore: 74,
  recentActivities: [
    { id: '1', type: 'candidate', message: '新候选人 曾子涵 投递了 AI算法工程师 岗位', time: '10分钟前' },
    { id: '2', type: 'interview', message: '张三丰 完成了一面，综合评分85分', time: '30分钟前' },
    { id: '3', type: 'screening', message: '系统完成了15份简历的自动筛选评分', time: '1小时前' },
    { id: '4', type: 'offer', message: '杨小丽 收到了录用意向书，等待回复', time: '2小时前' },
    { id: '5', type: 'interview', message: '王思琪 的二面已安排在明天15:00', time: '3小时前' },
  ],
};

export const defaultSettings: Settings = {
  weights: { education: 20, experience: 25, skills: 30, salary: 10, potential: 15 },
  thresholds: { pass: 75, reject: 55 },
  autoScreening: true,
  aiAssistance: true,
};
