const demo={
  week:{games:8,avg:"3,9",top4:"63%",wins:2,comps:[["Feiticeiros",5,72],["Bastião",4,61],["Flex AD",3,55]],units:[["Ahri",7],["Taric",6],["Shen",5],["Kai'Sa",5],["Janna",4]],augments:[["Jeweled Lotus",4,"3,2"],["Pandora's Items",3,"3,7"],["Tiny Titans",2,"2,5"]],records:[["Melhor colocação","1º"],["Maior sequência Top 4","4"],["Comp de melhor média","Feiticeiros · 2,8"]],placements:[2,1,0,1,2,1,1,0]},
  month:{games:23,avg:"4,1",top4:"61%",wins:4,comps:[["Feiticeiros",11,78],["Bastião",9,65],["Flex AD",7,59]],units:[["Ahri",18],["Taric",15],["Shen",14],["Kai'Sa",12],["Janna",11]],augments:[["Jeweled Lotus",8,"3,4"],["Pandora's Items",7,"3,8"],["Tiny Titans",5,"3,1"]],records:[["Melhor colocação","1º · 4x"],["Maior sequência Top 4","5"],["Comp de melhor média","Feiticeiros · 2,9"]],placements:[4,3,3,4,3,2,2,2]},
  set:{games:86,avg:"4,3",top4:"56%",wins:11,comps:[["Feiticeiros",31,82],["Bastião",24,70],["Flex AD",22,66]],units:[["Ahri",53],["Taric",49],["Shen",45],["Kai'Sa",41],["Janna",36]],augments:[["Jeweled Lotus",19,"3,6"],["Pandora's Items",18,"4,0"],["Tiny Titans",13,"3,5"]],records:[["Melhor colocação","1º · 11x"],["Maior sequência Top 4","6"],["Patch mais forte","16.19 · média 3,6"]],placements:[11,10,12,15,10,9,11,8]}
};
const i18n={
  pt:{eyebrow:"Sua história recente no TFT",hero:"Seu set, contado como uma história.",sub:"Menos tabela, mais memória: descubra suas comps favoritas, augments marcantes, melhores resultados e recordes do período.",search:"Ver meu Wrapped",identity:"Identidade do período",identityText:"Você alternou comps com frequência e terminou melhor quando preservou opções até o estágio 4.",comps:"Comps que definiram seu período",placements:"Colocações",units:"Unidades mais presentes",augments:"Augments marcantes",records:"Seus recordes",share:"Compartilhar",shareTitle:"Seu TFT Wrapped em um card.",shareText:"O MVP reserva este bloco para gerar PNG compartilhável sem poluir a análise principal.",generate:"Gerar card"},
  en:{eyebrow:"Your recent TFT story",hero:"Your set, told like a story.",sub:"Less spreadsheet, more memory: see your favorite comps, standout augments, best finishes and personal records.",search:"See my Wrapped",identity:"Period identity",identityText:"You flexed often and performed better when you kept options open until stage 4.",comps:"Comps that defined your period",placements:"Placements",units:"Most played units",augments:"Standout augments",records:"Your records",share:"Share",shareTitle:"Your TFT Wrapped in one card.",shareText:"The MVP reserves this area for a shareable PNG without cluttering the main analysis.",generate:"Generate card"}
};
let period="month",lang="pt";
const $=s=>document.querySelector(s);
function render(){
  const d=demo[period];
  Object.entries({games:d.games,avg:d.avg,top4:d.top4,wins:d.wins}).forEach(([k,v])=>{const el=$('[data-metric="'+k+'"]');if(el)el.textContent=v});
  $('[data-comps]').innerHTML=d.comps.map(([n,c,p])=>'<div><div class="row"><strong>'+n+'</strong><span class="muted">'+c+' partidas</span></div><div class="bar"><span style="width:'+p+'%"></span></div></div>').join("");
  $('[data-units]').innerHTML=d.units.map(([n,c])=>'<div class="row"><strong>'+n+'</strong><span class="muted">'+c+' partidas</span></div>').join("");
  $('[data-augments]').innerHTML=d.augments.map(([n,c,a])=>'<div class="row"><strong>'+n+'</strong><span class="muted">'+c+'x · média '+a+'</span></div>').join("");
  $('[data-records]').innerHTML=d.records.map(([n,v])=>'<div class="row"><span class="muted">'+n+'</span><strong>'+v+'</strong></div>').join("");
  $('[data-placements]').innerHTML=d.placements.map((v,i)=>'<div class="place '+(i<4?"is-hot":"")+'"><span>'+ (i+1)+'º</span><small class="muted">'+v+'x</small></div>').join("");
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=i18n[lang][key]||el.textContent});
  $('[data-lang]').textContent=lang==="pt"?"EN":"PT-BR";
  document.documentElement.lang=lang==="pt"?"pt-BR":"en";
}
document.querySelectorAll("[data-period]").forEach(btn=>btn.addEventListener("click",()=>{period=btn.dataset.period;render()}));
$("[data-lang]").addEventListener("click",()=>{lang=lang==="pt"?"en":"pt";localStorage.setItem("tft-wrapped-lang",lang);render()});
$("[data-search]").addEventListener("submit",e=>{e.preventDefault();$("[data-mode-label]").textContent=lang==="pt"?"Modo demonstrativo — Riot ID capturado para integração via backend.":"Demo mode — Riot ID captured for backend integration.";render()});
$("[data-share]").addEventListener("click",()=>alert(lang==="pt"?"Gerador de PNG entra na próxima etapa do MVP.":"PNG generator is the next MVP step."));
lang=localStorage.getItem("tft-wrapped-lang")||"pt";
render();