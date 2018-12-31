/**
 * this uses the fetch api, a newer promise based way of pulling the server, if you need to support older browsers check the MDN for a "polyfill" for this feature
 * 
 */
var curStar = '';
document.addEventListener("DOMContentLoaded",function(){
    console.log("ready");
    document.getElementById("map").addEventListener("mousemove",(event)=>{
        /**
         * changes cursor to pointer when hovering over star, may need to be optimized if too many stars are in 1 map
         */
        let x = event.clientX - event.srcElement.x;
        let y = event.clientY - event.srcElement.y;
        let ispointer = false;
        hitboxes.forEach(h=>{
            if(Math.sqrt(((x-h.x)*(x-h.x))+((y-h.y)*(y-h.y))) <= hitboxSize){
                ispointer = true;
            }
         });
        if(ispointer){
            document.body.style.cursor = "pointer";
        }else{
            document.body.style.cursor = "default";
        }
    }, false);
    document.getElementById("map").addEventListener("click",(event)=>{
        /**
         * on click checks to see if hitting a star then sets up the popout
         */
        let x = event.clientX - event.srcElement.x;
        let y = event.clientY - event.srcElement.y;
        console.log("clicked: ",x,y);
        hitboxes.forEach(h=>{
            if(Math.sqrt(((x-h.x)*(x-h.x))+((y-h.y)*(y-h.y))) <= hitboxSize){ // checks distance between mouse click and hitboxes of stars
                curStar = h.name;
                fetch('lore/'+h.name+'/list.json') // gets list of files for selected star
                    .then((response)=>{
                        response.json().then((j)=>{
                            setupTitleList(j.files);
                            setupPopout(h.name,j.files[0].file); //sets first file in list as default
                            showPopout();
                        });
                        
                    });


            }
         });
    });
});

/**
 * Set up needed here, use your graphics app to get the coordinates of the stars
 * x:0,y:0 is the top left corner of the image
 * star name must exactly match folder name and cannot have spaces, users don't see this so does not need to match what is shown on map
 * you can also use the console log in the click listener above if you check the developer console to get the coordinates you are clicking
 */
let hitboxes = [ // list of hitboxes, put in x/y coords for each star and name
    {x:267,y:97,name:"job"},
    {x:687,y:97,name:"ex"},
    {x:1014,y:165,name:"volcania"},
    {x:202,y:489,name:"charybdo"},
    {x:687,y:367,name:"orion"},
    {x:1069,y:478,name:"hemiswar"},
    {x:687,y:737,name:"sol"}
];
let hitboxSize = 30; // size of hitbox in pixels, tweak this for click accuracy 


function setupPopout(name,doc){ //fetches data from selected file and replaces content inside popout main div
    if(name && doc){
        fetch('lore/'+name+'/'+doc+'.txt')
                    .then((response)=>{
                        response.text().then((text)=>{
                            document.getElementById("popout_article").innerHTML = text;
                            showPopout();
                        });
                        
                    });
    }
}
/**
 * creates clickable list of titles from the list of files for the selected star
 */
function setupTitleList(docs){
    let l = '<ul class="popout_titlelist_ul">';
    docs.forEach(t =>{
        l += '<li class="popout_titlelist_li" data-file="'+t.file+'">' + t.name + '</li>'
    });
    l += '</ul>';
    let titleList = document.getElementById("popout_titlelist");
    titleList.innerHTML = l;
    Array.from(titleList.getElementsByTagName("li")).forEach(t => {
        t.addEventListener("click",(event)=>{
            setupPopout(curStar,t.getAttribute("data-file"));
        },false);
    });
}

function hidePopout(){
    let el = document.getElementById("popout_holder");
    el.classList.remove("show");
    el.classList.add("hide");
    el.removeEventListener("click",handlePopoutClickout);
    curStar='';
}

function showPopout(){
    let el = document.getElementById("popout_holder");
    el.classList.remove("hide");
    el.classList.add("show");
    el.addEventListener("click",handlePopoutClickout,false);
    document.body.style.cursor = "default";
}

/**
 * made this a seperate function to allow it to be removed when popout is hidden
 */
function handlePopoutClickout(event){
    if(!event.path.find(a=> a===document.getElementById("popout"))){
        // only hides popout if clicks somewhere outside the main popout
        hidePopout();
    }
}