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

const googleNotesKey="isanlove_google_notes_v1";
let googleNotes=get(googleNotesKey,[]);
const specialReplies={
 "ฉันจะรอคุยกับคุณนะคะ":[
 ["優しい","ผมก็อยากคุยกับคุณนะครับ","僕もあなたと話したいよ","ポム ゴー ヤーク クイ ガップ クン ナ クラップ"],
 ["甘い","ผมก็รอคุยกับคุณเหมือนกันนะ คิดถึงจัง 🩷","僕も話せるのを待ってるよ。恋しいな🩷","ポム ゴー ロー クイ ガップ クン ムアン ガン ナ キットゥン ジャン"],
 ["普段どおり","โอเค เดี๋ยวคุยกันนะ 😊","わかった、あとで話そうね😊","オーケー ディアオ クイ ガン ナ"]
 ],
 "ต่อไปนี้ ฉันจะเป็นคนเดียวที่เข้าใจสิ่งที่คุณพูดเองนะคะ 🩷":[
 ["優しい","ขอบคุณนะครับ ผมดีใจมากที่คุณพยายามเข้าใจผม 🩷","僕を理解しようとしてくれてありがとう。すごく嬉しいよ🩷","コープ クン ナ クラップ ポム ディー ジャイ マーク ティー クン パヤーヤーム カオ ジャイ ポム"],
 ["甘い","ผมก็อยากเป็นคนที่เข้าใจคุณมากที่สุดเหมือนกันนะ รักคุณนะ 🩷","僕も君を誰よりも理解したい。愛してるよ🩷","ポム ゴー ヤーク ペン コン ティー カオ ジャイ クン マーク ティー スット ムアン ガン ナ ラック クン ナ"],
 ["普段どおり","ดีใจจังครับ เรามาค่อย ๆ เรียนรู้กันนะ 😊","嬉しいな。少しずつお互いを知っていこうね😊","ディー ジャイ ジャン クラップ ラオ マー コイ コイ リアン ルー ガン ナ"]
 ]
};
const homeQuestionReplies=[
 ["🏠 帰宅済み・優しい","ถึงบ้านแล้วครับ ขอบคุณที่เป็นห่วงนะ ❤️","もう家に着いたよ。心配してくれてありがとう❤️","トゥン・バーン・レーオ・クラップ コープクン・ティー・ペンフアン・ナ"],
 ["🏠 帰宅済み・甘い","ถึงบ้านแล้วครับ ตอนนี้คิดถึงคุณจังเลย ❤️","もう家に着いたよ。今すごくFonが恋しいよ❤️","トゥン・バーン・レーオ・クラップ トーンニー・キットゥン・クン・ジャン・ルーイ"],
 ["🏠 帰宅済み・普段どおり","ใช่ครับ กลับถึงบ้านแล้ว 😊","うん、もう家に帰ったよ😊","チャイ・クラップ グラップ・トゥン・バーン・レーオ"],
 ["🚗 まだ帰宅前・優しい","ยังไม่ถึงบ้านครับ ไม่ต้องห่วงนะ ❤️","まだ家に着いてないよ。心配しないでね❤️","ヤン・マイ・トゥン・バーン・クラップ マイ・トン・フアン・ナ"],
 ["🚗 まだ帰宅前・甘い","ยังไม่ถึงบ้านครับ ถึงบ้านแล้วจะรีบทักหานะ คิดถึงคุณ ❤️","まだ帰ってないよ。着いたらすぐ連絡するね。Fonが恋しいよ❤️","ヤン・マイ・トゥン・バーン・クラップ トゥン・バーン・レーオ・ジャ・リープ・タック・ハー・ナ キットゥン・クン"],
 ["🚗 まだ帰宅前・普段どおり","ยังไม่ถึงบ้านครับ 😊","まだ家に着いてないよ😊","ヤン・マイ・トゥン・バーン・クラップ"]
];
function isHomeQuestion(msg){return /กลับบ้านแล้วใช่ไหม|ถึงบ้านแล้วใช่ไหม|กลับถึงบ้านแล้วหรือยัง|ถึงบ้านหรือยัง/.test(normal(msg))}
function renderHomeReplies(replies,id,attr){
 return '<p class="note">今の状況に合う方を選んでね。</p><h3>🏠 もう家に帰った</h3>'+
 replies.slice(0,3).map((v,i)=>'<div class="reply-card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p class="kana">'+esc(v[3])+'</p><p>'+esc(v[2])+'</p><button '+attr+'="'+esc(id)+'" data-reply-no="'+i+'">📋 この返信をコピー</button></div>').join("")+
 '<h3>🚗 まだ家に帰っていない</h3>'+
 replies.slice(3).map((v,i)=>'<div class="reply-card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p class="kana">'+esc(v[3])+'</p><p>'+esc(v[2])+'</p><button '+attr+'="'+esc(id)+'" data-reply-no="'+(i+3)+'">📋 この返信をコピー</button></div>').join("");
}
const scallopWorkReplies=[
 ["✅ 500kgある","มีครับ พรุ่งนี้ที่โรงสดมีหอยเชลล์ 500 กิโลกรัมครับ","あるよ。明日、生処理場にホタテ500kgあるよ","ミー・クラップ プルンニー・ティー・ローンソット・ミー・ホーイチェーン・ハーローイ・ギロクラム・クラップ"],
 ["❌ 500kgない","ไม่มีครับ พรุ่งนี้ที่โรงสดไม่มีหอยเชลล์ 500 กิโลกรัมครับ","ないよ。明日、生処理場にホタテ500kgはないよ","マイミー・クラップ プルンニー・ティー・ローンソット・マイミー・ホーイチェーン・ハーローイ・ギロクラム・クラップ"],
 ["🔎 まだ未確認","ยังไม่แน่ใจครับ เดี๋ยวผมเช็กให้แล้วบอกนะ","まだ分からないよ。確認してから教えるね","ヤン・マイ・ネー・ジャイ・クラップ ディアオ・ポム・チェック・ハイ・レーオ・ボーク・ナ"]
];
function isScallopWorkQuestion(msg){const t=normal(msg);return t.includes("โรงสด")&&t.includes("หอยเชลล์")&&t.includes("500")&&/ไหม|มั้ย/.test(t)}
function showScallopReplies(box){
 box.style.display="block";
 box.innerHTML="<b>♡ 仕事の質問への返信</b><p class='note'>実際の予定を確認して、当てはまる返信だけ送ってね。</p>"+scallopWorkReplies.map((v,i)=>'<div class="card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p class="kana">'+esc(v[3])+'</p><p>'+esc(v[2])+'</p><button data-scallop-reply="'+i+'">📋 この返信をコピー</button></div>').join("");
 box.querySelectorAll("[data-scallop-reply]").forEach(b=>b.addEventListener("click",async()=>{const v=scallopWorkReplies[Number(b.dataset.scallopReply)];try{await navigator.clipboard.writeText(v[1]);b.textContent="コピーしました ✓"}catch{prompt("長押ししてコピーしてください",v[1])}}));
}
function availableReplies(x){
 // Question intent takes priority over generic keyword matches and old stored suggestions.
 if(isScallopWorkQuestion(String(x.th||"")))return scallopWorkReplies;
 if(isHomeQuestion(String(x.th||"")))return homeQuestionReplies;
 if(isTiredQuestion(String(x.th||"")))return tiredQuestionReplies;
 if(Array.isArray(x.replies)&&x.replies.length)return x.replies;
 const special=specialReplies[String(x.th||"").trim()];
 if(special)return special;
 const hay=normal((x.th||"")+" "+(x.ja||""));
 const group=replySets.find(g=>g.terms.some(t=>hay.includes(normal(t))));
 return group?group.items.map(v=>[...v,""]):[];
}
function showFonExtras(x){
 const notes=googleNotes.filter(n=>normal(n.th)===normal(x.th));
 const replies=availableReplies(x);
 const replyHtml=isHomeQuestion(x.th)?renderHomeReplies(replies,x.id,"data-reply-copy"):replies.length?replies.map((v,i)=>'<div class="reply-card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p>'+esc(v[2])+'</p>'+(v[3]?'<p class="kana">'+esc(v[3])+'</p>':"")+'<button data-reply-copy="'+esc(x.id)+'" data-reply-no="'+i+'">📋 この返信をコピー</button></div>').join(""):'<p class="note">この文章に合う返信はまだ未登録だよ。ChatGPTで確認してね。</p>';
 const notesHtml=notes.map(n=>'<div class="reply-card"><small>'+esc(n.date||"")+'</small><p><b>検索・入力した文章：</b>'+esc(n.query)+'</p><p><b>Googleの結果：</b>'+esc(n.result)+'</p></div>').join("");
 const isFon=x.cat==="💜Fon🩷"||String(x.cat||"").startsWith("Fon辞書");
 return isFon?'<details class="fon-details"><summary>💌 返信候補・Googleの調べもの</summary><h3>♡ 返信候補</h3>'+replyHtml+'<p class="note">返信は定型候補です。意味と文脈を確認して送ってね。</p><h3>🔎 Googleで調べた記録</h3>'+(notesHtml||'<p class="note">まだ調べた記録はありません。</p>')+'<label>Googleで入力・検索した文章<textarea data-google-query="'+esc(x.id)+'" rows="2">'+esc(x.th)+'</textarea></label><label>Google翻訳・検索の結果（コピーして貼り付け）<textarea data-google-result="'+esc(x.id)+'" rows="3" placeholder="調べた日本語訳やメモを貼り付けてね"></textarea></label><button data-google-save="'+esc(x.id)+'">💾 Googleの調べものを保存</button></details>':"";
}


const localDay=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const validDay=s=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(new Date(s+"T12:00:00").getTime())&&new Date(s+"T12:00:00").getFullYear()===Number(s.slice(0,4))&&new Date(s+"T12:00:00").getMonth()+1===Number(s.slice(5,7))&&new Date(s+"T12:00:00").getDate()===Number(s.slice(8,10));
const entryDay=x=>validDay(x.savedDate)?x.savedDate:(typeof x.createdAt==="string"&&validDay(x.createdAt.slice(0,10))?x.createdAt.slice(0,10):"");
let calMonth=localDay().slice(0,7),calSelected=localDay();
const fonEntries=()=>own;
function setFonDate(id,date){
 if(!validDay(date)){alert("正しい年月日（例：2026-11-03）を入力してね");return}
 const next=own.map(x=>x.id===id?{...x,savedDate:date}:x);
 if(store(ownKey,next)){own=next;render();renderCalendar()}
}
function renderCalendar(){
 const [year,month]=calMonth.split("-").map(Number);
 $("calTitle").textContent=year+"年"+month+"月";
 const start=new Date(year,month-1,1).getDay(),last=new Date(year,month,0).getDate();
 const entries=fonEntries(),counts={};
 for(const x of entries){const date=entryDay(x);if(date)counts[date]=(counts[date]||0)+1}
 let grid="";
 for(let i=0;i<start;i++)grid+='<span></span>';
 for(let d=1;d<=last;d++){
  const date=calMonth+"-"+String(d).padStart(2,"0"),isAnniversary=month===11&&d===3;
  grid+='<button class="cal-day'+(date===calSelected?' selected':'')+(isAnniversary?' anniversary':'')+'" data-cal-day="'+date+'" aria-label="'+date+(isAnniversary?" 記念日":"")+'">'+d+(isAnniversary?'<span class="cal-dot">💜記念日</span>':counts[date]?'<span class="cal-dot">♥ '+counts[date]+'件</span>':'')+'</button>';
 }
 $("calGrid").innerHTML=grid;
 const isAnniversary=calSelected.slice(5)==="11-03";
 $("calSelectedTitle").textContent=calSelected.replaceAll("-","/")+(isAnniversary?" 💜 記念日":"");
 const selected=entries.filter(x=>entryDay(x)===calSelected);
 $("calEntries").innerHTML=selected.length?selected.map(x=>'<div class="cal-date-entry"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka||"")+'</div><p>'+esc(x.ja||"")+'</p><button data-cal-open="'+esc(x.id)+'">💌 辞書で見る</button></div>').join(""):'<p class="note">'+(isAnniversary?"💜 ふたりの大切な記念日":"この日に登録されたFonの言葉はまだないよ")+'</p>';
 const unknown=entries.filter(x=>!entryDay(x));
 $("calUndated").innerHTML=unknown.length?unknown.map(x=>'<div class="cal-date-entry"><div class="thai">'+esc(x.th)+'</div><p>'+esc(x.ja||"")+'</p><label>登録日<input type="date" data-cal-input="'+esc(x.id)+'"></label><button data-cal-set="'+esc(x.id)+'">この日付を保存</button></div>').join(""):'<p class="note">日付未設定の言葉はないよ。</p>';
}
function moveCalendar(delta){const [y,m]=calMonth.split("-").map(Number),next=new Date(y,m-1+delta,1);calMonth=next.getFullYear()+"-"+String(next.getMonth()+1).padStart(2,"0");calSelected=calMonth+"-01";renderCalendar()}
$("calPrev").addEventListener("click",()=>moveCalendar(-1));
$("calNext").addEventListener("click",()=>moveCalendar(1));
$("calGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-day]");if(btn){calSelected=btn.dataset.calDay;renderCalendar()}});
$("calUndated").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-set]");if(!btn)return;const input=Array.from($("calUndated").querySelectorAll("[data-cal-input]")).find(x=>x.dataset.calInput===btn.dataset.calSet);if(input&&input.value)setFonDate(btn.dataset.calSet,input.value);else alert("登録日を選んでね")});
$("calEntries").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-open]");if(!btn)return;const x=own.find(v=>v.id===btn.dataset.calOpen);if(x){$("q").value=x.th;showTab("search");render();$("results").scrollIntoView({block:"start"})}});

function render(){if($("calGrid"))renderCalendar();const q=$("q").value.trim().toLowerCase(),items=all().filter(x=>(!isanOnly||languageOf(x)==="isan")&&[x.ja,x.th,x.ka,x.cat].some(v=>String(v||"").toLowerCase().includes(q)));$("count").textContent=items.length+"件表示 / 全"+all().length+"件";$("results").innerHTML=items.slice(0,150).map(x=>'<article class="card"><small>'+esc(x.cat)+(languageOf(x)==='isan'?' 🌾 イサーン語':languageOf(x)==='thai'?' 🇹🇭 標準タイ語':own.some(v=>v.id===x.id)?' ❔ 未判定':'')+'</small><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><div class="row"><button data-say="'+esc(x.id)+'">🔊 発音を確認</button>'+(own.some(v=>v.id===x.id)?'<button data-edit-lang="'+esc(x.id)+'">言語を変更</button><button data-delete="'+esc(x.id)+'">削除</button>':"")+'</div>'+showFonExtras(x)+'</article>').join("")||"<p>一致する例文がありません</p>"}
$("q").addEventListener("input",render);$("isanOnly").addEventListener("click",()=>{isanOnly=!isanOnly;$("isanOnly").classList.toggle("active",isanOnly);render()});document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{$("q").value=b.dataset.category;render()}));
$("loverExamples").addEventListener("click",()=>{$("q").value="愛情・大切なもの";showTab("search");render()});
$("results").addEventListener("click",e=>{
 const replyButton=e.target.closest("[data-reply-copy]"),noteButton=e.target.closest("[data-google-save]");
 if(replyButton){
  const x=all().find(v=>v.id===replyButton.dataset.replyCopy),v=x&&availableReplies(x)[Number(replyButton.dataset.replyNo)];
  if(v){const value=v[1];if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(value).then(()=>replyButton.textContent="コピーしました ✓").catch(()=>prompt("ここからコピーしてね",value));else prompt("ここからコピーしてね",value)}
  return;
 }
 if(noteButton){
  const x=all().find(v=>v.id===noteButton.dataset.googleSave),card=noteButton.closest(".fon-details");
  if(!x||!card)return;
  const query=card.querySelector("[data-google-query]").value.trim(),result=card.querySelector("[data-google-result]").value.trim();
  if(!query||!result){alert("検索した文章と結果を入力してね");return}
  if(query.length>2000||result.length>5000){alert("文章が長すぎるよ");return}
  const next=[...googleNotes,{th:x.th,query,result,date:new Date().toLocaleDateString("ja-JP")}];
  if(store(googleNotesKey,next)){googleNotes=next;render();alert("Googleの調べものを保存したよ。辞書カードで見返せるよ")}
  return;
 }
const say=e.target.closest("[data-say]"),del=e.target.closest("[data-delete]"),editLang=e.target.closest("[data-edit-lang]");if(editLang){const x=own.find(v=>v.id===editLang.dataset.editLang);if(x){const current=languageOf(x)==="isan"?"1":languageOf(x)==="thai"?"2":"3";const choice=prompt("言語の種類を変更：\n1 = 🌾 イサーン語（確認済み）\n2 = 標準タイ語\n3 = 未判定・共通表現",current);if(choice!==null){if(!["1","2","3"].includes(choice)){alert("1、2、3から選んでね")}else{const next=own.map(v=>v.id===x.id?{...v,lang:choice==="1"?"isan":choice==="2"?"thai":"unverified"}:v);if(store(ownKey,next)){own=next;render();findMessage()}}}}return}if(say){const x=all().find(v=>v.id===say.dataset.say);if(x&&"speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(x.th);u.lang="th-TH";u.rate=.85;speechSynthesis.speak(u)}else alert("読み上げに対応していません")}if(del&&confirm("この表現を削除しますか？")){own=own.filter(x=>x.id!==del.dataset.delete);store(ownKey,own);render()}});
function parseCSV(text){let rows=[],row=[],v="",quote=false;text=text.replace(/^\uFEFF/,"");for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){v+='"';i++}else quote=!quote}else if(c===","&&!quote){row.push(v);v=""}else if((c==="\r"||c==="\n")&&!quote){if(c==="\r"&&text[i+1]==="\n")i++;row.push(v);if(row.some(Boolean))rows.push(row);row=[];v=""}else v+=c}row.push(v);if(row.some(Boolean))rows.push(row);const head=(rows.shift()||[]).map(x=>x.trim());const idx=(...names)=>head.findIndex(x=>names.some(n=>x.toLowerCase().includes(n.toLowerCase())));const j=idx("日本語","japanese"),t=idx("イサーン語","タイ文字","thai","isan"),k=idx("カタカナ","読み方","reading"),c=idx("課","カテゴリ","category","場面");if(j<0||t<0)throw Error("CSVの日本語列またはタイ語列がありません");return rows.map((r,i)=>({id:"csv"+i,ja:r[j]||"",th:r[t]||"",ka:k<0?"":r[k]||"",cat:c<0?"例文":r[c]||"例文"})).filter(x=>x.ja&&x.th)}
async function load(){if(bundled.length>=600){render();return}try{const res=await fetch("./examples-600.csv?v=8",{cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);bundled=parseCSV(await res.text());render()}catch(e){$("count").textContent="600例文の読込に失敗しました。再接続してください";render()}}
const replySets=[
{terms:["会いたい","恋しい","คิดถึง","คิดฮอด"],items:[["優しい","ผมก็คิดถึงคุณเหมือนกันนะ ❤️","俺もFonが恋しいよ ❤️"],["甘い","อยากเจอคุณเร็ว ๆ จัง ❤️","早くFonに会いたいな ❤️"],["普段どおり","ผมก็คิดถึงนะ 😊","俺も会いたいよ 😊"]]},
{terms:["疲れ","เหนื่อย","เมื่อย"],items:[["優しい","พักผ่อนเยอะ ๆ นะ ❤️","ゆっくり休んでね ❤️"],["甘い","เป็นห่วงนะ อย่าฝืนตัวเอง ❤️","心配だよ、無理しないでね ❤️"],["普段どおり","วันนี้เหนื่อยมากไหม 😊","今日はすごく疲れた？ 😊"]]},
{terms:["ご飯","食べ","กินข้าว"],items:[["優しい","อย่าลืมกินข้าวนะ ❤️","ご飯を忘れずに食べてね ❤️"],["甘い","อยากกินข้าวด้วยกันจัง ❤️","一緒にご飯を食べたいな ❤️"],["普段どおり","ผมกินแล้ว คุณล่ะ 😊","俺は食べたよ、Fonは？ 😊"]]},
{terms:["おやすみ","寝","ฝันดี","นอน"],items:[["優しい","ฝันดีนะ พักผ่อนเยอะ ๆ ❤️","おやすみ、ゆっくり休んでね ❤️"],["甘い","ฝันดีนะ คิดถึงคุณ ❤️","おやすみ、Fonが恋しいよ ❤️"],["普段どおり","ฝันดีนะ 😊","おやすみ 😊"]]},
{terms:["愛して","รัก","ฮัก"],items:[["優しい","ผมก็รักคุณนะ ❤️","俺もFonを愛してるよ ❤️"],["甘い","รักคุณมาก ๆ เลยนะ ❤️","Fonのことが大好きだよ ❤️"],["普段どおり","รักเหมือนกันนะ 😊","俺も好きだよ 😊"]]}
];
const tiredQuestionReplies=[
 ["優しい","เหนื่อยนิดหน่อยครับ แต่ไม่เป็นไรนะ ขอบคุณที่เป็นห่วง ❤️","少し疲れたけど大丈夫だよ。心配してくれてありがとう❤️","ヌアイ・ニットノイ・クラップ テー・マイペンライ・ナ コープクン・ティー・ペンフアン"],
 ["甘い","เหนื่อยครับ แต่พอได้คุยกับคุณก็หายเหนื่อยเลย ❤️","疲れたけど、Fonと話せたら疲れも吹き飛ぶよ❤️","ヌアイ・クラップ テー・ポー・ダイ・クイ・ガップ・クン・ゴー・ハーイ・ヌアイ・ルーイ"],
 ["普段どおり","ไม่ค่อยเหนื่อยครับ แล้วคุณล่ะ 😊","そんなに疲れてないよ。Fonは？😊","マイ・コイ・ヌアイ・クラップ レーオ・クン・ラ"]
];
function isTiredQuestion(msg){const t=normal(msg);return /เหนื่อย(?:มาก)?ไหม|เหนื่อย(?:มาก)?มั้ย|เมื่อยบ่|เหนื่อยหรือเปล่า/.test(t)}
function renderTiredQuestionReplies(box){
 box.style.display="block";
 box.innerHTML="<b>♡ Fonの質問への返信3種類</b><p class='note'>「疲れた？」への返事です。自分の体調に合うものを選んでね。</p>"+tiredQuestionReplies.map((v,i)=>'<div class="card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p class="kana">'+esc(v[3])+'</p><p>'+esc(v[2])+'</p><button data-tired-reply="'+i+'">📋 この返信をコピー</button></div>').join("");
 box.querySelectorAll("[data-tired-reply]").forEach(b=>b.addEventListener("click",async()=>{const v=tiredQuestionReplies[Number(b.dataset.tiredReply)];try{await navigator.clipboard.writeText(v[1]);b.textContent="コピーしました ✓"}catch{prompt("長押ししてコピーしてください",v[1])}}))
}
function showReplies(msg,meaning){const box=$("replySuggestions");if(isScallopWorkQuestion(msg)){showScallopReplies(box);return}if(isHomeQuestion(msg)){box.style.display="block";box.innerHTML="<b>♡ 帰宅状況に合わせた返信</b>"+renderHomeReplies(homeQuestionReplies,"home","data-home-reply");box.querySelectorAll("[data-home-reply]").forEach(b=>b.addEventListener("click",async()=>{const v=homeQuestionReplies[Number(b.dataset.replyNo)];try{await navigator.clipboard.writeText(v[1]);b.textContent="コピーしました ✓"}catch{prompt("長押ししてコピーしてください",v[1])}}));return}if(isTiredQuestion(msg)){renderTiredQuestionReplies(box);return}const hay=normal(msg+" "+meaning);const match=replySets.find(group=>group.terms.some(t=>hay.includes(normal(t))));if(!match){box.style.display="block";box.innerHTML="<b>♡ 返信候補</b><p class='note'>この文章に合う返信はまだ登録されていません。意味を確認してから、日本語の返信を作ってね。無関係な返信を自動表示しないようにしています。</p>";return}box.style.display="block";box.innerHTML="<b>♡ おすすめの返信3種類</b><p class='note'>登録済みの定型返信です。相手の文脈に合うか確認して送ってね。</p>"+match.items.map((v,i)=>'<div class="card"><b>'+esc(v[0])+'</b><div class="thai">'+esc(v[1])+'</div><p>'+esc(v[2])+'</p><button data-reply-index="'+i+'">この返信をコピー</button></div>').join("");box.querySelectorAll("[data-reply-index]").forEach(b=>b.addEventListener("click",async()=>{const v=match.items[Number(b.dataset.replyIndex)];try{await navigator.clipboard.writeText(v[1]);b.textContent="コピーしました ✓"}catch{prompt("長押ししてコピーしてください",v[1])}}))}
function findMessage(){const msg=$("msgIn").value.trim(),out=$("translationResult"),save=$("translationSave");$("translationStatus").textContent="";if(!msg){out.style.display="none";save.style.display="none";$("replySuggestions").style.display="none";return}out.style.display="block";save.style.display="block";const n=normal(msg);const fon=own.filter(x=>(String(x.cat||"").startsWith("Fon辞書")||x.cat==="💜Fon🩷")&&normal(x.th)===n);const exact=fon.length?fon:all().filter(x=>normal(x.th)===n);const k=known[msg]||known[n];let candidate=null;if(fon.length||exact.length){candidate=exact[0];out.innerHTML="<b>"+(fon.length?"♡ Fon辞書で確認済み":"登録例文と一致")+"</b><div class='thai'>"+esc(msg)+"</div><p>"+esc(candidate.ja)+"</p><p class='kana'>"+esc(candidate.ka||"")+"</p>"}else if(k){candidate=k;out.innerHTML="<b>日本語訳の候補</b><div class='thai'>"+esc(msg)+"</div><p>"+esc(k.ja)+"</p><p class='kana'>"+esc(k.ka)+"</p><small>文脈によって意味は変わります。</small>"}else{const close=all().map(x=>({x,t:normal(x.th)})).filter(v=>v.t.length>=4&&(n.includes(v.t)||v.t.includes(n))).slice(0,4);out.innerHTML=close.length?"<b>似た表現（全文訳ではありません）</b>"+close.map(v=>"<p>"+esc(v.x.th)+"： "+esc(v.x.ja)+"</p>").join("")+"<p class='note'>下の日本語訳は空欄です。意味を確認してから保存してください。</p>":"<b>まだ辞書にない文章です</b><p>Google翻訳で確認し、下に正しい日本語訳を入力すると次回から自動表示できます。</p>"}$("translationJa").value=candidate?candidate.ja:"";$("translationKana").value=candidate?candidate.ka||"":"";$("translationLang").value=fon.length?languageOf(fon[0]):"unverified";showReplies(msg,candidate?candidate.ja:"")}
$("msgIn").addEventListener("input",findMessage);
$("translationAdopt").addEventListener("click",()=>{
 const th=$("msgIn").value.trim(),ja=$("translationJa").value.trim(),ka=$("translationKana").value.trim(),lang=$("translationLang").value;
 const status=$("translationStatus");
 if(!th||!ja){status.textContent="タイ語と日本語訳が必要です";return}
 if(!["isan","thai","unverified"].includes(lang)){status.textContent="言語の分類を選んでね";return}
 const previous=own.find(x=>(x.cat==="💜Fon🩷"||String(x.cat||"").startsWith("Fon辞書"))&&normal(x.th)===normal(th));
 if(previous&&previous.ja===ja&&previous.ka===ka&&languageOf(previous)===lang){status.textContent="💜Fon🩷 辞書に登録済みだよ";return}
 if(!confirm("答え合わせした内容を 💜Fon🩷 辞書に保存する？"))return;
 const next=own.filter(x=>!((x.cat==="💜Fon🩷"||String(x.cat||"").startsWith("Fon辞書"))&&normal(x.th)===normal(th)));
 next.push({id:previous?.id||"fon"+Date.now(),th,ja,ka,lang,cat:"💜Fon🩷",savedDate:previous?entryDay(previous):localDay()});
 if(!store(ownKey,next))return;
 own=next;
 const remaining=pending.filter(x=>normal(x.th)!==normal(th));
 if(store(pendingKey,remaining))pending=remaining;
 renderPending();render();findMessage();
 status.textContent="💜Fon🩷 に保存したよ！ 次回からこの日本語訳を優先するね。";
});

$("lookupMsg").addEventListener("click",findMessage);
$("pasteMsg").addEventListener("click",async()=>{try{if(!navigator.clipboard||!navigator.clipboard.readText)throw Error("unsupported");const value=await navigator.clipboard.readText();if(!value.trim()){$("pasteStatus").textContent="コピーされた文章がありません";return}$("msgIn").value=value;findMessage();$("pasteStatus").textContent="LINEの文章を貼り付けました"}catch{$("pasteStatus").textContent="iPhoneの設定で自動貼り付けできない場合は、上の入力欄を長押しして「ペースト」を選んでね。";$("msgIn").focus()}});
$("askTsuu").addEventListener("click",async()=>{const msg=$("msgIn").value.trim();if(!msg){$("pasteStatus").textContent="先にFonの文章を貼り付けてね";return}const promptText="次のタイ語・イサーン語の短文を日本語で翻訳してください。私はタイ文字を読めません。①自然な日本語訳 ②単語ごとの意味 ③カタカナ読み ④Fonへの返信を「優しい・甘い・普段どおり」の3種類（各タイ文字・日本語訳・カタカナ読み）で提案してください。意味が曖昧なら断定せず、文脈確認が必要と伝えてください。\\n\\nFonからの文章：\\n"+msg;try{await navigator.clipboard.writeText(promptText);$("pasteStatus").textContent="相談文をコピーしました。ChatGPTを開いて貼り付けてね。";if(confirm("相談文をコピーしました。ChatGPTを開きますか？"))window.open("https://chatgpt.com/","_blank","noopener")}catch{$("pasteStatus").textContent="コピーできませんでした。下に相談文を表示します。長押ししてコピーしてね。";$("replyJa").value=promptText}});
function google(text,sl,tl){if(!text.trim()){alert("文章を入力してください");return}location.href="https://translate.google.com/?sl="+sl+"&tl="+tl+"&text="+encodeURIComponent(text)+"&op=translate"}
$("externalThai").addEventListener("click",()=>google($("msgIn").value,"auto","ja"));
$("replyTranslate").addEventListener("click",()=>google($("replyJa").value,"ja","th"));
$("save").addEventListener("click",()=>{const x={id:"own"+Date.now(),ja:$("ja").value.trim(),th:$("th").value.trim(),ka:$("ka").value.trim(),cat:$("cat").value.trim()||"自分の単語",savedDate:localDay()};if(!x.ja||!x.th){alert("日本語とタイ文字を入力してください");return}own.push(x);if(store(ownKey,own)){["ja","th","ka","cat"].forEach(k=>$(k).value="");render();alert("保存しました")}});
async function safeBackup(){const payload={format:"isan-love-backup-v2",exportedAt:new Date().toISOString(),entries:own,pending:pending,googleNotes:googleNotes};const content=JSON.stringify(payload,null,2),name="ISAN-LOVE-Fon-"+new Date().toISOString().slice(0,10)+".json";const status=$("safeBackupStatus");try{const file=new File([content],name,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"ISAN LOVE バックアップ"});status.textContent="共有が完了したら「ファイルに保存」を確認してね。";return}}catch(e){if(e.name==="AbortError"){status.textContent="保存をキャンセルしました";return}}download(name,content,"application/json");status.textContent="バックアップを作成しました。「ファイル」に保存されたか確認してね。"}
$("safeBackup").addEventListener("click",safeBackup);
function download(name,data,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([data],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
$("export").addEventListener("click",()=>download("isan-love-backup.json",JSON.stringify(own,null,2),"application/json"));
$("csvExport").addEventListener("click",()=>{const q=s=>'"'+String(s||"").replace(/"/g,'""')+'"';download("isan-love.csv",["日本語,イサーン語,カタカナ,カテゴリ",...all().map(x=>[x.ja,x.th,x.ka,x.cat].map(q).join(","))].join("\r\n"),"text/csv;charset=utf-8")});
$("import").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{let rows;if(file.name.endsWith(".json")){const v=JSON.parse(await file.text());rows=(Array.isArray(v)?v:v.entries||[]).map(x=>({ja:x.ja||x["日本語"]||"",th:x.th||x["イサーン語"]||"",ka:x.ka||"",cat:x.cat||"取込",lang:x.lang||"unverified",savedDate:x.savedDate||"",createdAt:x.createdAt||""}));if(v&&v.format==="isan-love-backup-v2"&&Array.isArray(v.googleNotes)){const merged=[...googleNotes];const seen=new Set(merged.map(n=>normal(n.th)+"|"+n.query+"|"+n.result));for(const n of v.googleNotes){if(n&&typeof n.th==="string"&&typeof n.query==="string"&&typeof n.result==="string"){const key=normal(n.th)+"|"+n.query+"|"+n.result;if(!seen.has(key)){merged.push({th:n.th,query:n.query,result:n.result,date:n.date||""});seen.add(key)}}}if(!store(googleNotesKey,merged))throw Error("Googleメモの保存に失敗");googleNotes=merged} if(v&&v.format==="isan-love-backup-v2"&&Array.isArray(v.pending)){const existingPending=new Set(pending.map(x=>normal(x.th)));const merged=[...pending];for(const x of v.pending){if(x&&typeof x.th==="string"&&x.th.trim()&&!existingPending.has(normal(x.th))){merged.push({th:x.th,createdAt:x.createdAt||new Date().toISOString()});existingPending.add(normal(x.th))}}if(!store(pendingKey,merged))throw Error("確認待ちの保存に失敗");pending=merged;renderPending()}}else rows=parseCSV(await file.text());let count=0;const existing=new Set(all().map(x=>normal(x.th)+"|"+x.ja));for(const x of rows){const id=normal(x.th)+"|"+x.ja;if(x.ja&&x.th&&!existing.has(id)){existing.add(id);own.push({...x,id:"import"+Date.now()+"_"+count++})}}store(ownKey,own);render();$("status").textContent=count+"件を追加しました"}catch(err){$("status").textContent="取込エラー："+err.message}});
function renderPending(){const el=$("pendingList");$("pendingCount").textContent="("+pending.length+"件)";el.innerHTML=pending.map((x,i)=>'<article class="card"><small>未確認</small><div class="thai">'+esc(x.th)+'</div><div class="row"><button data-review="'+i+'">つーちゃんと答え合わせ</button><button data-confirm="'+i+'">辞書に反映</button><button data-remove="'+i+'">削除</button></div></article>').join("")||"<p class='note'>まだ登録待ちの言葉はありません。</p>"}
$("pendingSave").addEventListener("click",()=>{const th=$("msgIn").value.trim();if(!th){$("pendingStatus").textContent="タイ語・イサーン語を貼り付けてね";return}if(pending.some(x=>normal(x.th)===normal(th))){$("pendingStatus").textContent="同じ文章はすでに登録待ちです";return}pending.push({th,createdAt:new Date().toISOString()});if(store(pendingKey,pending)){$("pendingStatus").textContent="答え合わせ待ちに保存しました";renderPending()}});
$("pendingList").addEventListener("click",e=>{const b=e.target.closest("[data-review],[data-confirm],[data-remove]");if(!b)return;const i=Number(b.dataset.review??b.dataset.confirm??b.dataset.remove),x=pending[i];if(!x)return;if(b.hasAttribute("data-review")){$("msgIn").value=x.th;showTab("translate");findMessage();$("msgIn").scrollIntoView({block:"start",behavior:"smooth"});return}if(b.hasAttribute("data-remove")){if(!confirm("この未確認の言葉を削除しますか？"))return;pending.splice(i,1);store(pendingKey,pending);renderPending();return}const ja=prompt("つーちゃんと確認した日本語の意味を入力",x.ja||"");if(ja===null)return;if(!ja.trim()){alert("答え合わせ後の日本語訳を入力してください");return}const ka=prompt("確認した読み方（任意・空欄でOK）",x.ka||"");if(ka===null)return;const kind=prompt("言葉の種類：1=イサーン語（確認済み） 2=標準タイ語 3=未判定","3");if(kind===null)return;if(!["1","2","3"].includes(kind)){alert("1、2、3から選んでね");return}const lang=kind==="1"?"isan":kind==="2"?"thai":"unverified";if(!confirm("答え合わせ済みとして 💜Fon🩷 辞書に反映しますか？"))return;const next=own.filter(v=>!((v.cat==="💜Fon🩷"||String(v.cat||"").startsWith("Fon辞書"))&&normal(v.th)===normal(x.th)));next.push({id:"fon"+Date.now(),th:x.th,ja:ja.trim(),ka:ka.trim(),cat:"💜Fon🩷",lang,savedDate:localDay()});if(!store(ownKey,next))return;own=next;pending.splice(i,1);store(pendingKey,pending);renderPending();render();alert("💜Fon🩷 辞書に反映しました")});

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
  const previous=own.find(x=>(x.cat==="💜Fon🩷"||String(x.cat||"").startsWith("Fon辞書"))&&normal(x.th)===normal(data.th));
  next.push({id:previous?.id||"fon"+Date.now(),...data,cat:"💜Fon🩷",savedDate:previous?entryDay(previous):localDay()});
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
// Updating code never clears the private Fon dictionary in localStorage.
const APP_VERSION=34;
const updateButton=$("manualUpdate"),updateStatus=$("manualUpdateStatus");
let updateBusy=false;
async function checkUpdate(manual=false){
 if(updateBusy)return;
 if(!navigator.onLine){if(manual)updateStatus.textContent="オフラインです。通信を確認してね。";return}
 updateBusy=true;
 if(manual){updateButton.disabled=true;updateStatus.textContent="最新版を確認中…"}
 try{
  if("serviceWorker" in navigator){
   const reg=await navigator.serviceWorker.getRegistration();
   if(reg)await reg.update();
  }
  const response=await fetch("./index.html?check="+Date.now(),{cache:"no-store"});
  if(!response.ok)throw new Error("サーバーに接続できません");
  const match=(await response.text()).match(/app[.]js[?]v=([0-9]+)/);
  if(!match)throw new Error("バージョンを確認できません");
  const remote=Number(match[1]);
  if(remote>APP_VERSION){
   updateStatus.textContent="v"+remote+" が見つかりました。更新します…";
   const url=new URL(location.href);
   url.searchParams.set("app_update",String(remote));
   // Refresh app assets, not the user's saved localStorage.
   location.replace(url.href);
   return;
  }
  if(manual){
   updateStatus.textContent="確認結果：v"+remote+"。"+(remote===APP_VERSION?"最新版です。":"公開側の更新待ちです。");
  }
 }catch(e){if(manual)updateStatus.textContent="確認できませんでした："+e.message}
 finally{updateBusy=false;updateButton.disabled=false}
}
updateButton.addEventListener("click",()=>checkUpdate(true));
if("serviceWorker" in navigator){
 navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>reg.update()).catch(()=>{});
}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkUpdate()});
window.addEventListener("pageshow",()=>checkUpdate());
})();