import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Award, BarChart3, CheckCircle2, Download, FileCheck2, Filter, Leaf, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = {
  navy: '#0B1F33',
  green: '#0F766E',
  emerald: '#047857',
  gold: '#B45309',
  bronze: '#92400E',
  silver: '#64748B',
  red: '#DC2626',
  orange: '#F97316',
  yellow: '#EAB308',
  slate: '#334155',
  soft: '#F8FAFC',
};

const levelByScore = (score) => {
  const v = Number(score || 0);
  if (v < 40) return { level: 'E1', label: 'Inicial', seal: 'Não classificável', rank: 1, color: COLORS.red };
  if (v < 60) return { level: 'E2', label: 'Em desenvolvimento', seal: 'Bronze', rank: 2, color: COLORS.bronze };
  if (v < 75) return { level: 'E3', label: 'Estruturado', seal: 'Prata', rank: 3, color: COLORS.silver };
  if (v < 90) return { level: 'E4', label: 'Avançado', seal: 'Ouro', rank: 4, color: COLORS.gold };
  return { level: 'E5', label: 'Excelência', seal: 'Esmeralda', rank: 5, color: COLORS.emerald };
};

const scoreFromLevel = { E1: 20, E2: 50, E3: 70, E4: 85, E5: 95, NA: null };

const requirements = [
  // IWA 48
  ['IWA-GER-01','IWA 48','Sistema','Geral','Princípios Gerais ESG','Sistema','4.1','Obrigatório'],
  ['IWA-GER-02','IWA 48','Sistema','Geral','Gestão de Dados, Evidências e Registros ESG','Sistema','4.2.2 / 4.5 / 5.2.2 / 9.2.3.1','Obrigatório'],
  ['IWA-GER-03','IWA 48','Sistema','Governança','Compliance, Conformidade e Avaliação de Conformidade ESG','Sistema','8','Obrigatório'],
  ['IWA-GER-04','IWA 48','Sistema','Governança','Asseguração ESG','Sistema','9.3','Complementar'],
  ['IWA-GER-05','IWA 48','Sistema','Governança','Comunicação ESG','Sistema','7.7','Obrigatório'],
  ['IWA-GER-06','IWA 48','Sistema','Governança','Melhoria Contínua ESG','Sistema','10','Obrigatório'],
  ['IWA-A-01','IWA 48','Ambiental','Impactos ambientais','Gestão de Impactos Ambientais','Sistema','4.2 / 4.5 / 5.2.1','Obrigatório'],
  ['IWA-A-02','IWA 48','Ambiental','Riscos ambientais','Gestão de Riscos Ambientais','Sistema','4.2','Obrigatório'],
  ['IWA-A-03','IWA 48','Ambiental','Indicadores','Indicadores Ambientais (KPIs)','Sistema','5.4','Obrigatório'],
  ['IWA-A-04','IWA 48','Ambiental','Cadeia de valor','Cadeia de Valor Ambiental','Sistema','4.2.1 / 4.4 / 5.1 / 5.2.2','Obrigatório'],
  ['IWA-A-05','IWA 48','Ambiental','Estratégia','Integração Estratégica Ambiental','Sistema','4.2 / 5.2.1','Obrigatório'],
  ['IWA-A-06','IWA 48','Ambiental','Ciclo de vida','Perspectiva de Ciclo de Vida','Sistema','4.2 / 5.1','Obrigatório'],
  ['IWA-S-01','IWA 48','Social','Impactos sociais','Gestão de Impactos Sociais','Sistema','6.2','Obrigatório'],
  ['IWA-S-02','IWA 48','Social','Stakeholders','Stakeholders e Engajamento','Sistema','4.4','Obrigatório'],
  ['IWA-S-03','IWA 48','Social','DEI','Inclusão e Equidade','Sistema','4.1','Obrigatório'],
  ['IWA-S-04','IWA 48','Social','Indicadores','Indicadores Sociais','Sistema','6.4','Obrigatório'],
  ['IWA-S-05','IWA 48','Social','Cadeia de valor','Cadeia de Valor Social','Sistema','4.2 / 4.4 / 6.2','Obrigatório'],
  ['IWA-S-06','IWA 48','Social','Direitos humanos','Direitos Humanos e Condições de Trabalho','Sistema','6.1','Obrigatório'],
  ['IWA-S-07','IWA 48','Social','Bem-estar','Bem-estar e Qualidade de Vida no Trabalho','Sistema','6.2','Obrigatório'],
  ['IWA-S-08','IWA 48','Social','Comunidade','Engajamento com a Comunidade','Sistema','6.1','Obrigatório'],
  ['IWA-S-09','IWA 48','Social','Direitos humanos','Due Diligence em Direitos Humanos','Sistema','4.2 / 4.4 / 6.1','Obrigatório'],
  ['IWA-G-01','IWA 48','Governança','Materialidade','Materialidade ESG','Sistema','4.5','Obrigatório'],
  ['IWA-G-02','IWA 48','Governança','Riscos ESG','Gestão de Riscos ESG','Sistema','4.2 / 4.2.3','Obrigatório'],
  ['IWA-G-03','IWA 48','Governança','Indicadores','KPIs ESG','Sistema','7.4','Obrigatório'],
  ['IWA-G-04','IWA 48','Governança','Reporte','Transparência e Reporte','Sistema','9','Obrigatório'],
  ['IWA-G-05','IWA 48','Governança','Estratégia','Integração Estratégica ESG','Sistema','7.2','Obrigatório'],
  ['IWA-G-06','IWA 48','Governança','Ética','Ética, Integridade e Compliance','Sistema','7.2 / 7.3','Obrigatório'],
  ['IWA-G-07','IWA 48','Governança','Estrutura','Estrutura de Governança ESG','Sistema','7.2','Obrigatório'],
  ['IWA-G-08','IWA 48','Governança','Cultura','Tomada de Decisão e Cultura Organizacional','Sistema','7.5 / 7.6','Obrigatório'],
  ['IWA-G-09','IWA 48','Governança','Liderança','Desafio Construtivo na Governança ESG','Sistema','7.5.2','Obrigatório'],

  // ABNT PR 2030
  ['2030-A-01','ABNT PR 2030','Ambiental','Mudanças Climáticas','Mitigação de emissões de GEE','Temático','7.1.1.1','Obrigatório'],
  ['2030-A-02','ABNT PR 2030','Ambiental','Mudanças Climáticas','Adaptação às mudanças climáticas','Temático','7.1.1.2','Obrigatório'],
  ['2030-A-03','ABNT PR 2030','Ambiental','Energia','Eficiência Energética','Temático','7.1.1.3','Obrigatório'],
  ['2030-A-04','ABNT PR 2030','Ambiental','Recursos Hídricos','Uso e consumo de água','Temático','7.1.2.1','Obrigatório'],
  ['2030-A-05','ABNT PR 2030','Ambiental','Recursos Hídricos','Gestão de efluentes','Temático','7.1.2.2','Obrigatório'],
  ['2030-A-06','ABNT PR 2030','Ambiental','Biodiversidade','Conservação e uso sustentável da biodiversidade','Temático','7.1.3.1','Obrigatório'],
  ['2030-A-07','ABNT PR 2030','Ambiental','Solo','Uso sustentável do solo','Temático','7.1.3.2','Obrigatório'],
  ['2030-A-08','ABNT PR 2030','Ambiental','Economia Circular','Economia circular','Temático','7.1.4.1','Obrigatório'],
  ['2030-A-09','ABNT PR 2030','Ambiental','Resíduos','Gestão de resíduos sólidos','Temático','7.1.4.2','Obrigatório'],
  ['2030-A-10','ABNT PR 2030','Ambiental','Gestão Ambiental','Gestão ambiental','Temático','7.1.5.1','Obrigatório'],
  ['2030-A-11','ABNT PR 2030','Ambiental','Poluição','Prevenção de poluição sonora','Temático','7.1.5.2','Obrigatório'],
  ['2030-A-12','ABNT PR 2030','Ambiental','Poluição','Qualidade do ar','Temático','7.1.5.3','Obrigatório'],
  ['2030-A-13','ABNT PR 2030','Ambiental','Áreas contaminadas','Gerenciamento de áreas contaminadas','Temático','7.1.5.4','Obrigatório'],
  ['2030-A-14','ABNT PR 2030','Ambiental','Produtos perigosos','Produtos e substâncias perigosas','Temático','7.1.5.5','Obrigatório'],
  ['2030-S-01','ABNT PR 2030','Social','Diálogo Social','Diálogo e engajamento social','Temático','7.2.1.1','Obrigatório'],
  ['2030-S-02','ABNT PR 2030','Social','Impacto Social','Impactos sociais','Temático','7.2.1.2','Obrigatório'],
  ['2030-S-03','ABNT PR 2030','Social','Investimento Social','Investimento social privado','Temático','7.2.1.3','Complementar'],
  ['2030-S-04','ABNT PR 2030','Social','Direitos Humanos','Respeito aos direitos humanos','Temático','7.2.2.1','Obrigatório'],
  ['2030-S-05','ABNT PR 2030','Social','Direitos Humanos','Combate ao trabalho forçado','Temático','7.2.2.2','Obrigatório'],
  ['2030-S-06','ABNT PR 2030','Social','Direitos Humanos','Combate ao trabalho infantil','Temático','7.2.2.3','Obrigatório'],
  ['2030-S-07','ABNT PR 2030','Social','DEI','Políticas e práticas de diversidade e inclusão','Temático','7.2.3.1','Obrigatório'],
  ['2030-S-08','ABNT PR 2030','Social','DEI','Cultura e promoção de inclusão','Temático','7.2.3.2','Obrigatório'],
  ['2030-S-09','ABNT PR 2030','Social','Trabalho','Desenvolvimento profissional','Temático','7.2.4.1','Obrigatório'],
  ['2030-S-10','ABNT PR 2030','Social','Trabalho','Saúde e segurança ocupacional','Temático','7.2.4.2','Obrigatório'],
  ['2030-S-11','ABNT PR 2030','Social','Trabalho','Qualidade de vida e bem-estar','Temático','7.2.4.3','Obrigatório'],
  ['2030-S-12','ABNT PR 2030','Social','Trabalho','Liberdade de associação','Temático','7.2.4.4','Obrigatório'],
  ['2030-S-13','ABNT PR 2030','Social','Trabalho','Política de Remuneração e benefícios','Temático','7.2.4.5','Obrigatório'],
  ['2030-S-14','ABNT PR 2030','Social','Cadeia de valor','Relacionamento com consumidores e clientes','Temático','7.2.5.1','Obrigatório'],
  ['2030-S-15','ABNT PR 2030','Social','Cadeia de valor','Relacionamento com fornecedores','Temático','7.2.5.2','Obrigatório'],
  ['2030-G-01','ABNT PR 2030','Governança','Governança Corporativa','Estrutura e composição da governança','Temático','7.3.1.1','Obrigatório'],
  ['2030-G-02','ABNT PR 2030','Governança','Estratégia','Propósito e estratégia em relação à sustentabilidade','Temático','7.3.1.1','Obrigatório'],
  ['2030-G-03','ABNT PR 2030','Governança','Compliance','Compliance, programa de integridade e anticorrupção','Temático','7.3.2.1','Obrigatório'],
  ['2030-G-04','ABNT PR 2030','Governança','Concorrência','Práticas de concorrência leal (antitruste)','Temático','7.3.2.2','Obrigatório'],
  ['2030-G-05','ABNT PR 2030','Governança','Stakeholders','Engajamento com partes interessadas','Temático','7.3.2.3','Obrigatório'],
  ['2030-G-06','ABNT PR 2030','Governança','Riscos','Gestão de riscos do negócio','Temático','7.3.3.1','Obrigatório'],
  ['2030-G-07','ABNT PR 2030','Governança','Controles','Controles internos','Temático','7.3.3.2','Obrigatório'],
  ['2030-G-08','ABNT PR 2030','Governança','Auditoria','Auditorias internas e externas','Temático','7.3.3.3','Obrigatório'],
  ['2030-G-09','ABNT PR 2030','Governança','Regulatório','Ambiente legal e regulatório','Temático','7.3.3.4','Obrigatório'],
  ['2030-G-10','ABNT PR 2030','Governança','Segurança da informação','Gestão de segurança da informação','Temático','7.3.3.5','Obrigatório'],
  ['2030-G-11','ABNT PR 2030','Governança','Privacidade','Privacidade de dados pessoais','Temático','7.3.3.6','Obrigatório'],
  ['2030-G-12','ABNT PR 2030','Governança','Prestação de contas','Responsabilização – Prestação de contas','Temático','7.3.4.1','Obrigatório'],
  ['2030-G-13','ABNT PR 2030','Governança','Reporte','Relatório ESG, integrado, sustentabilidade','Temático','7.3.4.2','Obrigatório'],
  ['2030-G-14','ABNT PR 2030','Governança','Jornada ESG','Jornada de Implementação ESG','Sistema','2030-1 item 5','Obrigatório'],
  ['2030-G-15','ABNT PR 2030','Governança','Materialidade','Materialidade ESG','Sistema','2030-2 item 5','Obrigatório'],

  // ODS macrotemas
  ['ODS-01','ODS','Social','Impacto social','Impacto Social e Desenvolvimento Local','Impacto','ODS 1, 2, 10','Obrigatório'],
  ['ODS-02','ODS','Ambiental','Recursos','Segurança Alimentar e Uso Responsável de Recursos','Impacto','ODS 2, 12','Obrigatório'],
  ['ODS-03','ODS','Social','Saúde','Saúde, Segurança e Bem-estar','Impacto','ODS 3','Obrigatório'],
  ['ODS-04','ODS','Social','Educação','Educação, Capacitação e Desenvolvimento','Impacto','ODS 4, 8','Obrigatório'],
  ['ODS-05','ODS','Social','DEI','Diversidade, Equidade e Inclusão','Impacto','ODS 5, 10','Obrigatório'],
  ['ODS-06','ODS','Ambiental','Recursos naturais','Recursos Naturais e Sustentabilidade Operacional','Impacto','ODS 6, 7, 13, 14, 15','Obrigatório'],
  ['ODS-07','ODS','Governança','Inovação','Inovação, Infraestrutura e Tecnologia','Impacto','ODS 9, 11','Obrigatório'],
  ['ODS-08','ODS','Governança','Ética e parcerias','Governança, Parcerias e Ética','Impacto','ODS 16, 17','Obrigatório'],

  // Pacto Global
  ['PACTO-01','Pacto Global','Social','Direitos Humanos','Princípio 1 – Respeitar e proteger os direitos humanos','Ética','Princípio 1','Crítico'],
  ['PACTO-02','Pacto Global','Social','Direitos Humanos','Princípio 2 – Não participar de violações de direitos humanos','Ética','Princípio 2','Crítico'],
  ['PACTO-03','Pacto Global','Social','Trabalho','Princípio 3 – Liberdade de associação e negociação coletiva','Ética','Princípio 3','Obrigatório'],
  ['PACTO-04','Pacto Global','Social','Trabalho','Princípio 4 – Eliminação do trabalho forçado','Ética','Princípio 4','Obrigatório'],
  ['PACTO-05','Pacto Global','Social','Trabalho','Princípio 5 – Erradicação do trabalho infantil','Ética','Princípio 5','Obrigatório'],
  ['PACTO-06','Pacto Global','Social','Trabalho','Princípio 6 – Eliminação da discriminação no trabalho','Ética','Princípio 6','Obrigatório'],
  ['PACTO-07','Pacto Global','Ambiental','Meio ambiente','Princípio 7 – Abordagem preventiva aos desafios ambientais','Ética','Princípio 7','Obrigatório'],
  ['PACTO-08','Pacto Global','Ambiental','Meio ambiente','Princípio 8 – Responsabilidade ambiental','Ética','Princípio 8','Obrigatório'],
  ['PACTO-09','Pacto Global','Ambiental','Tecnologia','Princípio 9 – Tecnologias ambientalmente sustentáveis','Ética','Princípio 9','Obrigatório'],
  ['PACTO-10','Pacto Global','Governança','Anticorrupção','Princípio 10 – Combate à corrupção','Ética','Princípio 10','Crítico'],
].map(([id, model, axis, theme, requirement, type, reference, critical]) => ({ id, model, axis, theme, requirement, type, reference, critical }));

const initialScores = Object.fromEntries(requirements.map((r, idx) => [r.id, idx % 5 === 0 ? 50 : idx % 5 === 1 ? 70 : idx % 5 === 2 ? 85 : idx % 5 === 3 ? 95 : 20]));

function avg(vals) {
  const nums = vals.filter((v) => v !== null && v !== undefined && !Number.isNaN(Number(v))).map(Number);
  return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0;
}

function classifyByRank(rank) {
  if (rank <= 1) return { seal: 'Não classificável', level: 'E1', color: COLORS.red };
  if (rank === 2) return { seal: 'Bronze', level: 'E2', color: COLORS.bronze };
  if (rank === 3) return { seal: 'Prata', level: 'E3', color: COLORS.silver };
  if (rank === 4) return { seal: 'Ouro', level: 'E4', color: COLORS.gold };
  return { seal: 'Esmeralda', level: 'E5', color: COLORS.emerald };
}

function exportCsv(rows, scores) {
  const header = ['ID','Modelo','Eixo','Tema','Requisito','Tipo','Referência','Criticidade','Score','Nível','Selo'];
  const csv = [header.join(';'), ...rows.map(r => {
    const score = scores[r.id] ?? '';
    const lvl = score === '' ? '' : levelByScore(score);
    return [r.id,r.model,r.axis,r.theme,r.requirement,r.type,r.reference,r.critical,score,lvl.level,lvl.seal].map(v => `"${String(v).replaceAll('"','""')}"`).join(';');
  })].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'avaliacao_esg_rating_brasil.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function SustenceESGRatingSaaS() {
  const [scores, setScores] = useState(initialScores);
  const [modelFilter, setModelFilter] = useState('Todos');
  const [axisFilter, setAxisFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('Empresa Exemplo S.A.');

  const filtered = useMemo(() => requirements.filter(r =>
    (modelFilter === 'Todos' || r.model === modelFilter) &&
    (axisFilter === 'Todos' || r.axis === axisFilter) &&
    (`${r.id} ${r.model} ${r.axis} ${r.theme} ${r.requirement}`.toLowerCase().includes(search.toLowerCase()))
  ), [modelFilter, axisFilter, search]);

  const metrics = useMemo(() => {
    const getScores = (predicate) => requirements.filter(predicate).map(r => scores[r.id]);
    const esgItems = requirements.filter(r => r.model === 'IWA 48' || r.model === 'ABNT PR 2030');
    const E = avg(esgItems.filter(r => r.axis === 'Ambiental').map(r => scores[r.id]));
    const S = avg(esgItems.filter(r => r.axis === 'Social').map(r => scores[r.id]));
    const G = avg(esgItems.filter(r => r.axis === 'Governança' || r.axis === 'Sistema').map(r => scores[r.id]));
    const ESG = avg([E,S,G]);
    const ODS = avg(getScores(r => r.model === 'ODS'));
    const Pacto = avg(getScores(r => r.model === 'Pacto Global'));
    const finalScore = (ESG * 0.5) + (ODS * 0.3) + (Pacto * 0.2);

    const odsMet = requirements.filter(r => r.model === 'ODS' && (scores[r.id] || 0) >= 40).length;
    const pacto1 = scores['PACTO-01'] || 0;
    const pacto2 = scores['PACTO-02'] || 0;
    const pacto10 = scores['PACTO-10'] || 0;
    const pactoPrinciplesAt40 = requirements.filter(r => r.model === 'Pacto Global' && (scores[r.id] || 0) >= 40).length;
    const pactoPrinciplesAt60 = requirements.filter(r => r.model === 'Pacto Global' && (scores[r.id] || 0) >= 60).length;
    const pactoPrinciplesAt80 = requirements.filter(r => r.model === 'Pacto Global' && (scores[r.id] || 0) >= 80).length;

    const esgRank = levelByScore(ESG).rank;
    const odsRankRaw = levelByScore(ODS).rank;
    let odsRank = odsRankRaw;
    if (odsRankRaw >= 5 && odsMet < 14) odsRank = 4;
    if (odsRankRaw >= 4 && odsMet < 10) odsRank = 3;
    if (odsRankRaw >= 3 && odsMet < 6) odsRank = 2;
    if (odsRankRaw >= 2 && odsMet < 3) odsRank = 1;

    const pactoRankRaw = levelByScore(Pacto).rank;
    let pactoRank = pactoRankRaw;
    if (pacto1 < 40 || pacto2 < 40 || pacto10 < 40) pactoRank = 1;
    if (pactoRankRaw >= 3 && pactoPrinciplesAt40 < 6) pactoRank = 2;
    if (pactoRankRaw >= 4 && pactoPrinciplesAt60 < 8) pactoRank = 3;
    if (pactoRankRaw >= 5 && pactoPrinciplesAt80 < 10) pactoRank = 4;

    const finalRank = Math.min(levelByScore(finalScore).rank, esgRank, odsRank, pactoRank);
    const finalClass = classifyByRank(finalRank);
    const blockers = [];
    if (ESG < 40) blockers.push('Índice ESG abaixo de E2');
    if (ODS < 40) blockers.push('Índice ODS abaixo de E2');
    if (Pacto < 40) blockers.push('Índice Pacto Global abaixo de E2');
    if (odsMet < 3) blockers.push('ODS: mínimo de 3 ODS atendidos para classificação visual');
    if (pacto1 < 40 || pacto2 < 40) blockers.push('Pacto: Direitos Humanos abaixo de E2');
    if (pacto10 < 40) blockers.push('Pacto: Anticorrupção abaixo de E2');

    return { E,S,G,ESG,ODS,Pacto,finalScore, finalClass, finalRank, odsMet, pactoPrinciplesAt40, blockers,
      modelScores: ['IWA 48','ABNT PR 2030','ODS','Pacto Global'].map(m => ({ name: m, score: avg(getScores(r => r.model === m)) })),
      axisScores: [{axis:'Ambiental',score:E},{axis:'Social',score:S},{axis:'Governança',score:G}],
      heat: requirements.map(r => ({ name: r.id, score: scores[r.id], model: r.model, axis: r.axis })),
    };
  }, [scores]);

  const gapList = useMemo(() => requirements
    .map(r => ({ ...r, score: scores[r.id] || 0, level: levelByScore(scores[r.id] || 0).level }))
    .filter(r => r.score < 60)
    .sort((a,b)=>a.score-b.score)
    .slice(0,12), [scores]);

  const updateScore = (id, val) => {
    const n = Math.max(0, Math.min(100, Number(val || 0)));
    setScores(s => ({ ...s, [id]: n }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-900 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3"><Leaf className="h-7 w-7 text-emerald-300" /></div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">ESG Rating Brasil®</h1>
                <p className="text-sm text-slate-300">Sistema de avaliação ESG — Sustence</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:w-80">
            <span className="text-xs uppercase tracking-widest text-slate-300">Organização avaliada</span>
            <Input value={company} onChange={e=>setCompany(e.target.value)} className="border-white/20 bg-white/10 text-white placeholder:text-slate-400" />
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 rounded-2xl bg-white p-2 shadow-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
            <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
            <TabsTrigger value="regras">Regras</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Kpi title="Score Final" value={metrics.finalScore} icon={<Award />} color={metrics.finalClass.color} sub={metrics.finalClass.seal} />
              <Kpi title="Índice ESG" value={metrics.ESG} icon={<BarChart3 />} color={levelByScore(metrics.ESG).color} sub="Peso 50%" />
              <Kpi title="Índice ODS" value={metrics.ODS} icon={<Target />} color={levelByScore(metrics.ODS).color} sub="Peso 30%" />
              <Kpi title="Pacto Global" value={metrics.Pacto} icon={<ShieldCheck />} color={levelByScore(metrics.Pacto).color} sub="Peso 20%" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl shadow-sm lg:col-span-1">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Classificação Final</h2>
                  <div className="flex flex-col items-center justify-center gap-4 py-4">
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{background:`conic-gradient(${metrics.finalClass.color} ${metrics.finalScore}%, #E2E8F0 0)`}}>
                      <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                        <span className="text-4xl font-bold">{metrics.finalScore.toFixed(0)}</span>
                        <span className="text-xs text-slate-500">/100</span>
                      </div>
                    </div>
                    <Badge className="rounded-full px-4 py-2 text-sm" style={{backgroundColor:metrics.finalClass.color}}>{metrics.finalClass.seal} · {metrics.finalClass.level}</Badge>
                    <p className="text-center text-sm text-slate-500">Classificação definida pelo menor desempenho entre ESG, ODS e Pacto Global, sem compensação entre índices.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm lg:col-span-1">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Eixos ESG</h2>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={metrics.axisScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" />
                        <PolarRadiusAxis domain={[0,100]} />
                        <Radar name="Score" dataKey="score" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.35} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm lg:col-span-1">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Score por Modelo</h2>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.modelScores} layout="vertical" margin={{left:30}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0,100]} />
                        <YAxis dataKey="name" type="category" width={90} />
                        <Tooltip />
                        <Bar dataKey="score" radius={[0,10,10,0]}>
                          {metrics.modelScores.map((entry, index) => <Cell key={index} fill={levelByScore(entry.score).color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Regras de Elegibilidade</h2>
                  {metrics.blockers.length === 0 ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 /> Elegível para classificação conforme regras atuais.</div>
                  ) : (
                    <div className="space-y-2">
                      {metrics.blockers.map((b,i)=><div key={i} className="flex items-center gap-3 rounded-2xl bg-red-50 p-3 text-red-700"><AlertTriangle className="h-5 w-5" />{b}</div>)}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Distribuição dos Níveis</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={['E1','E2','E3','E4','E5'].map(l => ({name:l, value: requirements.filter(r => levelByScore(scores[r.id]||0).level===l).length}))} dataKey="value" nameKey="name" outerRadius={90} label>
                          {[COLORS.red, COLORS.bronze, COLORS.silver, COLORS.gold, COLORS.emerald].map((c,i)=><Cell key={i} fill={c}/>) }
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="avaliacao" className="space-y-4">
            <Toolbar modelFilter={modelFilter} setModelFilter={setModelFilter} axisFilter={axisFilter} setAxisFilter={setAxisFilter} search={search} setSearch={setSearch} onExport={() => exportCsv(filtered, scores)} />
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>{['ID','Modelo','Eixo','Tema','Requisito','Tipo','Score','Nível','Evidência','Prioridade'].map(h=><th key={h} className="px-3 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map((r,idx) => {
                      const lvl = levelByScore(scores[r.id] || 0);
                      return <tr key={r.id} className={idx%2?'bg-white':'bg-slate-50'}>
                        <td className="px-3 py-3 font-mono text-xs">{r.id}</td>
                        <td className="px-3 py-3">{r.model}</td>
                        <td className="px-3 py-3">{r.axis}</td>
                        <td className="px-3 py-3">{r.theme}</td>
                        <td className="px-3 py-3 font-medium">{r.requirement}</td>
                        <td className="px-3 py-3"><Badge variant="outline">{r.type}</Badge></td>
                        <td className="px-3 py-3"><Input type="number" min="0" max="100" value={scores[r.id] ?? 0} onChange={e=>updateScore(r.id,e.target.value)} className="w-20" /></td>
                        <td className="px-3 py-3"><Badge style={{backgroundColor:lvl.color}}>{lvl.level}</Badge></td>
                        <td className="px-3 py-3"><Input placeholder="link, documento ou observação" className="w-56" /></td>
                        <td className="px-3 py-3">{(scores[r.id]||0)<60?<Badge className="bg-red-600">Alta</Badge>:(scores[r.id]||0)<75?<Badge className="bg-yellow-600">Média</Badge>:<Badge className="bg-emerald-600">Baixa</Badge>}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requisitos" className="space-y-4">
            <Toolbar modelFilter={modelFilter} setModelFilter={setModelFilter} axisFilter={axisFilter} setAxisFilter={setAxisFilter} search={search} setSearch={setSearch} onExport={() => exportCsv(filtered, scores)} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(r => <Card key={r.id} className="rounded-3xl shadow-sm"><CardContent className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><Badge variant="outline">{r.id}</Badge><Badge>{r.model}</Badge></div><h3 className="font-semibold">{r.requirement}</h3><p className="text-sm text-slate-500">{r.axis} · {r.theme}</p><div className="text-xs text-slate-500">Referência: {r.reference}</div><Progress value={scores[r.id] || 0} /><div className="flex justify-between text-sm"><span>{scores[r.id] || 0}/100</span><span>{levelByScore(scores[r.id]||0).seal}</span></div></CardContent></Card>)}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><TrendingUp className="h-5 w-5"/> Top Gaps Prioritários</h2>
                <div className="space-y-3">
                  {gapList.map(g => <div key={g.id} className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-[120px_1fr_120px_120px] md:items-center"><div className="font-mono text-xs text-slate-500">{g.id}</div><div><div className="font-medium">{g.requirement}</div><div className="text-sm text-slate-500">{g.model} · {g.axis} · {g.theme}</div></div><Badge style={{backgroundColor:levelByScore(g.score).color}}>{g.level}</Badge><div className="text-right font-semibold">{g.score}/100</div></div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regras" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <RuleCard title="Cálculo Final" items={["ESG = média dos eixos Ambiental, Social e Governança", "ODS = média dos macrotemas/ODS avaliados", "Pacto Global = média dos 10 princípios", "Score Final = (ESG × 50%) + (ODS × 30%) + (Pacto × 20%)"]}/>
              <RuleCard title="Classificação" items={["E1: 0–39 — Não classificável", "E2: 40–59 — Bronze", "E3: 60–74 — Prata", "E4: 75–89 — Ouro", "E5: 90–100 — Esmeralda"]}/>
              <RuleCard title="Bloqueios" items={["Não há compensação entre ESG, ODS e Pacto Global", "Classificação final considera o menor nível entre os três índices", "Direitos Humanos e Anticorrupção no Pacto devem ser ≥ E2", "ODS exige quantidade mínima de ODS e metas por nível"]}/>
              <RuleCard title="Pesos Oficiais" items={["Índice ESG: 50%", "Índice ODS: 30%", "Índice Pacto Global: 20%", "Evidências verificáveis são obrigatórias"]}/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Kpi({title,value,icon,color,sub}) {
  return <Card className="rounded-3xl shadow-sm"><CardContent className="p-5"><div className="flex items-center justify-between"><div className="rounded-2xl p-3 text-white" style={{backgroundColor:color}}>{React.cloneElement(icon,{className:'h-5 w-5'})}</div><Badge variant="outline">{sub}</Badge></div><div className="mt-5"><p className="text-sm text-slate-500">{title}</p><p className="text-4xl font-bold" style={{color}}>{Number(value||0).toFixed(1)}</p><Progress className="mt-3" value={Number(value||0)} /></div></CardContent></Card>
}

function Toolbar({modelFilter,setModelFilter,axisFilter,setAxisFilter,search,setSearch,onExport}) {
  return <Card className="rounded-3xl shadow-sm"><CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center"><div className="flex items-center gap-2 text-slate-600"><Filter className="h-5 w-5"/><span className="font-medium">Filtros</span></div><Select value={modelFilter} onValueChange={setModelFilter}><SelectTrigger className="md:w-48"><SelectValue/></SelectTrigger><SelectContent>{['Todos','IWA 48','ABNT PR 2030','ODS','Pacto Global'].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><Select value={axisFilter} onValueChange={setAxisFilter}><SelectTrigger className="md:w-48"><SelectValue/></SelectTrigger><SelectContent>{['Todos','Sistema','Ambiental','Social','Governança'].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><Input placeholder="Buscar requisito, tema ou código" value={search} onChange={e=>setSearch(e.target.value)} className="flex-1"/><Button onClick={onExport} className="gap-2 bg-slate-900"><Download className="h-4 w-4"/> Exportar CSV</Button></CardContent></Card>
}

function RuleCard({title,items}) {
  return <Card className="rounded-3xl shadow-sm"><CardContent className="p-6"><h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><FileCheck2 className="h-5 w-5 text-teal-700"/>{title}</h3><div className="space-y-3">{items.map((it,i)=><div key={i} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{it}</div>)}</div></CardContent></Card>
}
