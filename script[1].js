let focusStart
let quiz=[]
let qIndex=0
let score=0

function nav(page){

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"))

document.getElementById("p"+page).classList.add("active-page")

if(page===3){

focusStart=Date.now()

setInterval(()=>{

let sec=Math.floor((Date.now()-focusStart)/1000)

document.getElementById("focusTime").innerText=sec+" sec"

},1000)

}

}

function setMode(mode){

document.body.className=mode

nav(3)

}

function processText(){

let text=document.getElementById("textInput").value

let sentences=text.split(/[.!?]/).filter(s=>s.length>10)

let out=document.getElementById("output")

out.innerHTML=""

sentences.forEach(s=>{

out.innerHTML+=`<div class="textChunk">${s}</div>`

})

generateSummary(sentences)

generateQuiz(sentences)

}

function generateSummary(sentences){

let summary=sentences.slice(0,3).join(". ")

document.getElementById("output").innerHTML+=

`<div class="dashboard"><h3>AI Study Summary</h3><p>${summary}</p></div>`

}

function speakText(){

let text=document.getElementById("textInput").value

speechSynthesis.speak(new SpeechSynthesisUtterance(text))

}

function showVisual(){

let img=document.createElement("img")

img.src="https://source.unsplash.com/800x400/?education"

img.style.width="100%"

document.getElementById("output").appendChild(img)

}

function generateDiagram(){

let words=document.getElementById("textInput").value.split(" ").slice(0,6)

let canvas=document.getElementById("diagramCanvas")

let ctx=canvas.getContext("2d")

canvas.width=800
canvas.height=400

ctx.clearRect(0,0,800,400)

let cx=400
let cy=200

ctx.fillText(words[0]||"Topic",cx,cy)

for(let i=1;i<words.length;i++){

let angle=(i*Math.PI*2)/words.length

let x=cx+150*Math.cos(angle)

let y=cy+150*Math.sin(angle)

ctx.beginPath()
ctx.moveTo(cx,cy)
ctx.lineTo(x,y)
ctx.stroke()

ctx.fillText(words[i],x,y)

}

}

function generateQuiz(sentences){

quiz=[]

sentences.slice(0,3).forEach(s=>{

let words=s.split(" ")

let key=words[Math.floor(words.length/2)]

quiz.push({

q:s.replace(key,"_____"),

a:key.toLowerCase(),

opts:[key,"concept","data","theory"]

})

})

}

function startQuiz(){

if(quiz.length===0){

alert("Generate quiz first")

return

}

nav(4)

showQuestion()

}

function showQuestion(){

let q=quiz[qIndex]

document.getElementById("question").innerText=q.q

let optBox=document.getElementById("options")

optBox.innerHTML=""

q.opts.forEach(o=>{

let btn=document.createElement("button")

btn.className="quizBtn"

btn.innerText=o

btn.onclick=()=>{

if(o.toLowerCase()===q.a)score++

qIndex++

updateProgress()

if(qIndex<quiz.length)showQuestion()
else showResult()

}

optBox.appendChild(btn)

})

}

function updateProgress(){

let p=Math.floor((qIndex/quiz.length)*100)

document.getElementById("progress").innerText=p+"%"

document.getElementById("progressFill").style.width=p+"%"

}

function showResult(){

document.getElementById("quizBox").style.display="none"

document.getElementById("result").classList.remove("hidden")

document.getElementById("score").innerText=score+" / "+quiz.length

}