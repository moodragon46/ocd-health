var questionAnimTime = 1;

var c, ctx;

var started = false;
var question = 0;
var questionAnimTimeLeft;


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
        drawButton("No..? What are you talking about?",50,90,540,40,20);
        drawButton("Yes! I couldn't help but notice the bad grammar!",50,150,540,40,20);

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
}

function now(){
    return Date.now()/1000;
}

function write(text, x, y, size, col) {
    ctx.font = size + "px Verdana";
    ctx.fillStyle = col || "black";
    ctx.fillText(text, x, y);
}

function drawButton(text, x, y, width, height, fontSize, foreCol, backCol){
    //text position
    var textSize = ctx.measureText(text);
    var textX = x + (width/2) - (textSize.width / 2);
    var textY = y + (height/2) + fontSize/3;

    ctx.fillStyle = backCol || '#ccc';
    ctx.fillRect(x,y,width,height);

    write(text,textX,textY,fontSize,foreCol);
}

function render(){
    tick();
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,640,480);

    if(!started){
        write("OCD TEsT", 150, 240, 60);
        write("PresS aNy kEY TO sTArT", 130, 300, 30);
    }else if(question > 0){
        if(questionAnimTimeLeft > 0){
            questionAnimTimeLeft -= dt;
            renderQuestionAnim("Question 1",1-(questionAnimTimeLeft/questionAnimTime));
        }else {
            renderQuestion();
        }
    }else {
        // just started the game
        var secondsLeft = Math.floor(6 - (now() - started));
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

    tick();
    requestAnimationFrame(render);
}

window.addEventListener("keydown", function(e){
    var w = e.which || e.keyCode;

    if(!started){
        started = now();
    }
});
