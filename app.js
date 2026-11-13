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
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{showTab(b.dataset.tab);const menu=$("moreMenu");if(menu)menu.open=false;window.scrollTo({top:0,behavior:"smooth"})}));
document.querySelectorAll("[data-home-tab]").forEach(b=>b.addEventListener("click",()=>{showTab(b.dataset.homeTab);window.scrollTo({top:0,behavior:"smooth"})}));

document.querySelectorAll("[data-culture]").forEach(button=>button.addEventListener("click",()=>{const category=button.dataset.culture;document.querySelectorAll("[data-culture]").forEach(x=>x.classList.toggle("active",x===button));document.querySelectorAll("[data-culture-topic]").forEach(x=>{x.hidden=category!=="all"&&x.dataset.cultureTopic!==category})}));
document.querySelectorAll("[data-culture-say]").forEach(b=>b.addEventListener("click",()=>{practiceSpeak(b.dataset.cultureSay);const status=$("cultureActionStatus");if(status)status.textContent="🔊 読み上げ中（端末のタイ語音声）"}));
document.querySelectorAll("[data-culture-copy]").forEach(b=>b.addEventListener("click",async()=>{const status=$("cultureActionStatus");try{await navigator.clipboard.writeText(b.dataset.cultureCopy);if(status)status.textContent="コピーしたよ 💜"}catch{if(status)status.textContent="コピーできませんでした。タイ文字を長押ししてコピーしてね"}}));
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
const entrySource=x=>["fon","mine","unknown"].includes(x.source)?x.source:(x.cat==="💜Fon🩷"||String(x.cat||"").startsWith("Fon辞書")?"fon":"unknown");
function setEntrySource(id,source){if(!["fon","mine","unknown"].includes(source))return;const next=own.map(x=>String(x.id)===String(id)?{...x,source}:x);if(store(ownKey,next)){own=next;renderCalendar()}}
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
 for(const x of entries){const date=entryDay(x);if(date){const c=counts[date]||(counts[date]={fon:0,mine:0,unknown:0});c[entrySource(x)]++}}
 const listeningHistory=(()=>{try{return JSON.parse(localStorage.getItem("isanlove_beginner_history_v1"))||{}}catch{return {}}})();
 const listened=date=>Array.isArray(listeningHistory[date])?listeningHistory[date].map(th=>sceneLessons.find(x=>x.th===th)).filter(Boolean):[];
 let grid="";
 for(let i=0;i<start;i++)grid+='<span></span>';
 for(let d=1;d<=last;d++){
  const date=calMonth+"-"+String(d).padStart(2,"0"),isAnniversary=month===11&&d===3;
  const savedCounts=counts[date]||{fon:0,mine:0,unknown:0},fonCount=savedCounts.fon,mineCount=savedCounts.mine,unknownCount=savedCounts.unknown,listenCount=listened(date).length;
  grid+='<button class="cal-day'+(date===calSelected?' selected':'')+(isAnniversary?' anniversary':'')+(fonCount?' has-fon':'')+(mineCount||unknownCount?' has-saved':'')+(listenCount?' has-listen':'')+'" data-cal-day="'+date+'" aria-label="'+date+(isAnniversary?' 記念日':'')+(fonCount?' Fon'+fonCount+'件':'')+(mineCount?' 自分'+mineCount+'件':'')+(unknownCount?' 未分類'+unknownCount+'件':'')+(listenCount?' 聞き流し'+listenCount+'語':'')+'">'+d+(isAnniversary?'<span class="cal-dot">💜記念日</span>':'')+(fonCount?'<span class="cal-dot cal-dot-fon">💗'+fonCount+'</span>':'')+(mineCount?'<span class="cal-dot cal-dot-mine">📝'+mineCount+'</span>':'')+(unknownCount?'<span class="cal-dot cal-dot-unknown">❔'+unknownCount+'</span>':'')+(listenCount?'<span class="cal-dot cal-dot-listen">🎧'+listenCount+'</span>':'')+'</button>';
 }
 $("calGrid").innerHTML=grid;
 const isAnniversary=calSelected.slice(5)==="11-03";
 $("calSelectedTitle").textContent=calSelected.replaceAll("-","/")+(isAnniversary?" 💜 記念日":"");
 const selected=entries.filter(x=>entryDay(x)===calSelected);
 $("calEntries").innerHTML=selected.length?selected.map(x=>'<div class="cal-date-entry"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka||"")+'</div><p>'+esc(x.ja||"")+'</p><label>保存元<select data-cal-source="'+esc(x.id)+'"><option value="fon"'+(entrySource(x)==="fon"?' selected':'')+'>💗 FonからのLINE</option><option value="mine"'+(entrySource(x)==="mine"?' selected':'')+'>📝 自分で登録した言葉</option><option value="unknown"'+(entrySource(x)==="unknown"?' selected':'')+'>❔ 未分類</option></select></label><button data-cal-open="'+esc(x.id)+'">📖 辞書で見る</button></div>').join(""):'<p class="note">'+(isAnniversary?"💜 ふたりの大切な記念日":"この日に保存された言葉はまだないよ")+'</p>';
 const heard=listened(calSelected);
 $("calListening").innerHTML=heard.length?'<p class="note">🎧 この日に聞いた '+heard.length+'フレーズ</p><div class="row"><button id="calListenAll">▶️ この日の言葉を連続再生</button></div>'+heard.map((x,i)=>'<div class="cal-date-entry"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka||"")+'</div><p>'+esc(x.ja||"")+'</p><button data-cal-listen="'+i+'">🔊 もう一度聞く</button></div>').join(""):'<p class="note">この日の聞き流し履歴はまだないよ。</p>'+(calSelected==="2026-11-13"?'<div class="card"><p>💜 11月13日に最初に流した3語は、旧バージョンでは日付が保存されていませんでした。</p><p class="note">最初の3語（愛してるよ・会いたいよ・おやすみ）を、この日の履歴として補登録できます。実際の再生記録を復元するものではありません。</p><button id="calRestoreFirst3">＋ 最初の3語を11月13日に登録</button></div>':'');
 const unknown=entries.filter(x=>!entryDay(x));
 $("calUndated").innerHTML=unknown.length?unknown.map(x=>'<div class="cal-date-entry"><div class="thai">'+esc(x.th)+'</div><p>'+esc(x.ja||"")+'</p><label>登録日<input type="date" data-cal-input="'+esc(x.id)+'"></label><button data-cal-set="'+esc(x.id)+'">この日付を保存</button></div>').join(""):'<p class="note">日付未設定の言葉はないよ。</p>';
}
function moveCalendar(delta){const [y,m]=calMonth.split("-").map(Number),next=new Date(y,m-1+delta,1);calMonth=next.getFullYear()+"-"+String(next.getMonth()+1).padStart(2,"0");calSelected=calMonth+"-01";renderCalendar()}
$("calPrev").addEventListener("click",()=>moveCalendar(-1));
$("calNext").addEventListener("click",()=>moveCalendar(1));
$("calGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-day]");if(btn){calSelected=btn.dataset.calDay;renderCalendar()}});
$("calUndated").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-set]");if(!btn)return;const input=Array.from($("calUndated").querySelectorAll("[data-cal-input]")).find(x=>x.dataset.calInput===btn.dataset.calSet);if(input&&input.value)setFonDate(btn.dataset.calSet,input.value);else alert("登録日を選んでね")});
$("calListening").addEventListener("click",e=>{
 if(e.target.closest("#calRestoreFirst3")){
  const key="isanlove_beginner_history_v1",date="2026-11-13";
  let history={};try{history=JSON.parse(localStorage.getItem(key))||{}}catch{}
  const original=[sceneLessons[1].th,sceneLessons[0].th,sceneLessons[4].th];
  history[date]=Array.from(new Set([...(Array.isArray(history[date])?history[date]:[]),...original]));
  try{localStorage.setItem(key,JSON.stringify(history));beginnerHistory=history;renderCalendar();beginnerHistoryRender()}catch{alert("保存できませんでした。端末の保存設定を確認してね")}
  return;
 }

 const heard=(()=>{try{const h=JSON.parse(localStorage.getItem("isanlove_beginner_history_v1"))||{};return (Array.isArray(h[calSelected])?h[calSelected]:[]).map(th=>sceneLessons.find(x=>x.th===th)).filter(Boolean)}catch{return []}})();
 const btn=e.target.closest("[data-cal-listen],#calListenAll");if(!btn||!heard.length)return;
 if(btn.id==="calListenAll"){beginnerSequence(heard);return}
 const x=heard[Number(btn.dataset.calListen)];if(x){beginnerStop();beginnerSaveHistory(x);beginnerSpeak(x.th,0.85)}
});
$("calEntries").addEventListener("change",e=>{const el=e.target.closest("[data-cal-source]");if(el)setEntrySource(el.dataset.calSource,el.value)});
$("calEntries").addEventListener("click",e=>{const btn=e.target.closest("[data-cal-open]");if(!btn)return;const x=own.find(v=>v.id===btn.dataset.calOpen);if(x){$("q").value=x.th;showTab("search");render();$("results").scrollIntoView({block:"start"})}});

// Private voice clips live only in this device's IndexedDB, never in public GitHub.
const voiceDb=()=>new Promise((resolve,reject)=>{const req=indexedDB.open("isanlove_private_voice",1);req.onupgradeneeded=()=>req.result.createObjectStore("clips");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
async function voiceOperation(mode,id,file){const db=await voiceDb();return new Promise((resolve,reject)=>{const tx=db.transaction("clips",mode==="get"?"readonly":"readwrite"),st=tx.objectStore("clips");const req=mode==="put"?st.put(file,id):mode==="delete"?st.delete(id):st.get(id);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()})}
let activeVoiceUrl=null;
async function handleVoiceAction(e){
 const save=e.target.closest("[data-voice-save]"),play=e.target.closest("[data-voice-play]"),remove=e.target.closest("[data-voice-delete]");
 const id=(save&&save.dataset.voiceSave)||(play&&play.dataset.voicePlay)||(remove&&remove.dataset.voiceDelete);
 if(!id)return;
 try{
  if(save){const input=Array.from($("results").querySelectorAll("[data-voice-file]")).find(n=>n.dataset.voiceFile===id),file=input&&input.files[0];if(!file){alert("先に音声ファイルを選んでね");return}if(file.size>25*1024*1024){alert("音声は25MB以下にしてね");return}await voiceOperation("put",id,file);alert("このiPhoneに音声を保存したよ 💜（バックアップJSONには含まれません）");return}
  if(remove){if(confirm("この言葉の音声だけ削除する？")){await voiceOperation("delete",id);alert("音声を削除したよ")}return}
  const file=await voiceOperation("get",id);if(!file){alert("この端末にはまだ音声が保存されていないよ");return}
  if(activeVoiceUrl)URL.revokeObjectURL(activeVoiceUrl);
  activeVoiceUrl=URL.createObjectURL(file);
  const player=document.createElement("audio");player.controls=true;player.autoplay=true;player.src=activeVoiceUrl;
  const card=play.closest(".card"),old=card.querySelector("[data-voice-player]");if(old)old.remove();
  const area=document.createElement("div");area.dataset.voicePlayer="1";area.appendChild(player);play.parentNode.after(area);
 }catch(err){alert("音声の操作に失敗しました。iPhoneの空き容量やブラウザの保存設定を確認してね")}
}
// A private two-message memory: add only after the user taps the button.
const loveExchange=[
 {id:"fon_voice_love_20261112",ja:"Fon：私はあなたを愛してるよ ❤️（聞き取り推定）",th:"ข้อยฮักเจ้า",ka:"コイ・ハック・ジャオ",cat:"💜Fon🩷",lang:"isan",savedDate:"2026-11-13",replies:[["甘い返事","ข้อยกะฮักเจ้าคือกัน ❤️","俺も君を愛してるよ ❤️","コイ・ガ・ハック・ジャオ・クー・ガン"]]},
 {id:"fon_voice_question_20261112",ja:"Fon：私のこと愛してる？ ❤️（聞き取り推定）",th:"เจ้าฮักข้อยบ่?",ka:"ジャオ・ハック・コイ・ボー？",cat:"💜Fon🩷",lang:"isan",savedDate:"2026-11-13",replies:[["優しい","ฮักเด้อ ❤️","愛してるよ ❤️","ハック・ドー"],["甘い","ข้อยฮักเจ้าหลาย ๆ เด้อ ❤️","俺は君をすごく愛してるよ ❤️","コイ・ハック・ジャオ・ラーイ・ラーイ・ドー"],["普段どおり","ฮักหลาย ๆ เด้อ ❤️","すごく愛してるよ ❤️","ハック・ラーイ・ラーイ・ドー"]]}
];
const loveBtn=document.getElementById("saveLoveExchange");
if(loveBtn)loveBtn.addEventListener("click",()=>{
 const existing=new Set(own.map(x=>x.id));const additions=loveExchange.filter(x=>!existing.has(x.id));
 if(!additions.length){alert("ふたりの会話は登録済みだよ 💜 音声をそれぞれのカードに付けてね");$("q").value="Fon：";showTab("search");render();return}
 const next=[...own,...additions];if(store(ownKey,next)){own=next;$("q").value="Fon：";showTab("search");render();alert("ふたりの会話を保存したよ 💜 2つのカードを開いて、それぞれの音声を選んでね")}
});
const sceneLessons=[
 ["💜 恋愛","会いたいよ","คิดฮอดเจ้า","キット・ホート・ジャオ"],
 ["💜 恋愛","愛してるよ","ข้อยฮักเจ้า","コイ・ハック・ジャオ"],
 ["💜 恋愛","私のこと愛してる？","เจ้าฮักข้อยบ่?","ジャオ・ハック・コイ・ボー？"],
 ["🌅 朝・夜","おはよう","สวัสดีตอนเช้า","サワッディー・トーン・チャオ"],
 ["🌅 朝・夜","おやすみ","ฝันดีเด้อ","ファン・ディー・ドー"],
 ["🌅 朝・夜","よく眠れた？","นอนหลับสบายบ่?","ノーン・ラップ・サバーイ・ボー？"],
 ["🍚 食事","ご飯食べた？","กินข้าวแล้วบ่?","ギン・カーオ・レーオ・ボー？"],
 ["🍚 食事","おいしい？","แซ่บบ่?","セープ・ボー？"],
 ["🍚 食事","お腹すいた","หิวข้าวแล้ว","ヒウ・カーオ・レーオ"],
 ["🏭 仕事","疲れた？","เมื่อยบ่?","ムアイ・ボー？"],
 ["🏭 仕事","無理しないでね","อย่าฝืนเด้อ","ヤー・フーン・ドー"],
 ["🏭 仕事","頑張ってね","สู้ ๆ เด้อ","スー・スー・ドー"],
 ["🚗 帰宅・移動","気をつけてね","ระวังโตเด้อ","ラワン・トー・ドー"],
 ["🚗 帰宅・移動","もう帰るよ","สิเมือแล้วเด้อ","シ・ムア・レーオ・ドー"],
 ["🚗 帰宅・移動","着いたよ","ฮอดแล้วเด้อ","ホート・レーオ・ドー"],
 ["💬 LINE・電話","何してるの？","เฮ็ดหยังอยู่?","ヘット・ニャン・ユー？"],
 ["💬 LINE・電話","もう一回言って","เว้าอีกเทื่อได้บ่?","ワオ・イーク・トゥア・ダイ・ボー？"],
 ["💬 LINE・電話","ゆっくり話してね","เว้าช้า ๆ แน่เด้อ","ワオ・チャー・チャー・ネー・ドー"]
,
 ["💜 恋愛","今日も会いたいよ","อยากเจอเจ้าอีกมื้อนี้","ヤーク・ジュー・ジャオ・イーク・ムー・ニー"],
 ["💜 恋愛","あなたと話すと嬉しい","ดีใจที่ได้เว้ากับเจ้า","ディー・ジャイ・ティー・ダイ・ワオ・ガップ・ジャオ"],
 ["💜 恋愛","あなたの笑顔が好き","มักรอยยิ้มของเจ้า","マック・ローイ・イム・コーン・ジャオ"],
 ["💜 恋愛","一緒にいると幸せ","อยู่กับเจ้าแล้วมีความสุข","ユー・ガップ・ジャオ・レーオ・ミー・クワーム・スック"],
 ["💜 恋愛","あなたが大切だよ","เจ้าสำคัญกับข้อยหลาย","ジャオ・サムカン・ガップ・コイ・ラーイ"],
 ["🌷 気づかい","心配してるよ","เป็นห่วงเด้อ","ペン・フアン・ドー"],
 ["🌷 気づかい","今日は疲れた？","มื้อนี้เมื่อยบ่?","ムー・ニー・ムアイ・ボー？"],
 ["🌷 気づかい","ゆっくり寝てね","นอนหลับสบายเด้อ","ノーン・ラップ・サバーイ・ドー"],
 ["🌷 気づかい","具合はどう？","เป็นจั่งได๋แน?","ペン・ジャン・ダイ・ネー？"],
 ["🌷 気づかい","何か手伝おうか？","ให้ข้อยซ่อยหยังบ่?","ハイ・コイ・ソーイ・ニャン・ボー？"],
 ["🍚 食事","お腹いっぱい？","อิ่มแล้วบ่?","イム・レーオ・ボー？"],
 ["🍚 食事","すごくおいしい","แซ่บหลายเด้อ","セープ・ラーイ・ドー"],
 ["🍚 食事","これ辛い？","อันนี้เผ็ดบ่?","アン・ニー・ペット・ボー？"],
 ["🍚 食事","何が食べたい？","อยากกินหยัง?","ヤーク・ギン・ニャン？"],
 ["🍚 食事","作ってくれてありがとう","ขอบคุณที่เฮ็ดให้กินเด้อ","コープ・クン・ティー・ヘット・ハイ・ギン・ドー"],
 ["🏭 仕事","仕事終わった？","เลิกงานแล้วบ่?","ルーク・ガーン・レーオ・ボー？"],
 ["🏭 仕事","今日は忙しい？","มื้อนี้ยุ่งบ่?","ムー・ニー・ユン・ボー？"],
 ["🏭 仕事","無事に帰ってね","กลับบ้านปลอดภัยเด้อ","グラップ・バーン・プロート・パイ・ドー"],
 ["🏭 仕事","少し休んでね","พักจักหน่อยเด้อ","パック・ジャック・ノイ・ドー"],
 ["🏭 仕事","明日も頑張ろうね","มื้ออื่นสู้กันใหม่เด้อ","ムー・ウン・スー・ガン・マイ・ドー"],
 ["💬 LINE・電話","今話せる？","ตอนนี้เว้าได้บ่?","トーン・ニー・ワオ・ダイ・ボー？"],
 ["💬 LINE・電話","また明日話そうね","มื้ออื่นค่อยเว้ากันเด้อ","ムー・ウン・コイ・ワオ・ガン・ドー"],
 ["💬 LINE・電話","メッセージありがとう","ขอบคุณที่ส่งข้อความมาเด้อ","コープ・クン・ティー・ソン・コー・クワーム・マー・ドー"],
 ["💬 LINE・電話","声が聞きたい","อยากได้ยินเสียงเจ้า","ヤーク・ダイ・イン・シアン・ジャオ"],
 ["💬 LINE・電話","あとで電話するね","เดี๋ยวโทรหาเด้อ","ディアオ・トー・ハー・ドー"],
 ["🇹🇭 タイ文化","これは何という料理？","อาหารนี่เรียกว่าอะไรครับ","アーハーン・ニー・リアック・ワー・アライ・クラップ"],
 ["🇹🇭 タイ文化","これはどうやって食べるの？","อันนี้กินยังไงครับ","アン・ニー・ギン・ヤン・ガイ・クラップ"],
 ["🇹🇭 タイ文化","辛くしないでください","ไม่เผ็ดนะครับ","マイ・ペット・ナ・クラップ"],
 ["🇹🇭 タイ文化","タイ語で何と言うの？","ภาษาไทยพูดว่าอะไรครับ","パーサー・タイ・プート・ワー・アライ・クラップ"],
 ["🇹🇭 タイ文化","もう一度言ってください","พูดอีกครั้งได้ไหมครับ","プート・イーク・クラン・ダイ・マイ・クラップ"]
,
 ["💜 恋愛","私のこと恋しい？","คิดฮอดข้อยบ่?","キット・ホート・コイ・ボー？"],
 ["💜 恋愛","とても恋しいよ","คิดฮอดหลายเด้อ","キット・ホート・ラーイ・ドー"],
 ["💜 恋愛","今日会える？","มื้อนี้เจอกันได้บ่?","ムー・ニー・ジュー・ガン・ダイ・ボー？"],
 ["💜 恋愛","今日は会えるよ","มื้อนี้เจอกันได้","ムー・ニー・ジュー・ガン・ダイ"],
 ["💜 恋愛","一緒にいたい？","อยากอยู่ด้วยกันบ่?","ヤーク・ユー・ドゥアイ・ガン・ボー？"],
 ["💜 恋愛","一緒にいたいよ","อยากอยู่ด้วยกันเด้อ","ヤーク・ユー・ドゥアイ・ガン・ドー"],
 ["💜 恋愛","私のこと好き？","มักข้อยบ่?","マック・コイ・ボー？"],
 ["💜 恋愛","好きだよ","มักเจ้าเด้อ","マック・ジャオ・ドー"],
 ["🌅 朝・夜","起きた？","ตื่นแล้วบ่?","トゥーン・レーオ・ボー？"],
 ["🌅 朝・夜","もう起きたよ","ตื่นแล้วเด้อ","トゥーン・レーオ・ドー"],
 ["🌅 朝・夜","眠い？","ง่วงบ่?","グアン・ボー？"],
 ["🌅 朝・夜","少し眠い","ง่วงนิดหน่อย","グアン・ニット・ノイ"],
 ["🌅 朝・夜","何時に寝る？","สิไปนอนจักโมง?","シ・パイ・ノーン・ジャック・モーン？"],
 ["🌅 朝・夜","もう寝るね","สิไปนอนแล้วเด้อ","シ・パイ・ノーン・レーオ・ドー"],
 ["🌷 気づかい","大丈夫？","โอเคบ่?","オーケー・ボー？"],
 ["🌷 気づかい","大丈夫だよ","โอเคอยู่เด้อ","オーケー・ユー・ドー"],
 ["🌷 気づかい","疲れた？","เมื่อยบ่?","ムアイ・ボー？"],
 ["🌷 気づかい","少し疲れた","เมื่อยนิดหน่อย","ムアイ・ニット・ノイ"],
 ["🌷 気づかい","元気？","สบายดีบ่?","サバーイ・ディー・ボー？"],
 ["🌷 気づかい","元気だよ","สบายดีเด้อ","サバーイ・ディー・ドー"],
 ["🍚 食事","お腹すいた？","หิวข้าวบ่?","ヒウ・カーオ・ボー？"],
 ["🍚 食事","お腹すいたよ","หิวข้าวแล้ว","ヒウ・カーオ・レーオ"],
 ["🍚 食事","おいしい？","แซ่บบ่?","セープ・ボー？"],
 ["🍚 食事","すごくおいしい","แซ่บหลาย","セープ・ラーイ"],
 ["🍚 食事","もっと食べる？","กินอีกบ่?","ギン・イーク・ボー？"],
 ["🍚 食事","もうお腹いっぱい","อิ่มแล้ว","イム・レーオ"],
 ["🍚 食事","辛いもの食べられる？","กินเผ็ดได้บ่?","ギン・ペット・ダイ・ボー？"],
 ["🍚 食事","少しなら食べられる","กินเผ็ดได้นิดหน่อย","ギン・ペット・ダイ・ニット・ノイ"],
 ["🏭 仕事","仕事に行くの？","ไปเฮ็ดเวียกบ่?","パイ・ヘット・ウィアック・ボー？"],
 ["🏭 仕事","仕事に行くよ","ไปเฮ็ดเวียกเด้อ","パイ・ヘット・ウィアック・ドー"],
 ["🏭 仕事","今日は休み？","มื้อนี้หยุดบ่?","ムー・ニー・ユット・ボー？"],
 ["🏭 仕事","今日は休みだよ","มื้อนี้หยุดเด้อ","ムー・ニー・ユット・ドー"],
 ["🚗 帰宅・移動","家に着いた？","ฮอดบ้านแล้วบ่?","ホート・バーン・レーオ・ボー？"],
 ["🚗 帰宅・移動","家に着いたよ","ฮอดบ้านแล้วเด้อ","ホート・バーン・レーオ・ドー"],
 ["🚗 帰宅・移動","今どこにいる？","ตอนนี้อยู่ไส?","トーン・ニー・ユー・サイ？"],
 ["🚗 帰宅・移動","家にいるよ","อยู่บ้านเด้อ","ユー・バーン・ドー"],
 ["🚗 帰宅・移動","一緒に行く？","ไปนำกันบ่?","パイ・ナム・ガン・ボー？"],
 ["🚗 帰宅・移動","一緒に行こう","ไปนำกันเด้อ","パイ・ナム・ガン・ドー"],
 ["💬 LINE・電話","今忙しい？","ตอนนี้ยุ่งบ่?","トーン・ニー・ユン・ボー？"],
 ["💬 LINE・電話","今は忙しくないよ","ตอนนี้บ่ยุ่ง","トーン・ニー・ボー・ユン"],
 ["💬 LINE・電話","電話してもいい？","โทรหาได้บ่?","トー・ハー・ダイ・ボー？"],
 ["💬 LINE・電話","電話していいよ","โทรมาได้เด้อ","トー・マー・ダイ・ドー"],
 ["💬 LINE・電話","聞こえる？","ได้ยินบ่?","ダイ・イン・ボー？"],
 ["💬 LINE・電話","聞こえるよ","ได้ยินอยู่","ダイ・イン・ユー"],
 ["💬 LINE・電話","分かった？","เข้าใจบ่?","カオ・ジャイ・ボー？"],
 ["💬 LINE・電話","分かったよ","เข้าใจแล้ว","カオ・ジャイ・レーオ"],
 ["🇹🇭 タイ文化","これは何？","อันนี้คืออะไร?","アン・ニー・クー・アライ？"],
 ["🇹🇭 タイ文化","これはタイ料理だよ","อันนี้เป็นอาหารไทย","アン・ニー・ペン・アーハーン・タイ"],
 ["🇹🇭 タイ文化","タイに行ったことある？","เคยไปไทยบ่?","クーイ・パイ・タイ・ボー？"],
 ["🇹🇭 タイ文化","まだ行ったことない","ยังบ่เคยไป","ヤン・ボー・クーイ・パイ"],
 ["🇹🇭 タイ文化","イサーン語を教えてくれる？","สอนภาษาอีสานให้แน่ได้บ่?","ソーン・パーサー・イサーン・ハイ・ネー・ダイ・ボー？"],
 ["🇹🇭 タイ文化","もちろん教えるよ","ได้เลย","ダイ・ルーイ"]
].map((x,i)=>({id:"sceneLesson"+i,cat:x[0],ja:x[1],th:x[2],ka:x[3],lang:/^(💜|🍚|🏭|🚗|💬)/.test(x[0])?"unverified":"unverified"}));
function renderScenes(){
 const target=$("sceneLessons");if(!target)return;
 const groups=[...new Set(sceneLessons.map(x=>x.cat))];
 target.innerHTML=groups.map(g=>'<details class="card"><summary><b>'+esc(g)+'</b> <small>('+sceneLessons.filter(x=>x.cat===g).length+'語)</small></summary>'+sceneLessons.filter(x=>x.cat===g).map(x=>'<div class="reply-card"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><button data-scene-add="'+esc(x.id)+'">💾 辞書に追加して音声を付ける</button></div>').join("")+'</details>').join("");
}
if($("sceneLessons")){$("sceneLessons").addEventListener("click",e=>{
 const b=e.target.closest("[data-scene-add]");if(!b)return;const x=sceneLessons.find(v=>v.id===b.dataset.sceneAdd);if(!x)return;
 let found=own.find(v=>v.th===x.th);
 if(!found){const next={...x,id:"ownScene"+Date.now(),cat:"💜Fon🩷",savedDate:localDay()};if(!store(ownKey,[...own,next]))return;own.push(next);found=next}
 $("q").value=found.th;showTab("search");render();alert("辞書に準備したよ。カードを開いてFonの音声を選んでね。まだ音声は付いていないよ。")
});renderScenes()}

const fonPriorityLessons=[["💜 Fonに愛を伝える","愛してるよ","ฮักเจ้าเด้อ","ハック・ジャオ・ドー"],["💜 Fonに愛を伝える","すごく愛してるよ","ฮักเจ้าหลาย ๆ เด้อ","ハック・ジャオ・ラーイ・ラーイ・ドー"],["💜 Fonに愛を伝える","会いたいよ","คิดฮอดเจ้าเด้อ","キット・ホート・ジャオ・ドー"],["💜 Fonに愛を伝える","一緒にいたいよ","อยากอยู่กับเจ้า","ヤーク・ユー・ガップ・ジャオ"],["💜 Fonに愛を伝える","大切にするよ","สิดูแลเจ้าให้ดี","シ・ドゥーレー・ジャオ・ハイ・ディー"],["💜 Fonに愛を伝える","いつも想ってるよ","คิดฮอดเจ้าอยู่เสมอ","キット・ホート・ジャオ・ユー・サムー"],["🌷 Fonを気づかう","疲れた？","เมื่อยบ่?","ムアイ・ボー？"],["🌷 Fonを気づかう","無理しないでね","อย่าฝืนเด้อ","ヤー・フーン・ドー"],["🌷 Fonを気づかう","ゆっくり休んでね","พักผ่อนหลาย ๆ เด้อ","パック・ポーン・ラーイ・ラーイ・ドー"],["🌷 Fonを気づかう","ご飯食べた？","กินข้าวแล้วบ่?","ギン・カーオ・レーオ・ボー？"],["🌷 Fonを気づかう","大丈夫？","เป็นหยังบ่?","ペン・ニャン・ボー？"],["🌷 Fonを気づかう","気をつけてね","ระวังโตเด้อ","ラワン・トー・ドー"]].map((x,i)=>({id:"fonPriority"+i,cat:x[0],ja:x[1],th:x[2],ka:x[3],lang:"unverified"}));
// Beginner mode: rotating daily lessons, local listening history and optional review.
const beginnerKey="isanlove_beginner_v1",beginnerHistoryKey="isanlove_beginner_history_v1";
let beginnerSaved={},beginnerHistory={};try{beginnerSaved=JSON.parse(localStorage.getItem(beginnerKey))||{}}catch{}try{beginnerHistory=JSON.parse(localStorage.getItem(beginnerHistoryKey))||{}}catch{}
let beginnerActive=false,beginnerToken=0,beginnerLastDate="";
const beginnerDate=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const beginnerDayNumber=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)};
function beginnerList(){
 const n=Number($("beginnerCount")?.value||3),offset=(beginnerDayNumber()*3)%sceneLessons.length;
 return Array.from({length:n},(_,i)=>sceneLessons[(offset+i)%sceneLessons.length]);
}
function beginnerSaveHistory(x){
 const day=beginnerDate(),list=Array.isArray(beginnerHistory[day])?beginnerHistory[day]:[];
 if(!list.includes(x.th)){beginnerHistory[day]=[...list,x.th];try{localStorage.setItem(beginnerHistoryKey,JSON.stringify(beginnerHistory))}catch{}}
 beginnerHistoryRender();
}
function beginnerHistoryItems(date){
 const ths=Array.isArray(beginnerHistory[date])?beginnerHistory[date]:[];
 return ths.map(th=>sceneLessons.find(x=>x.th===th)).filter(Boolean);
}
function beginnerHistoryRender(){
 const sel=$("beginnerHistoryDate"),root=$("beginnerHistoryCards");if(!sel||!root)return;
 const dates=Object.keys(beginnerHistory).filter(d=>beginnerHistoryItems(d).length).sort().reverse(),selected=dates.includes(sel.value)?sel.value:dates[0];
 sel.innerHTML=dates.length?dates.map(d=>'<option value="'+esc(d)+'"'+(d===selected?' selected':'')+'>'+esc(d)+' ('+beginnerHistoryItems(d).length+'語)</option>').join(""):'<option value="">まだ履歴はありません</option>';
 const items=selected?beginnerHistoryItems(selected):[];
 root.innerHTML=items.map((x,i)=>'<div class="reply-card"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><button data-beginner-history-say="'+i+'">🔊 もう一度聞く</button></div>').join("");
 $("beginnerHistoryPlay").disabled=!items.length;$("beginnerHistoryAll").disabled=!dates.length;
}
function beginnerRender(){
 const root=$("beginnerCards");if(!root)return;const items=beginnerList();beginnerLastDate=beginnerDate();
 root.innerHTML=items.map((x,i)=>'<div class="reply-card"><small>'+(i+1)+' / '+items.length+'</small><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><div class="row"><button data-beginner-say="'+i+'">🔊 聞く</button><button data-beginner-slow="'+i+'">🐢 ゆっくり</button><button data-beginner-known="'+i+'">'+(beginnerSaved[x.th]?'✓ 聞き慣れた':'♡ 聞き慣れたら押す')+'</button></div></div>').join("");
 $("beginnerPlay").textContent="▶️ "+items.length+"語を続けて聞く";
 $("beginnerProgress").textContent="今日の「聞き慣れた」 "+items.filter(x=>beginnerSaved[x.th]).length+" / "+items.length+"語（端末内に保存）";
 beginnerHistoryRender();
}
function beginnerStop(){beginnerActive=false;beginnerToken++;if("speechSynthesis" in window)speechSynthesis.cancel();if($("beginnerStatus"))$("beginnerStatus").textContent="停止したよ。好きな時にまた聞いてね。"}
function beginnerSpeak(text,rate,done){
 if(!("speechSynthesis" in window)){if($("beginnerStatus"))$("beginnerStatus").textContent="この端末は読み上げに対応していません";beginnerActive=false;return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="th-TH";u.rate=rate;
 const v=speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith("th"));if(v)u.voice=v;
 u.onend=()=>{if(done)done()};u.onerror=()=>{beginnerActive=false;if($("beginnerStatus"))$("beginnerStatus").textContent="再生が止まりました。もう一度押してね。"};
 speechSynthesis.speak(u);
}
function beginnerSequence(items){
 if(!items.length)return;beginnerStop();beginnerActive=true;const token=beginnerToken;let index=0,repeat=0;
 function next(){if(!beginnerActive||token!==beginnerToken)return;
  if(index>=items.length){beginnerActive=false;$("beginnerStatus").textContent="今日もよく聞けたね！ 💜";return}
  const x=items[index];$("beginnerStatus").textContent=(index+1)+" / "+items.length+"：「"+x.ja+"」（"+(repeat+1)+"/2回）";
  beginnerSaveHistory(x);
  beginnerSpeak(x.th,repeat===0?0.75:0.85,()=>{if(!beginnerActive||token!==beginnerToken)return;repeat++;if(repeat>=2){repeat=0;index++}next()});
 }next();
}
if($("beginnerCards")){
 $("beginnerCount").addEventListener("change",()=>{beginnerStop();beginnerRender()});
 $("beginnerCards").addEventListener("click",e=>{
  const b=e.target.closest("[data-beginner-say],[data-beginner-slow],[data-beginner-known]");if(!b)return;
  if(beginnerLastDate!==beginnerDate())beginnerRender();
  const i=Number(b.dataset.beginnerSay??b.dataset.beginnerSlow??b.dataset.beginnerKnown),x=beginnerList()[i];if(!x)return;
  if(b.hasAttribute("data-beginner-known")){beginnerSaved[x.th]=!beginnerSaved[x.th];try{localStorage.setItem(beginnerKey,JSON.stringify(beginnerSaved))}catch{};beginnerRender();return}
  beginnerStop();beginnerSaveHistory(x);beginnerSpeak(x.th,b.hasAttribute("data-beginner-slow")?0.65:0.85);
 });
 $("beginnerStop").addEventListener("click",beginnerStop);
 $("beginnerPlay").addEventListener("click",()=>{if(beginnerLastDate!==beginnerDate())beginnerRender();beginnerSequence(beginnerList())});
 $("beginnerHistoryDate").addEventListener("change",beginnerHistoryRender);
 $("beginnerHistoryCards").addEventListener("click",e=>{const b=e.target.closest("[data-beginner-history-say]");if(!b)return;const x=beginnerHistoryItems($("beginnerHistoryDate").value)[Number(b.dataset.beginnerHistorySay)];if(x){beginnerStop();beginnerSaveHistory(x);beginnerSpeak(x.th,0.85)}});
 $("beginnerHistoryPlay").addEventListener("click",()=>beginnerSequence(beginnerHistoryItems($("beginnerHistoryDate").value)));
 $("beginnerHistoryAll").addEventListener("click",()=>{const seen=new Set(),items=[];Object.keys(beginnerHistory).sort().reverse().forEach(d=>beginnerHistoryItems(d).forEach(x=>{if(!seen.has(x.th)){seen.add(x.th);items.push(x)}}));beginnerSequence(items)});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&beginnerLastDate!==beginnerDate()){beginnerStop();beginnerRender()}});
 beginnerRender();
}
const practiceKey="isanlove_practice_v1";
let practiceStats=(()=>{try{return JSON.parse(localStorage.getItem(practiceKey))||{}}catch{return {}}})();
let practiceMode="listen",practiceScene="💜 Fonに愛を伝える",practiceCurrent=null,practiceReveal=false,practiceQueue=[],practiceDone=0;
const practiceDay=()=>new Date().toLocaleDateString("sv-SE");
const practicePool=()=>[...fonPriorityLessons,...sceneLessons,...own.filter(x=>x.th&&x.ja)].filter(x=>practiceScene==="all"||x.cat===practiceScene);
function practiceDue(x){const st=practiceStats[x.th];return !st||!st.next||st.next<=practiceDay()}
function practicePick(){const pool=practicePool();if(!pool.length)return null;const due=pool.filter(practiceDue);const choices=due.length?due:pool;return choices[Math.floor(Math.random()*choices.length)]}
function practiceSpeak(text,rate=0.85){
 if(!("speechSynthesis" in window)){alert("この端末では読み上げが使えないよ");return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="th-TH";u.rate=rate;
 const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang.toLowerCase().startsWith("th"));if(v)u.voice=v;
 speechSynthesis.speak(u);
}
function practiceRender(){
 const root=$("practiceCard");if(!root)return;
 if(!practiceCurrent){root.innerHTML='<p>練習できる言葉がありません。</p>';return}
 const x=practiceCurrent;
 const isListen=practiceMode==="listen";
 root.innerHTML='<small>'+esc(x.cat)+' · '+(isListen?"🎧 聞き取り":"🗣️ 発話")+'</small><h3>'+(isListen?"音声を聞いて意味を考えよう":"この日本語をタイ語・イサーン語で言ってみよう")+'</h3>'+
 (isListen?'<p class="note">タイ文字は答えを見るまで隠しています。</p>':'<p style="font-size:22px;font-weight:bold">'+esc(x.ja)+'</p>')+
 '<div class="row"><button data-practice-play>🔊 '+(isListen?"音声を聞く":"お手本を聞く")+'</button><button data-practice-slow>🐢 ゆっくり</button></div>'+
 (!isListen?'<p class="note">まず自分の声で言ってみてから答えを見よう。録音や音声認識による自動採点はまだありません。</p>':'')+
 (practiceReveal?'<div class="fon-details"><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><p class="note">音声は端末の標準タイ語読み上げ。イサーン語の発音と異なる場合があります。</p></div><div class="row"><button data-practice-grade="again">🔁 まだ覚えてない</button><button data-practice-grade="good">✓ 覚えた</button></div>':'<button class="primary" style="width:100%;margin-top:12px" data-practice-reveal>👀 答えを見る</button>')+
 '<p class="note">今回の練習：'+practiceDone+'問 · 記録はこの端末に保存</p>';
}
function practiceNext(){practiceCurrent=practicePick();practiceReveal=false;practiceRender()}
if($("practiceCard")){
 const selector=$("practiceScene");selector.innerHTML='<option value="all">すべてのシーン</option>'+[...new Set([...fonPriorityLessons,...sceneLessons].map(x=>x.cat))].map(g=>'<option value="'+esc(g)+'">'+esc(g)+'</option>').join("");
 selector.value=practiceScene;selector.addEventListener("change",()=>{practiceScene=selector.value;practiceNext()});
 $("practiceMode").addEventListener("change",()=>{practiceMode=$("practiceMode").value;practiceNext()});
 $("practiceCard").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||!practiceCurrent)return;
  if(b.hasAttribute("data-practice-play")){practiceSpeak(practiceCurrent.th);return}
  if(b.hasAttribute("data-practice-slow")){practiceSpeak(practiceCurrent.th,0.65);return}
  if(b.hasAttribute("data-practice-reveal")){practiceReveal=true;practiceRender();return}
  if(b.hasAttribute("data-practice-grade")){
   const grade=b.dataset.practiceGrade,prev=practiceStats[practiceCurrent.th]||{level:0},level=grade==="good"?Math.min((prev.level||0)+1,5):0;
   const date=new Date();date.setDate(date.getDate()+([1,2,4,7,14,30][level]));
   practiceStats[practiceCurrent.th]={level,next:date.toLocaleDateString("sv-SE"),last:practiceDay(),result:grade};
   try{localStorage.setItem(practiceKey,JSON.stringify(practiceStats))}catch{alert("復習履歴を保存できませんでした")}
   practiceDone++;practiceNext();
  }
 });
 practiceNext();
}

/* Phase 1: audio-first, continuous listening. No recordings are uploaded. */
let earRunning=false,earToken=0,earPosition=0,earList=[],earPlayed=0;
const earSettingsKey="isanlove_ear_settings_v1";
let earSettings=(()=>{try{return {...{scene:"💜 Fonに愛を伝える",count:10,repeat:2,rate:0.85,japanese:true},...JSON.parse(localStorage.getItem(earSettingsKey)||"{}")}}catch{return {scene:"💜 Fonに愛を伝える",count:10,repeat:2,rate:0.85,japanese:true}}})();
function earSaveSettings(){try{localStorage.setItem(earSettingsKey,JSON.stringify(earSettings))}catch{}}
function earSpeak(text,lang,rate,token){return new Promise(resolve=>{
 if(!earRunning||token!==earToken||!("speechSynthesis" in window)){resolve(false);return}
 let finished=false;const done=ok=>{if(finished)return;finished=true;resolve(ok)};
 const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=rate;
 if(lang==="th-TH"){const v=speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith("th"));if(v)u.voice=v}
 u.onend=()=>done(true);u.onerror=()=>done(false);
 try{speechSynthesis.speak(u)}catch{done(false)}
 })}
function earStatus(msg){const e=$("earStatus");if(e)e.textContent=msg}
function earStop(){earRunning=false;earToken++;if("speechSynthesis" in window)speechSynthesis.cancel();const b=$("earStart");if(b)b.textContent="▶️ 連続再生を開始"}
function earPool(){const allP=[...fonPriorityLessons,...sceneLessons,...own.filter(x=>x.th&&x.ja)];const filtered=allP.filter(x=>earSettings.scene==="all"||x.cat===earSettings.scene);return filtered.filter((x,i)=>filtered.findIndex(y=>y.th===x.th)===i)}
async function earPlay(){
 if(!("speechSynthesis" in window)){earStatus("この端末は音声読み上げに対応していません");return}
 earStop();earRunning=true;const token=earToken;
 earList=earPool().slice(0,earSettings.count);earPosition=0;earPlayed=0;
 if(!earList.length){earStop();earStatus("このシーンには言葉がありません");return}
 $("earStart").textContent="■ 停止";
 for(;earPosition<earList.length&&earRunning&&token===earToken;earPosition++){
  const x=earList[earPosition];earStatus((earPosition+1)+"/"+earList.length+"： "+x.ja+" ／ "+x.ka);
  if(earSettings.japanese){const ok=await earSpeak(x.ja,"ja-JP",0.95,token);if(!ok)break}
  for(let i=0;i<earSettings.repeat&&earRunning&&token===earToken;i++){const ok=await earSpeak(x.th,"th-TH",earSettings.rate,token);if(!ok)break}
  earPlayed++;
 }
 if(token===earToken){earStop();earStatus("再生終了："+earPlayed+"フレーズ。今日もお疲れさま 💜")}
}
if($("earStart")){
 const scene=$("earScene");scene.innerHTML='<option value="all">すべて</option>'+[...new Set([...fonPriorityLessons,...sceneLessons].map(x=>x.cat))].map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join("");
 scene.value=earSettings.scene;
 $("earCount").value=String(earSettings.count);$("earRepeat").value=String(earSettings.repeat);$("earRate").value=String(earSettings.rate);$("earJapanese").checked=earSettings.japanese;
 const changed=()=>{earSettings={scene:scene.value,count:Number($("earCount").value),repeat:Number($("earRepeat").value),rate:Number($("earRate").value),japanese:$("earJapanese").checked};earSaveSettings();if(earRunning){earStop();earStatus("設定を変更したよ。もう一度再生してね。")}};
 [scene,$("earCount"),$("earRepeat"),$("earRate"),$("earJapanese")].forEach(x=>x.addEventListener("change",changed));
 $("earStart").addEventListener("click",()=>earRunning?earStop():earPlay());
 $("earNext").addEventListener("click",()=>{if(earRunning){earStop();earStatus("停止しました。次の再生では最初から始まります。")}else earStatus("再生を開始してね")});
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&earRunning)earStatus("画面を閉じるとiPhoneでは音声が停止する場合があります")});
}

/* Phase 2-3: guided conversation and local pronunciation playback. */
const conversations=[
 {name:"💜 愛情を伝える",turns:[["Fonに伝える","ฮักเจ้าเด้อ","愛してるよ","ハック・ジャオ・ドー"],["Fonからの質問（練習用）","เจ้าฮักข้อยบ่?","私のこと愛してる？","ジャオ・ハック・コイ・ボー？"],["返事をする","ฮักหลาย ๆ เด้อ","すごく愛してるよ","ハック・ラーイ・ラーイ・ドー"]]},
 {name:"🌷 疲れを気づかう",turns:[["Fonに聞く","เมื่อยบ่?","疲れた？","ムアイ・ボー？"],["返事の例","เมื่อยหลาย","とても疲れた","ムアイ・ラーイ"],["優しく伝える","พักผ่อนหลาย ๆ เด้อ","ゆっくり休んでね","パック・ポーン・ラーイ・ラーイ・ドー"]]},
 {name:"🍚 食事の会話",turns:[["Fonに聞く","กินข้าวแล้วบ่?","ご飯食べた？","ギン・カーオ・レーオ・ボー？"],["返事の例","กินแล้ว","食べたよ","ギン・レーオ"],["気づかう","กินข้าวหลาย ๆ เด้อ","しっかり食べてね","ギン・カーオ・ラーイ・ラーイ・ドー"]]}
];
let conversationIndex=0,conversationStep=0,conversationShown=false;
function renderConversation(){
 const el=$("conversationCard");if(!el)return;const scene=conversations[conversationIndex],t=scene.turns[conversationStep];
 el.innerHTML='<small>'+esc(scene.name)+' · '+(conversationStep+1)+' / '+scene.turns.length+'</small><h3>'+esc(t[0])+'</h3><div style="font-size:21px;font-weight:bold;margin:12px 0">'+esc(t[2])+'</div><div class="row"><button data-conversation="listen">🔊 お手本を聞く</button><button data-conversation="slow">🐢 ゆっくり</button></div><p class="note">先に声に出してから、答えを見てね。</p>'+(conversationShown?'<div class="fon-details"><div class="thai">'+esc(t[1])+'</div><div class="kana">'+esc(t[3])+'</div></div>':'')+'<div class="row"><button data-conversation="reveal">答えを見る</button><button class="primary" data-conversation="next">次のセリフへ</button></div>';
}
if($("conversationCard")){
 const sel=$("conversationScene");sel.innerHTML=conversations.map((x,i)=>'<option value="'+i+'">'+esc(x.name)+'</option>').join("");
 sel.addEventListener("change",()=>{conversationIndex=Number(sel.value);conversationStep=0;conversationShown=false;renderConversation()});
 $("conversationCard").addEventListener("click",e=>{const b=e.target.closest("[data-conversation]");if(!b)return;const t=conversations[conversationIndex].turns[conversationStep];if(b.dataset.conversation==="listen")practiceSpeak(t[1]);if(b.dataset.conversation==="slow")practiceSpeak(t[1],0.65);if(b.dataset.conversation==="reveal"){conversationShown=true;renderConversation()}if(b.dataset.conversation==="next"){conversationStep=(conversationStep+1)%conversations[conversationIndex].turns.length;conversationShown=false;renderConversation()}});
 renderConversation();
}
// 26 question/answer pairs appended in v48; no network or microphone required.
const pairItems=Array.from({length:26},(_,i)=>({q:sceneLessons[48+i*2],a:sceneLessons[49+i*2]})).filter(x=>x.q&&x.a);
const pairProgressKey="isanlove_pair_progress_v1";
let pairStats={};try{pairStats=JSON.parse(localStorage.getItem(pairProgressKey))||{}}catch{pairStats={}}
let pairIndex=0,pairRevealed=false;
const pairTheme=$("pairTheme"),pairQuestion=$("pairQuestion"),pairAnswer=$("pairAnswer");
function pairChoices(){return pairItems.map((p,i)=>({...p,index:i})).filter(p=>!pairTheme||pairTheme.value==="all"||p.q.cat===pairTheme.value)}
function pairRender(){if(!pairQuestion)return;const p=pairItems[pairIndex];if(!p)return;
 const choices=pairChoices(),done=choices.filter(x=>(pairStats[x.q.th]?.good||0)>0).length;
 $("pairProgress").textContent="テーマ内 "+done+" / "+choices.length+"組を1回以上クリア";
 pairQuestion.innerHTML='<small>'+esc(p.q.cat)+'</small><h3>Fon役の質問</h3><div class="thai">'+esc(p.q.th)+'</div><div class="kana">'+esc(p.q.ka)+'</div><p>'+esc(p.q.ja)+'</p>';
 pairAnswer.innerHTML=pairRevealed?'<div class="fon-details"><b>返事のお手本</b><div class="thai">'+esc(p.a.th)+'</div><div class="kana">'+esc(p.a.ka)+'</div><p>'+esc(p.a.ja)+'</p></div>':'<p class="note">返事を声に出してから「返事を見る」を押してね。</p>';
 $("pairReveal").disabled=pairRevealed;$("pairReplay").disabled=!pairRevealed;$("pairAgain").disabled=!pairRevealed;$("pairGood").disabled=!pairRevealed;
}
function pairNext(){const pool=pairChoices();if(!pool.length)return;const sorted=[...pool].sort((a,b)=>(pairStats[a.q.th]?.good||0)-(pairStats[b.q.th]?.good||0));const pick=sorted.find(x=>x.index!==pairIndex)||sorted[0];pairIndex=pick.index;pairRevealed=false;pairRender()}
if(pairQuestion){
 const themes=[...new Set(pairItems.map(p=>p.q.cat))];pairTheme.innerHTML='<option value="all">すべてのテーマ</option>'+themes.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join("");
 pairTheme.addEventListener("change",()=>{const first=pairChoices()[0];if(first)pairIndex=first.index;pairRevealed=false;pairRender()});
 $("pairListen").addEventListener("click",()=>practiceSpeak(pairItems[pairIndex].q.th));
 $("pairSlow").addEventListener("click",()=>practiceSpeak(pairItems[pairIndex].q.th,0.65));
 $("pairReveal").addEventListener("click",()=>{pairRevealed=true;pairRender()});
 $("pairReplay").addEventListener("click",()=>{if(pairRevealed)practiceSpeak(pairItems[pairIndex].a.th)});
 $("pairAgain").addEventListener("click",()=>{if(!pairRevealed)return;const th=pairItems[pairIndex].q.th;pairStats[th]={...(pairStats[th]||{}),again:(pairStats[th]?.again||0)+1};try{localStorage.setItem(pairProgressKey,JSON.stringify(pairStats))}catch{};$("pairStatus").textContent="もう一度、質問から練習しよう";pairRevealed=false;pairRender()});
 $("pairGood").addEventListener("click",()=>{if(!pairRevealed)return;const th=pairItems[pairIndex].q.th;pairStats[th]={...(pairStats[th]||{}),good:(pairStats[th]?.good||0)+1};try{localStorage.setItem(pairProgressKey,JSON.stringify(pairStats))}catch{};$("pairStatus").textContent="よくできたね！次の会話へ 💜";pairNext()});
 pairRender();
}
let ownRecording=null,ownRecordingStream=null,ownRecordingUrl=null;
function recordingStatus(t){const el=$("recordingStatus");if(el)el.textContent=t}
function recordingCleanup(){if(ownRecordingStream){ownRecordingStream.getTracks().forEach(t=>t.stop());ownRecordingStream=null}}
if($("recordStart")){
 $("recordExample").innerHTML=fonPriorityLessons.map((x,i)=>'<option value="'+i+'">'+esc(x.ja)+'</option>').join("");
 $("recordSample").addEventListener("click",()=>practiceSpeak(fonPriorityLessons[Number($("recordExample").value)].th));
 $("recordStart").addEventListener("click",async()=>{
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){recordingStatus("この端末では録音できません");return}
  try{
   recordingCleanup();ownRecordingStream=await navigator.mediaDevices.getUserMedia({audio:true});
   const chunks=[];ownRecording=new MediaRecorder(ownRecordingStream);
   ownRecording.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
   ownRecording.onstop=()=>{
    recordingCleanup();if(ownRecordingUrl)URL.revokeObjectURL(ownRecordingUrl);
    const blob=new Blob(chunks,{type:ownRecording.mimeType||"audio/mp4"});
    if(!blob.size){recordingStatus("録音が空でした");return}
    ownRecordingUrl=URL.createObjectURL(blob);
    const player=$("recordPlayback");player.src=ownRecordingUrl;player.hidden=false;
    recordingStatus("録音できたよ。再生してお手本と聞き比べよう。端末外には送信されません。");
   };
   ownRecording.start();recordingStatus("🔴 録音中。終わったら停止を押してね。");
  }catch{recordingStatus("マイクを利用できませんでした。端末のマイク許可を確認してね。")}
 });
 $("recordStop").addEventListener("click",()=>{if(ownRecording&&ownRecording.state==="recording")ownRecording.stop();else recordingStatus("録音は開始されていません")});
 window.addEventListener("pagehide",recordingCleanup);
}
let visibleLimit=10;
function render(){if($("calGrid"))renderCalendar();const q=$("q").value.trim().toLowerCase(),items=all().filter(x=>(!isanOnly||languageOf(x)==="isan")&&[x.ja,x.th,x.ka,x.cat].some(v=>String(v||"").toLowerCase().includes(q)));$("count").textContent=items.length+"件表示 / 全"+all().length+"件";$("results").innerHTML=items.slice(0,visibleLimit).map(x=>'<article class="card"><details class="entry-fold"><summary><small>'+esc(x.cat)+(languageOf(x)==='isan'?' 🌾 イサーン語':languageOf(x)==='thai'?' 🇹🇭 標準タイ語':own.some(v=>v.id===x.id)?' ❔ 未判定':'')+'</small> · '+esc(x.ja)+'</summary><div class="thai">'+esc(x.th)+'</div><div class="kana">'+esc(x.ka)+'</div><p>'+esc(x.ja)+'</p><div class="row"><button data-say="'+esc(x.id)+'">🔊 発音を確認</button>'+(own.some(v=>v.id===x.id)?'<button data-edit-lang="'+esc(x.id)+'">言語を変更</button><button data-delete="'+esc(x.id)+'">削除</button>':"")+'</div>'+(own.some(v=>v.id===x.id)?'<div class="fon-details"><b>🎙️ この言葉のボイスメッセージ</b><p class="note">音声はこの端末だけに保存。公開されません。JSONバックアップには含まれないので、元ファイルも残してね。</p><input type="file" accept="audio/*,video/mp4,.m4a,.mp4" data-voice-file="'+esc(x.id)+'"><div class="row"><button data-voice-save="'+esc(x.id)+'">💾 音声を保存</button><button data-voice-play="'+esc(x.id)+'">▶️ 再生</button><button data-voice-delete="'+esc(x.id)+'">音声削除</button></div></div>':'')+showFonExtras(x)+'</details></article>').join("")+(items.length>visibleLimit?'<button id="loadMoreEntries" class="secondary">さらに10件表示（残り'+(items.length-visibleLimit)+'件）</button>':'')||"<p>一致する例文がありません</p>"}
$("q").addEventListener("input",()=>{visibleLimit=10;render()});
$("results").addEventListener("click",e=>{if(e.target.closest("[data-voice-save],[data-voice-play],[data-voice-delete]")){handleVoiceAction(e);return}if(e.target.closest("#loadMoreEntries")){visibleLimit+=10;render()}});$("isanOnly").addEventListener("click",()=>{isanOnly=!isanOnly;$("isanOnly").classList.toggle("active",isanOnly);render()});document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{$("q").value=b.dataset.category;render()}));
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
 next.push({id:previous?.id||"fon"+Date.now(),th,ja,ka,lang,cat:"💜Fon🩷",source:"fon",savedDate:previous?entryDay(previous):localDay()});
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
$("save").addEventListener("click",()=>{const x={id:"own"+Date.now(),ja:$("ja").value.trim(),th:$("th").value.trim(),ka:$("ka").value.trim(),cat:$("cat").value.trim()||"自分の単語",savedDate:localDay(),source:$("addSource").value};if(!x.ja||!x.th){alert("日本語とタイ文字を入力してください");return}own.push(x);if(store(ownKey,own)){["ja","th","ka","cat"].forEach(k=>$(k).value="");render();alert("保存しました")}});
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
  next.push({id:previous?.id||"fon"+Date.now(),...data,cat:"💜Fon🩷",source:"fon",savedDate:previous?entryDay(previous):localDay()});
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
const APP_VERSION=57;
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