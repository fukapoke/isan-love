(()=>{"use strict";
const $=id=>document.getElementById(id), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const get=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:fallback}catch{return fallback}};
const store=(key,data)=>{try{localStorage.setItem(key,JSON.stringify(data));return true}catch(e){alert("端末への保存に失敗しました。ブラウザの保存設定を確認してください");return false}};
const ownKey="isanlove_entries_v1",pendingKey="isanlove_fon_pending_v1";
let own=get(ownKey,[]),pending=get(pendingKey,[]),bundled=Array.isArray(window.ISAN_LOVE_600)?window.ISAN_LOVE_600:[];
const basics=[["会いたいよ","คิดฮอดเด้อ","キット・ホート・ドー","恋愛"],["愛してるよ","ฮักเจ้าเด้อ","ハック・ジャオ・ドー","恋愛"],["大丈夫だよ","บ่เป็นหยัง","ボー・ペン・ニャン","気遣い"],["ご飯食べた？","กินข้าวแล้วบ่?","ギン・カーオ・レーオ・ボー？","食事"]].map((x,i)=>({id:"basic"+i,ja:x[0],th:x[1],ka:x[2],cat:x[3]}));
const callPhrases=[["これはどういう意味？","คำนี้แปลว่าอะไร","カム・ニー・プレー・ワー・アライ"],["もう一回言ってくれる？","พูดอีกครั้งได้ไหม","プート・イーク・クラン・ダイ・マイ"],["ゆっくり話してね","พูดช้า ๆ หน่อย","プート・チャー・チャー・ノイ"],["発音はこれで合ってる？","ผมออกเสียงถูกไหม","ポム・オーク・シアン・トゥーク・マイ"],["イサーン語では何て言うの？","ภาษาอีสานพูดว่าอะไร","パーサー・イーサーン・プート・ワー・アライ"],["分かったよ！","เข้าใจแล้ว","カオ・ジャイ・レーオ"],["文字で送ってくれる？","พิมพ์ส่งมาให้หน่อยได้ไหม","ピム・ソン・マー・ハイ・ノイ・ダイ・マイ"],["日本語で意味を調べてもいい？","ขอหาความหมายเป็นภาษาญี่ปุ่นก่อนได้ไหม","コー・ハー・クワームマーイ・ペン・パーサー・イープン・ゴーン・ダイ・マイ"],["この言葉を辞書に保存してもいい？","ขอบันทึกคำนี้ไว้ในพจนานุกรมได้ไหม","コー・バントゥック・カム・ニー・ワイ・ナイ・ポッチャナーヌクロム・ダイ・マイ"],["今日は何の言葉を教えてくれる？","วันนี้จะสอนคำว่าอะไร","ワンニー・ジャ・ソーン・カム・ワー・アライ"]].map((x,i)=>({id:"call"+i,ja:x[0],th:x[1],ka:x[2],cat:"電話で確認"}));
const addedIsan=[["水を飲みたい","ข่อยอยากกินน้ำ","コイ・ヤーク・ギン・ナーム","飲み物"],["水を飲む？","เจ้าสิกินน้ำบ่?","ジャオ・シ・ギン・ナーム・ボー？","飲み物"],["喉が渇いた","ข่อยหิวน้ำ","コイ・ヒウ・ナーム","飲み物"],["水を持ってきてくれる？","เอาน้ำมาให้ข่อยแน่","アオ・ナーム・マー・ハイ・コイ・ネー","飲み物"],["コーヒーを飲む？","เจ้าสิกินกาแฟบ่?","ジャオ・シ・ギン・ガーフェー・ボー？","飲み物"],["一緒に飲もう","มากินนำกัน","マー・ギン・ナム・ガン","飲み物"],["おいしい？","แซ่บบ่?","セープ・ボー？","飲み物"],["ありがとうね","ขอบใจเด้อ","コープ・ジャイ・ドー","気持ち"],["何してるの？","เฮ็ดหยังอยู่?","ヘット・ニャン・ユー？","日常"],["どこにいるの？","เจ้าอยู่ไส?","ジャオ・ユー・サイ？","場所"],["会いたいよ","คิดฮอดเด้อ","キット・ホート・ドー","恋愛"],["愛してるよ","ฮักเจ้าเด้อ","ハック・ジャオ・ドー","恋愛"]].map((x,i)=>({id:"verifiedIsan"+i,ja:x[0],th:x[1],ka:x[2],cat:x[3],lang:"isan"}));
const verifiedIsan=new Set(["คิดฮอดเด้อ","ฮักเจ้าเด้อ","บ่เป็นหยัง","กินข้าวแล้วบ่?","ข่อยฮักเจ้า","ข่อยคิดฮอดเจ้า","เมื่อยบ่?","ขอโทษเด้อ","เว้ากันดี ๆ ได้บ่?"]);const languageOf=x=>x.lang||(verifiedIsan.has(String(x.th||"").trim())?"isan":"unverified");let isanOnly=false;const all=()=>[...basics,...callPhrases,...bundled,...addedIsan,...own];
// Correct the first Fon entry previously classified as Isan by mistake.
const correctedThai="ฉันจะรอคุยกับคุณนะคะ";
if(own.some(x=>x.th===correctedThai&&x.lang==="isan")){const revised=own.map(x=>x.th===correctedThai&&x.lang==="isan"?{...x,lang:"thai"}:x);if(store(ownKey,revised))own=revised;}
const normal=s=>String(s||"").replace(/[\s\u200b.,!?！？。、「」]/g,"").toLowerCase();
const known={"ฉันคิดถึงคุณนะคะ":{ja:"あなたが恋しいです／会いたいな",ka:"チャン・キットトゥン・クン・ナ・カ"},"คิดถึงนะ":{ja:"会いたいよ／恋しいよ",ka:"キットトゥン・ナ"}};
function showTab(tab){document.querySelectorAll("main section").forEach(x=>x.classList.toggle("hide",x.id!==tab));document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab))}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
function render(){const q=$("q").value.trim().toLowerCase(),items=all().filter(x=>(!isanOnly||languageOf(x)==="isan")&&[x.ja,x.th,x.ka,x.cat].some(v=>String(v||"").toLowerCase().includes(q)));$("count").textContent=items.length+"件表示 / 全"+all().length+"件";$("results").innerHTML=items.slice(0,150).map(x=>'<article class="card"><small>'+esc(x.cat)+(languageOf(x)==='isan'?' 🌾 イサーン語':languageOf(x)==='thai'?' 🇹🇭 標準タイ語':own.some(v=>v.id===x.id)?' ❔ 未判定':'')+'</small><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><div class="row"><button data-say="'+esc(x.id)+'">🔊 発音を確認</button>'+(own.some(v=>v.id===x.id)?'<button data-edit-lang="'+esc(x.id)+'">言語を変更</button><button data-delete="'+esc(x.id)+'">削除</button>':"")+'</div></article>').join("")||"<p>一致する例文がありません</p>"}
$("q").addEventListener("input",render);$("isanOnly").addEventListener("click",()=>{isanOnly=!isanOnly;$("isanOnly").classList.toggle("active",isanOnly);render()});document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{$("q").value=b.dataset.category;render()}));
$("loverExamples").addEventListener("click",()=>{$("q").value="愛情・大切なもの";showTab("search");render()});
$("results").addEventListener("click",e=>{const say=e.target.closest("[data-say]"),del=e.target.closest("[data-delete]"),editLang=e.target.closest("[data-edit-lang]");if(editLang){const x=own.find(v=>v.id===editLang.dataset.editLang);if(x){const current=languageOf(x)==="isan"?"1":languageOf(x)==="thai"?"2":"3";const choice=prompt("言語の種類を変更：\n1 = 🌾 イサーン語（確認済み）\n2 = 標準タイ語\n3 = 未判定・共通表現",current);if(choice!==null){if(!["1","2","3"].includes(choice)){alert("1、2、3から選んでね")}else{const next=own.map(v=>v.id===x.id?{...v,lang:choice==="1"?"isan":choice==="2"?"thai":"unverified"}:v);if(store(ownKey,next)){own=next;render();findMessage()}}}}return}if(say){const x=all().find(v=>v.id===say.dataset.say);if(x&&"speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(x.th);u.lang="th-TH";u.rate=.85;speechSynthesis.speak(u)}else alert("読み上げに対応していません")}if(del&&confirm("この表現を削除しますか？")){own=own.filter(x=>x.id!==del.dataset.delete);store(ownKey,own);render()}});
function parseCSV(text){let rows=[],row=[],v="",quote=false;text=text.replace(/^\uFEFF/,"");for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){v+='"';i++}else quote=!quote}else if(c===","&&!quote){row.push(v);v=""}else if((c==="\r"||c==="\n")&&!quote){if(c==="\r"&&text[i+1]==="\n")i++;row.push(v);if(row.some(Boolean))rows.push(row);row=[];v=""}else v+=c}row.push(v);if(row.some(Boolean))rows.push(row);const head=(rows.shift()||[]).map(x=>x.trim());const idx=(...names)=>head.findIndex(x=>names.some(n=>x.toLowerCase().includes(n.toLowerCase())));const j=idx("日本語","japanese"),t=idx("イサーン語","タイ文字","thai","isan"),k=idx("カタカナ","読み方","reading"),c=idx("課","カテゴリ","category","場面");if(j<0||t<0)throw Error("CSVの日本語列またはタイ語列がありません");return rows.map((r,i)=>({id:"csv"+i,ja:r[j]||"",th:r[t]||"",ka:k<0?"":r[k]||"",cat:c<0?"例文":r[c]||"例文"})).filter(x=>x.ja&&x.th)}
async function load(){if(bundled.length>=600){render();return}try{const res=await fetch("./examples-600.csv?v=8",{cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);bundled=parseCSV(await res.text());render()}catch(e){$("count").textContent="600例文の読込に失敗しました。再接続してください";render()}}
const replySets=[
{terms:["会いたい","恋しい","คิดถึง","คิดฮอด"],items:[["優しい","ผมก็คิดถึงคุณเหมือนกันนะ ❤️","俺もFonが恋しいよ ❤️"],["甘い","อยากเจอคุณเร็ว ๆ จัง ❤️","早くFonに会いたいな ❤️"],["普段どおり","ผมก็คิดถึงนะ 😊","俺も会いたいよ 😊"]]},
{terms:["疲れ","เหนื่อย","เมื่อย"],items:[["優しい","พักผ่อนเยอะ ๆ นะ ❤️","ゆっくり休んでね ❤️"],["甘い","เป็นห่วงนะ อย่าฝืนตัวเอง ❤️","心配だよ、無理しないでね ❤️"],["普段どおり","วันนี้เหนื่อยมากไหม 😊","今日はすごく疲れた？ 😊"]]},
{terms:["ご飯","食べ","กินข้าว"],items:[["優しい","อย่าลืมกินข้าวนะ ❤️","ご飯を忘れずに食べてね ❤️"],["甘い","อยากกินข้าวด้วยกันจัง ❤️","一緒にご飯を食べたいな ❤️"],["普段どおり","ผมกินแล้ว คุณล่ะ 😊","俺は食べたよ、Fonは？ 😊"]]},
{terms:["おやすみ","寝","ฝันดี","นอน"],items:[["優しい","ฝันดีนะ พักผ่อนเยอะ ๆ ❤️","おやすみ、ゆっくり休んでね ❤️"],["甘い","ฝันดีนะ คิดถึงคุณ ❤️","おやすみ、Fonが恋しいよ ❤️"],["普段どおり","ฝันดีนะ 😊","おやすみ 😊"]]},
{terms:["愛して","รัก","ฮัก"],items:[["優しい","ผมก็รักคุณนะ ❤️","俺もFonを愛してるよ ❤️"],["甘い","รักคุณมาก ๆ เลยนะ ❤️","Fonのことが大好きだよ ❤️"],["普段どおり","รักเหมือนกันนะ 😊","俺も好きだよ 😊"]]}
];
function showReplies(msg,meaning){const box=$("replySuggestions");const hay=normal(msg+" "+meaning);const match=replySets.find(group=>group.terms.some(t=>hay.includes(normal(t))));if(!match){box.style.display="block";box.innerHTML="<b>♡ 返信候補</b><p class='note'>この文章に合う返信はまだ登録されていません。意味を確認してから、日本語の返信を作ってね。無関係な返信を自動表示しないようにしています。</p>";return}box.style.display="block";box.innerHTML="<b>♡ おすすめの返信3種類</b><p class='note'>登録済みの定型返信です。相手の文脈に合うか確認して送ってね。</p>"+match.items.map((v,i)=>'<div class="card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p>'+esc(v[2])+'</p><button data-reply-index="'+i+'">この返信をコピー</button></div>').join("");box.querySelectorAll("[data-reply-index]").forEach(b=>b.addEventListener("click",async()=>{const v=match.items[Number(b.dataset.replyIndex)];try{await navigator.clipboard.writeText(v[1]);b.textContent="コピーしました ✓"}catch{prompt("長押ししてコピーしてください",v[1])}}))}
function findMessage(){const msg=$("msgIn").value.trim(),out=$("translationResult"),save=$("translationSave");$("translationStatus").textContent="";if(!msg){out.style.display="none";save.style.display="none";$("replySuggestions").style.display="none";return}out.style.display="block";save.style.display="block";const n=normal(msg);const fon=own.filter(x=>(String(x.cat||"").startsWith("Fon辞書")||x.cat==="💜Fon🩷")&&normal(x.th)===n);const exact=fon.length?fon:all().filter(x=>normal(x.th)===n);const k=known[msg]||known[n];let candidate=null;if(fon.length||exact.length){candidate=exact[0];out.innerHTML="<b>"+(fon.length?"♡ Fon辞書で確認済み":"登録例文と一致")+"</b><div class='thai'>"+esc(msg)+"</div><p>"+esc(candidate.ja)+"</p><p class='kana'>"+esc(candidate.ka||"")+"</p>"}else if(k){candidate=k;out.innerHTML="<b>日本語訳の候補</b><div class='thai'>"+esc(msg)+"</div><p>"+esc(k.ja)+"</p><p class='kana'>"+esc(k.ka)+"</p><small>文脈によって意味は変わります。</small>"}else{const close=all().map(x=>({x,t:normal(x.th)})).filter(v=>v.t.length>=4&&(n.includes(v.t)||v.t.includes(n))).slice(0,4);out.innerHTML=close.length?"<b>似た表現（全文訳ではありません）</b>"+close.map(v=>"<p>"+esc(v.x.th)+"： "+esc(v.x.ja)+"</p>").join("")+"<p class='note'>下の日本語訳は空欄です。意味を確認してから保存してください。</p>":"<b>まだ辞書にない文章です</b><p>Google翻訳で確認し、下に正しい日本語訳を入力すると次回から自動表示できます。</p>"}$("translationJa").value=candidate?candidate.ja:"";$("translationKana").value=candidate?candidate.ka||"":"";showReplies(msg,candidate?candidate.ja:"")}
$("msgIn").addEventListener("input",findMessage);
$("translationAdopt").addEventListener("click",()=>{const th=$("msgIn").value.trim(),ja=$("translationJa").value.trim(),ka=$("translationKana").value.trim();if(!th||!ja){$("translationStatus").textContent="タイ語と日本語訳が必要です";return}if(!confirm("日本語の意味を確認しましたか？ 💜Fon🩷 に登録しますか？"))return;own=own.filter(x=>!((String(x.cat||"").startsWith("Fon辞書")||x.cat==="💜Fon🩷")&&normal(x.th)===normal(th)));own.push({id:"fon"+Date.now(),th,ja,ka,cat:"💜Fon🩷"});if(store(ownKey,own)){$("translationStatus").textContent="Fon辞書に保存しました。次回からこの訳を優先します。";render();findMessage();$("translationStatus").textContent="Fon辞書に保存しました。次回からこの訳を優先します。"}});
$("lookupMsg").addEventListener("click",findMessage);
$("pasteMsg").addEventListener("click",async()=>{try{if(!navigator.clipboard||!navigator.clipboard.readText)throw Error("unsupported");const value=await navigator.clipboard.readText();if(!value.trim()){$("pasteStatus").textContent="コピーされた文章がありません";return}$("msgIn").value=value;findMessage();$("pasteStatus").textContent="LINEの文章を貼り付けました"}catch{$("pasteStatus").textContent="iPhoneの設定で自動貼り付けできない場合は、上の入力欄を長押しして「ペースト」を選んでね。";$("msgIn").focus()}});
$("askTsuu").addEventListener("click",async()=>{const msg=$("msgIn").value.trim();if(!msg){$("pasteStatus").textContent="先にFonの文章を貼り付けてね";return}const promptText="次のタイ語・イサーン語の短文を日本語で翻訳してください。私はタイ文字を読めません。①自然な日本語訳 ②単語ごとの意味 ③カタカナ読み ④Fonへの返信を「優しい・甘い・普段どおり」の3種類（各タイ文字・日本語訳・カタカナ読み）で提案してください。意味が曖昧なら断定せず、文脈確認が必要と伝えてください。\\n\\nFonからの文章：\\n"+msg;try{await navigator.clipboard.writeText(promptText);$("pasteStatus").textContent="相談文をコピーしました。ChatGPTを開いて貼り付けてね。";if(confirm("相談文をコピーしました。ChatGPTを開きますか？"))window.open("https://chatgpt.com/","_blank","noopener")}catch{$("pasteStatus").textContent="コピーできませんでした。下に相談文を表示します。長押ししてコピーしてね。";$("replyJa").value=promptText}});
function google(text,sl,tl){if(!text.trim()){alert("文章を入力してください");return}location.href="https://translate.google.com/?sl="+sl+"&tl="+tl+"&text="+encodeURIComponent(text)+"&op=translate"}
$("externalThai").addEventListener("click",()=>google($("msgIn").value,"auto","ja"));
$("replyTranslate").addEventListener("click",()=>google($("replyJa").value,"ja","th"));
$("save").addEventListener("click",()=>{const x={id:"own"+Date.now(),ja:$("ja").value.trim(),th:$("th").value.trim(),ka:$("ka").value.trim(),cat:$("cat").value.trim()||"自分の単語"};if(!x.ja||!x.th){alert("日本語とタイ文字を入力してください");return}own.push(x);if(store(ownKey,own)){["ja","th","ka","cat"].forEach(k=>$(k).value="");render();alert("保存しました")}});
function download(name,data,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([data],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
$("export").addEventListener("click",()=>download("isan-love-backup.json",JSON.stringify(own,null,2),"application/json"));
$("csvExport").addEventListener("click",()=>{const q=s=>'"'+String(s||"").replace(/"/g,'""')+'"';download("isan-love.csv",["日本語,イサーン語,カタカナ,カテゴリ",...all().map(x=>[x.ja,x.th,x.ka,x.cat].map(q).join(","))].join("\r\n"),"text/csv;charset=utf-8")});
$("import").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{let rows;if(file.name.endsWith(".json")){const v=JSON.parse(await file.text());rows=(Array.isArray(v)?v:v.entries||[]).map(x=>({ja:x.ja||x["日本語"]||"",th:x.th||x["イサーン語"]||"",ka:x.ka||"",cat:x.cat||"取込"}))}else rows=parseCSV(await file.text());let count=0;const existing=new Set(all().map(x=>normal(x.th)+"|"+x.ja));for(const x of rows){const id=normal(x.th)+"|"+x.ja;if(x.ja&&x.th&&!existing.has(id)){existing.add(id);own.push({...x,id:"import"+Date.now()+"_"+count++})}}store(ownKey,own);render();$("status").textContent=count+"件を追加しました"}catch(err){$("status").textContent="取込エラー："+err.message}});
function renderPending(){const el=$("pendingList");$("pendingCount").textContent="("+pending.length+"件)";el.innerHTML=pending.map((x,i)=>'<article class="card"><small>未確認</small><div class="thai">'+esc(x.th)+'</div><div class="row"><button data-review="'+i+'">つーちゃんと答え合わせ</button><button data-confirm="'+i+'">辞書に反映</button><button data-remove="'+i+'">削除</button></div></article>').join("")||"<p class='note'>まだ登録待ちの言葉はありません。</p>"}
$("pendingSave").addEventListener("click",()=>{const th=$("msgIn").value.trim();if(!th){$("pendingStatus").textContent="タイ語・イサーン語を貼り付けてね";return}if(pending.some(x=>normal(x.th)===normal(th))){$("pendingStatus").textContent="同じ文章はすでに登録待ちです";return}pending.push({th,createdAt:new Date().toISOString()});if(store(pendingKey,pending)){$("pendingStatus").textContent="答え合わせ待ちに保存しました";renderPending()}});
$("pendingList").addEventListener("click",e=>{const b=e.target.closest("[data-review],[data-confirm],[data-remove]");if(!b)return;const i=Number(b.dataset.review??b.dataset.confirm??b.dataset.remove),x=pending[i];if(!x)return;if(b.hasAttribute("data-review")){$("msgIn").value=x.th;showTab("translate");findMessage();$("msgIn").scrollIntoView({block:"start",behavior:"smooth"});return}if(b.hasAttribute("data-remove")){if(!confirm("この未確認の言葉を削除しますか？"))return;pending.splice(i,1);store(pendingKey,pending);renderPending();return}const ja=prompt("つーちゃんと確認した日本語の意味を入力",x.ja||"");if(ja===null)return;if(!ja.trim()){alert("答え合わせ後の日本語訳を入力してください");return}const ka=prompt("確認した読み方（任意・空欄でOK）",x.ka||"");if(ka===null)return;const kind=prompt("言葉の種類：1=イサーン語（確認済み） 2=標準タイ語 3=未判定","3");if(kind===null)return;if(!["1","2","3"].includes(kind)){alert("1、2、3から選んでね");return}const lang=kind==="1"?"isan":kind==="2"?"thai":"unverified";if(!confirm("答え合わせ済みとして 💜Fon🩷 辞書に反映しますか？"))return;const next=own.filter(v=>!((v.cat==="💜Fon🩷"||String(v.cat||"").startsWith("Fon辞書"))&&normal(v.th)===normal(x.th)));next.push({id:"fon"+Date.now(),th:x.th,ja:ja.trim(),ka:ka.trim(),cat:"💜Fon🩷",lang});if(!store(ownKey,next))return;own=next;pending.splice(i,1);store(pendingKey,pending);renderPending();render();alert("💜Fon🩷 辞書に反映しました")});

function parseFonData(raw){
  const s=String(raw||"").trim();if(!s)throw Error("登録データを貼り付けてね");
  let obj;
  try{obj=JSON.parse(s)}catch{}
  if(!obj){
    const lines=s.split(/\r?\n/),fields={};
    for(const line of lines){
      const m=line.match(/^\s*(タイ語|タイ文字|原文|日本語|日本語訳|カタカナ|読み方|言語|分類)\s*[：:]\s*(.*?)\s*$/);
      if(m)fields[m[1]]=m[2];
    }
    obj={th:fields["タイ語"]||fields["タイ文字"]||fields["原文"],ja:fields["日本語"]||fields["日本語訳"],ka:fields["カタカナ"]||fields["読み方"]||"",lang:fields["言語"]||fields["分類"]||"未判定"};
  }
  if(!obj||Array.isArray(obj)||typeof obj!=="object")throw Error("登録形式を確認してね");
  const th=String(obj.th||"").trim(),ja=String(obj.ja||"").trim(),ka=String(obj.ka||"").trim(),rawLang=String(obj.lang||"未判定").trim().toLowerCase();
  if(!th||!ja)throw Error("タイ語と日本語訳の両方が必要だよ");
  if(!/[\u0E00-\u0E7F]/.test(th))throw Error("タイ文字が見つからないよ");
  if(th.length>1000||ja.length>2000||ka.length>1000)throw Error("文章が長すぎるため登録できないよ");
  const lang=["thai","標準タイ語","タイ語"].includes(rawLang)?"thai":["isan","イサーン語","イサン語"].includes(rawLang)?"isan":"unverified";
  return {th,ja,ka,lang};
}
function registerFonData(){
  const status=$("fonImportStatus");let data;
  try{data=parseFonData($("fonImportText").value)}catch(e){status.textContent=e.message;return}
  const langName=data.lang==="isan"?"イサーン語":data.lang==="thai"?"標準タイ語":"未判定";
  if(!confirm("次の内容で辞書に登録する？\n\n"+data.th+"\n"+data.ja+"\n"+data.ka+"\n分類："+langName+"\n\n同じFonの文章がある場合は更新します。"))return;
  const next=own.filter(v=>!((v.cat==="💜Fon🩷"||String(v.cat||"").startsWith("Fon辞書"))&&normal(v.th)===normal(data.th)));
  next.push({id:"fon"+Date.now(),...data,cat:"💜Fon🩷"});
  if(!store(ownKey,next))return;
  own=next;pending=pending.filter(x=>normal(x.th)!==normal(data.th));store(pendingKey,pending);
  $("msgIn").value=data.th;renderPending();render();findMessage();
  status.textContent="💜 Fonの辞書に登録したよ！ 辞書タブの「💜Fon🩷」で確認できるよ。";
}
$("fonImportButton").addEventListener("click",registerFonData);
try{
 const hash=location.hash.startsWith("#fon=")?location.hash.slice(5):"";
 if(hash){
  const data=parseFonData(decodeURIComponent(hash));
  $("fonImportText").value=JSON.stringify(data,null,2);
  showTab("translate");$("fonImportStatus").textContent="つーちゃんの翻訳を読み込んだよ。内容を確認して登録してね。";
  history.replaceState(null,"",location.pathname+location.search);
 }
}catch(e){$("fonImportStatus").textContent="共有された翻訳データを読み取れませんでした："+e.message}

renderPending();
render();load();
// Data is stored separately in localStorage and is never reset by app updates.
const APP_VERSION=26;
let updateBusy=false;
async function checkUpdate(){
 if(updateBusy||!navigator.onLine||document.hidden)return;
 updateBusy=true;
 try{
  const response=await fetch("./index.html?update_check="+Date.now(),{cache:"no-store"});
  if(!response.ok)return;
  const match=(await response.text()).match(/app[.]js[?]v=([0-9]+)/);
  if(!match||Number(match[1])<=APP_VERSION)return;
  const version=match[1];
  if(sessionStorage.getItem("isanlove_reload_target")===version)return;
  sessionStorage.setItem("isanlove_reload_target",version);
  const url=new URL(location.href);
  url.searchParams.set("app_update",version);
  location.replace(url.href);
 }catch(e){}finally{updateBusy=false}
}
if("serviceWorker" in navigator){
 navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>{
  reg.update().catch(()=>{});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden){reg.update().catch(()=>{});checkUpdate()}});
  window.addEventListener("focus",()=>{reg.update().catch(()=>{});checkUpdate()});
 }).catch(()=>{});
}
window.addEventListener("pageshow",checkUpdate);
checkUpdate();
})();