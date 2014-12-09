//Declaring variables | static throughout levels
var pot;
var drop;
var score;
var potLeft;
//Game Music & Sounds
var bkgrd_sound = new Audio('https://dl.dropboxusercontent.com/u/57018847/bkgrd.wav');
var play_sound = new Audio('https://dl.dropboxusercontent.com/u/57018847/play_music.wav');
var win_sound = new Audio('https://dl.dropboxusercontent.com/u/57018847/win_music.wav');
var menu_sound = new Audio('sound/blop.wav')
var mvmt_sound = new Audio('sound/woosh.wav');
var splash_sound = new Audio('sound/splash.wav');
var bad_sound = new Audio('sound/bubble.wav');
var img_num = 7;
var interval_timer = null;
var currentBadDrop = 0;
var currentScore = 0;
var keydown = [];
var time_stamp = [];
var menu_toggle = 0;
var trans_toggle = 0;
var row_toggle = 0;
var r_selected = false;
var beg;
var end;


//Level-dependent variables | varies by level
var speed;
var drop_num;
var target_prob;
var winScore;
var lv_matrix = [];

function Lv(spd, dn, tp, ws){
    this.speed = spd;
    this.drop_num = dn;
    this.target_prob = tp;
    this.win_score = ws;
}

function setLv(lv){
    speed = lv.speed;
    drop_num = lv.drop_num;
    target_prob = lv.target_prob;
    winScore = lv.win_score;
}

//New levels into matrix
lv_matrix[0]=new Lv(10000, 1, 0, 5);
lv_matrix[1]=new Lv(10000, 1, 0, 5);
lv_matrix[2]=new Lv(10000, 1, 0.1, 10);
lv_matrix[3]=new Lv(10000, 1, 0.1, 10);
lv_matrix[4]=new Lv(10000, 1, 0.1, 15);
lv_matrix[5]=new Lv(10000, 2, 0.1, 15);
lv_matrix[6]=new Lv(10000, 2, 0.2, 15);
lv_matrix[7]=new Lv(10000, 2, 0.2, 20);
lv_matrix[8]=new Lv(10000, 3, 0.3, 20);
lv_matrix[9]=new Lv(10000, 3, 0.3, 25);

//Main function
$(document).ready(function(){
    initMenu();
});

//create initial game menu and click handlers
function initMenu(){
    //play background music
    bkgrd_sound.load();
    bkgrd_sound.play();
    //adding background
    $('#game_matrix').css('background-image', 'url("imgs/startscr.png")');
    //clearing status border for reloads
    $('#status').css('border-bottom', 'none');
    //appending title, play and demo buttons
    $('#dropzone').append('<div class="menu_btn" id="play"><button type="button" class="btn btn-default" class="play">Play</button></div><div class="menu_btn" id="how"><button type="button" class="btn btn-default">How To</button></div>');
    //registering clicks and presses
    $('#play').on('click', clickHandler);
    $('#how').on('click', clickHandler);
    document.onkeydown = menuKeyListener;
    document.onkeyup = keyupListener;
}

//creates level menu and click handlers
function initLevelMenu(){
    var r = 2;
    var c = 5;
    var lv = 0;
    var i;
    var j;
    var id;
    var $row;
    //Adding buttons in a grid
    for (i=0; i<r; i++) {
        $row = $('<tr id="r' + i + '"></tr>'); 
        for (j=0; j<c; j++) {
        $row.append('<td><div class="lv"><button type="button" class="btn btn-default" id="' + lv + '">'+lv+'</button></div></td>');
            lv++;
        }
        $('#dropzone').append($row); 
    }
    
    document.onkeydown = gridKeyListener;
    document.onkeyup = keyupListener;
    //Registering all the buttons
    $('.lv').children().on('click', lvHandler);
}

function setGame(lv){
    //add level number top left
    $('#dropzone').prepend('<div class="lv_num">Level ' + lv + '</div>');
    //change background based on level
    $('#game_matrix').css({backgroundImage: 'url("imgs/bkgrd' + lv + '.png")'});
}

//button click handler
function clickHandler(){
    //when back to menu is clicked
    if ($(this).attr('id') == 'bk2menu'){
        win_sound.pause();
        $('#dropzone').empty();
        initMenu();
    }
    //when a play button is clicked
    if($(this).attr('id') === 'play' || $(this).attr('id') === 'how_play'){
        $('#dropzone').empty();
        initLevelMenu();
        $('#dropzone').append('<div id="gridinst">Selecting Levels with Keys: <br></br>Press RIGHT to move and LEFT to select. Once you select a row, you may press RIGHT again to move through the individual levels and make your selection. </div>');
    }
        
    if($(this).attr('id') === 'how'){
        $('#dropzone').empty();
        //Add text description of game play & play button
        $('#dropzone').append('<div id="how_div"><div id="how_txt">The purpose of the game is to create potions to help Harry, Ron, and Hermione defeat Lord Voldemort. You will move the pot on the screen to collect objects that are dropping, in order to make potions that will help the team defeat Voldemort. <ul><li>Lv. 0: The game will be automatically played.</li><li>Lv. 1: Use RIGHT arrow key to move the pot automatically under a drop that is falling. </li> <li>Lv. 2 - 9: Use LEFT or RIGHT arrow keys to move the pot around to catch drops. </li></ul> Each time you catch an item, you will receive 1 point. The number of items needed to make the potion and move on to the next level will increase as you progress. Beware of Voldemort’s head. If you catch it, you will lose 2 points. </div><div id="how_play" class="s_toggle"><button type="button" class="btn btn-default">Play</button></div></div>');
        //registering clicks and key presses
        $('#how_play').on('click', clickHandler);
        document.onkeydown = sToggleListener;
    }
    
    if($(this).attr('id') === 'again'){
        //console.log('again clicked!');
        $('#status').empty();
        $('#dropzone').empty();
        //reappend level number
        $('#dropzone').prepend('<div class="lv_num">Level ' + currentLv + '</div>');
        //pause winning music
        win_sound.pause();
        //reinitialize level
        initGame();
        //start
        start();
    }
    
    if($(this).attr('id') === 'next'){
        //transition to end of game screen
        if(currentLv === 9){
            //clearing current screen
            $('.win_btn').remove();
            $('.win').remove();
            //transition to the end of game screen
            $('#dropzone').append('<div id="final_message">You have defeated Voldemort!</div>');
            $('#dropzone').append('<div id="final_p">Thank you for playing! We hope that you enjoyed our game.</div>');
            //back to home screen button
            $('#dropzone').append('<div id="bk2menu" class="s_toggle"><button type="button" class="btn btn-success">Back to Menu</button></div>');
            //register back to menu click
            $('#bk2menu').on('click', clickHandler);
            //key handler
            document.onkeydown = sToggleListener;
        } else{
            nextLv++;
            currentLv = nextLv;
            $('#status').empty();
            $('#dropzone').empty();
            //set to next level
            setLv(lv_matrix[nextLv]);
            setGame(nextLv);
            //pause winning music
            win_sound.pause();
            //initialize next level
            initGame();
            //start
            start();
        }
    }
}

//Pot move click handler
function moveClickHandler(){
    
    //if lv.1 and clicked right arrow
    if($(this).attr('id') === 'right_btn' && currentLv ===1){
        $('#lv1inst').remove();
        rainLoop();
    }
    //if clicked left arrow
    if($(this).attr('id') === 'left_btn'){
        if(potLeft > 0){
                if(potLeft < 100){
                    potLeft -= potLeft;
                }else{
                    potLeft -= 200;
                } 
            }
    }
    
    //if clicked right arrow
    if($(this).attr('id') === 'right_btn' && currentLv !== 1){
        if (potLeft < $('#game_matrix').width() - 200){
                if(potLeft > $('#game_matrix').width() - 200){
                    potLeft = $('#game_matrix').width() - 200;
                }else{
                    potLeft += 200;  
                }
        }
    }
    //remove instruction
    if(currentLv === 2){$('#lv2inst').remove();}
    //play swoosh sound
    mvmt_sound.load();
    mvmt_sound.play();
    //update pot position
    pot.style.left = potLeft + 'px';
}

function lvHandler(){
    bkgrd_sound.pause();
    currentLv = parseInt($(this).attr('id'));
    nextLv = currentLv;
    
    //console.log(currentLv);
    
    switch(currentLv){
        case 0: 
            setLv(lv_matrix[0]);
        break;
        case 1: 
            setLv(lv_matrix[1]);
        break;
        case 2: 
            setLv(lv_matrix[2]);
        break;
        case 3: 
            setLv(lv_matrix[3]);
        break;
        case 4: 
            setLv(lv_matrix[4]);
        break;
        case 5: 
            setLv(lv_matrix[5]);
        break;
        case 6: 
            setLv(lv_matrix[6]);
        break;
        case 7: 
            setLv(lv_matrix[7]);
        break;
        case 8: 
            setLv(lv_matrix[8]);
        break;
        case 9: 
            setLv(lv_matrix[9]);
        break;
        default:
            setLv(lv_matrix[0]);
    }
    //emptying the dropzone
    $('#dropzone').empty();
    //setting the game
    setGame(currentLv);
    initGame();
    start();
}

function renderTransition(){
    //play level again 
    //or proceed to next level
     $('#dropzone').prepend('<div class="win_btn" id="again"><button type="button" class="btn btn-success">Play Again</button></div><div class="win_btn" id="next"><button type="button" class="btn btn-primary">Next Level</button></div>');
        //add message, potion and story
        $('#dropzone').prepend('<div id="win_message" class="win">Congrats! You Made:</div>');
        $('#dropzone').prepend('<div id="potion" class="win"></div>');
        $('#dropzone').prepend('<div id="story" class="win"></div>');
        //change rendering of potion and story based on lv
        $('#potion').css({backgroundImage: 'url("imgs/potion' + currentLv + '.gif")'});
        $('#story').css({backgroundImage: 'url("imgs/story' + currentLv + '.png")'});
}

//checking for winning
function checkScore(){
    //winning game
    if (currentScore >= winScore){
        endGame();
        renderTransition();
        //register transtion buttons and keys
        $('#again').on('click', clickHandler);
        $('#next').on('click', clickHandler);
        document.onkeydown = transitionKeyListener;
    }
}

//creating the game and setting initializing DOM variables
function initGame(){
    //instantiate objects from HTML
    currentScore = 0;
    $('#dropzone').append('<div id="pot"></div>');
    pot = document.getElementById('pot');
    potLeft = $('#pot').position().left;
    //status div adds score and progbar
    $('#status').css('border-bottom', '2px solid white');
    $('#status').append('<div id="score">Score: </div>');
    score = document.getElementById('score');
    //add progress bar
    $('#status').append('<div id="prog">Progress: </div><div class="wrap"></div><div id="progbar"></div>');
    //register keyboard events
    document.onkeydown = keydownListener;
    document.onkeyup = keyupListener;
    //adding left and right buttons (lv.2+)
    if(currentLv !== 0 && currentLv !== 1){
        //append buttons to screen
        $('#game_matrix').append('<div id="mvm"><div id="left_btn"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span></button></div><div id="right_btn"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button></div></div>');
        //register clicks
        $('#left_btn').on('click', moveClickHandler);
        $('#right_btn').on('click', moveClickHandler);
    } else if(currentLv == 1){
        //append only right button to screen
        $('#game_matrix').append('<div id="mvm"><div id="right_btn"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button></div></div>');
        //register clicks
         $('#right_btn').on('click', moveClickHandler);
    }
    //plays game music
    play_sound.load();
    play_sound.play();
}


function endGame(){
    //clear interval and empty current game zone
    clearInterval(interval_timer);
    $('.drop').stop();
    $('.drop').remove();
    $('#pot').hide();
    $('#status').empty();
    play_sound.pause();
    //play winning music
    win_sound.load();
    win_sound.play();
    //remove mvm buttons
    $('#mvm').remove();
    if (currentLv === 0){
        $('#lv0inst').remove();
    }else if(currentLv === 2){
        $('#lv2inst').remove();
    }
}

function menuKeyListener(e){
    //ignore long keydowns
     if(!keydown[e.keyCode]){
        keydown[e.keyCode] = true;
         //right key press
         if(e.keyCode == 39){
                 if(menu_toggle == 0){
                    $('#how').removeClass('r_active');
                    $('#play').addClass('r_active');
                    menu_toggle = 1;
                 }else{
                    $('#play').removeClass('r_active');
                    $('#how').addClass('r_active');
                    menu_toggle = 0;
                }
             
                //play sounds
                menu_sound.load();
                menu_sound.play();
          
         }
         //left key press
         if(e.keyCode == 37){
             //reset toggle
             menu_toggle = 0;
             if($('#play').hasClass('r_active')){
                 $('#play')[0].click();
             }else if($('#how').hasClass('r_active')){
                 $('#how')[0].click();
             }
             
             //play sounds
            menu_sound.load();
            menu_sound.play();
         }
      }else{
         e.preventDefault();
    }   
}

//key listener for menu movements
function gridKeyListener(e){
    //keep track of current button
    var current = 0;
    //right key navigates selection
    //left key makes selection
    if(!keydown[e.keyCode]){
        keydown[e.keyCode] = true;
         if(e.keyCode == 39){
             //if rows are not selected
             if(!r_selected){
                 if(row_toggle == 0){
                    $('#r1').removeClass('r_active');
                    $('#r0').addClass('r_active');
                    row_toggle = 1;
                 }else{
                    $('#r0').removeClass('r_active');
                    $('#r1').addClass('r_active');
                    row_toggle = 0;
                    }
            //selecting cols
             }else{
                 if(beg <= end){
                     if (beg == end){
                         if($('#r0').hasClass('r_active')){
                             beg = 0;
                         } else{
                             beg = 5;
                         }
                     }
                     
                    $('.lv').children().css('border', 'none');
                    $('#'+beg).css('border', '5px solid red');
                    beg++;
                 }
             }
             
                //play sounds
                menu_sound.load();
                menu_sound.play();
         }
        //selected!
        if(e.keyCode == 37){
            if(!r_selected){
                if($('#r0').hasClass('r_active')){
                         //select from top 0-4
                         beg = 0;
                         end = 5;
                        r_selected = true;
                     } else if($('#r1').hasClass('r_active')){
                         //select from bottom 5-9
                         beg = 5;
                         end = 10;
                         r_selected = true;
                     }
            //if row is selected, pressing left twice in less than 2 sec will release selection
            } else{
                    //if selected col
                    current = beg -1;
                    //trigger button clicks
                    if(!isNaN(current)) $('#'+current)[0].click();
            }
            
            //play sounds
            menu_sound.load();
            menu_sound.play();
        }

    }else {
        e.preventDefault();
    }
}
//key listener for transtion page
function transitionKeyListener(e){
    //ignore long keydowns
     if(!keydown[e.keyCode]){
        keydown[e.keyCode] = true;
        //right key press
         if(e.keyCode == 39){
                 if(trans_toggle == 0){
                    $('#next').removeClass('r_active');
                    $('#again').addClass('r_active');
                    trans_toggle = 1;
                 }else{
                    $('#again').removeClass('r_active');
                    $('#next').addClass('r_active');
                    trans_toggle = 0;
                }
             
                //play sounds
                menu_sound.load();
                menu_sound.play();
          
         }
         //left key press
         if(e.keyCode == 37){
             //reset toggle
             trans_toggle = 0;
             if($('#again').hasClass('r_active')){
                 $('#again')[0].click();
             }else if($('#next').hasClass('r_active')){
                 $('#next')[0].click();
             }
             
             //play sounds
            menu_sound.load();
            menu_sound.play();
     }else{
         e.preventDefault();
        }
     }
    
}

//key listener for pot movements
function keydownListener(e){
    //7 second keyboard delay on level 1
    if(currentLv === 1 && time_stamp[e.keyCode] && (e.timeStamp - time_stamp[e.keyCode]) < 7000){
        e.preventDefault();
    //if not too many key downs, check for keydown holds
    } else if (!keydown[e.keyCode]){
        keydown[e.keyCode] = true;
        time_stamp[e.keyCode] = e.timeStamp;
        //key behavior for level 1
        if (currentLv === 1){
            //only enable right key
            if(e.keyCode == 39){
                $('#lv1inst').remove();
                //initiate rain
                rainLoop();
            }
        //key behavior for all levels beside 0
        //lv 0 has no registered keys
        }else if(currentLv !==0){
            if(currentLv === 2){$('#lv2inst').remove();}
             //if pressed left arrow
            if(e.keyCode == 37 && potLeft > 0){
                if(potLeft < 100){
                    potLeft -= potLeft;
                }else{
                    potLeft -= 200;
                } 
                
                mvmt_sound.load();
                mvmt_sound.play();
            }
            //if pressed right arrow
            if (e.keyCode == 39 && potLeft < $('#game_matrix').width() - 200){
                if(potLeft > $('#game_matrix').width() - 200){
                    potLeft = $('#game_matrix').width() - 200;
                }else{
                    potLeft += 200;  
                }
                
                mvmt_sound.load();
                mvmt_sound.play();
            }

            pot.style.left = potLeft + 'px';
        }
        //disable key behavior when holding keydown
    } else {
        e.preventDefault();
    }
    
}
//single toggle key listener
function sToggleListener(e){
      if(!keydown[e.keyCode]){
                keydown[e.keyCode] = true;
                if (e.keyCode == 39) {
                $('.s_toggle').toggleClass('r_active');
                    //play sounds
                    menu_sound.load();
                    menu_sound.play();
                }
                 
                if(e.keyCode == 37){
                if($('.s_toggle').hasClass('r_active')){
                        $('.s_toggle')[0].click();
                        //play sounds
                        menu_sound.load();
                        menu_sound.play();
                    }
                }
             }else{
                 e.preventDefault();
             }
}

function keyupListener(e){
    keydown[e.keyCode] = false;
}

function rainLoop(){
    DropPile.add(drop_num);
    if (currentLv === 1 || currentLv === 0){
        //move pot to drop position
        potLeft = $('.drop').position().left - 100;
        pot.style.left = potLeft + 'px';
        //movement sound
        mvmt_sound.load();
        mvmt_sound.play();
    }
    //drop animation
    rain(speed);
    //check for win
    checkScore();
    //check for song ending
    if (play_sound.currentTime >= 85){
        //play song again
        play_sound.load();
        play_sound.play();
    }
}

function start(){
    //current game loop
    if (currentLv === 1){
         //display instruction
        $('#game_matrix').append('<div id="lv1inst">Welcome to Level 1! In this level, the user gains a little more control over gameplay. By pressing the RIGHT arrow key, the pot will move to the location where a drop will fall. When you catch enough drops, you will make a new potion! PRESS or CLICK RIGHT KEY to Begin. </div>');
        interval_timer = setInterval(checkScore, 5000);
    } else {
        if (currentLv === 0){
            //console.log('level 0!');
            $('#game_matrix').append('<div id="lv0inst">Welcome to Level 0! In this level, the game will be simulated for you. Every time the pot moves, a drop will be automatically caught. Once you reach the winning score, you will see what potion you have made.</div>');
        }
        if(currentLv === 2){
             $('#game_matrix').append('<div id="lv2inst">Welcome to Level 2! This is the first level where you have complete freedom to move. Press LEFT and RIGHT to move the pot. When you see VOLDEMORT, avoid him!</div>');
        }
        interval_timer = setInterval(rainLoop, 10000);
    }
}

//helper function to update the progress bar
function updateProgress(val){
    //take in the fraction and multiply by 300
    var prog = (val/winScore)*300;
    //render this progress
    $('#progbar').animate({width: prog + 'px'});
}

function incScore(){
    currentScore += 1;
    score.innerHTML = 'Score: ' + currentScore;
    score.style.color = 'white';
    //update progress bar unless reached 100%
    if(currentScore <= winScore){
        updateProgress(currentScore);
    }
}

function decScore(){
    currentScore -= 2;
    score.innerHTML = 'Score: ' + currentScore;
    score.style.color = 'red';
    //update progress bar unless reached 100%
    if(currentScore <= winScore){
        updateProgress(currentScore);
    }
}





