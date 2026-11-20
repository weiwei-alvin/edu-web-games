(function(root){
'use strict';
const normalize=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const makeStats=()=>({items:{},hints:0});
const item=(s,id)=>s.items[id]||(s.items[id]={attempts:0,first:null,wrong:0,hints:0,solved:false});
function record(s,id,ok){const r=item(s,id);if(r.solved)return false;if(r.first===null)r.first=!!ok&&r.hints===0;r.attempts++;if(ok)r.solved=true;else r.wrong++;return true;}
function hint(s,id){const r=item(s,id);if(!r.solved){r.hints++;s.hints++;}}
function summary(s,total){const a=Object.values(s.items),firstCorrect=a.filter(r=>r.first===true).length;return{firstCorrect,total,rate:total?Math.round(firstCorrect/total*100):0,errors:a.reduce((n,r)=>n+r.wrong,0),hints:s.hints,solved:a.filter(r=>r.solved).length};}
function positionOK(rel,p,refs){const [x,y]=p,[bx,by]=refs.bed;const dx=x-bx,dy=y-by;switch(rel){case 'behind':return dx===0&&dy===-1;case 'in front of':return dx===0&&dy===1;case 'beside':case 'next to':return Math.abs(dx)===1&&dy===0;case 'near':return Math.max(Math.abs(dx),Math.abs(dy))===1&&!Object.values(refs).some(q=>q[0]===x&&q[1]===y);case 'between':return y===by&&x>bx&&x<refs.chair[0];case 'inside':return x===refs.box[0]&&y===refs.box[1];default:return false;}}
function sortingPool(ids,words,cats,count=15){const selected=[];for(const cat of cats){const choices=shuffle(ids.filter(id=>words.find(w=>w.id===id).cats.includes(cat)&&!selected.includes(id))).slice(0,3);selected.push(...choices);}const remaining=shuffle(ids.filter(id=>!selected.includes(id)));return shuffle([...selected,...remaining].slice(0,count));}
const api={normalize,shuffle,makeStats,record,hint,summary,positionOK,sortingPool};root.G7Core=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
