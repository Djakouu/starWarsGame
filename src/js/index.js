// TODO
// score handler done
// time handler done
// start/stop/ start_over button effects done
// pause/resume button done
// game.startover() function done
// toggle buttons on buttons handler done
// "next/previous level" buttons done
//
// end of the Game : done
    // time out done
    // 0 enemies done
// Git done
//
// Rules
// Transition fade in start
// Robot class
// Change robot speed !
// Sound effects
// Heroku/ mywebsite
// Responsive


import Position from "./models/Position"
import Robot from "./models/Robot"
import * as spriteView from "./views/spriteView"
import * as positionView from "./views/positionView"
import * as controlPanelView from "./views/controlPanelView"
import * as startGame from "./startGame"

export const game = new class {
  constructor(
          nom,
          arrowLeft=false, arrowUp=false, arrowRight=false, arrowDown=false,
          robot,
          run=true,
          tFrameLast=0,
          level=1,
          enemies=[],
          score=0,
          time=181999
      ) {
    this.nom = nom;
    this.arrowLeft = arrowLeft;
    this.arrowUp = arrowUp;
    this.arrowRight = arrowRight;
    this.arrowDown = arrowDown;
    this.robot = robot;
    this.run = run;
    this.tFrameLast= tFrameLast;
    this.level=level;
    this.enemies=enemies;
    this.touched=false // A lock for updating score after collision with darthvader.
    this.score=score;
    this.time=time;
  }
  start() {
    // Demarrage du jeux  
    this.run = true;    
    startGame.startLevel(this.level)
    // Lunch time
    controlPanelView.lunchTime(); 
    // Toggle buttons
    controlPanelView.toggleButtons("start")
  }

  stop() {
    console.log("stop")
    game.run=false;
    // Remove the robot
    const elem = document.getElementById(this.robot.id);
    elem.parentNode.removeChild(elem);
    this.robot = null;
    // Remove enemies
    this.enemies.forEach(enemy => {
      const elem = document.getElementById(enemy.id);
      elem.parentNode.removeChild(elem);
    })
    this.enemies=[];
    // reset Arrows
    this.arrowLeft = false;
    this.arrowUp = false;
    this.arrowRight = false;
    this.arrowDown = false;
    // Reset the score
    this.score=0;
    controlPanelView.updateScore(this.score);
    // Reset tFrameLast
    // Reset the controlPanel time
    controlPanelView.stopTime();
    // Toggle buttons
    controlPanelView.toggleButtons("stop")
  }

  startOver() {
    if (document.getElementById("timeLeftInput").value == "TIME'S UP!")
      document.getElementById("timeLeftInput").value = "02:00"
    this.run=true;
    main(0, true)
    this.start(); 
  }

  pause() {
    this.run = false;
    // Pause the time
    controlPanelView.pauseTime();
  }

  resume() {
    // Resume the game animation
    this.run = true;
    main(0, true);
    // Resume the time
    controlPanelView.resumeTime();
  }

  update(tFrame) {
    // Stop the game if time out
    if (document.getElementById("timeLeftInput").value == "TIME'S UP!") 
      this.stop();
    // Stop the game if this.enemies.length = 0
    if (this.robot && this.enemies.length <= ((this.level-1)*2)+1) {
    //((this.level-1)*2)+1): means 1 darthvader left for level 1,
    // Three darthvader for level 2 and 5 darthvader for level 3
      const lastTime = document.getElementById("timeLeftInput").value
      const lastScore = document.getElementById("scoreInput").value
      this.stop();
      document.getElementById("timeLeftInput").value = lastTime;
      document.getElementById("scoreInput").value = lastScore;
      let finaleScore; // equals to (lastScore + lastTime div 3) so every 3 seconds make a point
      if (!lastTime.includes(":")) {
        finaleScore = parseInt(lastScore) + Math.trunc(parseInt(lastTime)/3);
        if (finaleScore > 0) {
          document.getElementById("you").innerHTML = "YOU WON!"
          document.getElementById("your").innerHTML = "Your final score is:"
          document.getElementById("finalScore").innerHTML = finaleScore
          document.getElementById("endGame").style.visibility = "visible"
        }
        else { // finaleScore <= 0
          document.getElementById("you").innerHTML = "You lost!"
          document.getElementById("your").innerHTML = "Your final score is:"
          document.getElementById("finalScore").innerHTML = finaleScore
          document.getElementById("endGame").style.visibility = "visible"
        }
      }
    }
    // Update the game according to the time
    let lap = tFrame - this.tFrameLast ;//< 20 ? tFrame - this.tFrameLast : 17;
    
    // Update Arrows values on keydown
    window.onkeydown = (k) => {
      const arrowsValues = positionView.updateArrowsValues(k);
      this.arrowLeft = arrowsValues[0];
      this.arrowUp = arrowsValues[1];
      this.arrowRight = arrowsValues[2];
      this.arrowDown = arrowsValues[3];
    }

    // Update the robot position
    if (this.robot) {
        const arrows = [this.arrowLeft, this.arrowUp, this.arrowRight, this.arrowDown]
        const {stepX, stepY} = positionView.updateRobotPosition(arrows, this.robot)
        this.robot.moveRel(new Position(stepX, stepY));
    }

    // Update enemies positions then check possible collision 
    this.enemies.forEach(enemy => {
    // 1. update enemies position
      const {stepX, stepY} = positionView.updateEnemiesPosition(enemy, lap)
      enemy.moveRel(new Position(stepX, stepY));
    // 2. Check possible collision
      const collisionEnemy = positionView.checkCollision(enemy, this.robot)
      if (collisionEnemy) {
        if (!collisionEnemy.id.includes("darthvader")) {
          // Remove sprite from the view
            spriteView.removeSprite(collisionEnemy.id)
          // Remove enemy from the array
            this.enemies.splice(this.enemies.indexOf(collisionEnemy), 1);
          // Update score
            this.score += 3;
            controlPanelView.updateScore(this.score);
        }
        else {
          // Warn the player 
          document.getElementById(this.robot.id).style.filter = "saturate(8)";
          setTimeout(() => {
            if (this.robot)
              document.getElementById(this.robot.id).style.filter = "";
          }, 1000);
          // Update score
          if (!this.touched) {
            this.touched = true;
            this.score -= 3;
            controlPanelView.updateScore(this.score);
            setTimeout(() => {
                this.touched = false;
            }, 1000);
          }
        }
      }
    });
  }
}('Star-Wars');

// Choosing level
// document.getElementById("level1").onclick = () => {
//   game.level = 1;
// }
// document.getElementById("level2").onclick = () => {
//   game.level = 2;
// }
// document.getElementById("level3").onclick = () => {
//   game.level = 3;
// }

// Changing level
document.getElementById("previousLevel").onclick = () => {
  document.getElementById("endGame").style.visibility = "hidden"
  if (game.run && game.robot)
    game.stop();
  game.level -= 1;
  document.getElementById("levelInput").value = game.level + "/3"
  if (game.level == 1)
    document.getElementById("previousLevel").style.visibility = "hidden"
  if (game.level < 3)
    document.getElementById("nextLevel").style.visibility = "visible"
}
document.getElementById("nextLevel").onclick = () => {
  document.getElementById("endGame").style.visibility = "hidden"
  if (game.run && game.robot)
    game.stop();
  game.level += 1;
  document.getElementById("levelInput").value = game.level + "/3"
  if (game.level == 3)
    document.getElementById("nextLevel").style.visibility = "hidden"
  if (game.level > 1)
    document.getElementById("previousLevel").style.visibility = "visible"
}

// Starting and stopping the game by clicking on the button "Start" or "Stop"
document.getElementById("start").onclick = () => {
  const innerHTML = document.getElementById("start").innerHTML
  if (innerHTML == "Start") {
    game.level=2;
    document.getElementById("levelInput").value = "2/3"
    // Start the game
    game.start(); 
  }
  else if (innerHTML == "Stop") {
    game.stop();
  }
  else { // innerHTML == "Start over"
    // Restart the game, the animation and the time
    document.getElementById("endGame").style.visibility = "hidden"
    game.startOver();
  }
};

// Pausing and resuming the game by clicking on the button "Pause" or "Resume"
document.getElementById("pause").onclick = () => {
  let innerHTML;
  if (game.run) {
    innerHTML = document.getElementById("pause").innerHTML;
    if (innerHTML == "Pause") {
      // Pause the game
      game.pause();
      // Toggle buttons
      controlPanelView.toggleButtons("pause");
    }
  }
  else {
    innerHTML = document.getElementById("pause").innerHTML;
    if (innerHTML == "Resume") {
      // Resume the game
      game.resume();
      // Toggle buttons
      controlPanelView.toggleButtons("resume");
    }
  }
}

// Game animation
let main; // Main animation function to run on browser lunch then  bu clicking the button start over
let lock=false; // Allows the update of game.tFrameLast after a restart
let lastLap; // Stores the last lp between tFrame and game.tFrameLast to be reduced from the new tFrame after restart
// Explanation about the lock for start over :
// After stopping the game the tFrame goes back to zero
// On "start over" the first tFrame = 0 then the second jumps back to where it was before pausing the game
// For that, the first gmae.tFrameLast needs to be 0 :
// if (startover) {
//   game.tFrameLast = tFrame;
//   lock = true;
// }
// then jumps back to the second to last tFrame before pausing the game
// if (lock) {
//   game.tFrameLast = tFrame - lastLap;
//   lock = false;
// }
;(  () => {
  main = (tFrame, startover) => {
    // Lunch animation
    let cbId = window.requestAnimationFrame(main);
    // While game.run is true it runs game.update
    if (game.run) {
      // Restores game.tFrameLast after a restart
      if (lock) {
          game.tFrameLast = tFrame - lastLap;
          lock = false;
      }
      // If it's a start over game.tFrameLast needs to be set to tFrame 
      // which is equals to 0 (from main(0)) on the first run
      if (startover) {
          game.tFrameLast = tFrame;
          lock = true;
      }
      // Stores the last lap
      lastLap = tFrame - game.tFrameLast
      // Runs game.update
      game.update(tFrame);
    // Cancels the animation if the "stop" button in clicked
    } else {
      window.cancelAnimationFrame(cbId);
      console.log("Game over");
    }
    // Updates game.tFrameLast after every game.update
    game.tFrameLast = tFrame;
    }
  main(0); // Lunch cycle
})();

// Stop game if 's' pressed
window.onkeyup = (k) => {
  if (k.key == "s")
      game.stop();
  if (k.key == "x") {
      game.stop();
      game.run=false;
  }
}


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
document.getElementById("nextRule").onclick = () => {
  // Show "previousRule" button
  document.getElementById("previousRule").style.visibility = "visible";
  // Update rules number
  const ruleNb = parseInt(document.getElementById("ruleNb").innerHTML);
  document.getElementById("ruleNb").innerHTML = ruleNb+1;
  // Hide "nextRule" button if last page
  if (ruleNb+1 == 4)
    document.getElementById("nextRule").style.visibility = "hidden";
  // Toggle rule page
  document.getElementById("ruleAd"+ruleNb).style.display = "none";
  document.getElementById("ruleAd"+(ruleNb+1)).style.display = "inline";
}

document.getElementById("previousRule").onclick = () => {
  // Show "nextRule" button
  document.getElementById("nextRule").style.visibility = "visible"
  // Update rules number
  const ruleNb = parseInt(document.getElementById("ruleNb").innerHTML)
  document.getElementById("ruleNb").innerHTML = ruleNb-1;
  // Hide "previousRule" button if first page
  if (ruleNb-1 == 1)
    document.getElementById("previousRule").style.visibility = "hidden"
  // Toggle rule page
  document.getElementById("ruleAd"+ruleNb).style.display = "none";
  document.getElementById("ruleAd"+(ruleNb-1)).style.display = "inline";
}












