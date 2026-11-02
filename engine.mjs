import { randomUUID } from 'node:crypto';
export const terminal = new Set(['PAID','BROKEN','KEPT','SETTLED','WEASELED','VOIDED']);
export const normalize = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,'').replace(/\s+/g,' ').trim();
export const hasCue = text => /\b(if|i'll|i will|gonna|never|minutes|back in|promise|bet|loser|tomorrow|next stream)\b/i.test(text.replace(/[’‘]/g,"'"));
export const fresh = () => ({promises:[],viewers:{},timeStats:[],activity:[],category:'Only Up!',online:true,stream:1,paused:false,quiet:false,approveAll:false,enabled:{goal:true,time:true,vow:true,next_stream:true},debtDay:null,tab:'Say it on stream. I’ll take it from here.',lastBeat:0});
const modifiers=['in a pirate voice','with dramatic narration','wearing an imaginary crown'];
export function validate(c,text){
 if(!c || c.kind==='none') return {drop:true};
 if(!['goal','time','vow','next_stream'].includes(c.kind)||!c.quote||!normalize(text).includes(normalize(c.quote))||!normalize(c.quote))return {drop:true};
 if(c.hypothetical||c.quoting_someone_else||c.first_person!==true||!Number.isFinite(c.confidence)||c.confidence<.5)return {drop:true};
 if(c.safety!=='ok'||/\b(drink|drinking|bottle|suicide|self.harm|(?:home|my)\s+address|credit card|spend money|dox|kill myself)\b/i.test(c.quote))return {refused:true,reason:'This promise stays off stream. Choose a safe, free challenge.'};
 if(!c.condition||!['follows','raids','chat_phrase','subs','cheers','called','time','category','none'].includes(c.condition.type)||typeof c.action!=='string'||!c.action.trim()||c.action.length>60)return {drop:true};
 const q=c.condition; let hold=c.confidence<.8;
 if((c.kind==='time'&&q.type!=='time')||(['vow','next_stream'].includes(c.kind)&&q.type!=='category'))return {drop:true};
 if(['follows','raids','chat_phrase','subs','cheers'].includes(q.type) && (!Number.isInteger(q.target)||q.target<1))return {drop:true};
 if(q.type==='chat_phrase'&&(!q.phrase||normalize(q.phrase).length>40))return {drop:true};
 if(q.type==='time'&&(!Number.isFinite(q.minutes)||q.minutes<=0))return {drop:true};
 if(q.type==='category'&&(!q.category||String(q.category).length>100))return {drop:true};
 if(q.target>(q.type==='chat_phrase'?500:1000)||q.minutes>120||/\b\d{3,}[\s-]*push/i.test(c.quote))hold=true;
 return {hold};
}
export function fallback(text,category){
 const t=text.toLowerCase().replace(/’/g,"'"); const nums={one:1,two:2,three:3,five:5,ten:10,twenty:20,a:1};
 const n=s=>nums[s]||Number(s); let kind='none',action='',condition={type:'none'};
 if(/chat says|he said|she said|if i had|i'd |would |someone said|reading chat/.test(t))return {kind};
 let m=t.match(/(?:back in|be back in)\s+(\d+|one|two|three|five|ten|a couple of|a)\s*(minutes?|mins?|seconds?|secs?)/);
 if(m){kind='time';action='be back on time';condition={type:'time',minutes:m[1]==='a couple of'?2:n(m[1])*(/sec/.test(m[2])?1/60:1)};}
 else if(/\bnever\b.*\bagain\b/.test(t)){kind='vow';action='stay away from '+category;condition={type:'category',category};}
 else if((m=t.match(/(?:tomorrow|next stream)\s+(?:we're|we are|i'm|i am)\s+(?:playing|doing|streaming)\s+(.+)/))){kind='next_stream';action='stream '+m[1];condition={type:'category',category:m[1]};}
 else if((m=t.match(/(?:if\s+)?(\d+|one|two|three|five|ten|twenty)\s+of you\s+type\s+["']?(\w+)["']?[,\s]+(?:i'll|i will|i’m gonna|i'm gonna)\s+(.+)/))){kind='goal';action=m[3];condition={type:'chat_phrase',target:n(m[1]),phrase:m[2]};}
 else if((m=t.match(/if.*?(\d+|five|ten|twenty)\s+(?:new\s+)?follows?[,\s]+(?:i'll|i will)\s+(.+)/))){kind='goal';action=m[2];condition={type:'follows',target:n(m[1])};}
 else if((m=t.match(/if.*?raids? us[,\s]+(?:i'll|i will)\s+(.+)/))){kind='goal';action=m[1];condition={type:'raids',target:1};}
 else if((m=t.match(/if i lose.*?(?:i'll|i will)\s+(.+)/))){kind='goal';action=m[1];condition={type:'called'};}
 else if((m=t.match(/(?:i'll|i will)\s+(.+)/))){kind='goal';action=m[1];}
 return {kind,quote:text,action:action.slice(0,60),condition,first_person:true,hypothetical:false,quoting_someone_else:false,safety:'ok',confidence:/sure|1000|1,000/.test(t)?.65:.92,deadline:kind==='vow'?'none':kind==='next_stream'?'next_stream':'end_of_stream'};
}
export class Engine{
 constructor({state=fresh(),now=()=>Date.now(),save=()=>{},sim=false}={}){this.s=state;this.now=now;this.save=save;this.sim=sim;this.seen=new Set();}
 commit(type,detail={}){this.save({type,at:this.now(),detail,state:this.s});}
 beat(line,type='beat'){this.s.tab=line;this.s.lastBeat=this.now();this.s.activity.unshift({id:randomUUID(),at:this.now(),type,text:line});this.s.activity=this.s.activity.slice(0,60);}
 add(c,text,source='TYPED'){
  if(this.s.paused||!this.s.enabled[c.kind])return null;const v=validate(c,text);if(v.drop)return null;
  if(v.refused){this.s.refusal=v.reason;this.commit('refused');return null;}
  const dup=this.s.promises.find(p=>!terminal.has(p.state)&&this.now()-p.created<120000&&p.kind===c.kind&&normalize(p.action)===normalize(c.action)&&JSON.stringify(p.condition)===JSON.stringify(c.condition));if(dup)return dup;
  const p={id:randomUUID(),...c,state:'CAUGHT',source,sim:this.sim,created:this.now(),publicAt:null,autoAt:v.hold||this.s.approveAll?null:this.now()+10000,witnesses:{},participants:{},collectors:{},votes:{},bets:{},callers:{},progress:0,modifiers:[],stream:this.s.stream};
  this.s.promises.unshift(p);this.s.refusal=null;this.commit('caught',{id:p.id});return p;
 }
 publish(p,at=this.now()){if(p.state!=='CAUGHT')return;p.state='OPEN';p.publicAt=at;p.witnessEnd=at+30000;p.witnessClose=p.witnessEnd+25000;if(p.kind==='vow')p.vowLeft=normalize(this.s.category)!==normalize(p.condition.category);
  if(p.kind==='time'){p.dueAt=at+p.condition.minutes*60000;p.betLine=Math.max(120,p.condition.minutes*60*this.exchange());p.betEnd=at+60000;p.betClose=at+85000;}
  this.beat('Noted. Witnesses, sign below.','catch');}
 due(p,cause){if(!['OPEN','TRACKING','OWED'].includes(p.state))return;p.state='DUE';p.becameDueAt=this.now();if(p.kind!=='time')p.dueAt=this.now();p.cause=cause;this.beat(p.kind==='time'?'Your promised break is over. We are now operating on streamer time.':'The conditions have been met. '+p.action.charAt(0).toUpperCase()+p.action.slice(1)+'. Please.',p.kind==='time'?'overtime':'due');this.s.activity[0].promiseId=p.id;}
 resolve(p,state,cause){if(terminal.has(p.state))return;p.state=state;p.closed=this.now();p.cause=cause;this.beat(({PAID:'PAID IN FULL. A rare and beautiful transaction.',PLAYED:'Chat got played. The debt remains.',BROKEN:'VOW BROKEN. That aged like milk.',WEASELED:'Cancelled. The record remembers.',KEPT:'A promise kept. Filing this under: unexpected.',SETTLED:'The clock has spoken.'})[state]||state,'result');}
 exchange(){const a=this.s.timeStats.slice(-10).map(x=>x.actual/x.promised).sort((a,b)=>a-b);return a.length?(a[Math.floor((a.length-1)/2)]+a[Math.ceil((a.length-1)/2)])/2:1.7;}
 back(p){if(p.kind!=='time'||!['OPEN','TRACKING','DUE'].includes(p.state))return;const actual=(this.now()-p.publicAt)/1000;this.s.timeStats.push({promised:p.condition.minutes*60,actual});p.ratio=actual/(p.condition.minutes*60);p.actual=actual;this.resolve(p,'SETTLED','streamer return');for(const [id,bet]of Object.entries(p.bets))if((actual>p.betLine?'over':'under')===bet)this.points(id,10);this.beat(`STREAMER TIME ${p.ratio.toFixed(1)}×. Your minutes have an exchange rate now.`,'result');}
 points(id,n){if(this.s.viewers[id])this.s.viewers[id].points+=n;}
 chat({id,login,text,broadcaster=false,bot=false},eventId){
  if(this.s.paused||broadcaster||bot||!id||!/^\w{1,25}$/.test(login))return;if(eventId&&this.seen.has(eventId))return;if(eventId)this.seen.add(eventId);if(this.seen.size>10000)this.seen.delete(this.seen.values().next().value);
  const msg=text.trim().toLowerCase(),now=this.now();let reply,dirty=false;const touch=()=>{dirty=true;this.s.viewers[id]??={login,points:0};};
  if(msg==='!forgetme'){delete this.s.viewers[id];for(const p of this.s.promises)for(const k of ['witnesses','participants','collectors','votes','bets','callers'])delete p[k][id];if(this.s.debtDay)delete this.s.debtDay.votes[id];this.commit('forget');return 'Your viewer record has been removed.';}
  if(msg==='!rank')reply=`${login}: ${this.s.viewers[id]?.points||0} collector points.`;
  if(msg==='!exchange')reply=`1 streamer minute = ${this.exchange().toFixed(1)} real minutes.`;
  if(msg==='!record')reply=`Paid ${this.s.promises.filter(p=>['PAID','KEPT','SETTLED'].includes(p.state)).length} · Broken ${this.s.promises.filter(p=>p.state==='BROKEN').length} · Owed ${this.s.promises.filter(p=>p.state==='OWED').length}`;
  if(msg==='!tab'||msg==='!vows')reply=this.s.promises.filter(p=>!terminal.has(p.state)&&p.state!=='CAUGHT'&&(msg!=='!vows'||p.kind==='vow')).slice(0,3).map(p=>p.action+' ['+p.state+']').join(' · ')||'The tab is clear. Suspicious.';
  const d=this.s.debtDay;if(d&&now<=d.close&&/^!first [123]$/.test(msg)&&!d.votes[id]){const choice=Number(msg.at(-1))-1;if(d.ids[choice]){touch();d.votes[id]=d.ids[choice];}}
  for(const p of this.s.promises){if(!['OPEN','TRACKING','DUE','VOTING'].includes(p.state))continue;
   if(msg==='!witness'&&now<=p.witnessClose&&!p.witnesses[id]){touch();p.witnesses[id]=login;this.points(id,1);}
   if(p.condition.type==='chat_phrase'&&['OPEN','TRACKING'].includes(p.state)&&normalize(msg).split(' ').join(' ').match(new RegExp('(?:^| )'+normalize(p.condition.phrase).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?: |$)'))&&!p.participants[id]){touch();p.participants[id]=login;p.progress++;if(p.progress>=p.condition.target)this.due(p,'unique chat phrase');else if(p.progress/p.condition.target>=.8&&!p.warned){p.warned=true;this.beat('Nearly there. A responsible time to start worrying.','progress');}}
   if(msg==='!itsdue'&&p.condition.type==='called'&&['OPEN','TRACKING'].includes(p.state)){if(!p.callClose){p.callClose=now+45000;touch();}if(now<=p.callClose&&!p.callers[id]){touch();p.callers[id]=login;}}
   if(msg==='!collect'&&p.kind!=='time'&&p.state==='DUE'&&!p.collectors[id]){touch();p.collectors[id]=login;this.points(id,1);}
   if(p.state==='VOTING'&&now<=p.voteClose&&['!paid','!played'].includes(msg)&&!p.votes[id]){touch();p.votes[id]=msg.slice(1);}
   if(p.kind==='time'&&now<=p.betClose&&now<p.publicAt+p.betLine*1000&&['!over','!under'].includes(msg)&&!p.bets[id]){touch();p.bets[id]=msg.slice(1);}
  }if(dirty)this.commit('chat',{command:msg.startsWith('!')?msg.split(' ')[0]:'phrase'});return reply;
 }
 event(type,e={},eventId){if(this.s.paused&&!['stream.online','stream.offline'].includes(type))return;if(eventId&&this.seen.has(eventId))return;if(eventId)this.seen.add(eventId);
  if(type==='channel.chat.message')return this.chat({id:e.chatter_user_id,login:e.chatter_user_login,text:e.message?.text||'',broadcaster:e.chatter_user_id===e.broadcaster_user_id,bot:e.chatter_user_id===e.botId},eventId?eventId+':chat':null);
  if(type==='channel.update'){this.s.category=e.category_name||this.s.category;for(const p of this.s.promises)if(p.kind==='vow'&&normalize(p.condition.category)!==normalize(this.s.category))p.vowLeft=true;for(const p of this.s.promises)if(p.kind==='vow'&&p.vowLeft&&['OPEN','TRACKING'].includes(p.state)&&normalize(p.condition.category)===normalize(this.s.category))this.resolve(p,'BROKEN','Twitch category change');}
  if(type==='stream.offline'){this.s.online=false;for(const p of this.s.promises){if(p.kind==='vow'&&p.deadline==='end_of_stream'&&['OPEN','TRACKING'].includes(p.state))this.resolve(p,'KEPT','stream ended');else if(p.kind!=='vow'&&['OPEN','TRACKING','DUE','VOTING'].includes(p.state)){p.state='OWED';p.voteClose=null;}}}
  if(type==='stream.online'){
   const streamId=e.id||e.stream_id;
   if(streamId&&(this.s.streamId===streamId||(this.s.streamIds||[]).includes(streamId))){this.s.online=true;return;}
   if(!streamId&&this.s.online)return;
   // A new identity is evidence of a new broadcast even if offline was missed.
   this.event('stream.offline');
   this.s.online=true;this.s.stream++;
   if(streamId){this.s.streamId=streamId;this.s.streamIds=[...(this.s.streamIds||[]),streamId].slice(-100);}
for(const p of this.s.promises)if(p.kind==='next_stream'&&p.stream<this.s.stream&&!terminal.has(p.state)){if(normalize(p.condition.category)===normalize(e.category_name||this.s.category))this.resolve(p,'KEPT','next stream category');else p.state='OWED';}const owed=this.s.promises.filter(p=>p.state==='OWED');for(const p of owed){if(p.modifiers.length<3)p.modifiers.push(modifiers[p.modifiers.length]);}if(owed.length){this.s.debtDay={ids:owed.slice(0,3).map(p=>p.id),votes:{},end:this.now()+60000,close:this.now()+85000};this.beat('DEBT DAY. New stream. Same outstanding personality.','debt');}}
  const checker=({'channel.follow':'follows','channel.raid':'raids','channel.subscribe':'subs','channel.cheer':'cheers'})[type];if(checker)for(const p of this.s.promises)if(['OPEN','TRACKING'].includes(p.state)&&p.condition.type===checker){p.progress+=checker==='cheers'?Number(e.bits||0):1;if(p.progress>=p.condition.target)this.due(p,'Twitch '+type);}
  this.commit(type);
 }
 action(type,id){const p=this.s.promises.find(p=>p.id===id);if(type==='pause'){this.s.paused=!this.s.paused;if(this.s.paused)this.s.pauseAt=this.now();else{const dt=this.now()-this.s.pauseAt;for(const p of this.s.promises)for(const k of ['autoAt','witnessEnd','witnessClose','dueAt','betEnd','betClose','voteEnd','voteClose','callClose','publicAt'])if(p[k])p[k]+=dt;if(this.s.debtDay){this.s.debtDay.end+=dt;this.s.debtDay.close+=dt;}}}
  if(type==='quiet')this.s.quiet=!this.s.quiet;
  if(this.s.paused&&!['pause','quiet'].includes(type)){this.commit('paused');return;}
  if(p){if(type==='approve')this.publish(p);if(type==='cancel'){if(p.state==='CAUGHT'){p.state='VOIDED';p.closed=this.now();}else if(!terminal.has(p.state))this.resolve(p,'WEASELED','streamer cancel');}if(type==='confirmDue'&&p.callClose&&Object.keys(p.callers).length&&['OPEN','TRACKING'].includes(p.state)){for(const uid of Object.keys(p.callers))this.points(uid,5);this.due(p,'streamer confirmed chat call');}if(type==='pay'&&p.state==='DUE'){p.state='VOTING';p.votes={};p.voteEnd=this.now()+30000;p.voteClose=p.voteEnd+25000;this.beat('The attempt is in. Chat, audit the receipt.','vote');}if(type==='back')this.back(p);}
  this.commit(type,{id});
 }
 tick(){if(this.s.paused)return;let changed=false;const now=this.now();for(const p of this.s.promises){if(p.state==='CAUGHT'&&p.autoAt&&now>=p.autoAt){this.publish(p,p.autoAt);changed=true;}if(p.state==='OPEN'&&now>p.witnessClose){p.state='TRACKING';changed=true;}if(['OPEN','TRACKING'].includes(p.state)&&((p.kind==='time'&&now>=p.dueAt)||(p.condition.type==='none'&&now>p.witnessClose))){this.due(p,'timer');changed=true;}if(p.state==='VOTING'&&now>p.voteClose){const votes=Object.values(p.votes),paid=votes.filter(v=>v==='paid').length,played=votes.length-paid;if(paid>=played)this.resolve(p,'PAID','unique chat vote, tie to streamer');else{p.state='OWED';p.cause='unique chat vote';this.beat('CHAT GOT PLAYED. This one stays on the tab.','result');}changed=true;}}
  if(this.s.debtDay&&now>this.s.debtDay.close){const d=this.s.debtDay,counts=d.ids.map(id=>({id,n:Object.values(d.votes).filter(v=>v===id).length})).sort((a,b)=>b.n-a.n);const p=this.s.promises.find(p=>p.id===counts[0]?.id);if(p)this.due(p,'Debt Day chat vote');this.s.debtDay=null;changed=true;}if(changed)this.commit('timer');
 }
}
