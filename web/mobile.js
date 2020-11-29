"use strict";
var libMobile = (function() {
    function closeDoor(tile) {
        tile.main.classList.remove("open-mobile");
        tile.closed = true;
    }

    function openDoor(tile) {
        tile.main.classList.add("open-mobile");
        tile.closed = false;
    }

    function Sizes() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;

        var unit = Math.floor(this.screenHeight / 6);
        this.screenHeight *= 4;

        this.hspace = 0;
        this.vspace = 0;
        this.tileWidth = this.screenWidth;
        this.tileHeight = unit;
        this.tilesPerRow = 1;
        this.hborder = 0;
        this.vborder = 0;
    }

    function Tile(width, height, song, number) {
        this.fontScale = 0.4;
        this.main = Div("tile-box-mobile");
        this.doorBox = Div("tile-door tile-door-box");
        this.doorFront = Div("tile-door-front");
        this.doorImg = Div("tile-canvas");
        this.number = Div("tile-door-number");
        this.number.innerHTML = number.toString();
        this.back = Div("tile-back");
        this.closed = true;
        size(this, width, height);
        if (song !== null) {
            setOnClick(this);
            this.backImage =Elem("img", "tile-artist-image-mobile");
            this.backImage.src = imgPrefix + song.artistPicture;
            this.backImage.width = Math.floor(height * 0.98);
            this.back.appendChild(this.backImage);
            this.surprise = new Surprise(song, height, 36);
            this.back.appendChild(this.surprise.main);
        }
        this.doorFront.appendChild(this.doorImg);
        this.doorFront.appendChild(this.number);
        this.main.appendChild(this.back);
        this.doorBox.appendChild(this.doorFront);
        this.main.appendChild(this.doorBox);
    }

    function toggleDoor(tile) {
        if (tile.closed) {
            openDoor(tile);
        } else {
            closeDoor(tile);
        }
    }

    function setOnClick(tile) {
        tile.onClickFunction = function (event) {
            toggleDoor(tile);
        };
        tile.doorBox.addEventListener("click", tile.onClickFunction);
    }

    function SurpriseTextBox(artist, title, size) {
        this.main = Div(mobile ? "surprise-text-mobile" : "surprise-text");
        this.songTitle = Elem("div", "surprise-title");
        this.songTitle.style.fontSize = Math.floor(size * 0.14) + 'px';
        this.songTitle.innerHTML = title;
        this.main.appendChild(this.songTitle);
        this.artist = Elem("div", "surprise-artist");
        this.artist.style.fontSize = Math.floor(size * 0.13) + 'px';
        this.artist.innerHTML = artist;
        this.main.appendChild(this.artist);
    }

    function Surprise(song, size, iconSize) {
        this.main = Div("surprise-box");
        this.textBox = new SurpriseTextBox(song.artist, song.title, size);
        this.audioControl = new AudioControl(3, song.audioFile, iconSize);
        this.textBox.main.appendChild(this.audioControl.main);
        this.main.appendChild(this.textBox.main);
    }

    function Main() {
        this.main = Div("area");
        this.main.style.layout = "block";
        this.main.style.width = "100%";
        this.main.style.height = "100%";
    }

    return {
        Sizes: Sizes,
        Tile: Tile,
        Main: Main,
    };
})();
