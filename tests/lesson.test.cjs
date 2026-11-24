const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../assets/lessons/content.js');
const lesson=n=>({schemaVersion:1,lessonId:'custom-test',revision:1,publisherId:'custom',editionId:'self',grade:7,book:1,lesson:'01',title:'試用',sourceNote:'自編',goals:['meaning-recognition','spelling'],words:Array.from({length:n},(_,i)=>({id:'word-'+i,en:'word '+i,zh:'詞 '+i,example:'Example '+i,exampleZh:'例句 '+i}))});
test('三款模式以有效詞數判斷，不重複補題',()=>{for(const n of [7,8,9,10]){const d=lesson(n);assert.equal(L.check(d,'vocabulary-matching',8).ok,n>=8);assert.equal(L.check(d,'vocabulary-matching',10).ok,n>=10);for(const c of [4,6,8])assert.equal(L.check(d,'vocabulary-memory',c).ok,n>=c);assert.equal(L.check(d,'vocabulary-typing',10).ok,n>=10);}});
test('重複卡面、ID、缺例句及無效結構明確失敗',()=>{for(const field of ['id','en','zh']){const d=lesson(10);d.words[1][field]=d.words[0][field];assert.equal(L.check(d,'vocabulary-typing',10).ok,false);}const d=lesson(10);d.words[0].example='';assert.equal(L.check(d,'vocabulary-matching',10).ok,false);assert.equal(L.check(null,'vocabulary-memory',4).ok,false);});
test('轉換只使用所選教材，修改內容可重新載入',()=>{const d=lesson(10);const a=L.adapt(d,{});assert.equal(a.words.length,10);assert.deepEqual(a.pools.matching,d.words.map(w=>w.id));d.words[0].zh='新版';assert.equal(L.adapt(d,{}).words[0].zh,'新版');});
test('詞條 ID 不得碰撞計分物件原型',()=>{for(const id of ['constructor','__proto__','toString']){const d=lesson(10);d.words[0].id=id;assert.equal(L.check(d,'vocabulary-typing',10).ok,false);}});
