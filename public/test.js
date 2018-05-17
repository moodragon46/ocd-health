var questionAnimTime = 1;

var c, ctx;

var started = false;
var question = 0;
var questionAnimTimeLeft;

var numberSamplesQ3 = [
    [83, 72, 1],
    [2, 36, 53],
    [9, 89, 32]
];
var q3ans = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
]
var q3pressedDone = false;

var timer;

var mouse = [0,0];
var buttons = [];

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
        
        var timeVal = Math.ceil(timer);
        var timeText = Math.ceil(timer)+" seconds left."
        if(timeVal === 1){
            timeText = "1 second left.";
        }
        write(timeText, 10, 350, 20);
        write("Click if you notice something on the brick wall.", 10, 400, 20);

        if(timer <= 0){
            nextQuestion();
        }

        break;
    case 3:
        write("Click all the prime numbers. No cheating!",10,50,30);

        for(var y=0;y<numberSamplesQ3.length;y++){
            for(var x=0;x<numberSamplesQ3[y].length;x++){
                var isHighlight = q3ans[y][x];
                drawButton(
                    numberSamplesQ3[y][x], 170 + 100 * x, 150 + 80 * y, 70, 40, 20,
                    false, isHighlight?'#0c0':'#f40', isHighlight?'#0f0':'#fb0'
                );
            }
        }

        drawButton(q3pressedDone?'Are you sure?':'Done',q3pressedDone?220:270,400,q3pressedDone?200:100,40,20);

        if(q3pressedDone){
            timer+=dt;
        }

        break;
    }
}
function handleQuestionPress(x,y){
    switch(question){
    case 1:
        if(clickedButton("No..?",x,y)){
            //Press no
            nextQuestion();
        }else if(clickedButton("Yes!",x,y)){
            // press yes
            points++;
            nextQuestion();
        }
        break;
    case 2:
        if(pointInRect(x,y,50, 190, 30, 60)){
            points++;
            nextQuestion();
        }
        break;
    case 3:
        for(var j=0;j<numberSamplesQ3.length;j++){
            for(var k=0;k<numberSamplesQ3[j].length;k++){
                var currentNumber = numberSamplesQ3[j][k];
                if(clickedButton(currentNumber,x,y)){
                    q3ans[j][k] = !q3ans[j][k];
                }
            }
        }

        if(clickedButton('Done',x,y)){
            q3pressedDone = true;
            timer = 0;
        }
        if(clickedButton('Are you sure?',x,y)){
            if(timer < 3){
                points++;
            }
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
        timer = 8;
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

function clickedButton(name,x,y){
    for(var i=0;i<buttons.length;i++){
        if(buttons[i].name === name){
            if(pointInRect(x,y,buttons[i].x,buttons[i].y,buttons[i].w,buttons[i].h)){
                return true;
            }
        }
    }
    return false;
}
function clearButtons(){
    buttons = [];
}
function drawButton(text, x, y, width, height, fontSize, foreCol, backCol, backColHighlight){
    //text position
    var textSize = ctx.measureText(text);
    var textX = x + (width/2) - (textSize.width / 2);
    var textY = y + (height/2) + fontSize/3;

    if(pointInRect(mouse[0],mouse[1],x,y,width,height)){
        ctx.fillStyle = backColHighlight || "#ccc";
    }else {
        ctx.fillStyle = backCol || '#999';
    }
    ctx.fillRect(x,y,width,height);

    write(text,textX,textY,fontSize,foreCol);

    // Add to buttons
    buttons.push({name:text, x:x, y:y, w:width, h:height});
}

function render(){
    clearButtons();
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
        // var secondsLeft = Math.floor(6 - (now() - started));
        var secondsLeft = Math.floor(1 - (now() - started));// for testing

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