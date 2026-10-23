'use strict';
const levels = [
  {name:'First steps',start:[0,4],goal:[3,4],walls:[],task:'Add instructions to reach the gem. The arrows always mean directions on the screen.',hint:'The gem is on the same row, three squares to the right.',answer:'Right → Right → Right. Repeat the sequence once. Or use one Right instruction and repeat it 3 times.',learning:'You built a sequence: instructions run in order. Can you explain what each arrow did?'},
  {name:'Find the bug',start:[0,4],goal:[3,1],walls:[[0,3],[1,3],[2,3],[2,2]],seed:['R','R','U','U','U','U'],task:'One instruction is wrong. Predict where the robot gets stuck, then tap the block you would change. Choose an arrow to replace that block.',hint:'The third instruction tries to move into a rock. Can the robot travel farther right before going up?',answer:'Right → Right → Right → Up → Up → Up. Repeat once. Change the third instruction from Up to Right.',learning:'You debugged a program: predict, test, spot the problem and change an instruction.'},
  {name:'Spot the pattern',start:[0,4],goal:[4,0],walls:[[0,3],[1,2],[2,1],[3,0]],task:'Can you reach the gem using only TWO instruction blocks? Look for a short pattern, then repeat it.',hint:'Try Right, then Up. Where will the robot be if you repeat those two instructions four times?',answer:'Right → Up, with Repeat this whole sequence set to 4 times. Two blocks produce eight moves.',learning:'A loop repeats a sequence. Right → Up repeated four times uses two instruction blocks to produce eight moves.'}
];
const symbols={U:'↑',R:'→',D:'↓',L:'←'};
const words={U:'up',R:'right',D:'down',L:'left'};
const vectors={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
const $=id=>document.getElementById(id);
let level=0,program=[],position=[0,4],visited=new Set(),running=false,runToken=0,editing=null;
const key=([x,y])=>`${x},${y}`;
function drawBoard(){
  const spec=levels[level];$('board').replaceChildren();
  for(let y=0;y<5;y++) for(let x=0;x<5;x++){
    const cell=document.createElement('div');cell.className='cell';
    if(visited.has(key([x,y])))cell.classList.add('visited');
    if(spec.walls.some(([wx,wy])=>wx===x&&wy===y))cell.classList.add('wall');
    if(spec.goal[0]===x&&spec.goal[1]===y){const gem=document.createElement('span');gem.className='gem';cell.append(gem);}
    if(position[0]===x&&position[1]===y){const bot=document.createElement('span');bot.className='bot';cell.append(bot);}
    $('board').append(cell);
  }
  const rocks=spec.walls.length?` Rocks at ${spec.walls.map(([x,y])=>`row ${y+1} column ${x+1}`).join('; ')}.`:' No rocks.';
  $('board').setAttribute('aria-label',`5 by 5 map. Robot at row ${position[1]+1}, column ${position[0]+1}. Gem at row ${spec.goal[1]+1}, column ${spec.goal[0]+1}.${rocks}`);
}
function drawProgram(){
  $('program').replaceChildren();
  program.forEach((c,i)=>{
    const li=document.createElement('li'),button=document.createElement('button');
    button.type='button';button.className='program-block';button.textContent=symbols[c];button.disabled=running;
    button.setAttribute('aria-label',`Instruction ${i+1}: ${words[c]}. Select to change.`);
    button.setAttribute('aria-pressed',String(editing===i));
    button.addEventListener('click',()=>{editing=i;drawProgram();$('status').textContent=`Editing instruction ${i+1}. Choose a direction to replace this block.`;document.querySelector('[data-command="U"]').focus();});
    li.append(button);$('program').append(li);
  });
  document.querySelectorAll('[data-command]').forEach(el=>el.setAttribute('aria-label',editing===null?`Add ${words[el.dataset.command]} instruction`:`Change instruction ${editing+1} to ${words[el.dataset.command]}`));
  $('empty').hidden=program.length>0;
  const times=Number($('repeat').value);
  const body=program.map(c=>`move ${words[c]}`).join('\n');
  $('code').textContent=program.length?(times>1?`repeat ${times} times:\n${body.split('\n').map(line=>'  '+line).join('\n')}`:body):'// Add a direction to begin';
  $('undo').disabled=running||!program.length;$('clear').disabled=running||!program.length;
}
function lock(value){running=value;document.querySelectorAll('[data-command],#repeat,#run').forEach(el=>el.disabled=value);drawProgram();}
function resetRobot(){runToken++;lock(false);position=[...levels[level].start];visited=new Set([key(position)]);drawBoard();$('feedback').hidden=true;$('status').textContent='Predict first: where will the robot finish?';}
function chooseLevel(n){level=n;editing=null;program=[...(levels[n].seed||[])];$('repeat').value='1';resetRobot();$('level-title').textContent=levels[n].name;$('task').textContent=levels[n].task;$('level-count').textContent=`CHALLENGE ${n+1} / 3`;$('hint-text').textContent=levels[n].hint;$('answer-text').textContent=levels[n].answer;$('hint').open=false;$('answer').open=false;document.querySelectorAll('[data-level]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.level)===n)));}
document.querySelectorAll('[data-level]').forEach(el=>el.addEventListener('click',()=>chooseLevel(Number(el.dataset.level))));
document.querySelectorAll('[data-command]').forEach(el=>el.addEventListener('click',()=>{if(editing!==null){program[editing]=el.dataset.command;editing=null;}else{if(program.length>=20){$('status').textContent='You have 20 blocks. Try a shorter sequence or use Repeat.';return;}program.push(el.dataset.command);}resetRobot();drawProgram();}));
$('undo').addEventListener('click',()=>{editing=null;program.pop();resetRobot();drawProgram();});
$('clear').addEventListener('click',()=>{editing=null;program=[];resetRobot();drawProgram();});
$('repeat').addEventListener('change',()=>{resetRobot();drawProgram();});
$('reset').addEventListener('click',resetRobot);
$('run').addEventListener('click',async()=>{
  editing=null;resetRobot();if(!program.length){$('status').textContent='Add at least one instruction, then test your idea.';return;}
  const token=runToken,spec=levels[level],times=Number($('repeat').value);let moves=0;
  lock(true);
  for(let cycle=0;cycle<times;cycle++)for(let i=0;i<program.length;i++){
    if(token!==runToken)return;
    [...$('program').children].forEach((el,n)=>el.classList.toggle('active',n===i));
    $('status').textContent=`Testing instruction ${i+1} of ${program.length} · repeat ${cycle+1} of ${times}…`;
    await new Promise(resolve=>setTimeout(resolve,400));
    if(token!==runToken)return;
    const [dx,dy]=vectors[program[i]],next=[position[0]+dx,position[1]+dy];
    if(next.some(n=>n<0||n>4)||spec.walls.some(p=>key(p)===key(next))){$('status').textContent=`Stopped at instruction ${i+1} (${words[program[i]]}), repeat ${cycle+1}: ${next.some(n=>n<0||n>4)?'edge of the map':'a rock is in the way'}. Change one instruction and test again.`;lock(false);return;}
    position=next;visited.add(key(position));moves++;drawBoard();
  }
  lock(false);
  const won=key(position)===key(spec.goal);
  if(won){$('status').textContent=`Gem collected! ${program.length} instruction ${program.length===1?'block':'blocks'} · ${times} ${times===1?'run':'repeats'} · ${moves} moves.`;$('feedback').hidden=false;$('learning').textContent=spec.learning+(level===2&&program.length>2?' Now try the same route with only two blocks and Repeat.':'');$('next').textContent=level===2?'Play again →':'Next challenge →';}
  else $('status').textContent=`Your program finished at row ${position[1]+1}, column ${position[0]+1}. The gem is at row ${spec.goal[1]+1}, column ${spec.goal[0]+1}. What could you change?`;
});
$('next').addEventListener('click',()=>{chooseLevel((level+1)%levels.length);$('level-title').scrollIntoView({block:'start',behavior:'auto'});});
$('print').addEventListener('click',()=>window.print());
$('copy-link').addEventListener('click',async()=>{const url='https://rashyaakb.github.io/codewarts-academy/treasure-trail/';try{await navigator.clipboard.writeText(url);$('share-status').textContent='Activity link copied. Share it with someone who enjoys a puzzle.';}catch{$('share-status').textContent=`Copy this link: ${url}`;}});
chooseLevel(0);
