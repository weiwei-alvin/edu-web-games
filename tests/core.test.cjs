const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('首次紀錄不能被重試與提示後答對覆寫',()=>{
  assert.ok(fs.existsSync('assets/grade7/core.js'),'核心模組尚未實作');
  const C=require('../assets/grade7/core.js');
  const s=C.makeStats(); C.record(s,'a',false); C.record(s,'a',true); C.record(s,'b',true);
  assert.equal(C.summary(s,3).firstCorrect,1); assert.equal(C.summary(s,3).rate,33);
  assert.equal(s.items.a.attempts,2); assert.equal(C.summary(s,3).errors,1);
  C.hint(s,'c'); C.record(s,'c',true); assert.equal(C.summary(s,3).firstCorrect,1);
});
test('片語檢查忽略大小寫與多餘空白但不忽略字序',()=>{
  const C=require('../assets/grade7/core.js');
  assert.equal(C.normalize('  In   front OF  '),'in front of');
  assert.notEqual(C.normalize('front in of'),C.normalize('in front of'));
});
test('固定格線位置判定對應明確空間關係',()=>{
  const C=require('../assets/grade7/core.js'); const refs={bed:[2,2],chair:[6,2],box:[4,4]};
  assert.ok(C.positionOK('between',[4,2],refs)); assert.ok(!C.positionOK('between',[4,3],refs));
  assert.ok(C.positionOK('behind',[2,1],refs)); assert.ok(!C.positionOK('behind',[2,3],refs));
  assert.ok(C.positionOK('in front of',[2,3],refs)); assert.ok(C.positionOK('inside',[4,4],refs));
  assert.ok(C.positionOK('next to',[1,2],refs)); assert.ok(!C.positionOK('next to',[2,2],refs));
});
test('多重可接受分類不會重複抽詞或阻礙過關',()=>{
 const C=require('../assets/grade7/core.js');assert.equal(typeof C.sortingPool,'function','尚未提供可去除重複分類詞的抽題函式');
 const words=Array.from({length:20},(_,i)=>({id:'x'+i,cats:['A','B','C','D','E']}));
 for(let n=0;n<20;n++){const pool=C.sortingPool(words.map(w=>w.id),words,['A','B','C','D','E'],15);assert.equal(pool.length,15);assert.equal(new Set(pool).size,15);}
});
