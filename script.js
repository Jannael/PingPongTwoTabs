const currentPage = (location.href.split("?")[1] === "2") ? "2" : "1";
localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
localStorage.setItem(`innerHeight-${currentPage}`, innerHeight);

//save the inner height and width of the each page
window.onresize = () => {
    localStorage.setItem(`innerWidth-${currentPage}`, innerWidth);
    localStorage.setItem(`innerHeight-${currentPage}`, innerHeight);
}

let isPlaying = false;
let countPlayer = 0;
let countBot = 0;

class bot {
    constructor(difficult){
        this.difficult = difficult;
        if(difficult == "Easy"){
            this.speed = 2;
        }else if(difficult == "Medium"){
            this.speed = 15;
        }
    }
    move(){
        const root = document.querySelector(":root");
        const top = Number(localStorage.getItem("ballPositionTop"));
        let topBot = Number(localStorage.getItem("botPosition"));
        if(this.difficult === "Literally impossible"){
            root.style.setProperty("--top-bot", (topBot = top - 30) + "px");
        }else{
            if((top >= topBot && top <= topBot + 100)){
                return false;
            }else if((topBot - 30) < top){
                root.style.setProperty("--top-bot", (topBot += this.speed) + "px");
            }else if((topBot + 30) > top){
                root.style.setProperty("--top-bot", (topBot -= this.speed) + "px");
            }    
        }
        localStorage.setItem("botPosition", topBot);
    }
}

class player {
    constructor(element, position, speed){
        this.element = element;
        this.position = position;
        this.speed = speed;
    }
    moveUp(){
        if(this.position <= 0){
            return false; //avoid go out of the screen
        }
        this.position = this.position - this.speed;
        this.element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("playerPosition", this.position)
    }
    moveDown(){
        if(this.position >= innerHeight - 100){
            return false; //avoid go out of the screen
        }
        this.position = this.position + this.speed;
        this.element.style.setProperty("--top-user", this.position + "px");
        localStorage.setItem("playerPosition", this.position)
    }
}

class ball {
    constructor(element, positionX, positionY, speedX, speedY, widthScreen, heightScreen){
        this.widthScreen = widthScreen;
        this.heightScreen = heightScreen;
        this.element = element;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    move(){
        if(this.positionX <= 0){
            this.speedX = -this.speedX;
            this.positionX = this.widthScreen / 2;
            if(isPlaying) countBot++;
        }
        if(this.positionX >= this.widthScreen - 40){
            this.speedX = -this.speedX;
            this.positionX = this.widthScreen / 2;
            if(isPlaying) countPlayer++;
        }
        if(this.positionY >= this.heightScreen - 40
            || this.positionY <= 0){
            this.speedY = -this.speedY;
        }

        this.positionX = this.positionX + this.speedX;
        this.positionY = this.positionY + this.speedY;
        this.element.style.setProperty("top", this.positionY + "px");
        this.element.style.setProperty("left", this.positionX + "px");
        localStorage.setItem("ballPositionTop", this.positionY); 
        localStorage.setItem("ballPositionLeft", this.positionX);
    }
    moveOfLocalStorageSecondScreen(){
        const top = Number(localStorage.getItem("ballPositionTop"));
        const left = Number(localStorage.getItem("ballPositionLeft")) - Number(localStorage.getItem("innerWidth-1"));
        this.element.style.setProperty("top", top + "px");
        this.element.style.setProperty("left", left + "px");
    }
    checkCollisionWithPlayerOrBot(){
        const ballPositionLeft = this.element.style.getPropertyValue("left").replace("px", "");
        const ballPositionTop = this.element.style.getPropertyValue("top").replace("px", "");
        const playerPosition = Number(localStorage.getItem("playerPosition"));
        const botPosition = Number(localStorage.getItem("botPosition"));
        if((ballPositionLeft <= 35)
        &&(ballPositionTop >= playerPosition -15 && ballPositionTop<= playerPosition + 115)){
            this.speedX = -this.speedX;
        }

        //its minus 70 because balls width is 40px and the hitBox is on the top left corner
        if(((this.widthScreen - 75) <= ballPositionLeft)
        &&(ballPositionTop >= botPosition - 15 && ballPositionTop <= botPosition + 115)){
            this.speedX = -this.speedX;
        }

        //check for win
        if(countPlayer === 5){
            alert("Player win!");
            countPlayer = 0;
            countBot = 0;
        }else if(countBot === 5){
            alert("Bot win!");
            countPlayer = 0;
            countBot = 0;
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const $btnPlay = document.querySelector('.btn-play');
    let botOnSecondPage = new bot("Literally impossible");
    let playerFirstScreen = undefined;

    //height and width of the two pages
    let totalWidth = Number(localStorage.getItem(`innerWidth-1`)) + Number(localStorage.getItem(`innerWidth-2`));
    let minHeight = Math.min(Number(localStorage.getItem(`innerHeight-1`)), Number(localStorage.getItem(`innerHeight-2`)));
    let ballToPlay = new ball(document.querySelector(".ball"), innerWidth / 2, innerHeight / 2, 5, 5, totalWidth, minHeight);

    //validate if we are on the second page
    if(currentPage === "2"){
        document.querySelector('.ask-players').style.display = 'none';
        document.querySelector('.container-1').classList.replace(`container-1`, `container-2`);
        if(localStorage.getItem("botDifficult") !== null){
            botOnSecondPage = new bot(localStorage.getItem("botDifficult"));
        }
        const updateBot = ()=>{
            requestAnimationFrame(updateBot);
            botOnSecondPage.move();
            ballToPlay.moveOfLocalStorageSecondScreen();
        }
        updateBot();
    }else{
        localStorage.setItem("playerPosition", 100);
        playerFirstScreen = new player(document.querySelector(".user"), Number(localStorage.getItem("playerPosition")), 25);
        const updateBall = ()=>{
            requestAnimationFrame(updateBall);
            ballToPlay.move();
            ballToPlay.checkCollisionWithPlayerOrBot();
        }
        updateBall();
    }
    
    $btnPlay.addEventListener('click', () => {
        document.querySelector('.ask-players').style.display = 'none';
    
        //ask for the difficulty
        const $selectDifficulty = document.querySelector('.select-difficulty');
        const $btn = $selectDifficulty.querySelectorAll('button');
    
        //show the difficult selector
        $selectDifficulty.style.display = 'flex';
        $btn.forEach(($btn) => {
            $btn.addEventListener('click', () => {
                $selectDifficulty.style.display = 'none';
                isPlaying = true;
                document.querySelector('.ask-players').style.display = 'none';
                window.open(location.href.split("?")[0] + "?2", "_blank");
                localStorage.setItem("botDifficult", $btn.innerText);
                if($btn.innerText === "Literally impossible"){
                    ballToPlay.speedX = 25;
                    ballToPlay.speedY = 25;
                }
            });
        });
    });
    
    document.addEventListener("keydown", (e)=>{
        const keyUp = "w";
        const keyDown = "s"
        if(e.key === keyUp){
            playerFirstScreen.moveUp();
        }else if(e.key === keyDown){
            playerFirstScreen.moveDown();
        }
    })
})
