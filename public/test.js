var questionAnimTime = 1;

var c, ctx;

var started = false;
var question = 0;
var questionAnimTimeLeft;

var timer;

var mouse = [0,0];

var points = 0;

var imgs = {};

var last;
var dt;
function tick(){
    var currentTime = now();
    dt = currentTime-last;
    last = currentTime;
}

// Questions
function renderQuestion(){
    switch(question){
    case 1:
        
        write("Did the countdown at the start of this test annoy you?", 10, 50, 20);

        drawButton("No..?",50,90,540,40,20);
        drawButton("Yes!",50,150,540,40,20);

        break;
    case 2:
        timer -= dt;

        drawImg('testA', 10, 10);
        
        write(Math.ceil(timer)+" seconds left.", 10, 350, 20);
        drawButton("Click here if there is something wrong with this brick wall.", 10, 400, 620, 40, 20);

        break;
    }
}
function handleQuestionPress(x,y){
    switch(question){
    case 1:
        if(pointInRect(x,y,50,90,540,40)){
            //Press no
            points++;
            nextQuestion();
        }else if(pointInRect(x,y,50,150,540,40)){
            // press yes
            nextQuestion();
        }
        break;
    }
}



function renderQuestionAnim(text,progress){
    var prog = Math.min(progress * 2, 1);// Progress

    var textLen = text.length;
    var thisFrameText = text.slice(0,Math.ceil(text.length*prog));
    write(thisFrameText, 150, 240, 60, 'red');
}

function nextQuestion(){
    question++;
    questionAnimTimeLeft = questionAnimTime;

    switch(question){
    case 2:
        timer = 5;
        break;
    }
}

function now(){
    return Date.now()/1000;
}

function write(text, x, y, size, col) {
    ctx.font = size + "px Verdana";
    ctx.fillStyle = col || "black";
    ctx.fillText(text, x, y);
}

function loadImgs(imgNames, onload){
    for(var i=0;i<imgNames.length;i++){
        imgs[imgNames[i]] = new Image();

        if(i===imgNames.length-1){
            imgs[imgNames[i]].onload = onload;
        }

        imgs[imgNames[i]].src = 'images/'+imgNames[i]+'.jpg';
    }
}
function drawImg(imgName,x,y){
    ctx.drawImage(imgs[imgName], x, y);
}

function pointInRect(x1,y1,x2,y2,w2,h2){
    return x1>x2 && x1<x2+w2 && y1>y2 && y1<y2+h2;
}

function drawButton(text, x, y, width, height, fontSize, foreCol, backCol, backColHighlight){
    //text position
    var textSize = ctx.measureText(text);
    var textX = x + (width/2) - (textSize.width / 2);
    var textY = y + (height/2) + fontSize/3;

    if(pointInRect(mouse[0],mouse[1],x,y,width,height)){
        ctx.fillStyle = backColHighlight || "#999";
    }else {
        ctx.fillStyle = backCol || '#ccc';
    }
    ctx.fillRect(x,y,width,height);

    write(text,textX,textY,fontSize,foreCol);
}

function render(){
    tick();
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,640,480);

    if(!started){
        write("OCD TEsT", 150, 240, 60);
        write("Click to sTart", 200, 300, 30);
    }else if(question > 0){
        if(questionAnimTimeLeft > 0){
            questionAnimTimeLeft -= dt;
            renderQuestionAnim("Question "+question,1-(questionAnimTimeLeft/questionAnimTime));
        }else {
            renderQuestion();
        }
    }else {
        // just started the game
        var secondsLeft = Math.floor(6 - (now() - started));
        //var secondsLeft = Math.floor(1 - (now() - started));// for testing

        if(secondsLeft <= 0){
            nextQuestion();
        }else {
            write("Test starts in "+secondsLeft+" second.", 130, 100, 30);
            write("Answer the questions honestly and as quickly", 100, 200, 20);
            write("as possible for best results.", 100, 230, 20);
        }
    }

    requestAnimationFrame(render);
}

window.onload = function(){
    c = this.document.getElementById("c");
    ctx = c.getContext("2d");

    loadImgs(['testA'],function(){
        tick();

        requestAnimationFrame(render);
    })

    c.addEventListener("pointermove",function(e){
        pointerMove(e.offsetX, e.offsetY);
    });
    
    c.addEventListener("pointerdown",function(e){
        pointerDown(e.offsetX, e.offsetY);
    });
}

function pointerMove (x,y){
    mouse = [x,y];
}

function pointerDown (x,y){
    if(!started){
        started = now();
    }

    handleQuestionPress(x,y);
}