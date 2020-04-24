export const renderSprite = ({id, imgPath, pos, insideDOM}) => {
    let newImg = document.createElement("img");
    newImg.setAttribute("src", imgPath);
    newImg.setAttribute("id", id);
    insideDOM.appendChild(newImg);
    // style the sprite
    let style = document.getElementById(id).style;
    style.height = "75px";
    style.left = pos.x + "px";
    style.opacity = "0"
    style.position = "absolute";
    style.top = pos.y + "px"; 
    style.transition = "all 0.017s";  
    style.transition = "opacity 1s" 
    style.width = "75px";

    setTimeout(() => {
        style.opacity = "1";
    }, 17);
    
}

export const removeSprite = id => {
    document.getElementById(id).style.opacity = "0";
    setTimeout(() => {
        const elem = document.getElementById(id);
        elem.parentNode.removeChild(elem);
    }, 200);
}