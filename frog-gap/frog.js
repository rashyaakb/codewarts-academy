'use strict';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const test=document.querySelector('#test'),result=document.querySelector('#result');
const inputs=[...document.querySelectorAll('input[name="speed"]')];
let state={x:220,y:736,vy:0,landed:false,failed:false,coin:false},running=false,ticks=0,previous=0,accumulator=0,activeSpeed=4;
const tested=new Set();
function draw(){
 ctx.fillStyle='#092e37';ctx.fillRect(0,0,720,850);
 ctx.fillStyle='#b6e0b5';ctx.beginPath();ctx.arc(570,160,65,0,Math.PI*2);ctx.fill();ctx.fillStyle='#092e37';ctx.beginPath();ctx.arc(548,145,60,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#134c4c';for(let k=0;k<7;k++){let x=k*130-40;ctx.beginPath();ctx.moveTo(x,780);ctx.lineTo(x+70,280+(k%3)*60);ctx.lineTo(x+140,780);ctx.fill();}
 ctx.fillStyle='#a4cf75';ctx.fillRect(0,780,260,15);ctx.fillRect(440,780,280,15);ctx.fillStyle='#42765a';ctx.fillRect(0,795,260,55);ctx.fillRect(440,795,280,55);
 ctx.strokeStyle='#6fbdc0';ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(280+i*45,815,24,0,Math.PI);ctx.stroke();}
 if(!state.coin){ctx.fillStyle='#ffe279';ctx.beginPath();ctx.arc(600,735,18,0,Math.PI*2);ctx.fill();}
 if(state.y<850){let x=state.x,y=state.y;ctx.fillStyle='#80dc93';ctx.beginPath();ctx.roundRect(x,y,36,44,9);ctx.fill();for(let dx of [7,26]){ctx.fillStyle='#b6f0a4';ctx.beginPath();ctx.arc(x+dx,y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#173f43';ctx.beginPath();ctx.arc(x+dx+1,y-1,2,0,Math.PI*2);ctx.fill();}}
 ctx.fillStyle='#ffe279';ctx.font='bold 29px Arial';ctx.fillText('FROG GAP',35,58);ctx.fillStyle='#bce3dc';ctx.font='21px Arial';ctx.fillText('SPEED '+activeSpeed+' · JUMP −14 · GRAVITY 0.7',35,96);
 if(state.failed||state.coin){ctx.textAlign='center';ctx.font='bold 25px Arial';ctx.fillStyle=state.coin?'#ffe279':'#ffb4a1';ctx.fillText(state.coin?'COIN COLLECTED':'MISSED THE PLATFORM',360,230);ctx.textAlign='left';}
}
function step(){
 if(!state.failed){state.x+=activeSpeed;if(!state.landed){const oldBottom=state.y+44;state.vy+=.7;state.y+=state.vy;if(state.vy>0&&oldBottom<=780&&780<=state.y+44&&(state.x+36<=260||state.x>=440)){state.y=736;state.vy=0;state.landed=true;}}if(state.y>1100)state.failed=true;if(state.landed&&state.x>=560)state.coin=true;state.x=Math.min(state.x,620);}
 ticks++;
}
function frame(now){
 accumulator+=Math.min(100,now-previous);previous=now;
 while(accumulator>=1000/60&&ticks<180){step();accumulator-=1000/60;}draw();
 if(ticks<180){requestAnimationFrame(frame);return;}
 running=false;test.disabled=false;inputs.forEach(i=>i.disabled=false);tested.add(activeSpeed);
 result.textContent=state.coin?'Landed! Speed 7 crosses the gap. The jump and gravity stayed the same.':'Too short! Speed 4 falls into the gap. Try speed 7 with the same jump.';
 document.querySelector('#comparison').textContent=tested.size===2?'Both tested: speed 4 misses; speed 7 lands. What changed? Horizontal speed. What stayed fixed? Jump impulse and gravity.':'Now try the other speed to compare.';
}
test.addEventListener('click',()=>{
 if(running)return;activeSpeed=Number(document.querySelector('input[name="speed"]:checked').value);state={x:220,y:736,vy:-14,landed:false,failed:false,coin:false};ticks=0;accumulator=0;running=true;test.disabled=true;inputs.forEach(i=>i.disabled=true);result.textContent='Testing your prediction…';previous=performance.now();requestAnimationFrame(frame);
});
inputs.forEach(input=>input.addEventListener('change',()=>{activeSpeed=Number(input.value);document.querySelector('#rule').textContent=`run_speed = ${activeSpeed}\nx += run_speed\nvy += 0.7\ny += vy`;state={x:220,y:736,vy:0,landed:false,failed:false,coin:false};result.textContent='Prediction ready? Press Test to compare.';draw();}));
draw();
