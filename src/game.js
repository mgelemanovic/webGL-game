var Game = function (scene) {
    webGLStart();
    this.scene = null;
    this.inputManager = new Input();
    this.textureManager = new TextureManager();
    this.hud = new HUD();
    this.editor = new Editor();
    this.waitToLoad = 6;

    //Scene loading
    this.loadScene(scene);
};

Game.prototype.finishedLoadingResource = function () {
    --this.waitToLoad;
    this.hud.updateResourceLoading();
};

Game.prototype.loadScene = function (path) {
    var self = this;
    var http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            // Javascript function JSON.parse to parse JSON data
            self.scene = new SceneManager(JSON.parse(http_request.responseText));
            self.finishedLoadingResource();
        }
    };

    http_request.open("GET", "scenes/" + path + ".json", true);
    http_request.send();
};

Game.prototype.saveScene = function (path) {
    var data = {
        ground: [],
        decor: []
    };

    var fillData = function(data, scenePool) {
        for (var i = 0; i < scenePool.length; ++i) {
            var tmp = {
                pos: {
                    x: scenePool[i].position.x,
                    y: scenePool[i].position.y
                }
            };
            if (scenePool[i].textureIndex != 0) {
                tmp.texture = scenePool[i].textureIndex;
            }
            if (scenePool[i].scale.x != 1.0 || scenePool[i].scale.y != 1.0) {
                tmp.scale = {
                    x: scenePool[i].scale.x,
                    y: scenePool[i].scale.y
                };
            }
            data.push(tmp);
        }
    };
    fillData(data.ground, this.scene.ground);
    fillData(data.decor, this.scene.decor);
    if (this.scene.player.respawnPosition.x != 0 ||this.scene.player.respawnPosition.y != 0)
        data.respawn = this.scene.player.respawnPosition;
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(data)], {type: "text/json"});
    a.href = URL.createObjectURL(file);
    a.download = path;
    a.click();
};

var game;

function startGame() {
    game = new Game("demo");
    gameLoop();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    if (game.waitToLoad == 0) {
        if (game.editor.isOn) {
            game.editor.handleInput();
        }
        else
            game.inputManager.handleInput();
        game.scene.update();
        game.scene.render();
        if (game.editor.isOn) {
            game.editor.drawUsedObject();
        }
    }
}

function changeScene(newScene) {
    game.hud.clearHUD();
    game = new Game(newScene);
}