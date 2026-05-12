type Tone = 'formal' | 'concise' | 'tech';

type Section = 'achievement' | 'problem' | 'plan';

interface BulletPoint {
  raw: string;
  section: Section;
}

const actionVerbs: Record<Tone, Record<Section, string[]>> = {
  formal: {
    achievement: [
      '圆满完成', '顺利交付', '高效推进', '全面落实',
      '有序开展', '按时达成', '高质量完成', '系统梳理',
      '深度参与', '牵头组织', '协调各方', '主动跟进',
      '有序推动', '稳步实施', '统筹协调', '扎实落地',
    ],
    problem: [
      '持续关注', '积极协调', '深入分析', '反思复盘',
      '重点关注', '密切跟踪', '及时排查', '审慎评估',
    ],
    plan: [
      '重点推进', '全面启动', '持续优化', '深入调研',
      '有序开展', '着力提升', '稳步推进', '重点突破',
      '系统规划', '协同推进', '重点落实', '持续迭代',
      '深化拓展', '加快落地', '精心筹备', '扎实推进',
    ],
  },
  concise: {
    achievement: ['完成', '交付', '推进', '落地', '上线', '优化', '输出', '对齐'],
    problem: ['跟进', '协调', '分析', '排查', '评估', '关注'],
    plan: ['推进', '启动', '优化', '调研', '提升', '迭代', '落地', '规划'],
  },
  tech: {
    achievement: [
      '完成开发', '成功上线', '性能优化', '重构完成',
      'Bug修复', '方案落地', '技术调研', '代码Review',
      '架构升级', '系统迁移', '接口联调', '压测通过',
    ],
    problem: [
      '定位根因', '排查Bug', '技术调研', '性能分析',
      '兼容性修复', '依赖升级', '安全审计',
    ],
    plan: [
      '技术方案设计', '系统重构', '性能优化', '自动化改造',
      '监控完善', '文档建设', '工具链升级', '技术预研',
    ],
  },
};

const connectors: Record<Tone, string[]> = {
  formal: [
    '在此过程中，', '与此同时，', '此外，', '值得关注的是，',
    '从整体来看，', '基于上述工作，', '结合当前进展，',
  ],
  concise: ['同时，', '另外，', '后续，', '接下来，'],
  tech: [
    '技术层面，', '从架构角度看，', '在实现层面，',
    '基于当前方案，', '后续计划：',
  ],
};

const sectionLabels: Record<Section, string> = {
  achievement: '本周工作进展',
  problem: '问题与风险',
  plan: '下周工作计划',
};

const sectionIcons: Record<Section, string> = {
  achievement: '📌',
  problem: '⚠️',
  plan: '🎯',
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function classifySection(line: string): Section {
  const lower = line.toLowerCase();
  if (
    /问题|bug|困难|卡点|风险|阻塞|延迟|报错|故障/i.test(lower)
  ) {
    return 'problem';
  }
  if (
    /下周|计划|准备|打算|将[要会]|下一步|后续|待办/i.test(lower)
  ) {
    return 'plan';
  }
  return 'achievement';
}

function stripPrefix(line: string): string {
  return line
    .replace(/^[-*•·\d.]+\s*/, '')
    .replace(/^\[\s*[x✓✅✗✘ ]\s*\]\s*/i, '')
    .trim();
}

function professionalize(raw: string, tone: Tone): string {
  const verbs = actionVerbs[tone].achievement;

  const startsWithVerb =
    /^(完成|交付|推进|落实|开展|达成|高质量|系统|深度|参与|牵头|组织|协调|主动|推动|实施|统筹|扎实|优化|上线|输出|对齐|开发|重构|修复|调研|Review|升级|迁移|联调|压测|定位|排查|分析|启动|规划|迭代|拓展|落地|筹备|完善|改造|预研|跟进|评估|关注)/.test(
      raw
    );

  if (startsWithVerb) {
    return raw;
  }

  const verb = pickRandom(verbs);
  return `${verb}${raw}`;
}

function generateReflection(
  achievements: string[],
  problems: string[],
  tone: Tone
): string {
  if (tone === 'concise' && achievements.length <= 2) return '';
  if (tone === 'tech' && achievements.length === 0 && problems.length === 0) return '';

  const templates: Record<Tone, string[]> = {
    formal: [
      `本周整体工作推进顺利，${
        achievements.length
          ? `完成了${achievements.length}项重点工作，整体进度符合预期。`
          : '各项事务有序推进中。'
      }${
        problems.length
          ? `针对当前存在的${problems.length}项问题，已制定应对方案并将持续推进。`
          : ''
      }`,
      `回顾本周，团队在多个方向取得了扎实进展。${
        achievements.length > 2
          ? '工作节奏紧凑，关键节点均按时达成。'
          : '后续将继续保持高效推进节奏。'
      }${
        problems.length
          ? '面对过程中的挑战，我们积极应对，积累了宝贵经验。'
          : ''
      }`,
    ],
    concise: [
      `本周重点完成${achievements.length}项工作${
        problems.length ? `，跟进${problems.length}项问题` : ''
      }，整体进度正常。`,
    ],
    tech: [
      `本周技术产出：${achievements.length}项交付${
        problems.length ? `，${problems.length}项待解决` : ''
      }。${
        achievements.length > 0
          ? '代码质量和系统稳定性保持在预期水平。'
          : '当前主要聚焦在技术调研和方案设计阶段。'
      }`,
    ],
  };

  return pickRandom(templates[tone]);
}

export interface GeneratedReport {
  sections: { label: string; icon: string; items: string[] }[];
  reflection: string;
}

export function generateReport(
  inputText: string,
  tone: Tone
): GeneratedReport {
  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const bullets: BulletPoint[] = lines.map((line) => ({
    raw: stripPrefix(line),
    section: classifySection(line),
  }));

  const grouped: Record<Section, string[]> = {
    achievement: [],
    problem: [],
    plan: [],
  };

  for (const b of bullets) {
    const expanded = professionalize(b.raw, tone);
    grouped[b.section].push(expanded);
  }

  if (grouped.achievement.length === 0 && grouped.plan.length === 0 && grouped.problem.length === 0) {
    return { sections: [], reflection: '' };
  }

  const sections: GeneratedReport['sections'] = [];
  for (const s of ['achievement', 'problem', 'plan'] as Section[]) {
    if (grouped[s].length > 0) {
      sections.push({
        label: sectionLabels[s],
        icon: sectionIcons[s],
        items: grouped[s],
      });
    }
  }

  const reflection = generateReflection(
    grouped.achievement,
    grouped.problem,
    tone
  );

  return { sections, reflection };
}

export function formatReport(report: GeneratedReport, tone: Tone): string {
  const lines: string[] = [];

  lines.push('【周报】');
  lines.push('');

  for (const section of report.sections) {
    lines.push(`${section.icon} ${section.label}`);
    for (let i = 0; i < section.items.length; i++) {
      lines.push(`  ${i + 1}. ${section.items[i]}`);
    }
    lines.push('');
  }

  if (report.reflection) {
    lines.push(`💡 本周小结`);
    lines.push(report.reflection);
  }

  return lines.join('\n');
}

export { sectionLabels, sectionIcons };
export type { Tone, Section };
