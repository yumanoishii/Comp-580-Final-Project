var DropPile = {drops:[]};
var new_drop;
var curr_drop;

DropPile.add = function(n){
    
    for (var i = 0; i < n; i++){
        
        //set the view elements to separate variables
        var drop_zone = $('#dropzone');
        curr_drop = $('<div class="drop"></div>');
        
        //generates prob val for this drop
        var new_prob = Math.random();
        
        //creates new drop
        new_drop = new Drop(randDanger(new_prob, target_prob));
       
        //push this drop into drop queue
        this.drops.push(new_drop);

        //randomizes the position of the drop
        //in actual program, should only randomize left b/c y needs to be 0px
        updatePos(new_drop, curr_drop, 0, 0);
        
        //Randomly assign img based on probability
        assignImg(new_drop, curr_drop, img_num);
        
        //eventually appending all these drops
        drop_zone.append(curr_drop);
    }
    
};

//Randomizes the type of drops (ie: true--> dangerous; false-->not)
function randDanger(p, target_p){
    //low probability for 'bad' drops
    if(p < target_p){
       return true;
    } else {
        return false;
    }
}

//Helper function to update position for the view
function updatePos(drop_m, drop_v, dx, dy){
    drop_m.x += dx;
    drop_m.y += dy;
    
   drop_v.css({
            'left': drop_m.x + 'px',
            'top': drop_m.y + 'px'
        });
}

//Randomly assigns imgs based on the view and the model of the drop --> essentially we need the data from the model in order to determine whether a drop is dangerous or not
function assignImg(drop_m, drop_v, img_num){
    if (drop_m.type === true){
        drop_v.css('background-image', 'url("https://dl.dropboxusercontent.com/u/57018847/dropb.png")');
    } else {
        drop_v.css('background-image', drop_m.randImageSrc(img_num));
    }
}

function rain(spd){
    //defines values for collision detection
    var dry;
    var dryp;
    var drx;
    var drxp;
    var py;
    var px;
    var pxp;
    var imgsrc;
    var netScore = 0;
    
   $(".drop").animate({
        //destination
        top: $('#dropzone').height()-60 + 'px',
        //speed
        }, {
       duration: spd, 
       complete: function(){
            $(this).remove();
       }, 
       step:checkCollision = function(){
           dry = $(this).position().top;
           dryp = dry+ $(this).height();
           if(typeof $('#pot') !== 'undefined' && $('#pot') !== null){
               py = $('#pot').position().top;
           }
           if (dryp >= py && dryp <=py+50){
            drx = $(this).position().left;
            drxp = drx + $(this).width();
            px = $('#pot').position().left;
            pxp = px + $('#pot').width();
            imgsrc = $(this).css('background-image');
               
           if (drx >= px && drxp <= pxp){
                //update score based on drop
                //if bad drop
                if (imgsrc === 'url(https://dl.dropboxusercontent.com/u/57018847/dropb.png)'){
                    decScore();
                    //bubbling sound
                    bad_sound.load();
                    bad_sound.play();
                 //otherwise
                } else {
                    //splash sound
                   splash_sound.load();
                   splash_sound.play();
                    incScore();
                }
               //remove drop
                $(this).remove();
                }
           }
       }
   });
}


