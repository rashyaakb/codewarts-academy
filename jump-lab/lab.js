const canvas=document.querySelector('#game'), ctx=canvas.getContext('2d');
const test=document.querySelector('#test'), result=document.querySelector('#result');
const floor=985, coin={x:330,y:770};
let state={x:155,y:941,vy:0,collected:false}, running=false, previous=0, accumulator=0, steps=0;
function reset(){state={x:155,y:941,vy:0,collected:false};steps=0;}
function draw(){
 const gradient=ctx.createLinearGradient(0,0,0,1100);gradient.addColorStop(0,'#10223e');gradient.addColorStop(1,'#234759');ctx.fillStyle=gradient;ctx.fillRect(0,0,720,1100);
 ctx.fillStyle='#365e71';ctx.beginPath();ctx.arc(555,245,70,0,Math.PI*2);ctx.fill();ctx.fillStyle='#9bcabe';ctx.beginPath();ctx.arc(540,233,53,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#27495a';for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(i*130-70,985);ctx.lineTo(i*130+10,620+i%3*60);ctx.lineTo(i*130+95,985);ctx.fill();}
 ctx.fillStyle='#75b686';ctx.fillRect(0,floor,720,15);ctx.fillStyle='#1a3544';ctx.fillRect(0,floor+15,720,100);
 ctx.strokeStyle='#7398bc';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(540,855,85,130,36);ctx.stroke();
 if(!state.collected){ctx.fillStyle='#ffe279';ctx.beginPath();ctx.arc(coin.x,coin.y,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a27d34';ctx.fillRect(coin.x-3,coin.y-10,6,20);}
 ctx.fillStyle='#6bd8bd';ctx.beginPath();ctx.roundRect(state.x,state.y,40,44,9);ctx.fill();ctx.fillStyle='#162c3e';ctx.fillRect(state.x+23,state.y+17,5,7);ctx.fillRect(state.x+32,state.y+17,5,7);ctx.fillStyle='#ebbe67';ctx.fillRect(state.x-3,state.y+30,46,8);
 ctx.fillStyle='#ffe279';ctx.font='bold 32px system-ui';ctx.fillText('JUMP LAB',40,70);ctx.fillStyle='#c9e4e9';ctx.font='22px system-ui';ctx.fillText('COINS '+(state.collected?'1 / 1':'0 / 1'),500,70);
}
function step(){
 state.vy+=0.7;state.y+=state.vy;state.x=Math.min(566,state.x+5.5);
 if(Math.hypot(state.x+20-coin.x,state.y+22-coin.y)<37)state.collected=true;
 if(state.y>=floor-44){state.y=floor-44;state.vy=0;}
 steps++;
}
function frame(now){
 accumulator+=Math.min(100,now-previous);previous=now;
 while(accumulator>=1000/60 && steps<100){step();accumulator-=1000/60;}
 draw();
 if(steps<100){requestAnimationFrame(frame);}else{running=false;test.disabled=false;result.textContent=state.collected?'Coin collected! One number changed the result. Try the other speed to compare.':'Too low: the coin was missed. Try a stronger jump and test again.';}
}
test.addEventListener('click',()=>{if(running)return;reset();state.vy=Number(document.querySelector('input[name="speed"]:checked').value);running=true;test.disabled=true;result.textContent='Testing your prediction…';previous=performance.now();accumulator=0;requestAnimationFrame(frame);});
document.querySelectorAll('input[name="speed"]').forEach(input=>input.addEventListener('change',()=>{document.querySelector('#jump-rule').textContent='jump_speed = '+input.value;result.textContent=running?'This selection will apply to your next test.':'Prediction ready? Press Test to compare.';}));
draw();
