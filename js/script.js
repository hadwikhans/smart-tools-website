/* =========================
   SEARCH TOOL
========================= */

function searchTools(){
let input=document.getElementById("toolSearch").value.toLowerCase()
let cards=document.querySelectorAll(".card")

cards.forEach(card=>{
let text=card.innerText.toLowerCase()

if(text.includes(input)){
card.style.display="block"
}else{
card.style.display="none"
}
})
}


/* =========================
   AGE CALCULATOR
========================= */

function calcAge(){
let dob=document.getElementById("dob").value

if(!dob){
alert("Select date")
return
}

let birth=new Date(dob)
let diff=Date.now()-birth.getTime()
let ageDate=new Date(diff)

let age=Math.abs(ageDate.getUTCFullYear()-1970)

document.getElementById("ageResult").innerText="Age: "+age+" years"
}

function clearAge(){
document.getElementById("dob").value=""
document.getElementById("ageResult").innerText=""
}


/* =========================
   BMI CALCULATOR
========================= */

function calcBMI(){

let w=parseFloat(document.getElementById("weight").value)
let h=parseFloat(document.getElementById("height").value)/100

if(!w || !h){
alert("Enter weight and height")
return
}

let bmi=(w/(h*h)).toFixed(2)

document.getElementById("bmiResult").innerText="BMI: "+bmi
}

function clearBMI(){
document.getElementById("weight").value=""
document.getElementById("height").value=""
document.getElementById("bmiResult").innerText=""
}


/* =========================
   PERCENTAGE CALCULATOR
========================= */

function calcPercent(){

let p=parseFloat(document.getElementById("percent").value)
let n=parseFloat(document.getElementById("number").value)

if(!p || !n){
alert("Enter values")
return
}

let res=(p/100)*n

document.getElementById("percentResult").innerText="Result: "+res
}

function clearPercent(){
document.getElementById("percent").value=""
document.getElementById("number").value=""
document.getElementById("percentResult").innerText=""
}


/* =========================
   LOAN EMI CALCULATOR
========================= */

function calcEMI(){

let P=parseFloat(document.getElementById("loan").value)
let r=parseFloat(document.getElementById("rate").value)/1200
let n=parseFloat(document.getElementById("months").value)

if(!P || !r || !n){
alert("Enter all fields")
return
}

let emi=(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)

document.getElementById("emiResult").innerText="EMI: "+emi.toFixed(2)
}

function clearEMI(){
document.getElementById("loan").value=""
document.getElementById("rate").value=""
document.getElementById("months").value=""
document.getElementById("emiResult").innerText=""
}


/* =========================
   PASSWORD GENERATOR
========================= */

function generatePassword(){

let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
let pass=""

for(let i=0;i<12;i++){
pass+=chars.charAt(Math.floor(Math.random()*chars.length))
}

document.getElementById("passwordResult").innerText=pass
}

function copyPassword(){

let pass=document.getElementById("passwordResult").innerText

if(pass){
navigator.clipboard.writeText(pass)
alert("Password copied!")
}else{
alert("Generate password first")
}

}

function clearPassword(){
document.getElementById("passwordResult").innerText=""
}


/* =========================
   QR CODE GENERATOR
========================= */

function generateQR(){

let text=document.getElementById("qrText").value

if(!text){
alert("Enter text or URL")
return
}

document.getElementById("qrImage").src=
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+encodeURIComponent(text)
}

function downloadQR(){

let img=document.getElementById("qrImage")

if(!img.src){
alert("Generate QR first")
return
}

let canvas=document.createElement("canvas")
let ctx=canvas.getContext("2d")
let image=new Image()

image.crossOrigin="anonymous"

image.onload=function(){

canvas.width=image.width
canvas.height=image.height

ctx.drawImage(image,0,0)

let link=document.createElement("a")
link.download="qr-code.png"
link.href=canvas.toDataURL("image/png")
link.click()

}

image.src=img.src
}

function clearQR(){
document.getElementById("qrText").value=""
document.getElementById("qrImage").src=""
}


/* =========================
   TEXT REPEATER
========================= */

function repeatText(){

let text=document.getElementById("repeatText").value
let count=parseInt(document.getElementById("repeatTimes").value)

if(!text || !count){
alert("Enter text and repeat count")
return
}

if(count>200){
alert("Max limit is 200")
return
}

let result=""

for(let i=0;i<count;i++){
result+=text+" "
}

document.getElementById("repeatResult").innerText=result
}

function clearRepeater(){
document.getElementById("repeatText").value=""
document.getElementById("repeatTimes").value=""
document.getElementById("repeatResult").innerText=""
}


/* =========================
   WORD COUNTER
========================= */

function countWords(){

let text=document.getElementById("wordText").value.trim()

let words=text ? text.split(/\s+/).length : 0

document.getElementById("wordResult").innerText="Words: "+words
}

function clearWord(){
document.getElementById("wordText").value=""
document.getElementById("wordResult").innerText=""
}