// ── Show result helper ──
function showResult(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
}
function hideResult(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
}

// ── Age Calculator ──
function calcAge() {
    var dob = document.getElementById("dob").value;
    if (!dob) { showResult("ageResult","Please select your date of birth."); return; }
    var b=new Date(dob), t=new Date();
    var y=t.getFullYear()-b.getFullYear(), m=t.getMonth()-b.getMonth(), d=t.getDate()-b.getDate();
    if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate();}
    if(m<0){y--;m+=12;}
    showResult("ageResult", y+" years, "+m+" months, "+d+" days");
}
function clearAge() {
    var e=document.getElementById("dob"); if(e) e.value="";
    hideResult("ageResult");
}

// ── BMI Calculator ──
function calcBMI() {
    var w=parseFloat(document.getElementById("weight").value), h=parseFloat(document.getElementById("height").value);
    if(!w||!h){showResult("bmiResult","Please enter both weight and height."); return;}
    var bmi=(w/((h/100)*(h/100))).toFixed(1);
    var c=bmi<18.5?"Underweight":bmi<25?"Normal weight":bmi<30?"Overweight":"Obese";
    showResult("bmiResult","BMI: "+bmi+" — "+c);
}
function clearBMI() {
    ["weight","height"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
    hideResult("bmiResult");
}

// ── Percentage Calculator ──
function calcPercent() {
    var p=parseFloat(document.getElementById("percent").value), n=parseFloat(document.getElementById("number").value);
    if(isNaN(p)||isNaN(n)){showResult("percentResult","Please enter both values."); return;}
    showResult("percentResult", p+"% of "+n+" = "+((p/100)*n).toFixed(2));
}
function clearPercent() {
    ["percent","number"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
    hideResult("percentResult");
}

// ── EMI Calculator ──
function calcEMI() {
    var p=parseFloat(document.getElementById("loan").value),
        r=parseFloat(document.getElementById("rate").value),
        mo=parseInt(document.getElementById("months").value);
    if(!p||!r||!mo){showResult("emiResult","Please fill in all three fields."); return;}
    var ri=r/12/100, emi=(p*ri*Math.pow(1+ri,mo))/(Math.pow(1+ri,mo)-1);
    var total=(emi*mo).toFixed(2), interest=(total-p).toFixed(2);
    showResult("emiResult","Monthly EMI: ₹"+emi.toFixed(2)+" | Total: ₹"+total+" | Interest: ₹"+interest);
}
function clearEMI() {
    ["loan","rate","months"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
    hideResult("emiResult");
}

// ── Password Generator ──
function generatePassword() {
    var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    var p=Array.from({length:16},function(){return c[Math.floor(Math.random()*c.length)];}).join("");
    showResult("passwordResult", p);
}
function copyPassword() {
    var e=document.getElementById("passwordResult");
    if(e&&e.textContent) navigator.clipboard.writeText(e.textContent).then(function(){alert("Copied!");});
}
function clearPassword() { hideResult("passwordResult"); }

// ── QR Generator ──
function generateQR() {
    var text=document.getElementById("qrText").value.trim();
    if(!text){alert("Please enter text or URL."); return;}
    var img=document.getElementById("qrImage");
    img.src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+encodeURIComponent(text);
    img.style.display="block";
}
function downloadQR() {
    var img=document.getElementById("qrImage");
    if(!img||!img.src||img.style.display==="none"){alert("Generate a QR code first."); return;}
    var a=document.createElement("a");a.href=img.src;a.download="qrcode.png";a.click();
}
function clearQR() {
    var t=document.getElementById("qrText");if(t)t.value="";
    var img=document.getElementById("qrImage");if(img){img.src="";img.style.display="none";}
}

// ── Word Counter ──
function countWords() {
    var text=document.getElementById("wordText").value.trim();
    if(!text){showResult("wordResult","Please enter some text."); return;}
    var words=text.split(/\s+/).filter(Boolean).length;
    var chars=text.length, noSpace=text.replace(/\s/g,"").length;
    showResult("wordResult","Words: "+words+" | Characters: "+chars+" | Without spaces: "+noSpace);
}
function clearWord() {
    var e=document.getElementById("wordText");if(e)e.value="";
    hideResult("wordResult");
}

// ── Text Repeater ──
function repeatText() {
    var text=document.getElementById("repeatText").value;
    var n=parseInt(document.getElementById("repeatTimes").value);
    if(!text||isNaN(n)||n<1){showResult("repeatResult","Enter text and a valid number."); return;}
    if(n>1000){showResult("repeatResult","Max 1000 repetitions."); return;}
    showResult("repeatResult", Array(n).fill(text).join(" "));
}
function clearRepeater() {
    ["repeatText","repeatTimes"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
    hideResult("repeatResult");
}

// ── Dropdown init (called by loadcomponents) ──
function initDropdownFix() {
    var dropdowns=document.querySelectorAll(".dropdown");
    dropdowns.forEach(function(drop){
        drop.addEventListener("click",function(e){
            if(window.innerWidth<900){
                var menu=this.querySelector(".dropdown-content");
                if(menu){e.preventDefault();menu.style.display=menu.style.display==="block"?"none":"block";}
            }
        });
    });
}

// ── Search tools ──
function searchTools() {
    var q=document.getElementById("toolSearch");
    if(!q) return;
}

// ── Quality range display ──
document.addEventListener("DOMContentLoaded", function(){
    var range=document.getElementById("qualityRange");
    var val=document.getElementById("qualityValue");
    if(range&&val){
        range.addEventListener("input",function(){val.textContent=Math.round(this.value*100)+"%";});
    }
});
