const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const lesson = {schemaVersion:1,lessonId:'custom-demo',revision:1,publisherId:'custom',editionId:'self',grade:7,book:1,lesson:'01',title:'自編十詞',sourceNote:'自編測試',goals:['meaning-recognition','spelling'],words:Array.from({length:10},(_,i)=>({id:'term-'+i,en:'item '+i,zh:'項目 '+i,example:'This is item '+i+'.',exampleZh:'這是項目 '+i+'。'}))};
const fileURL = p => 'file:///' + path.resolve(p).replace(/\\/g,'/');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const server = require('node:http').createServer((req,res) => {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/edu-web-games\//,'');
    let file = path.resolve(pathname || 'index.html');
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
    try { res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/html; charset=utf-8');res.end(fs.readFileSync(file)); } catch {res.statusCode=404;res.end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const page=await browser.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  async function importLesson(data) {
    await page.locator('#import').setInputFiles({name:'lesson.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
    await page.getByRole('button',{name:'配對 8 題／組',exact:true}).waitFor();
    await page.waitForFunction(()=>document.querySelector('#words tr'));
  }
  // Wait for the navigation to finish so assertions never run on the page being left.
  async function openGame(game) {
    await Promise.all([page.waitForURL(/vocabulary-/),page.getByRole('button',{name:game+' '+(game==='打字'?10:8)+' 題／組',exact:true}).click()]);
    await page.waitForLoadState('load');
  }
  async function backToEditor() {
    await Promise.all([page.waitForURL(/lesson-editor/),page.getByRole('link',{name:'返回教材頁'}).first().click()]);
    await page.locator('#words tr').first().waitFor();
  }
  async function solve(game) {
    await page.locator('#begin').click();
    if(game==='配對') {
      while(await page.locator('[data-side="en"]:not([disabled])').count()) {
        const card=page.locator('[data-side="en"]:not([disabled])').first(),id=await card.getAttribute('data-match');
        assert.ok(id.startsWith('term-'));await card.click();await page.locator('[data-side="zh"][data-match="'+id+'"]').click();
      }
      await page.locator('#finish').click();
    } else if(game==='翻牌') {
      const pairs=await page.locator('[data-memory]').evaluateAll(els=>{
        // Card IDs stay private; determine positions through actual flips below.
        return els.length;
      });
      const seen=new Map();
      for(let i=0;i<pairs;i+=2){await page.locator('[data-memory="'+i+'"]').click();seen.set(i,await page.locator('[data-memory="'+i+'"]').innerText());await page.locator('[data-memory="'+(i+1)+'"]').click();seen.set(i+1,await page.locator('[data-memory="'+(i+1)+'"]').innerText());await page.waitForTimeout(1000);}
      for(const w of lesson.words){const a=[...seen].find(([,v])=>v===w.en),b=[...seen].find(([,v])=>v===w.zh);if(!a||!b)continue;const card=page.locator('[data-memory="'+a[0]+'"]');if(await card.isDisabled())continue;await card.click();await page.locator('[data-memory="'+b[0]+'"]' ).click();await page.waitForTimeout(400);}
      await page.locator('#finish').click();
    } else {
      for(let i=0;i<10;i++){const zh=await page.locator('.question').innerText(),w=lesson.words.find(w=>w.zh===zh);assert.ok(w);await page.locator('#typed').fill(w.en.toUpperCase());await page.locator('#typed').press('Enter');await page.locator('#next').click();}
    }
    await page.locator('#end').waitFor({state:'visible'});
  }
  try {
    for(const editor of ['http://127.0.0.1:'+server.address().port+'/edu-web-games/lesson-editor/index.html',fileURL('lesson-editor/index.html')]) {
      await page.goto(editor);await importLesson(lesson);
      for(const game of ['配對','翻牌','打字']) {
        await openGame(game);
        await page.reload();await page.waitForLoadState('load');assert.match(await page.locator('#source').innerText(),/自編十詞/);await solve(game);
        await backToEditor();assert.equal(await page.locator('#words tr').count(),10);
      }
      await page.getByLabel('第 1 筆 example',{exact:true}).fill('Updated example.');
      await page.reload();await page.locator('#words tr').first().waitFor();
      assert.equal(await page.getByLabel('第 1 筆 example',{exact:true}).inputValue(),'Updated example.');
      // An unfinished draft (blank revision) must survive a reload instead of emptying the editor.
      await page.locator('#advanced summary').click();await page.locator('#revision').fill('');
      await page.reload();await page.locator('#words tr').first().waitFor();
      assert.equal(await page.locator('#words tr').count(),10);
      assert.equal(await page.getByLabel('第 1 筆 example',{exact:true}).inputValue(),'Updated example.');
      assert.equal(await page.getByRole('button',{name:'配對 8 題／組',exact:true}).isDisabled(),true);
      await page.locator('#revision').fill('1');
      for(const game of ['配對','翻牌','打字']) {
        await openGame(game);
        assert.equal(await page.evaluate(()=>G7Data.words[0].example),'Updated example.');await backToEditor();
      }
      const download=page.waitForEvent('download');await page.locator('#export').click();assert.match((await download).suggestedFilename(),/custom-demo/);
      console.log('PASS three games, reload, return, update, export: '+editor.split(':')[0]);
    }
    await page.goto('http://127.0.0.1:'+server.address().port+'/edu-web-games/lesson-editor/');
    for(const n of [7,8,9,10]) {
      await importLesson({...lesson,words:lesson.words.slice(0,n)});
      await page.waitForFunction(n=>document.querySelectorAll('#words tr').length===n,n);
      assert.equal(await page.getByRole('button',{name:'配對 8 題／組',exact:true}).isEnabled(),n>=8);
      assert.equal(await page.getByRole('button',{name:'配對 10 題／組',exact:true}).isEnabled(),n>=10);
      assert.equal(await page.getByRole('button',{name:'打字 10 題／組',exact:true}).isEnabled(),n>=10);
    }
    await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
    await page.waitForFunction(()=>document.querySelector('#errors').textContent.includes('匯入失敗'));
    assert.equal(await page.locator('#words tr').count(),10);
    await page.locator('#paste').fill('apple\t蘋果\npear\t梨子');await page.locator('#preview').click();
    assert.equal(await page.locator('#words tr').count(),2);
    assert.equal(await page.getByRole('button',{name:'翻牌 4 題／組',exact:true}).isDisabled(),true);
    await page.getByLabel('第 1 筆 example',{exact:true}).fill('An apple.');
    await page.getByLabel('第 1 筆 exampleZh',{exact:true}).fill('一個蘋果。');
    const draftDownload=page.waitForEvent('download');await page.locator('#export').click();await draftDownload;
    await page.evaluate(()=>sessionStorage.clear());
    await page.goto('http://127.0.0.1:'+server.address().port+'/edu-web-games/vocabulary-matching/?lesson=missing&revision=1');
    assert.equal(await page.locator('#begin').isDisabled(),true);
    assert.match(await page.locator('#settings + p').innerText(),/不符|遺失/);
    assert.deepEqual(errors,[]);
    console.log('PASS missing/mismatched lesson blocked; page errors 0');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

