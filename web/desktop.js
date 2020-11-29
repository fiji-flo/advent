"use strict";
var libDesktop = (function() {
    var enableFancyDiv = (function() {
        return false;
    })();

    function closeDoor(tile) {
        tile.main.classList.remove("open");
        tile.closed = true;
    }

    function openDoor(tile) {
        tile.main.classList.add("open");
        tile.closed = false;
    }

    function Sizes() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;

        var hunit = Math.floor(this.screenWidth / 74);
        var vunit = Math.floor(this.screenHeight / 37);
        this.unit = Math.min(hunit, vunit);

        this.hspace = this.unit * 2;
        this.vspace = this.unit * 1;
        this.tileWidth = this.unit * 8;
        this.tileHeight = this.unit * 8;
        this.tilesPerRow = 6;
        var tilesPerColumn = numTiles /  this.tilesPerRow;
        var hb =  this.screenWidth - this.tilesPerRow * this.tileWidth - (this.tilesPerRow - 1) * this.hspace;
        this.hborder = Math.floor(hb / 2);
        var vb =  this.screenHeight - tilesPerColumn * this.tileHeight - (tilesPerColumn - 1) * this.vspace;
        this.vborder = Math.floor(vb / 2);
    }

    function Tile(width, height, song, number) {
        this.fontScale = 0.3;
        this.main = Div("tile-box");
        this.main.style.perspective = "1000px";
        this.main.style.perspectiveOrigin = "50% 50%";
        this.main.style.transformStyle = "preserve-3d";
        if (enableFancyDiv) {
            this.doorBox = Div("tile-door-box");
        }
        this.doorFront = Div("tile-door tile-door-front");
        this.doorCanvas = Elem("canvas", "tile-canvas");
        this.doorBack = Div("tile-door tile-door-back");
        this.number = Div("tile-door-number");
        this.number.innerHTML = number.toString();
        this.back = Div("tile-back");
        this.closed = true;
        size(this, width, height);
        if (song !== null) {
            setOnClick(this);
            this.surprise = new Surprise(song, height, 24);
            this.back.appendChild(this.surprise.main);
            this.doorBackImage =Elem("img", "tile-artist-image");
            this.doorBackImage.src = imgPrefix + song.artistPicture;
            this.doorBackImage.width = Math.floor(height * 0.98);
            this.doorBack.appendChild(this.doorBackImage);
        }
        this.doorFront.appendChild(this.doorCanvas);
        this.doorFront.appendChild(this.number);
        this.main.appendChild(this.back);
        if (enableFancyDiv) {
            this.doorBox.appendChild(this.doorBack);
            this.doorBox.appendChild(this.doorFront);
            this.main.appendChild(this.doorBox);
        } else {
            this.main.appendChild(this.doorBack);
            this.main.appendChild(this.doorFront);
        }
        closeDoor(this);
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
        if (enableFancyDiv) {
            tile.doorBox.addEventListener("click", tile.onClickFunction);
        } else {
            tile.doorFront.addEventListener("click", tile.onClickFunction);
            tile.doorBack.addEventListener("click", tile.onClickFunction);
        }
    }

    function SurpriseTextBox(artist, title, size) {
        this.main = Div(mobile ? "surprise-text-mobile" : "surprise-text");
        this.songTitle = Elem("div", "surprise-title");
        this.songTitle.style.fontSize = Math.floor(size * 0.11) + 'px';
        this.songTitle.innerHTML = title;
        this.main.appendChild(this.songTitle);
        this.artist = Elem("div", "surprise-artist");
        this.artist.style.fontSize = Math.floor(size * 0.10) + 'px';
        this.artist.innerHTML = artist;
        this.main.appendChild(this.artist);
    }

    function Surprise(song, size, iconSize) {
        this.main = Div("surprise-box");
        this.textBox = new SurpriseTextBox(song.artist, song.title, size);
        this.audioControl = new AudioControl(3, song.audioFile, iconSize);
        this.main.appendChild(this.textBox.main);
        this.main.appendChild(this.audioControl.main);
    }

    function Main() {
        this.main = Div("area");
        this.main.style.layout = "block";
        this.main.style.width = "100%";
        this.main.style.height = "100%";
        this.main.style.transformStyle = "preserve-3d";
    }

    return {
        Sizes: Sizes,
        Tile: Tile,
        Main: Main,
    };
})();
