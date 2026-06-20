// ═══ DATA ═══
const GA=13.5;
const SW_HIST=[8.2,11.5,6.8,14.1,9.3,7.6,0];
const DN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CC={transport:'#00D4FF',food:'#D4A017',home:'#7C3AED',shopping:'#FF0080'};
const CL={transport:'Transport',food:'Food',home:'Home',shopping:'Shopping'};
const A={
  transport:[{id:'cp',ic:'🚗',nm:'Car (Petrol)',f:.21,u:'km'},{id:'ce',ic:'⚡',nm:'Car (Electric)',f:.05,u:'km'},{id:'bus',ic:'🚌',nm:'City Bus',f:.089,u:'km'},{id:'tr',ic:'🚆',nm:'Train',f:.041,u:'km'},{id:'mt',ic:'🚇',nm:'Metro',f:.028,u:'km'},{id:'fs',ic:'✈️',nm:'Flight (<3h)',f:.255,u:'km'},{id:'fl',ic:'🛫',nm:'Flight (>3h)',f:.195,u:'km'},{id:'bk',ic:'🚲',nm:'Bicycle/Walk',f:0,u:'km'},{id:'mo',ic:'🏍️',nm:'Motorbike',f:.114,u:'km'}],
  food:[{id:'bf',ic:'🥩',nm:'Beef',f:6.61,u:'servings'},{id:'lb',ic:'🍖',nm:'Lamb',f:5.84,u:'servings'},{id:'pk',ic:'🐖',nm:'Pork',f:1.89,u:'servings'},{id:'ck',ic:'🍗',nm:'Chicken',f:1.28,u:'servings'},{id:'fi',ic:'🐟',nm:'Fish',f:1.34,u:'servings'},{id:'eg',ic:'🥚',nm:'Eggs',f:.45,u:'servings'},{id:'dy',ic:'🧀',nm:'Dairy',f:.94,u:'servings'},{id:'vg',ic:'🥗',nm:'Vegan',f:.43,u:'servings'},{id:'lv',ic:'🥦',nm:'Local Veg',f:.15,u:'servings'},{id:'fd',ic:'📦',nm:'Food Delivery',f:.8,u:'orders'}],
  home:[{id:'el',ic:'💡',nm:'Electricity',f:.82,u:'kWh'},{id:'ga',ic:'🔥',nm:'Natural Gas',f:2.04,u:'m³'},{id:'lp',ic:'🍳',nm:'LPG Cooking',f:1.51,u:'hours'},{id:'ac',ic:'❄️',nm:'AC',f:.82,u:'hours'},{id:'sh',ic:'🚿',nm:'Hot Shower',f:.34,u:'showers'},{id:'wa',ic:'👕',nm:'Washing',f:.6,u:'loads'},{id:'la',ic:'💻',nm:'Laptop/PC',f:.036,u:'hours'}],
  shopping:[{id:'cl',ic:'👗',nm:'Clothing',f:15,u:'items'},{id:'sk',ic:'👟',nm:'Shoes',f:11.5,u:'pairs'},{id:'ed',ic:'📱',nm:'Electronics',f:70,u:'items'},{id:'ol',ic:'📦',nm:'Online Pkg',f:.5,u:'packages'},{id:'st',ic:'📺',nm:'Streaming',f:.036,u:'hours'},{id:'pb',ic:'🛍️',nm:'Plastic Bag',f:.014,u:'bags'}]
};
const TIPS=[
  {id:1,cat:'transport',ic:'🚲',t:'Cycle or Walk',imp:'Save 0.21 kg/km',d:'Replace car trips under 5km — zero emissions, better health.',df:'easy'},
  {id:2,cat:'food',ic:'🌱',t:'Plant-Based Day',imp:'Save up to 6 kg/wk',d:'One vegan swap per week saves 6+ kg CO₂.',df:'easy'},
  {id:3,cat:'transport',ic:'🚆',t:'Train Over Flight',imp:'Save up to 80%',d:'500km train: ~20kg vs 127kg by plane.',df:'medium'},
  {id:4,cat:'home',ic:'☀️',t:'Renewable Energy',imp:'Save 3-4 kg/kWh',d:'Ask your provider for a green energy plan.',df:'hard'},
  {id:5,cat:'home',ic:'❄️',t:'Raise AC by 2°C',imp:'Save ~10% energy',d:'24°C instead of 22°C — significant reduction.',df:'easy'},
  {id:6,cat:'shopping',ic:'🛒',t:'Buy Secondhand',imp:'Save 15 kg/item',d:'Thrifting saves massive emissions vs fast fashion.',df:'easy'},
  {id:7,cat:'food',ic:'🍃',t:'Compost Waste',imp:'Save ~0.3 kg/wk',d:'Landfill food waste produces methane.',df:'easy'},
  {id:8,cat:'home',ic:'🚿',t:'Shorter Showers',imp:'Save 0.34 kg each',d:'5 min instead of 10 halves hot water energy.',df:'easy'},
  {id:9,cat:'shopping',ic:'📦',t:'Bundle Orders',imp:'Save 0.5 kg/delivery',d:'Combine items in one order, not daily.',df:'easy'},
  {id:10,cat:'food',ic:'🥩',t:'Reduce Red Meat',imp:'Save 40 kg/mo',d:'Beef and lamb are highest-emission foods.',df:'medium'},
  {id:11,cat:'home',ic:'💡',t:'Switch to LED',imp:'Save 0.04 kg/hr',d:'LEDs use 75% less energy than incandescent.',df:'easy'},
  {id:12,cat:'food',ic:'🌳',t:'Plant a Tree',imp:'Offset 21 kg/yr',d:'One mature tree absorbs ~21 kg CO₂ annually.',df:'medium'}
];
const BDG=[
  {id:'first',ic:'🌱',nm:'First Log',ck:s=>s.logs>0},
  {id:'five',ic:'⚡',nm:'5 Green Acts',ck:s=>s.zero>=5},
  {id:'zday',ic:'🚴',nm:'Zero Day',ck:s=>s.logs>0&&s.tot===0},
  {id:'plant',ic:'🥦',nm:'Plant-Based',ck:s=>s.vegan>=1},
  {id:'week',ic:'🌳',nm:'Week Under',ck:s=>s.wAvg>0&&s.wAvg<GA},
  {id:'champ',ic:'🏆',nm:'Champion',ck:s=>s.tot<5&&s.logs>0}
];
const TICKER_FACTS=[
  '🌍 Global CO₂ concentration: 422 ppm',
  '🌡️ Earth is 1.2°C warmer than pre-industrial levels',
  '🌱 One mature tree absorbs ~21 kg CO₂ per year',
  '✈️ One transatlantic flight = 1,600 kg CO₂ per person',
  '🥩 Beef produces 20x more CO₂ than lentils per gram of protein',
  '☀️ Solar panels pay back carbon cost in 1–4 years',
  '🚗 Average petrol car emits ~4.6 tonnes CO₂ per year',
  '🌊 Sea levels rising 3.6mm per year due to climate change',
  '📱 Producing one smartphone emits ~70 kg CO₂'
];

// ═══ STATE ═══
let st=loadSt();
function loadSt(){const d={date:new Date().toDateString(),logs:[],badges:{},tips:{}};try{const s=localStorage.getItem('cw5');if(s){const p=JSON.parse(s);if(p.date!==new Date().toDateString()){p.logs=[];p.date=new Date().toDateString()}return p}}catch(e){}return d}
function save(){localStorage.setItem('cw5',JSON.stringify(st))}
function tot(){return st.logs.reduce((a,l)=>a+l.co2,0)}
function wd(){const d=[...SW_HIST];d[6]=tot();return d}

// ═══ UTILS ═══
function countUp(el,to,dur=1200,dec=2){const from=parseFloat(el.dataset.cv||0);el.dataset.cv=to;const t0=performance.now();const ease=x=>1-Math.pow(1-x,4);(function tick(n){const p=Math.min((n-t0)/dur,1);const v=from+(to-from)*ease(p);el.textContent=dec===0?Math.round(v):v.toFixed(dec);if(p<1)requestAnimationFrame(tick)})(t0)}
function toast(msg,type='t-i'){const box=document.getElementById('toastBox');if(box.children.length>=3)box.firstChild.remove();const d=document.createElement('div');d.className='toast '+type;const ic=type==='t-s'?'✓':type==='t-w'?'⚠':'ℹ';d.innerHTML=`<span style="font-size:15px">${ic}</span><span>${msg}</span>`;box.appendChild(d);requestAnimationFrame(()=>d.classList.add('vis'));setTimeout(()=>{d.classList.remove('vis');setTimeout(()=>d.remove(),400)},3000)}
function updSlider(container,sliderId){const act=container.querySelector('.active');const sl=document.getElementById(sliderId);if(!act||!sl)return;sl.style.left=act.offsetLeft+'px';sl.style.width=act.offsetWidth+'px'}
let _dt;function debounce(fn,ms){return(...a)=>{clearTimeout(_dt);_dt=setTimeout(()=>fn(...a),ms)}}
function ripple(e,btn){const r=btn.getBoundingClientRect();const el=document.createElement('span');el.className='ripple-el';el.style.left=(e.clientX-r.left)+'px';el.style.top=(e.clientY-r.top)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),600)}
function switchTab(name){const btn=document.querySelector(`.nav-btn[data-tab="${name}"]`);if(btn)btn.click()}
function getVal(color){return`0 0 30px ${color},0 0 60px ${color.replace('1)','0.5)')}`}
function getGradeColor(g){if(g==='A+')return'var(--green-signal)';if(g==='A')return'var(--cyan)';if(g[0]==='B')return'#86C232';if(g[0]==='C')return'var(--amber)';return'var(--magenta)'}

// ═══ STAR FIELD ═══
const cvs=document.getElementById('starCanvas'),ctx2=cvs.getContext('2d');
let stars=[];let mx2=-999,my2=-999;
function mkStar(layer){const r=layer===0?Math.random()*.5+.5:layer===1?Math.random()*.8+1:Math.random()+1.5;const col=layer===0?'15,23,42':layer===1?'71,85,105':'0,151,184';const op=layer===0?Math.random()*.05+.02:layer===1?Math.random()*.1+.05:Math.random()*.15+.1;const sp=layer===0?Math.random()*.05+.05:layer===1?Math.random()*.1+.1:Math.random()*.15+.2;return{x:Math.random()*cvs.width,y:Math.random()*cvs.height,r,col,op,sp,phase:Math.random()*Math.PI*2,twinkle:Math.random()<.3,twinkleSpeed:Math.random()*.001+.0005,layer}}
function initStars(){cvs.width=innerWidth;cvs.height=innerHeight;stars=[];for(let i=0;i<100;i++)stars.push(mkStar(0));for(let i=0;i<50;i++)stars.push(mkStar(1));for(let i=0;i<20;i++)stars.push(mkStar(2))}
let isCanvasVisible = true;
if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
        isCanvasVisible = entries[0].isIntersecting;
    });
    observer.observe(cvs);
}

/**
 * Renders the next frame of the starfield animation.
 * Optimized to pause when the canvas is out of view.
 */
function drawStars() {
    requestAnimationFrame(drawStars);
    if (!isCanvasVisible) return;

    ctx2.clearRect(0, 0, cvs.width, cvs.height);
    const t = performance.now();
    const bright = stars.filter(s => s.layer === 2);
    stars.forEach(s => {
        s.y -= s.sp;
        if (s.y < -5) {
            s.y = cvs.height + 5;
            s.x = Math.random() * cvs.width;
        }
        // Mouse pull for bright stars
        if (s.layer === 2) {
            const dx = s.x - mx2, dy = s.y - my2, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const f = (120 - dist) / 120 * .3;
                s.x -= dx / dist * f;
                s.y -= dy / dist * f;
            }
        }
        const op = s.twinkle ? s.op * (0.7 + .3 * Math.sin(t * s.twinkleSpeed + s.phase)) : s.op;
        ctx2.beginPath();
        ctx2.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(${s.col},${op})`;
        ctx2.fill();
        if (s.layer === 2) {
            ctx2.strokeStyle = `rgba(${s.col},0.3)`;
            ctx2.lineWidth = .5;
            for (let a = 0; a < 4; a++) {
                const ang = a * Math.PI / 2;
                ctx2.beginPath();
                ctx2.moveTo(s.x, s.y);
                ctx2.lineTo(s.x + Math.cos(ang) * 2, s.y + Math.sin(ang) * 2);
                ctx2.stroke();
            }
        }
    });
}
document.addEventListener('mousemove',e=>{mx2=e.clientX;my2=e.clientY});
requestAnimationFrame(drawStars);

// Cursor glow
const glowDiv=document.getElementById('cursorGlow');
let cgx=-999,cgy=-999;
document.addEventListener('mousemove',e=>{cgx=e.clientX;cgy=e.clientY});
(function glowLoop(){glowDiv.style.background=`radial-gradient(450px circle at ${cgx}px ${cgy}px,rgba(0,151,184,0.04),transparent 70%)`;requestAnimationFrame(glowLoop)})();

// Clock
setInterval(()=>{document.getElementById('navClock').textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})},1000);

// Ticker
(function(){const ti=document.getElementById('tickerInner');const txt=TICKER_FACTS.join('<span class="ticker-sep">·</span>');ti.innerHTML=`<span>${txt}</span><span class="ticker-sep">·</span><span>${txt}</span><span class="ticker-sep">·</span>`})();

// ═══ INTRO ═══
function endIntro(){const i=document.getElementById('intro');const p=document.getElementById('introPlant');const t=document.getElementById('introText');[p,t].forEach(e=>e.classList.add('bye'));i.classList.add('exit');setTimeout(()=>{i.classList.add('hidden');document.getElementById('app').classList.add('visible');renderDash()},650);sessionStorage.setItem('cw_intro','1')}
document.getElementById('skipBtn').addEventListener('click',endIntro);
if(sessionStorage.getItem('cw_intro')){document.getElementById('intro').classList.add('hidden');document.getElementById('app').classList.add('visible');window.addEventListener('load',()=>setTimeout(renderDash,200))}
else{setTimeout(endIntro,4400)}

// ═══ NAV ═══
const navPills=document.getElementById('navPills');
const navInner=navPills.querySelector('.bottom-nav-inner');
navPills.querySelectorAll('.nav-btn').forEach(btn=>{btn.addEventListener('click',()=>{
  navPills.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');updSlider(navInner,'navSlider');
  document.querySelectorAll('.tab').forEach(t=>{t.classList.remove('active');if(t.id==='tab-'+btn.dataset.tab){t.classList.add('active');const sg=t.querySelector('.stagger');if(sg)sg.querySelectorAll(':scope>*').forEach((c,i)=>{c.style.animation='none';c.offsetHeight;c.style.animation=`stUp .5s var(--ease-out) ${.05+i*.06}s both`})}});
  if(btn.dataset.tab==='dashboard'){renderDash()}
  if(btn.dataset.tab==='calculator'){setTimeout(()=>updSlider(document.getElementById('cPills'),'cSlider'),10)}
  if(btn.dataset.tab==='tips'){setTimeout(()=>updSlider(document.getElementById('tPills'),'tSlider'),10)}
  if(btn.dataset.tab==='insights')chkAIEmpty();
  if(btn.dataset.tab==='learn')trigScroll();
})});
document.getElementById('navLogo').addEventListener('click',()=>document.querySelector('[data-tab="dashboard"]').click());

// ═══ GAUGE ═══
function buildGaugeTicks(){const g=document.getElementById('gTicks');g.innerHTML='';for(let i=0;i<=24;i++){const ang=(135+i*11.25)*Math.PI/180;const major=i%2===0;const r1=102,r2=major?115:108;g.innerHTML+=`<line x1="${120+r1*Math.cos(ang)}" y1="${120+r1*Math.sin(ang)}" x2="${120+r2*Math.cos(ang)}" y2="${120+r2*Math.sin(ang)}" stroke="#00D4FF" stroke-width="${major?1.5:.8}" opacity="${major?.7:.3}"/>`}}
function updGauge(v){const ratio=Math.min(v/27,1);document.getElementById('gArc').setAttribute('stroke-dasharray',`${452*ratio} 603`);document.getElementById('gNeedle').style.transform=`rotate(${135+ratio*270}deg)`;countUp(document.getElementById('gVal'),v,1500,2);
const d=v-GA;const vs=document.getElementById('gVs');const gg=document.getElementById('gaugeGlow');
if(v<=6){vs.style.color='var(--green-signal)';gg.style.background='radial-gradient(circle,rgba(0,255,136,0.12),transparent 70%)'}
else if(v<=GA){vs.style.color='var(--cyan)';gg.style.background='radial-gradient(circle,rgba(0,212,255,0.12),transparent 70%)'}
else if(v<=20){vs.style.color='var(--amber)';gg.style.background='radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)'}
else{vs.style.color='var(--magenta)';gg.style.background='radial-gradient(circle,rgba(255,0,128,0.12),transparent 70%)'}
if(d<=0){vs.textContent=`${Math.abs(d).toFixed(1)} kg below avg ✓`}else{vs.textContent=`${d.toFixed(1)} kg above avg ↑`}}

// ═══ DASHBOARD ═══
let donut;
function reAnimateDash(){const w=document.getElementById('tab-dashboard');w.classList.remove('dash-anim');void w.offsetHeight;w.classList.add('dash-anim')}
function renderDash(){
  const t=tot();const w=wd();const avg=w.reduce((a,b)=>a+b,0)/7;
  const h=new Date().getHours();
  document.getElementById('greeting').innerHTML=`<em>Good</em> ${h<12?'morning':h<18?'afternoon':'evening'}.`;
  document.getElementById('dateStr').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  updGauge(t);
  // Score
  const score=Math.round(Math.max(0,Math.min(100,100-((t/27)*100))));
  const sEl=document.getElementById('sScore');countUp(sEl,score,1000,0);
  const scol=score>=70?'var(--green-signal)':score>=40?'var(--cyan)':score>=20?'var(--amber)':'var(--magenta)';
  sEl.style.color=scol;
  const ring=document.getElementById('scoreRing');ring.style.stroke=scol;
  const circum=276;setTimeout(()=>ring.style.strokeDashoffset=circum-((score/100)*circum),200);
  // Stat 1 DAILY CO2
  const sD=document.getElementById('sDaily');countUp(sD,t);
  const col=t<=6?'var(--green-signal)':t<=GA?'var(--cyan)':t<=20?'var(--amber)':'var(--magenta)';
  sD.style.color=col;sD.style.textShadow=`0 0 30px ${col}`;
  const bar=document.getElementById('sDailyBar');bar.style.background=col;setTimeout(()=>bar.style.width=Math.min(t/27*100,100)+'%',100);
  // Stat 2 VS AVG
  const dif=t-GA;const vsEl=document.getElementById('sVs');
  if(dif<=0){vsEl.style.color='var(--green-signal)';vsEl.style.textShadow='0 0 20px var(--green-signal)';vsEl.dataset.cv=0;countUp(vsEl,Math.abs(dif));vsEl.textContent='−'+Math.abs(dif).toFixed(2)}
  else{vsEl.style.color='var(--magenta)';vsEl.style.textShadow='0 0 20px var(--magenta)';countUp(vsEl,dif);vsEl.textContent='+'+dif.toFixed(2)}
  // Stat 3 AVG
  countUp(document.getElementById('sAvg'),avg);
  const pts=w.map((v,i)=>`${(i/6)*120},${40-(v/Math.max(...w,1)*36)}`).join(' ');document.getElementById('spark').setAttribute('points',pts);
  const lastPt=pts.split(' ').slice(-1)[0].split(',');document.getElementById('sparkEnd').setAttribute('cx',lastPt[0]);document.getElementById('sparkEnd').setAttribute('cy',lastPt[1]);
  // Stat 4 ZERO
  const zc=st.logs.filter(l=>l.co2===0).length;countUp(document.getElementById('sZero'),zc,800,0);
  const lb=document.getElementById('leavesBox');lb.innerHTML='';for(let i=0;i<Math.min(zc,6);i++){const s=document.createElement('span');s.textContent='🌿';s.style.animationDelay=i*.08+'s';lb.appendChild(s)}
  // VS bars
  const yest=SW_HIST[5];const maxV=Math.max(t,yest,GA,.1)*1.2;
  setTimeout(()=>{document.getElementById('vsFillToday').style.width=(t/maxV*100)+'%';document.getElementById('vsFillYest').style.width=(yest/maxV*100)+'%'},200);
  document.getElementById('vsTodayNum').textContent=t.toFixed(2)+' kg';document.getElementById('vsYestNum').textContent=yest.toFixed(2)+' kg';
  const vd=document.getElementById('vsDelta');const diff2=t-yest;vd.style.display='';
  if(diff2>0){vd.className='vs-delta up';vd.textContent=`↑ ${diff2.toFixed(1)} kg more`}else{vd.className='vs-delta dn';vd.textContent=`↓ ${Math.abs(diff2).toFixed(1)} kg less`}
  // Insight
  const im=document.getElementById('insightMsg');
  if(!st.logs.length)im.textContent='No activities logged yet — you\'re starting fresh today!';
  else{const cats={};st.logs.forEach(l=>cats[l.cat]=(cats[l.cat]||0)+l.co2);const top=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];if(top)im.textContent=`Your ${top[0]} choices account for ${Math.round(top[1]/Math.max(t,.01)*100)}% of today\'s footprint — ${top[1]>5?'consider alternatives':'great choices!'}`}
  renderBars(w);renderDonut();renderBadges();
  // Pace
  const pace=t*365/1000;const pb=document.getElementById('paceBar');pb.style.width=Math.min(pace/14.9*100,100)+'%';document.getElementById('paceVal').textContent=pace.toFixed(1)+'t';
  pb.style.background=pace>4.8?'var(--magenta)':pace>1.9?'var(--amber)':'var(--green-signal)';if(pace<=1.9){document.getElementById('paceVal').style.color='#000'}
  // Trend
  const tb=document.getElementById('trendBadge');if(w[6]<=w[5]){tb.className='trend-pill tp-good';tb.textContent='↘ Improving'}else{tb.className='trend-pill tp-bad';tb.textContent='↗ Trending up'}
  // Scan line
  const sl=document.getElementById('scanLine');sl.classList.remove('run');void sl.offsetHeight;sl.classList.add('run');
  reAnimateDash();
}
function renderBars(w){const area=document.getElementById('barsArea');area.innerHTML='';const maxV=Math.max(25,...w);
// Y labels
const yl=document.getElementById('yLabels');yl.innerHTML='';[25,20,15,10,5,0].forEach(v=>{const el=document.createElement('div');el.className='y-lbl mono';el.textContent=v;yl.appendChild(el)});
// Grid lines
const gr=document.getElementById('barGrid');gr.innerHTML='';[5,10,15,20,25].forEach(v=>{const el=document.createElement('div');el.className='bar-grid-line';el.style.bottom=(v/maxV*100)+'%';gr.appendChild(el)});
// Avg line
const al=document.getElementById('avgLine');al.style.bottom=(GA/maxV*100)+'%';al.classList.remove('show');
w.forEach((v,i)=>{const pct=Math.max(v/maxV*100,.5);const hi=v>GA;
const grad=hi?'linear-gradient(0deg,#7B0035 0%,var(--magenta) 100%)':'linear-gradient(0deg,var(--cyan-deep) 0%,var(--cyan) 70%,var(--cyan-bright) 100%)';
const capC=hi?'var(--magenta)':'var(--cyan-bright)';
const col=document.createElement('div');col.className='bar-col';
col.innerHTML=`<div class="bar-fill" style="height:0%;background:${grad};transition-delay:${i*70}ms"><div class="bar-cap" style="background:${capC}"></div></div><span class="bar-lbl mono">${DN[i]}</span><div class="bar-tip"><div class="bt-day">${DN[i]}</div><div class="bt-kg">${v.toFixed(1)} kg CO₂</div><div class="bt-kg" style="color:${hi?'var(--magenta)':'var(--green-signal)'}">${v>GA?'+':''}${(v-GA).toFixed(1)} vs avg</div></div>`;
area.appendChild(col);setTimeout(()=>col.querySelector('.bar-fill').style.height=pct+'%',50)});
setTimeout(()=>al.classList.add('show'),w.length*70+400)}
function renderDonut(){const cats={transport:0,food:0,home:0,shopping:0};st.logs.forEach(l=>cats[l.cat]=(cats[l.cat]||0)+l.co2);const data=Object.values(cats);const has=data.some(v=>v>0);const cols=Object.values(CC);
if(donut)donut.destroy();const ctx=document.getElementById('donutCanvas').getContext('2d');
donut=new Chart(ctx,{type:'doughnut',data:{labels:Object.values(CL),datasets:[{data:has?data:[1],backgroundColor:has?cols:['rgba(15,23,42,0.03)'],borderWidth:3,borderColor:'#FFFFFF',hoverOffset:10}]},options:{cutout:'75%',responsive:true,maintainAspectRatio:false,animation:{duration:1000,easing:'easeOutQuart'},plugins:{legend:{display:false},tooltip:{enabled:has,backgroundColor:'rgba(255,255,255,0.96)',titleColor:'#0F172A',bodyColor:'#475569',borderColor:'rgba(0,151,184,0.3)',borderWidth:1,padding:12,titleFont:{family:'Space Grotesk'},bodyFont:{family:'JetBrains Mono'}}}}});
document.getElementById('dTotal').textContent=tot().toFixed(2);
document.getElementById('dLeg').innerHTML=Object.keys(cats).map((k,i)=>`<div class="leg-item"><div class="leg-dot" style="background:${has?cols[i]:'rgba(15,23,42,0.05)'}"></div>${CL[k]}: <span>${cats[k].toFixed(2)}kg</span></div>`).join('')}
function renderBadges(){const br=document.getElementById('badgesRow');const s={logs:st.logs.length,tot:tot(),zero:st.logs.filter(l=>l.co2===0).length,vegan:st.logs.filter(l=>['vg','lv'].includes(l.aid)).length,wAvg:wd().reduce((a,b)=>a+b,0)/7};
const prev={...st.badges};br.innerHTML='';let uc=0;
BDG.forEach(b=>{const meets=b.ck(s);if(meets&&!st.badges[b.id]){st.badges[b.id]=true;save();toast(`⚡ Badge Unlocked: ${b.nm}!`)}
const ul=st.badges[b.id];if(ul)uc++;const jn=ul&&!prev[b.id];
const d=document.createElement('div');d.className=`card badge ${ul?'unlocked':'locked'} ${jn?'just-u':''}`;
d.innerHTML=`<span class="badge-icon" style="position:relative">${b.ic}</span><span class="badge-name">${b.nm}</span>`;
if(jn){const sn=document.createElement('div');sn.className='sonar';d.querySelector('.badge-icon').appendChild(sn)}
br.appendChild(d)});document.getElementById('bCnt').textContent=`${uc}/6 UNLOCKED`}

// ═══ CALCULATOR ═══
let selCat='transport',selAct=null;
function renderGrid(){const g=document.getElementById('actGrid');g.innerHTML=A[selCat].map(a=>`<div class="act-card${selAct&&selAct.id===a.id?' sel':''}" data-id="${a.id}"><span class="ac-ic">${a.ic}</span><span class="ac-nm">${a.nm}</span><span class="ac-fc">${a.f===0?'⚡ Zero':a.f+' kg/'+a.u.replace(/s$/,'')}</span></div>`).join('');
g.querySelectorAll('.act-card').forEach(c=>{c.addEventListener('click',()=>{g.querySelectorAll('.act-card').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');selAct=A[selCat].find(x=>x.id===c.dataset.id);document.getElementById('qtyLbl').textContent=`Quantity (${selAct.u})`;document.getElementById('qtyUnit').textContent=selAct.u;document.getElementById('qtyInp').focus();updPrev()})})}
document.getElementById('cPills').querySelectorAll('.pill-btn').forEach(b=>{b.addEventListener('click',()=>{document.getElementById('cPills').querySelectorAll('.pill-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');updSlider(document.getElementById('cPills'),'cSlider');selCat=b.dataset.cat;selAct=null;document.getElementById('qtyLbl').textContent='Select an activity';document.getElementById('qtyUnit').textContent='';document.getElementById('qtyInp').value='';document.getElementById('livePrev').innerHTML='&nbsp;';renderGrid()})});
document.getElementById('qtyInp').addEventListener('input',updPrev);
function updPrev(){const v=parseFloat(document.getElementById('qtyInp').value)||0;const p=document.getElementById('livePrev');if(selAct&&v>0){const co2=selAct.f*v;p.classList.remove('pulse');void p.offsetHeight;p.classList.add('pulse');if(co2===0){p.textContent='= ⚡ Zero Emission';p.style.color='var(--green-signal)'}else{p.textContent=`= ${co2.toFixed(2)} kg CO₂`;p.style.color=co2<=5?'var(--green-signal)':co2<=GA?'var(--cyan)':co2<=20?'var(--amber)':'var(--magenta)'}}else p.innerHTML='&nbsp;'}
document.getElementById('btnAdd').addEventListener('click',function(e){if(!selAct)return toast('Select an activity first','t-w');const qty=parseFloat(document.getElementById('qtyInp').value);if(!qty||qty<=0)return toast('Enter a valid quantity','t-w');ripple(e,this);const co2=parseFloat((selAct.f*qty).toFixed(4));st.logs.push({id:Date.now(),aid:selAct.id,cat:selCat,ic:selAct.ic,nm:selAct.nm,qty,u:selAct.u,co2});save();document.getElementById('qtyInp').value='';document.getElementById('livePrev').innerHTML='&nbsp;';renderLog();toast(`Logged: ${selAct.nm} (${co2.toFixed(2)} kg)`)});
document.getElementById('btnClr').addEventListener('click',()=>{if(!st.logs.length)return;st.logs=[];save();renderLog();toast('Log cleared','t-i')});
function renderLog(){const list=document.getElementById('logList');
if(!st.logs.length){list.innerHTML=`<div class="empty-log"><span class="el-icon">📡</span><div class="el-title">Mission log is empty.</div><div class="el-sub" style="color:var(--text-muted);justify-content:center">Select an activity to begin <span class="el-arrow">→</span></div></div>`}
else{list.innerHTML=st.logs.slice().reverse().map(l=>`<div class="log-e${l.co2===0?' zero-e':''}" id="le-${l.id}"><span class="le-ic">${l.ic}</span><div class="le-info"><div class="le-nm">${l.nm}</div><div class="le-qty mono">${l.qty} ${l.u}</div></div><span class="le-co2${l.co2===0?' zero':''} mono">${l.co2===0?'⚡ 0.00':l.co2.toFixed(2)}</span><button class="le-rm" data-id="${l.id}">✕</button></div>`).join('');
list.querySelectorAll('.le-rm').forEach(b=>{b.addEventListener('click',()=>{const el=document.getElementById('le-'+b.dataset.id);el.classList.add('rm');setTimeout(()=>{st.logs=st.logs.filter(l=>l.id!==parseInt(b.dataset.id));save();renderLog();toast('Removed','t-i')},220)})})}
document.getElementById('logCnt').textContent=st.logs.length;
const t=tot();countUp(document.getElementById('ltNum'),t,400,2);
const d=t-GA;const cmp=document.getElementById('ltCmp');
const ltN=document.getElementById('ltNum');
if(d<=0){cmp.style.color='var(--green-signal)';cmp.textContent=`${Math.abs(d).toFixed(1)} kg below global average`;ltN.style.color='var(--cyan)';ltN.style.textShadow='0 0 30px rgba(0,212,255,0.4)'}
else{cmp.style.color='var(--magenta)';cmp.textContent=`${d.toFixed(1)} kg above global average`;ltN.style.color='var(--magenta)';ltN.style.textShadow='0 0 30px rgba(255,0,128,0.4)'}}

// ═══ AI ═══
function chkAIEmpty(){const em=document.getElementById('aiEmpty');const res=document.getElementById('aiRes');if(!st.logs.length&&!res.classList.contains('vis')){em.style.display='';document.getElementById('aiHero').style.display=''}else em.style.display='none'}
document.getElementById('btnAI').addEventListener('click',runAI);
document.getElementById('btnRegen').addEventListener('click',runAI);
async function runAI(){if(!st.logs.length)return toast('Log activities first!','t-w');
const hero=document.getElementById('aiHero');const load=document.getElementById('aiLoad');const res=document.getElementById('aiRes');const fill=document.getElementById('aiPbar');const txt=document.getElementById('aiLoadTxt');
hero.style.display='none';res.classList.remove('vis');res.style.display='none';load.classList.add('active');fill.style.transition='width 3s ease-out';fill.style.width='0%';requestAnimationFrame(()=>fill.style.width='85%');
const msgs=['Parsing mission log...','Calculating planetary impact...','Formulating reduction protocol...'];let mi=0;
const ti=setInterval(()=>{mi=(mi+1)%msgs.length;txt.style.opacity='0';setTimeout(()=>{txt.textContent=msgs[mi];txt.style.opacity='1'},300)},1500);
const t=tot();
try{const r2=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({activities:st.logs,totalKg:t})});
if(!r2.ok){const err=await r2.json().catch(()=>({error:'Server error '+r2.status}));throw new Error(err.error||'Server error '+r2.status)}const j=await r2.json();
fill.style.transition='width .4s';fill.style.width='100%';
setTimeout(()=>{clearInterval(ti);load.classList.remove('active');document.getElementById('aiEmpty').style.display='none';
document.getElementById('aiPos').textContent=j.positive;document.getElementById('aiImp').textContent=j.impact;
document.getElementById('aiActs').innerHTML=(j.actions||[]).map((a,i)=>`<div class="act-mini"><span class="amn">0${i+1}</span><span style="font:400 13px 'Inter',sans-serif;color:var(--text-secondary)">${a}</span></div>`).join('');
const ge=document.getElementById('aiGrade');ge.textContent=j.score;ge.className='giant-grade orb grade-stamp';const gc=getGradeColor(j.score);ge.style.color=gc;ge.style.textShadow=`0 0 40px ${gc}`;
document.getElementById('aiSum').textContent=j.summary||`${t.toFixed(1)} kg vs ${GA} kg average`;
res.style.display='grid';setTimeout(()=>{res.classList.add('vis');res.querySelectorAll('.ai-r-card').forEach((c,i)=>{c.style.animation='none';void c.offsetHeight;c.style.animation=`cardReveal .55s var(--ease-spring) ${i*.12}s both`})},50)},600);
}catch(e){clearInterval(ti);load.classList.remove('active');hero.style.display='';toast('Analysis failed: '+e.message,'t-w')}}

// ═══ TIPS ═══
let tipFilter='all';
function renderTips(){const g=document.getElementById('tipsGrid');const f=tipFilter==='all'?TIPS:TIPS.filter(t=>t.cat===tipFilter);
g.innerHTML=f.map(t=>{const done=st.tips[t.id];const dc=t.df==='easy'?'dp-easy':t.df==='medium'?'dp-med':'dp-hard';const dl=t.df==='hard'?'Lifestyle':t.df[0].toUpperCase()+t.df.slice(1);
return`<div class="card tip-card${done?' done':''}" id="tip-${t.id}"><div class="tip-top"><span class="tip-emoji">${t.ic}</span><span class="diff-pill ${dc}">${dl}</span></div><h3>${t.t}</h3><p class="desc">${t.d}</p><div class="tip-bottom"><span class="tip-impact mono">⚡ ${t.imp}</span><button class="btn-mark" onclick="markTip(${t.id})"><svg class="chk-svg" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg><span>${done?'Adopted':'Mark Done'}</span></button></div></div>`}).join('');updRing()}
window.markTip=function(id){if(st.tips[id])return;st.tips[id]=true;save();const c=document.getElementById('tip-'+id);c.classList.add('done');c.querySelector('.btn-mark span').textContent='Adopted';const em=c.querySelector('.tip-emoji');em.style.transform='translateY(-10px) scale(1.15)';setTimeout(()=>em.style.transform='',400);toast('⚡ Protocol adopted!','t-s');updRing()};
function updRing(){const cnt=Object.values(st.tips).filter(Boolean).length;document.getElementById('ringLbl').textContent=`${cnt}/12`;document.getElementById('ringFill').style.strokeDashoffset=100.53-((cnt/12)*100.53)}
document.getElementById('tPills').querySelectorAll('.pill-btn').forEach(b=>{b.addEventListener('click',()=>{document.getElementById('tPills').querySelectorAll('.pill-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');updSlider(document.getElementById('tPills'),'tSlider');tipFilter=b.dataset.filter;renderTips()})});

// ═══ LEARN ═══
const convUpd=debounce(v=>{countUp(document.getElementById('eqTree'),v/21.77,600,2);countUp(document.getElementById('eqCar'),v*6.24,600,0);countUp(document.getElementById('eqLed'),v*277.7,600,0);countUp(document.getElementById('eqPhone'),v*333.3,600,0);countUp(document.getElementById('eqAC'),v/.82,600,1)},300);
document.getElementById('convInp').addEventListener('input',e=>convUpd(parseFloat(e.target.value)||0));
const sObs=new IntersectionObserver(ents=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');e.target.querySelectorAll('[data-cu]').forEach(el=>{if(!el.dataset.done){el.dataset.done='1';countUp(el,parseFloat(el.dataset.cu),1200,1)}});e.target.querySelectorAll('.g-fill[data-w]').forEach(el=>{setTimeout(()=>el.style.width=el.dataset.w+'%',200)})}})},{threshold:.15});
function trigScroll(){document.querySelectorAll('.scroll-anim').forEach(el=>sObs.observe(el))}

// ═══ SHARE MODAL ═══
document.getElementById('btnShare').addEventListener('click',()=>{
  const t=tot();const score=Math.round(Math.max(0,Math.min(100,100-((t/27)*100))));const dif=t-GA;const cnt=Object.values(st.tips).filter(Boolean).length;
  document.getElementById('modalDate').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('mToday').textContent=t.toFixed(2)+' kg CO₂';
  const grd=t<=6?'A+':t<=10?'A':t<=GA?'B':t<=20?'C':'D';document.getElementById('mGrade').textContent=grd;document.getElementById('mGrade').style.color=getGradeColor(grd);
  document.getElementById('mScore').textContent=score+'/100';document.getElementById('mScore').style.color=score>=70?'var(--green-signal)':score>=40?'var(--cyan)':'var(--magenta)';
  document.getElementById('mVsAvg').textContent=(dif<=0?'−':'+')+(Math.abs(dif).toFixed(1))+' kg';document.getElementById('mVsAvg').style.color=dif<=0?'var(--green-signal)':'var(--magenta)';
  document.getElementById('mAdopt').textContent=cnt+'/12';
  const m=document.getElementById('shareModal');m.classList.remove('closed');requestAnimationFrame(()=>m.classList.add('open'))});
document.getElementById('btnModalClose').addEventListener('click',closeModal);
document.getElementById('shareModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});
function closeModal(){const m=document.getElementById('shareModal');m.classList.remove('open');setTimeout(()=>m.classList.add('closed'),300)}
document.getElementById('btnCopy').addEventListener('click',()=>{const t=tot();const score=Math.round(Math.max(0,Math.min(100,100-((t/27)*100))));const grd=t<=6?'A+':t<=10?'A':t<=GA?'B':t<=20?'C':'D';const cnt=Object.values(st.tips).filter(Boolean).length;const d=t-GA;const txt=`🌍 CarbonWise Report — ${new Date().toLocaleDateString()}\n\nToday: ${t.toFixed(2)} kg CO₂\nGrade: ${grd}\nImpact Score: ${score}/100\nvs Global Avg: ${d<=0?'−':'+'}${Math.abs(d).toFixed(1)} kg\nActions Adopted: ${cnt}/12\n\nPowered by CarbonWise`;navigator.clipboard.writeText(txt).then(()=>toast('Copied to clipboard!','t-s')).catch(()=>toast('Copy failed','t-w'))});

// ═══ INIT ═══
window.addEventListener('load',()=>{
  initStars();drawStars();
  window.addEventListener('resize',()=>{cvs.width=innerWidth;cvs.height=innerHeight});
  buildGaugeTicks();
  setTimeout(()=>{updSlider(navInner,'navSlider');updSlider(document.getElementById('cPills'),'cSlider');updSlider(document.getElementById('tPills'),'tSlider')},200);
  renderGrid();renderLog();renderTips();convUpd(13.5);trigScroll();chkAIEmpty();
});
window.addEventListener('resize',()=>{updSlider(navInner,'navSlider');updSlider(document.getElementById('cPills'),'cSlider');updSlider(document.getElementById('tPills'),'tSlider')});