// Holds an exact 300 ms of PCM before the speech threshold is crossed.
export class AudioTurns {
 constructor(rate=24000){this.rate=rate;this.pre=new Int16Array(0);this.speaking=false;this.silent=0;this.frames=0;}
 push(pcm,loud){
  if(!this.speaking&&!loud){const joined=new Int16Array(this.pre.length+pcm.length);joined.set(this.pre);joined.set(pcm,this.pre.length);this.pre=joined.slice(-Math.round(this.rate*.3));return {chunks:[],commit:false};}
  const chunks=[];if(!this.speaking){if(this.pre.length)chunks.push(this.pre);this.pre=new Int16Array(0);this.speaking=true;}
  chunks.push(pcm);this.silent=loud?0:this.silent+pcm.length;this.frames+=chunks.reduce((n,c)=>n+c.length,0);
  const commit=this.silent>this.rate*.65||this.frames>this.rate*18;
  if(commit){this.speaking=false;this.silent=0;this.frames=0;}
  return {chunks,commit};
 }
}
