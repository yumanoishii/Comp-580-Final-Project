function Drop(type){
    this.type = type;
    this.defineType = function(type){
       return type.toString(); 
    }
    
    this.x = randX();
    //starting y negative so that drops will be staggered when they fall
    //this.y = -30;
    this.y = -1*(Math.random()*$('#dropzone').height());
}

Drop.prototype.randImageSrc = function(img_num){
    return 'url("imgs/drop' + Math.floor(Math.random()*img_num)+ '.png")';
}

function randX(){
    var randnum = Math.floor(Math.random()*3);
    var randx;
    switch(randnum){
        case 0: 
            randx = 100; 
            break;
        case 1: 
            randx = 300; 
            break;
        case 2: 
            randx = 500; 
            break;
        default: randx = 100;
    }
    return randx;
}






