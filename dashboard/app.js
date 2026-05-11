
// ── Clock ──────────────────────────────────────────────
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString();}
setInterval(tick,1000);tick();

// ── Tab navigation ─────────────────────────────────────
document.querySelectorAll('.nav-tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.nav-tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(t.dataset.tab).classList.add('active');
  });
});

// ── Animated counters ──────────────────────────────────
function count(id,end){
  let n=0,step=Math.ceil(end/50);
  const i=setInterval(()=>{n=Math.min(n+step,end);document.getElementById(id).textContent=n.toLocaleString();if(n>=end)clearInterval(i);},30);
}
setTimeout(()=>{count('s1',23);count('s2',847);count('s3',42381);count('s4',4);},400);

// ── Chart.js charts ────────────────────────────────────
const hours=['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h'];
const ld=[12,8,15,45,89,23,17,102,78,34,19,56];
const lc=new Chart(document.getElementById('loginChart'),{
  type:'bar',
  data:{labels:hours,datasets:[{label:'Failed Logins',data:ld,
    backgroundColor:ld.map(v=>v>50?'rgba(255,71,87,.7)':'rgba(0,144,255,.5)'),
    borderColor:ld.map(v=>v>50?'#ff4757':'#0090ff'),borderWidth:1,borderRadius:4}]},
  options:{responsive:true,plugins:{legend:{display:false}},
    scales:{x:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#64748b',font:{size:10}}},
            y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748b',font:{size:10}}}}}
});
setInterval(()=>{ld.shift();const v=Math.floor(Math.random()*90)+5;ld.push(v);
  lc.data.datasets[0].backgroundColor=ld.map(v=>v>50?'rgba(255,71,87,.7)':'rgba(0,144,255,.5)');
  lc.data.datasets[0].borderColor=ld.map(v=>v>50?'#ff4757':'#0090ff');lc.update('none');},4000);

new Chart(document.getElementById('pieChart'),{type:'doughnut',
  data:{labels:['Critical','High','Medium','Low'],
    datasets:[{data:[23,67,158,312],backgroundColor:['#ff4757','#ffa502','#00d4ff','#2ed573'],borderWidth:0,hoverOffset:6}]},
  options:{responsive:true,cutout:'65%',plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:11},padding:10}}}}
});

new Chart(document.getElementById('evtChart'),{type:'line',
  data:{labels:hours,datasets:[
    {label:'Windows',data:[120,98,145,210,380,180,140,420,310,190,130,260],borderColor:'#00d4ff',tension:.4,fill:false,pointRadius:2},
    {label:'Linux',  data:[80,60,95,130,220,100,90,280,200,120,85,160],borderColor:'#2ed573',tension:.4,fill:false,pointRadius:2},
    {label:'Firewall',data:[40,30,55,80,140,60,50,160,110,70,45,90],borderColor:'#ffa502',tension:.4,fill:false,pointRadius:2}
  ]},
  options:{responsive:true,plugins:{legend:{labels:{color:'#94a3b8',font:{size:11}}}},
    scales:{x:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#64748b',font:{size:10}}},
            y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748b',font:{size:10}}}}}
});

// ── Live alert feed ────────────────────────────────────
const ALERTS=[
  {l:'critical',m:'SSH Brute Force — 102 failed attempts from 185.220.101.42'},
  {l:'critical',m:'Win failed logins × 34 on WIN-SERVER01 (EventID 4625)'},
  {l:'warning', m:'Unusual root login at 03:17 UTC on linux-agent02'},
  {l:'info',    m:'File integrity change: /etc/passwd modified on linux-agent01'},
  {l:'warning', m:'Port scan from 194.165.16.78 detected on firewall'},
  {l:'critical',m:'Privilege escalation attempt: sudo abuse on linux-agent02'},
  {l:'info',    m:'New agent connected: WIN-DESKTOP02 (192.168.1.55)'},
  {l:'warning', m:'Firewall blocked 48 connections from 45.33.32.156'},
];
const NEW_ALERTS=[
  {l:'critical',m:'RDP brute force on WIN-SERVER01 — 67 attempts from 91.108.4.12'},
  {l:'warning', m:'Suspicious cron job added on linux-agent01'},
  {l:'info',    m:'Agent linux-agent02 reconnected after 2 min outage'},
  {l:'critical',m:'SQL injection attempt detected in firewall logs'},
];
let ai=0;
function renderAlerts(){
  const f=document.getElementById('alertFeed');
  f.innerHTML=ALERTS.slice(0,10).map(a=>`
    <div class="alert-item ${a.l}">
      <div class="alert-dot"></div>
      <div><div class="alert-msg">${a.m}</div>
      <div class="alert-time">${new Date().toLocaleTimeString()}</div></div>
    </div>`).join('');
}
renderAlerts();
setInterval(()=>{ALERTS.unshift({...NEW_ALERTS[ai%NEW_ALERTS.length]});if(ALERTS.length>12)ALERTS.pop();renderAlerts();ai++;},5000);

// ── Windows Log Feed ───────────────────────────────────
const WIN_LOGS=[
  {id:'4625',lvl:'WARN', msg:'Failed login: user administrator from 192.168.1.5'},
  {id:'4624',lvl:'INFO', msg:'Successful login: SYSTEM on WIN-SERVER01'},
  {id:'4648',lvl:'WARN', msg:'Explicit credential use: svchost.exe attempted runas'},
  {id:'4720',lvl:'INFO', msg:'New user account created: testuser01'},
  {id:'4732',lvl:'WARN', msg:'User added to Administrators group: testuser01'},
  {id:'4625',lvl:'CRIT', msg:'Failed login ×34 in 2 min from 91.108.4.12'},
];
let wi=0;
function pushWinLog(){
  const log=WIN_LOGS[wi%WIN_LOGS.length];wi++;
  const f=document.getElementById('winFeed');
  const d=document.createElement('div');d.className='log-row';
  d.innerHTML=`<span class="evtid">${log.id}</span><span class="badge-lvl ${log.lvl}">${log.lvl}</span><span class="log-msg">${log.msg}</span><span class="log-ts">${new Date().toLocaleTimeString()}</span>`;
  f.prepend(d);if(f.children.length>8)f.lastChild.remove();
}
setInterval(pushWinLog,3000);pushWinLog();

// ── Linux Log Feed ─────────────────────────────────────
const LIN_LOGS=[
  {src:'sshd',   lvl:'WARN', msg:'Failed password for root from 185.220.101.42 port 22'},
  {src:'sudo',   lvl:'CRIT', msg:'pam_unix: authentication failure; user=www-data'},
  {src:'cron',   lvl:'INFO', msg:'(root) CMD (/usr/lib/apt/apt.systemd.daily)'},
  {src:'sshd',   lvl:'INFO', msg:'Accepted publickey for deploy from 10.0.0.5 port 41922'},
  {src:'kernel', lvl:'WARN', msg:'Possible SYN flooding on port 80. Sending cookies.'},
];
let li=0;
function pushLinLog(){
  const log=LIN_LOGS[li%LIN_LOGS.length];li++;
  const f=document.getElementById('linFeed');
  const d=document.createElement('div');d.className='log-row';
  d.innerHTML=`<span class="evtid">${log.src}</span><span class="badge-lvl ${log.lvl}">${log.lvl}</span><span class="log-msg">${log.msg}</span><span class="log-ts">${new Date().toLocaleTimeString()}</span>`;
  f.prepend(d);if(f.children.length>8)f.lastChild.remove();
}
setInterval(pushLinLog,3500);pushLinLog();

// ── Firewall Log Feed ──────────────────────────────────
const FW_LOGS=[
  {action:'BLOCK',proto:'TCP', msg:'185.220.101.42:54321 → 10.0.0.1:22  [SYN Flood]'},
  {action:'ALLOW',proto:'UDP', msg:'8.8.8.8:53 → 10.0.0.5:1024  [DNS]'},
  {action:'BLOCK',proto:'TCP', msg:'91.108.4.12:3389 → 10.0.0.10:3389  [RDP Scan]'},
  {action:'BLOCK',proto:'TCP', msg:'194.165.16.78:*  → 10.0.0.1:*  [Port Scan]'},
  {action:'ALLOW',proto:'HTTPS',msg:'10.0.0.20:443 → 142.250.1.100:443  [Outbound]'},
];
let fi=0;
function pushFwLog(){
  const log=FW_LOGS[fi%FW_LOGS.length];fi++;
  const f=document.getElementById('fwFeed');
  const d=document.createElement('div');d.className='log-row';
  d.innerHTML=`<span class="badge-lvl ${log.action==='BLOCK'?'CRIT':'INFO'}">${log.action}</span><span class="evtid">${log.proto}</span><span class="log-msg">${log.msg}</span><span class="log-ts">${new Date().toLocaleTimeString()}</span>`;
  f.prepend(d);if(f.children.length>8)f.lastChild.remove();
}
setInterval(pushFwLog,2800);pushFwLog();

// ── IP bars animation ──────────────────────────────────
setTimeout(()=>document.querySelectorAll('.ip-bar').forEach(b=>b.style.width=b.dataset.w),500);

// ── Detection rules toggle ─────────────────────────────
document.querySelectorAll('.rule-toggle').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const active=btn.classList.toggle('on');
    btn.textContent=active?'ENABLED':'DISABLED';
    btn.style.background=active?'rgba(46,213,115,.2)':'rgba(100,116,139,.15)';
    btn.style.color=active?'#2ed573':'#64748b';
  });
});
