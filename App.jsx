// App.jsx
import React, { useMemo, useState } from 'react';

const requisitos = [
  ['IWA-01','IWA 48','Governança','Princípios Gerais ESG','Sistema'],
  ['IWA-02','IWA 48','Governança','Gestão de Dados e Evidências','Sistema'],
  ['IWA-03','IWA 48','Governança','Compliance e Conformidade ESG','Sistema'],
  ['IWA-04','IWA 48','Governança','Asseguração ESG','Sistema'],
  ['IWA-05','IWA 48','Governança','Comunicação ESG','Sistema'],
  ['IWA-06','IWA 48','Governança','Melhoria Contínua ESG','Sistema'],
  ['2030-A-01','ABNT PR 2030','Ambiental','Mitigação de emissões de GEE','Temático'],
  ['2030-A-02','ABNT PR 2030','Ambiental','Adaptação às mudanças climáticas','Temático'],
  ['2030-A-03','ABNT PR 2030','Ambiental','Eficiência Energética','Temático'],
  ['2030-A-04','ABNT PR 2030','Ambiental','Uso e consumo de água','Temático'],
  ['2030-A-05','ABNT PR 2030','Ambiental','Gestão de resíduos sólidos','Temático'],
  ['2030-S-01','ABNT PR 2030','Social','Direitos Humanos','Temático'],
  ['2030-S-02','ABNT PR 2030','Social','Diversidade, Equidade e Inclusão','Temático'],
  ['2030-S-03','ABNT PR 2030','Social','Saúde e Segurança Ocupacional','Temático'],
  ['2030-G-01','ABNT PR 2030','Governança','Governança Corporativa','Temático'],
  ['2030-G-02','ABNT PR 2030','Governança','Compliance e Anticorrupção','Temático'],
  ['ODS-01','ODS','Social','Impacto Social e Desenvolvimento Local','Impacto'],
  ['ODS-02','ODS','Ambiental','Recursos Naturais e Sustentabilidade Operacional','Impacto'],
  ['ODS-03','ODS','Social','Saúde, Segurança e Bem-estar','Impacto'],
  ['ODS-04','ODS','Governança','Governança, Parcerias e Ética','Impacto'],
  ['PACTO-01','Pacto Global','Social','Princípio 1 - Direitos Humanos','Ética'],
  ['PACTO-02','Pacto Global','Social','Princípio 2 - Não Cumplicidade','Ética'],
  ['PACTO-03','Pacto Global','Social','Princípio 3 - Liberdade de Associação','Ética'],
  ['PACTO-04','Pacto Global','Social','Princípio 4 - Trabalho Forçado','Ética'],
  ['PACTO-05','Pacto Global','Social','Princípio 5 - Trabalho Infantil','Ética'],
  ['PACTO-06','Pacto Global','Social','Princípio 6 - Discriminação','Ética'],
  ['PACTO-07','Pacto Global','Ambiental','Princípio 7 - Prevenção Ambiental','Ética'],
  ['PACTO-08','Pacto Global','Ambiental','Princípio 8 - Responsabilidade Ambiental','Ética'],
  ['PACTO-09','Pacto Global','Ambiental','Princípio 9 - Tecnologias Sustentáveis','Ética'],
  ['PACTO-10','Pacto Global','Governança','Princípio 10 - Anticorrupção','Ética']
].map(([id, modelo, eixo, tema, tipo]) => ({ id, modelo, eixo, tema, tipo }));

const iniciais = Object.fromEntries(requisitos.map((r, i) => [r.id, [50, 70, 85, 95, 30][i % 5]]));

function media(v) { const n = v.filter(x => typeof x === 'number'); return n.length ? n.reduce((a,b)=>a+b,0)/n.length : 0; }
function faixa(s) {
  if (s < 40) return { nivel:'E1', selo:'Não classificável', cor:'#dc2626' };
  if (s < 60) return { nivel:'E2', selo:'Bronze', cor:'#92400e' };
  if (s < 75) return { nivel:'E3', selo:'Prata', cor:'#64748b' };
  if (s < 90) return { nivel:'E4', selo:'Ouro', cor:'#b45309' };
  return { nivel:'E5', selo:'Esmeralda', cor:'#047857' };
}

export default function App() {
  const [scores, setScores] = useState(iniciais);
  const [modelo, setModelo] = useState('Todos');
  const [eixo, setEixo] = useState('Todos');
  const [busca, setBusca] = useState('');

  const calc = useMemo(() => {
    const esgReq = requisitos.filter(r => r.modelo === 'IWA 48' || r.modelo === 'ABNT PR 2030');
    const E = media(esgReq.filter(r => r.eixo === 'Ambiental').map(r => scores[r.id]));
    const S = media(esgReq.filter(r => r.eixo === 'Social').map(r => scores[r.id]));
    const G = media(esgReq.filter(r => r.eixo === 'Governança').map(r => scores[r.id]));
    const ESG = media([E,S,G]);
    const ODS = media(requisitos.filter(r => r.modelo === 'ODS').map(r => scores[r.id]));
    const Pacto = media(requisitos.filter(r => r.modelo === 'Pacto Global').map(r => scores[r.id]));
    const Final = ESG*0.5 + ODS*0.3 + Pacto*0.2;
    const odsAtendidos = requisitos.filter(r => r.modelo === 'ODS' && scores[r.id] >= 40).length;
    const bloqueios = [];
    if (ESG < 40) bloqueios.push('Índice ESG abaixo de E2');
    if (ODS < 40) bloqueios.push('Índice ODS abaixo de E2');
    if (Pacto < 40) bloqueios.push('Índice Pacto Global abaixo de E2');
    if (odsAtendidos < 3) bloqueios.push('Mínimo de 3 ODS atendidos não alcançado');
    if ((scores['PACTO-01']||0) < 40 || (scores['PACTO-02']||0) < 40) bloqueios.push('Direitos Humanos no Pacto abaixo de E2');
    if ((scores['PACTO-10']||0) < 40) bloqueios.push('Anticorrupção no Pacto abaixo de E2');
    const menor = Math.min(ESG, ODS, Pacto, Final);
    const classe = bloqueios.length ? faixa(0) : faixa(menor);
    return { E,S,G,ESG,ODS,Pacto,Final,classe,bloqueios };
  }, [scores]);

  const filtrados = requisitos.filter(r =>
    (modelo==='Todos'||r.modelo===modelo) && (eixo==='Todos'||r.eixo===eixo) &&
    `${r.id} ${r.modelo} ${r.eixo} ${r.tema}`.toLowerCase().includes(busca.toLowerCase())
  );

  const setScore = (id, v) => setScores(p => ({...p, [id]: Math.max(0, Math.min(100, Number(v)||0))}));

  return <div style={s.page}>
    <header style={s.header}>
      <div><h1 style={s.h1}>ESG Rating Brasil®</h1><p style={s.sub}>Plataforma Sustence de avaliação, score e dashboard ESG</p></div>
      <div style={{textAlign:'right'}}><div style={s.badge}>Sustence</div><b style={{fontSize:22,color:calc.classe.cor}}>{calc.classe.selo}</b></div>
    </header>

    <section style={s.kpis}>
      <KPI t="Score Final" v={calc.Final} d={calc.classe.nivel} c={calc.classe.cor}/>
      <KPI t="Índice ESG" v={calc.ESG} d="Peso 50%" c="#0f766e"/>
      <KPI t="Índice ODS" v={calc.ODS} d="Peso 30%" c="#2563eb"/>
      <KPI t="Pacto Global" v={calc.Pacto} d="Peso 20%" c="#7c3aed"/>
    </section>

    <section style={s.grid2}>
      <div style={s.card}><h2>Dashboard Executivo</h2><Bar nome="Ambiental" v={calc.E} c="#16a34a"/><Bar nome="Social" v={calc.S} c="#2563eb"/><Bar nome="Governança" v={calc.G} c="#7c3aed"/><Bar nome="ESG" v={calc.ESG} c="#0f766e"/><Bar nome="ODS" v={calc.ODS} c="#2563eb"/><Bar nome="Pacto" v={calc.Pacto} c="#7c3aed"/></div>
      <div style={s.card}><h2>Regras de Elegibilidade</h2>{calc.bloqueios.length ? calc.bloqueios.map(b=><div key={b} style={s.alert}>⚠ {b}</div>) : <div style={s.ok}>✓ Elegível conforme regras atuais</div>}<p style={s.note}>Score Final = ESG × 50% + ODS × 30% + Pacto × 20%. Classificação sem compensação entre índices.</p></div>
    </section>

    <section style={s.card}>
      <div style={s.filters}>
        <select value={modelo} onChange={e=>setModelo(e.target.value)} style={s.input}><option>Todos</option><option>IWA 48</option><option>ABNT PR 2030</option><option>ODS</option><option>Pacto Global</option></select>
        <select value={eixo} onChange={e=>setEixo(e.target.value)} style={s.input}><option>Todos</option><option>Ambiental</option><option>Social</option><option>Governança</option></select>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar requisito" style={s.search}/>
      </div>
      <div style={{overflowX:'auto'}}><table style={s.table}><thead><tr>{['ID','Modelo','Eixo','Tema','Tipo','Score','Nível'].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead><tbody>{filtrados.map(r=>{const f=faixa(scores[r.id]);return <tr key={r.id}><td style={s.td}>{r.id}</td><td style={s.td}>{r.modelo}</td><td style={s.td}>{r.eixo}</td><td style={s.td}>{r.tema}</td><td style={s.td}>{r.tipo}</td><td style={s.td}><input type="number" min="0" max="100" value={scores[r.id]} onChange={e=>setScore(r.id,e.target.value)} style={s.num}/></td><td style={s.td}><span style={{...s.pill,background:f.cor}}>{f.nivel}</span></td></tr>})}</tbody></table></div>
    </section>
  </div>
}

function KPI({t,v,d,c}) { return <div style={s.kpi}><div style={{...s.dot,background:c}}></div><div style={s.kpiTitle}>{t}</div><div style={{...s.kpiVal,color:c}}>{v.toFixed(1)}</div><div style={s.note}>{d}</div></div> }
function Bar({nome,v,c}) { return <div style={{margin:'14px 0'}}><div style={s.barTop}><b>{nome}</b><span>{v.toFixed(1)}</span></div><div style={s.track}><div style={{...s.fill,width:`${Math.max(0,Math.min(100,v))}%`,background:c}}/></div></div> }

const s = {
  page:{minHeight:'100vh',background:'#f1f5f9',padding:24,fontFamily:'Arial, sans-serif',color:'#0f172a'},
  header:{background:'linear-gradient(135deg,#0f172a,#115e59)',color:'white',borderRadius:24,padding:28,display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 15px 35px #0002'},
  h1:{margin:0,fontSize:34}, sub:{margin:'8px 0 0',color:'#cbd5e1'}, badge:{background:'#ffffff22',padding:'8px 14px',borderRadius:999,marginBottom:10},
  kpis:{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:16,margin:'22px 0'},
  kpi:{background:'white',borderRadius:20,padding:22,boxShadow:'0 8px 25px #0001'}, dot:{width:14,height:14,borderRadius:99}, kpiTitle:{marginTop:12,color:'#64748b'}, kpiVal:{fontSize:36,fontWeight:800,marginTop:6},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}, card:{background:'white',borderRadius:20,padding:22,boxShadow:'0 8px 25px #0001',marginBottom:18},
  barTop:{display:'flex',justifyContent:'space-between',fontSize:14}, track:{height:12,background:'#e2e8f0',borderRadius:99,overflow:'hidden',marginTop:6}, fill:{height:'100%',borderRadius:99},
  alert:{background:'#fee2e2',color:'#991b1b',padding:12,borderRadius:12,marginBottom:10}, ok:{background:'#dcfce7',color:'#166534',padding:14,borderRadius:12}, note:{fontSize:13,color:'#64748b'},
  filters:{display:'flex',gap:10,marginBottom:18}, input:{padding:12,border:'1px solid #cbd5e1',borderRadius:12,background:'white'}, search:{flex:1,padding:12,border:'1px solid #cbd5e1',borderRadius:12},
  table:{width:'100%',borderCollapse:'collapse',fontSize:14}, th:{background:'#0f172a',color:'white',padding:12,textAlign:'left'}, td:{borderBottom:'1px solid #e2e8f0',padding:12}, num:{width:80,padding:8,border:'1px solid #cbd5e1',borderRadius:10}, pill:{color:'white',padding:'6px 10px',borderRadius:999,fontWeight:700,fontSize:12}
};
