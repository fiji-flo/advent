"use strict";
var bImage = null;
var tiles = [];
var imgPrefix = "img/";
var numTiles = 24;
var perm = (function () {
    var perm = [];
    for (var i = 0; i < numTiles; i++) {
        perm.push(i + 1);
    }
    shuffleArray(perm);
    return perm;
})();

function draw(tile) {
    var iwidth = bImage.oWidth;
    var factor = iwidth / compWidth(bImage.img);
    var ix = parseInt(tile.main.style.left);
    var iy = parseInt(tile.main.style.top);
    ix *= factor;
    iy *= factor;
    var f = 1/factor;
    tile.doorImg.style.backgroundImage = `url(${bImage.img.src})`;
    tile.doorImg.style.backgroundSize = `${iwidth * f}px`;
    tile.doorImg.style.backgroundPositionX = -f*ix + 'px';
    tile.doorImg.style.backgroundPositionY = -f*iy + 'px';
}

function size(tile, x, y) {
    tile.main.style.width = x + 'px';
    tile.main.style.maxWidth = x + 'px';
    tile.main.style.height = y + 'px';
    tile.doorImg.style.width = x + 1 + 'px';
    tile.doorImg.style.height = y + 1 + 'px';
    tile.number.style.fontSize = y * tile.fontScale + 'px';
    tile.number.style.width = x + 'px';
    tile.number.style.height = y + 'px';
    draw(tile);
}

function move(tile, x, y) {
    var elem = tile.main;
    elem.style.top = y + 'px';
    elem.style.left = x + 'px';
    draw(tile);
}

function BImage(file) {
    this.main = Div("image-cropper");
    this.main.style.height = sizes.screenHeight + 'px';
    this.img = Elem("img");
    var me = this;
    this.img.onload = function () {
        me.oWidth = me.img.naturalWidth;
        me.oHeight = me.img.naturalHeight;
        moveTiles();
    };
    this.img.src = file;
    this.oWidth = this.img.naturlaWidth;
    this.oHeight = this.img.naturalHeight;
    this.main.appendChild(this.img);
}

BImage.prototype.zoom = function (landscape) {
    if (landscape) {
        this.img.style.width = "100%";
        this.img.style.height = "auto";
    } else {
        this.img.style.width = "auto";
        this.img.style.height = "100%";
    }
};

function createTiles(area) {
    var tileWidth = sizes.tileWidth;
    var tileHeight = sizes.tileHeight;
    for (var i = 0; i < numTiles; i++) {
        var j = perm[i];
        var song = songs[j] !== undefined ? songs[j]: null;
        var t = new lib.Tile(tileWidth, tileHeight, song, j);
        tiles.push(t);
        area.appendChild(t.main);
    }
}

function moveTiles() {
    var imageAR = bImage.oWidth / bImage.oHeight;
    var aR = sizes.screenWidth / sizes.screenHeight;
    var top = sizes.vborder;
    var left = sizes.hborder;
    var width = sizes.screenWidth;
    var vspace = sizes.vspace;
    var hspace = sizes.hspace;
    var tilesPerRow = sizes.tilesPerRow;
    var tileWidth = sizes.tileWidth;
    var tileHeight = sizes.tileHeight;
    var x = left;
    var y = top;
    bImage.zoom(aR > imageAR);
    for (var i = 0; i < tiles.length; i++) {
        move(tiles[i], x, y);
        x = x + tileWidth + hspace;
        if ((i + 1) % tilesPerRow === 0) {
            x = left;
            y = y + tileHeight + vspace;
        }
    }
}

function init() {
    var area = new lib.Main();
    var img = new BImage(backgroundImage);
    bImage = img;
    area.main.appendChild(img.main);
    document.body.appendChild(area.main);
    createTiles(area.main);
    moveTiles();
}


function ready(f) {
    document.addEventListener("DOMContentLoaded", function(event) {
        f();
    });
}

if (!(mobile)) {
    var lib = libDesktop;
    var sizes = new lib.Sizes();
    var backgroundImage = desktopBackgroundImage;
    ready(init);
} else {
    var lib = libMobile;
    var sizes = new lib.Sizes();
    var backgroundImage = mobileBackgroundImage;
    ready(init);
}
