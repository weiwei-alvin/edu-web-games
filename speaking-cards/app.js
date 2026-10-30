'use strict';
const ACTIONS = [
 ['sink','fixing a sink','修理水槽','home'],['car','fixing a car','修理汽車','home'],
 ['room','cleaning a room','打掃房間','home'],['apartment','cleaning an apartment','打掃公寓','home'],
 ['homework','doing homework','寫作業','learning'],['teeth','brushing my teeth','刷牙','home'],
 ['cat','feeding a cat','餵貓','home'],['wall','painting a wall','粉刷牆壁','home'],
 ['book','reading a book','看書','learning'],['newspaper','reading a newspaper','看報紙','learning'],
 ['window','washing a window','清洗窗戶','home'],['breakfast','eating breakfast','吃早餐','food'],
 ['dinner','eating dinner','吃晚餐','food'],['lunch','eating lunch','吃午餐','food'],
 ['cooking','cooking','做飯','food'],['studying','studying','讀書／學習','learning'],
 ['teaching','teaching','教學','learning'],['singing','singing','唱歌','leisure'],
 ['sleeping','sleeping','睡覺','home'],['swimming','swimming','游泳','leisure'],
 ['planting','planting flowers','種花','home'],['tv','watching TV','看電視','leisure'],
 ['music','listening to music','聽音樂','leisure'],['cards','playing cards','玩撲克牌','leisure'],
 ['baseball','playing baseball','打棒球','leisure'],['basketball','playing basketball','打籃球','leisure'],
 ['tennis','playing tennis','打網球','leisure'],['badminton','playing badminton','打羽毛球','leisure'],
 ['piano','playing the piano','彈鋼琴','leisure']
].map(([id,phrase,zh,category])=>({id,phrase,zh,category}));
const $=id=>document.getElementById(id);
const colors={green:'#5b8d71',blue:'#6d9ead',orange:'#e3a55d',skin:'#efb88f',ink:'#354e49'};
function rect(x,y,w,h,c,r=8){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;}
function circle(x,y,r,c){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;}
function line(x,y,a,b,c=colors.ink,w=5){return `<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;}
function path(d,c,stroke='none',w=4){return `<path d="${d}" fill="${c}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;}
function text(x,y,t,size=20,c=colors.ink){return `<text x="${x}" y="${y}" font-family="Segoe UI,sans-serif" font-size="${size}" font-weight="700" fill="${c}">${t}</text>`;}
function person(x,y,role='he',pose='reach',scale=1){
 const girl=role==='she';const shirt=girl?'#c87c67':'#6e96ae';
 let arms=pose==='up'?line(-18,61,-42,28,colors.skin,12)+line(18,61,46,18,colors.skin,12):pose==='mouth'?line(-18,61,-32,88,colors.skin,12)+path('M18 61L31 45L16 32','none',colors.skin,12):pose==='read'?line(-18,61,-5,83,colors.skin,12)+line(18,61,39,77,colors.skin,12):line(-18,61,-32,88,colors.skin,12)+line(18,61,52,75,colors.skin,12);
 return `<g transform="translate(${x} ${y}) scale(${scale})">`+(girl?rect(-26,-3,51,59,'#554738',20):'')+line(-10,95,-16,136,'#455d69',13)+line(12,95,21,136,'#455d69',13)+line(-17,138,-29,138,'#354743',9)+line(21,138,32,138,'#354743',9)+rect(-23,46,47,54,shirt,13)+arms+rect(-7,34,14,16,colors.skin,5)+circle(0,18,24,colors.skin)+path('M-24 16Q-28 -14 0 -10Q28 -12 25 15L15 2Q0 10 -24 16','#554738')+circle(-7,18,2.2,colors.ink)+circle(10,18,2.2,colors.ink)+path('M-5 29Q2 34 9 28','none',colors.ink,2.5)+(girl?circle(25,3,8,'#c87c67'):'')+'</g>';
}
function book(x,y,c='#dcad60'){return `<g transform="translate(${x} ${y})">`+path('M0 0Q18 -8 36 0Q54 -8 72 0V44Q54 36 36 44Q18 36 0 44Z',c,'#9d8052',2)+line(36,1,36,42,'#fff9dd',2)+line(7,11,28,11,'#fff9dd',2)+line(43,11,65,11,'#fff9dd',2)+'</g>';}
function plant(x,y){return `<g transform="translate(${x} ${y})">`+path('M-17 0H17L12 25H-12Z','#c37e5c')+line(0,0,0,-38,colors.green,4)+path('M0 -18Q-28 -18 -23 -35Q-5 -35 0 -18M0 -29Q4 -50 23 -48Q26 -30 0 -29',colors.green)+'</g>';}
function clock(hour){const a=(hour%12)/12*Math.PI*2;return circle(343,37,24,'#fffdf3')+`<circle cx="343" cy="37" r="24" fill="none" stroke="#9cae9e" stroke-width="3"/>`+line(343,37,343,20,colors.ink,2)+line(343,37,343+Math.sin(a)*13,37-Math.cos(a)*13,colors.ink,3)+circle(343,37,3,colors.ink);}
function scene(id,role){
 let bg=rect(0,0,390,240,'#eff2e7',18)+rect(0,200,390,40,'#dfe6d5',0),back='',front='',pose='reach',px=137,py=63,custom=false;
 const desk=()=>rect(170,148,160,13,'#bd9169',4)+rect(184,161,9,49,'#9c7757',2)+rect(307,161,9,49,'#9c7757',2);
 switch(id){
 case 'sink': back=rect(205,100,141,23,'#afc2bf')+rect(215,123,120,75,'#dbbd91')+path('M268 100V73Q268 59 285 59H298','none','#7b9194',8)+path('M278 126V155H300V173','none','#7b9194',8);front=line(187,139,229,163,'#758b93',8)+path('M220 151L231 146L239 155L232 167L220 164Z','#758b93');break;
 case 'car': back=path('M191 130L212 86H289L322 128Z','#afd4da','#55828e')+path('M173 128H338Q354 128 354 147V179H165V145Z','#df9e57')+circle(198,179,23,'#40565d')+circle(320,179,23,'#40565d')+circle(198,179,11,'#d8ded7')+circle(320,179,11,'#d8ded7')+path('M168 127L207 70L224 78L195 131Z','#d28a41');front=line(185,137,210,111,'#748f98',7)+circle(210,109,8,'#748f98');break;
 case 'room':back=rect(237,136,113,58,'#d9b27b')+rect(231,128,124,24,'#8ca69d')+rect(242,116,42,21,'#fffbed')+rect(247,68,66,43,'#c4d6dc');front=line(188,135,227,208,'#ad8154',6)+path('M215 197L237 193L252 217H209Z','#ddae5b')+circle(75,214,4,'#a99a81');break;
 case 'apartment':back=rect(8,55,94,77,'#e2d9bf')+rect(18,70,31,46,'#bad7da')+rect(57,70,31,46,'#bad7da')+rect(262,155,105,46,'#91aa9c')+rect(271,135,86,35,'#9db9a9')+plant(322,101)+line(245,30,245,204,'#cdd3c5',3);front=line(188,135,229,208,'#ad8154',6)+path('M215 197L237 193L252 217H209Z','#ddae5b')+rect(58,179,36,32,'#93b6bf');break;
 case 'homework':back=desk();front=rect(205,121,79,25,'#fffdf6',2)+line(215,128,249,128,'#aebdb6',2)+text(215,141,'2 + 3 =',11)+line(187,139,220,127,'#d99b45',5);back+=rect(295,82,37,48,'#86a9a7',3)+text(301,103,'A+',15);break;
 case 'teeth':pose='mouth';back=rect(216,30,96,108,'#bbd7dd',16)+rect(220,34,88,100,'#dbecee',14)+rect(222,163,110,19,'#afc2bf')+rect(243,181,67,32,'#e0d1b7');front=line(161,90,143,86,'#e49a4b',5)+rect(132,81,16,8,'white',2)+circle(140,87,7,'#fff');break;
 case 'cat':front=path('M249 179Q248 161 273 163Q293 166 292 185L288 202H251Z','#cf9363')+circle(242,174,18,'#cf9363')+path('M225 162L225 144L240 158M244 157L258 145L258 167','#cf9363')+circle(236,174,2,colors.ink)+circle(248,174,2,colors.ink)+path('M289 177Q321 159 306 144','none','#cf9363',8)+path('M204 198H240L235 214H209Z','#779dab')+circle(218,198,4,'#8a6450')+circle(228,197,4,'#8a6450')+path('M184 125L204 121L214 151L194 158Z','#e2b967')+circle(209,169,3,'#8a6450')+circle(216,185,3,'#8a6450');break;
 case 'wall':back=rect(221,24,137,177,'#e6ddc7',2)+path('M235 40H296V57H307V162H235Z','#93b4c1');front=line(187,138,222,110,'#ad8154',7)+path('M222 110V77H239','none','#829498',5)+rect(235,61,52,24,'#82a6b5',5)+rect(260,181,40,32,'#82a6b5',4);break;
 case 'book':pose='read';front=book(145,125);back=rect(273,44,63,130,'#c7a779',3)+rect(280,52,13,48,'#82a4a2',2)+rect(297,60,13,40,'#d79668',2)+rect(316,53,12,47,'#b0bd83',2)+line(276,105,333,105,'#a88761',4);break;
 case 'newspaper':pose='read';front=rect(147,111,111,74,'#fffdf5',2)+text(155,129,'DAILY NEWS',13)+rect(157,136,36,25,'#a7bbaf',1)+line(203,140,247,140,'#9aa79b',2)+line(203,148,247,148,'#9aa79b',2)+line(157,170,245,170,'#9aa79b',2);break;
 case 'window':back=rect(219,25,120,137,'#b4d3dc',2)+line(279,26,279,161,'white',6)+line(219,94,338,94,'white',6);front=line(188,138,223,112,colors.skin,11)+rect(217,96,28,23,'#eac876',4)+circle(255,75,9,'#f9fcf3')+circle(317,135,7,'#f9fcf3')+rect(246,181,40,32,'#83aab6',3);break;
 case 'breakfast':case 'lunch':case 'dinner':pose='mouth';back=desk()+clock(id==='breakfast'?7:id==='lunch'?12:19);front=`<ellipse cx="249" cy="139" rx="39" ry="11" fill="#fffaf0"/>`+line(168,108,153,95,'#9eaaa0',3);if(id==='breakfast')front+=rect(224,120,25,15,'#d29b59',3)+`<ellipse cx="258" cy="130" rx="17" ry="9" fill="white"/>`+circle(259,129,5,'#e7b248');else front+=path('M231 135Q234 107 259 135Z','#fffdf0')+circle(271,131,8,'#7b9e59')+circle(280,133,6,'#7b9e59')+rect(215,128,15,9,'#c98059',3);front+=rect(301,116,20,27,'#f1d392',4);if(id==='dinner')back+=circle(52,47,17,'#e7c474')+circle(60,40,16,'#eff2e7');else back+=circle(52,47,17,'#e7c474');break;
 case 'cooking':back=rect(211,157,122,53,'#c6d0c3',3)+rect(207,147,131,14,'#8d9c90',3)+rect(226,116,66,32,'#829fad',5)+line(289,123,319,123,'#526974',7);front=line(186,138,241,109,'#b48c54',6)+path('M244 101Q235 91 245 82M264 102Q254 87 266 76','none','#aab9ac',3)+path('M115 60Q106 47 119 44Q115 29 132 31Q145 20 157 32Q174 29 172 45Q185 52 159 61Z','#fffdf4');break;
 case 'studying':back=desk()+rect(287,53,51,61,'#d8e2cb',4)+text(295,78,'ABC',15)+text(295,99,'123',15);front=book(198,102,'#9db6a3')+rect(285,134,39,9,'#d6a064',2)+rect(288,123,36,9,'#83a9b6',2);break;
 case 'teaching':px=84;back=rect(158,27,194,123,'#b1976f',5)+rect(166,35,178,106,'#527968',2)+text(187,75,'A  B  C',29,'#fffbed')+text(190,113,'1 + 2 = 3',23,'#fffbed');front=line(135,138,194,80,'#c3a36e',4)+circle(241,183,19,'#dca57e')+rect(216,203,51,36,'#c68e76')+circle(315,184,19,'#efc49b')+rect(290,204,51,36,'#839db5');break;
 case 'singing':pose='mouth';front=line(168,112,158,96,'#5f747b',9)+circle(155,91,10,'#85979b')+text(236,80,'♪',45,'#72998b')+text(287,132,'♫',46,'#d6a45c');break;
 case 'sleeping':custom=true;back=rect(57,132,283,65,'#bd9e7c',7)+rect(66,117,267,44,'#fff9ea',9)+rect(75,108,62,38,'#e2e7dc',12)+circle(112,128,23,colors.skin)+path('M89 122Q87 100 112 104Q130 104 132 122','#554738')+path('M99 128Q103 132 108 128M115 128Q119 132 124 128','none',colors.ink,2)+path('M141 114Q194 107 219 123H322V174H141Z','#86aab4')+line(61,193,61,210,'#a88a67',8)+line(333,193,333,210,'#a88a67',8)+text(181,71,'Z',27,'#7899a0')+text(215,46,'z',19,'#7899a0');break;
 case 'swimming':custom=true;bg=rect(0,0,390,240,'#e8f0e6',18)+rect(0,111,390,129,'#a8d3dc',0);front=circle(133,112,24,colors.skin)+path('M109 107Q107 79 134 84Q155 82 157 105Z','#d7a460')+rect(113,105,34,9,'#568295',4)+path('M148 143Q181 127 230 146','none',colors.skin,22)+path('M180 137L213 95L246 118','none',colors.skin,13)+path('M40 166Q65 153 90 166T140 166T190 166T240 166T290 166T340 166M20 201Q45 188 70 201T120 201T170 201T220 201T270 201T320 201T370 201','none','#eef8f7',4);break;
 case 'planting':front=rect(208,190,132,25,'#aa8963',10)+plant(250,187)+plant(310,187)+line(188,138,216,180,'#9c7a4a',6)+path('M207 174L221 170L232 193L222 203Z','#789396');back=circle(320,43,20,'#e7c16e');break;
 case 'tv':back=rect(222,48,129,87,'#425d5d',8)+rect(231,56,111,70,'#accbd3',3)+path('M240 117L265 76L288 109L306 87L335 118Z','#7c9e7c')+circle(321,73,9,'#edce79')+line(285,136,285,153,'#425d5d',6)+rect(244,153,83,8,'#425d5d',3);front=rect(181,131,24,13,'#49635e',3)+circle(200,136,2,'#dbb974');break;
 case 'music':pose='up';front=path('M110 83Q107 46 136 46Q168 47 166 83','none','#48676c',7)+rect(108,76,12,24,'#48676c',5)+rect(156,76,12,24,'#48676c',5)+text(238,84,'♫',47,'#d9ae64')+text(274,143,'♪',40,'#7d9e8a');break;
 case 'cards':back=desk()+person(321,69,'she','read',.72);front=rect(194,128,23,30,'#fffbed',3)+rect(221,125,23,30,'#fffbed',3)+text(197,150,'♥',20,'#bc7660')+text(224,147,'♠',20)+path('M158 116L171 109L192 134L178 143Z','#fffbed')+text(173,132,'♦',16,'#bc7660');break;
 case 'baseball':pose='up';back=line(25,211,357,211,'#fdfcf1',3)+path('M272 204L290 189L308 204L290 217Z','white');front=line(175,87,222,28,'#c7a06b',12)+circle(285,86,14,'#fffdf3')+path('M278 75Q291 86 278 97','none','#bc786a',2);break;
 case 'basketball':pose='up';back=line(325,33,325,206,'#849c9a',7)+rect(272,20,81,54,'#fafbf0',4)+rect(291,35,37,27,'#b9d2ce',2)+line(287,77,334,77,'#c98b55',6)+path('M290 80L299 111H323L332 80M299 80L307 111M310 80L316 111','none','#a0b2a6',2);front=circle(222,57,23,'#d79752')+line(200,56,243,58,'#8b653d',2)+path('M218 35Q233 56 218 79M203 42Q218 57 203 71','none','#8b653d',2);break;
 case 'tennis':case 'badminton':back=line(30,211,355,211,'#fffdf3',3)+line(275,145,275,215,'#9baa9b',4)+line(275,146,390,146,'white',4)+line(275,174,390,174,'#c1cec0',2);front=line(186,138,226,106,'#a78158',7)+`<ellipse cx="240" cy="90" rx="22" ry="31" transform="rotate(35 240 90)" fill="#e6eee3" stroke="#729b98" stroke-width="5"/>`+line(222,77,257,99,'#a5bcb2',2)+line(223,90,248,108,'#a5bcb2',2)+line(233,66,264,88,'#a5bcb2',2);if(id==='tennis')front+=circle(303,53,12,'#bed16b')+path('M296 44Q310 54 296 61','none','white',2);else front+=path('M292 62L306 29L323 46L296 69Z','#fffdf3','#aabbb0',2)+circle(292,67,6,'#c9aa80')+line(299,58,310,35,'#b8c5bc',2);break;
 case 'piano':back=rect(200,82,145,79,'#506761',4)+rect(199,140,149,30,'#fdfcf3',1)+line(211,168,211,211,'#506761',9)+line(337,168,337,211,'#506761',9);for(let i=0;i<13;i++)back+=line(205+i*11,141,205+i*11,168,'#a6b0a4',1);for(let i=0;i<9;i++)back+=rect(209+i*15,141,7,16,'#3d554e',1);front=line(187,138,221,151,colors.skin,11)+text(276,48,'♫',32,'#ccaa6c');break;
 }
 return bg+back+(custom?'':person(px,py,role,pose))+front;
}
function illustration(card){const roles=card.subject==='they'?['he','she']:[card.subject==='you'?'he':card.subject];let inner;if(roles.length===2){inner=`<g transform="translate(5 18) scale(.73)">${scene(card.id,'he')}</g><g transform="translate(305 18) scale(.73)">${scene(card.id,'she')}</g>`;}else inner=`<g transform="translate(115 0)">${scene(card.id,roles[0])}</g>`;return `<svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.zh}的動作插圖">${inner}</svg>`;}
let deck=[],current=null,revealed=false,toastTimer;
function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function answerFor(card){let phrase=card.phrase;if(card.id==='teeth')phrase=`brushing ${{he:'his',she:'her',they:'their',you:'my'}[card.subject]} teeth`;return `${{he:'He’s',she:'She’s',they:'They’re',you:'I’m'}[card.subject]} ${phrase}.`;}
function newRound(){stopSpeech();if($('cardDialog').open)$('cardDialog').close();const cat=$('category').value;const pool=ACTIONS.filter(a=>cat==='all'||a.category===cat);const size=$('count').value==='all'?pool.length:Math.min(Number($('count').value),pool.length);const roles=shuffled(['he','she','they','you']);deck=shuffled(pool).slice(0,size).map((a,i)=>({...a,subject:$('subject').value==='mixed'?roles[i%4]:$('subject').value,done:false}));current=null;render();}
function render(){const done=deck.filter(c=>c.done).length;$('progress').textContent=`已完成 ${done} / ${deck.length}`;$('bar').style.width=`${done/deck.length*100}%`;$('end').hidden=done!==deck.length;$('random').disabled=done===deck.length;$('grid').innerHTML=deck.map((c,i)=>`<button class="card ${c.done?'done':''}" data-index="${i}" aria-label="第 ${i+1} 張卡片${c.done?'，已完成，可複習':''}"><span class="corner">FLIP & SAY</span><span class="number">${String(i+1).padStart(2,'0')}</span><span class="star">${c.done?'✓':'✧'}</span></button>`).join('');}
function openCard(i){current=i;revealed=false;const c=deck[i];$('cardNumber').textContent=`CARD ${String(i+1).padStart(2,'0')} / ${deck.length}`;$('question').textContent=`What ${c.subject==='he'||c.subject==='she'?'is':'are'} ${c.subject} doing?`;$('role').textContent={he:'he · 請用 He’s 回答',she:'she · 請用 She’s 回答',they:'they · 請用 They’re 回答',you:'you · 扮演圖中的人物，用 I’m 回答'}[c.subject];$('art').innerHTML=illustration(c);$('complete').textContent=c.done?'已完成 · 回到卡牌':'完成這張 ✓';renderAnswer();$('cardDialog').showModal();$('cardDialog').focus({preventScroll:true});$('cardDialog').scrollTop=0;}
function renderAnswer(){const c=deck[current];$('answer').innerHTML=revealed?`<div class="answer-en" lang="en">${answerFor(c)}</div><div class="answer-zh">${c.zh}</div>`:'<span class="hint">先看圖說說看，再揭曉答案。</span>';$('reveal').textContent=revealed?'隱藏答案':'顯示答案';$('speak').hidden=!revealed||!('speechSynthesis' in window);}
function toggleAnswer(){stopSpeech();revealed=!revealed;renderAnswer();}
function stopSpeech(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
function notice(t){$('notice').textContent=t;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('notice').textContent='',3500);}
$('grid').addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b)openCard(Number(b.dataset.index));});
for(const id of ['subject','category','count'])$(id).addEventListener('change',()=>{newRound();notice('新回合已準備好！');});
$('shuffle').onclick=()=>{newRound();notice('已重新洗牌，挑一張開始吧！');};
$('random').onclick=()=>{const choices=deck.map((c,i)=>c.done?null:i).filter(i=>i!==null);if(choices.length)openCard(choices[Math.floor(Math.random()*choices.length)]);};
$('close').onclick=()=>$('cardDialog').close();
$('cardDialog').addEventListener('close',()=>{stopSpeech();document.querySelector(`[data-index="${current}"]`)?.focus();});
$('reveal').onclick=toggleAnswer;
$('complete').onclick=()=>{deck[current].done=true;render();$('cardDialog').close();};
$('speak').onclick=()=>{stopSpeech();const u=new SpeechSynthesisUtterance(answerFor(deck[current]));u.lang='en-US';u.rate=.85;u.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted')notice('目前無法播放語音，請由老師示範朗讀。');};window.speechSynthesis.speak(u);};
$('cardDialog').addEventListener('keydown',e=>{if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();toggleAnswer();}});
$('helpBtn').onclick=()=>$('helpDialog').showModal();$('helpClose').onclick=()=>$('helpDialog').close();
newRound();
