/* 教材唯一資料區。字彙來源：docs/vocabulary-allocation.md。
 * 中文、例句、任務及句型為自編補充，不是課本第108頁逐字轉錄。
 * type/step/get 等多義詞在此固定為所列課堂用法；可在 cats 設定多個可接受分類。
 */
(function(root){
'use strict';
const rows=[
['living room','客廳','Places','The photo is in the living room.','照片在客廳裡。'],
['bedroom','臥室','Places','The blanket is in the bedroom.','毯子在臥室裡。'],
['bathroom','浴室','Places','The bathroom is quiet.','浴室很安靜。'],
['dining room','餐廳（用餐的房間）','Places','We eat in the dining room.','我們在餐廳用餐。'],
['kitchen','廚房','Places','The ice is in the kitchen.','冰在廚房裡。'],
['house','房子','Places','This house is small.','這間房子很小。'],
['please','請','Other','Please wait for me.','請等我。'],
['quiet','安靜的','Adjectives','The bedroom is quiet.','臥室很安靜。'],
['style','風格','Other','I like this style.','我喜歡這種風格。'],
['idea','主意','Other','That is a good idea.','那是個好主意。'],
['tool','工具','Objects','This is a useful tool.','這是個有用的工具。'],
['smartphone','智慧型手機','Objects','I see a smartphone.','我看到一支智慧型手機。'],
['step','步驟','Other','Read each step.','讀每個步驟。'],
['upload','上傳','Actions','Please upload the photo.','請上傳這張照片。'],
['photo','照片','Objects','Choose a photo.','選一張照片。'],
['choose','選擇','Actions','Please choose a theme.','請選擇一個主題。'],
['type','打字；輸入','Actions','Type your question.','輸入你的問題。'],
['theme','主題','Other','Choose a theme for the room.','為這個房間選擇一個主題。'],
['wait','等待','Actions','Please wait here.','請在這裡等候。'],
['get','取得；拿取','Actions','Get some ice.','拿一些冰。'],
['some','一些','Other','I need some tools.','我需要一些工具。'],
['expensive','昂貴的','Adjectives','The smartphone is expensive.','這支智慧型手機很昂貴。'],
['soft','柔軟的','Adjectives','The blanket is soft.','這條毯子很柔軟。'],
['hard','堅硬的','Adjectives','The tool is hard.','這個工具很堅硬。'],
['question','問題','Other','I have a question.','我有一個問題。'],
['blanket','毯子','Objects','Get a soft blanket.','拿一條柔軟的毯子。'],
['near','在……附近','Position Words','The kitchen is near the bedroom.','廚房在臥室附近。'],
['beside','在……旁邊','Position Words','The smartphone is beside the bed.','智慧型手機在床旁邊。'],
['next to','緊鄰；在……旁邊','Position Words','The tool is next to the table.','工具在桌子旁邊。'],
['between','在兩者之間','Position Words','The photo is between the chairs.','照片在兩張椅子之間。'],
['behind','在……後面','Position Words','The ice is behind the table.','冰在桌子後面。'],
['in front of','在……前面','Position Words','The blanket is in front of the bed.','毯子在床前面。'],
['inside','在……裡面','Position Words','The smartphone is inside the box.','智慧型手機在盒子裡。'],
['I see.','我懂了。','Other','I see. Thank you.','我懂了。謝謝你。'],
["Let’s",'讓我們……','Other',"Let’s choose a theme.",'讓我們選擇一個主題。'],
['in fact','事實上','Other','In fact, the blanket is soft.','事實上，這條毯子很柔軟。'],
['with','和……一起；帶有','Other','I am with you.','我和你在一起。'],
['around','在……周圍','Position Words','Walk around the house.','繞著房子走。'],
['world','世界','Other','We live in this world.','我們生活在這個世界裡。'],
['ice','冰','Objects','Get some ice.','拿一些冰。']
];
const words=rows.map(([en,zh,cat,example,exampleZh],i)=>({id:'w'+i,en,zh,cats:[cat],example,exampleZh}));
const find=en=>{const w=words.find(w=>w.en===en);if(!w)throw Error('Unknown word '+en);return w.id;};
const ids=s=>s.split('|').map(find);
const pools={matching:ids('living room|bedroom|bathroom|dining room|kitchen|house|please|quiet|style|idea|tool|smartphone'),memory:ids('step|upload|photo|choose|type|theme|wait|get|some|expensive|soft|hard'),typing:ids('please|house|quiet|style|idea|get|some|tool|smartphone|expensive|question|blanket|in front of'),sorting:ids('living room|bedroom|bathroom|dining room|kitchen|smartphone|photo|blanket|tool|choose|upload|wait|type|quiet|expensive|soft|hard|behind|between|near|beside')};
const categories={'Places':'場所','Objects':'物品','Actions':'動作','Adjectives':'形容詞','Position Words':'位置詞'};
const sentences=[
{zh:'廚房在臥室附近。',answers:['The kitchen is near the bedroom'],punct:'.'},
{zh:'我看到一支智慧型手機。',answers:['I see a smartphone'],punct:'.'},
{zh:'請等我。',answers:['Please wait for me'],punct:'.'},
{zh:'請上傳這張照片。',answers:['Please upload the photo'],punct:'.'},
{zh:'讓我們選擇一個主題。',answers:["Let’s choose a theme"],punct:'.'},
{zh:'輸入你的問題。',answers:['Type your question'],punct:'.'},
{zh:'拿一些工具。',answers:['Get some tools'],punct:'.'},
{zh:'智慧型手機在盒子裡。',answers:['The smartphone is inside the box'],punct:'.'},
{zh:'照片在毯子旁邊。',answers:['The photo is beside the blanket'],punct:'.'},
{zh:'我有一個主意。',answers:['I have an idea'],punct:'.'},
{zh:'事實上，這條毯子很柔軟。',answers:['In fact the blanket is soft'],punct:'.',display:'In fact, the blanket is soft.'},
{zh:'和我一起選擇一個主題。',answers:['Choose a theme with me'],punct:'.'}
].map((q,i)=>({...q,id:'sentence-'+i}));
// Scene coordinates are used to draw BOTH landmarks and target hot spots.
const rooms=[
{id:'living-room',en:'living room',zh:'客廳',landmarks:[{id:'sofa',en:'sofa',zh:'沙發',x:130,y:100}],objects:[{id:'phone',en:'smartphone',zh:'智慧型手機',x:60,y:100,icon:'📱'}]},
{id:'bedroom',en:'bedroom',zh:'臥室',landmarks:[{id:'bed',en:'bed',zh:'床',x:130,y:80}],objects:[{id:'blanket',en:'blanket',zh:'毯子',x:130,y:145,icon:'▧'}]},
{id:'bathroom',en:'bathroom',zh:'浴室',landmarks:[{id:'bath',en:'bathtub',zh:'浴缸',x:130,y:100}],objects:[]},
{id:'dining-room',en:'dining room',zh:'餐廳',landmarks:[{id:'chair-a',en:'chair',zh:'椅子',x:55,y:110},{id:'chair-b',en:'chair',zh:'椅子',x:205,y:110}],objects:[{id:'photo',en:'photo',zh:'照片',x:130,y:110,icon:'🖼'}]},
{id:'kitchen',en:'kitchen',zh:'廚房',landmarks:[{id:'table',en:'table',zh:'桌子',x:115,y:125}],objects:[{id:'tool',en:'tool',zh:'工具',x:195,y:125,icon:'🔧'},{id:'ice',en:'ice',zh:'冰',x:115,y:55,icon:'🧊'}]}
];
const detective=[...rooms.map(r=>({id:'find-'+r.id,prompt:'Find the '+r.en+'.',answer:r.id,hint:r.en+'：'+r.zh,zh:r.zh})),
{id:'find-phone',prompt:'Find the smartphone beside the sofa in the living room.',answer:'phone',hint:'beside＝在旁邊；sofa＝沙發',zh:'客廳裡沙發旁的智慧型手機'},
{id:'find-blanket',prompt:'Find the blanket in front of the bed in the bedroom.',answer:'blanket',hint:'in front of＝在前面；bed＝床',zh:'臥室裡床前面的毯子'},
{id:'find-photo',prompt:'Find the photo between the chairs in the dining room.',answer:'photo',hint:'between＝在兩者之間；chairs＝椅子（複數）',zh:'餐廳裡兩張椅子之間的照片'},
{id:'find-tool',prompt:'Find the tool next to the table in the kitchen.',answer:'tool',hint:'next to＝在旁邊；table＝桌子',zh:'廚房裡桌子旁的工具'},
{id:'find-ice',prompt:'Find the ice behind the table in the kitchen.',answer:'ice',hint:'behind＝在後面；table＝桌子',zh:'廚房裡桌子後面的冰'}
];
const design=['behind','in front of','between','next to','near','beside','inside'].map((rel,i)=>({id:'design-'+i,rel,object:['smartphone','photo','blanket'][i%3],ref:rel==='between'?'the bed and the chair':rel==='inside'?'the box':'the bed'}));
const refs={bed:[2,2],chair:[6,2],box:[4,4]};
const escape={locks:ids('house|quiet|style|idea|tool|smartphone|step|upload|photo|choose|type|theme|wait|get|some|expensive|soft|hard|question|blanket|around|world|ice|please|living room|bedroom|bathroom|dining room|kitchen|near|beside|next to|between|behind|in front of|inside|I see.|Let’s|in fact|with'),location:{...detective[9],id:'escape-location',code:'108'},sentences:sentences};
const data={words,pools,categories,sentences,rooms,detective,design,refs,escape,sourceNote:'依提供分配表製作；中文、例句與任務為自編補充。尚未取得課本第108頁完整教材，題庫未核對完整覆蓋。'};
root.G7Data=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window==='undefined'?globalThis:window);
