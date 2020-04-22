export const createSprite = (name, pos) => {
    
}

export const renderSprite = ({id, imgPath, pos, insideDOM}) => {
    let newImg = document.createElement("img");
    newImg.setAttribute("src", imgPath);
    newImg.setAttribute("id", id);
    insideDOM.appendChild(newImg);
    // style the sprite
    let style = document.getElementById(id).style;
    style.position = "absolute";
    style.height = "75px";
    style.transition = "all 0.017s";
    style.width = "75px";
    style.left = pos.x + "px";
    style.top = pos.y + "px";    
}

export const removeSprite = id => {
    let elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
}