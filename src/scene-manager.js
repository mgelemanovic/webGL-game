var SceneManager = function (sceneInfo) {
    this.cameraX = 0;
    this.cameraY = 0;

    this.lastTime = 0;
    this.elapsed = 0;

    //Something to hold info on scene
    this.player = new MovableObject(textureManager.player[0], 50);
    this.player.collider.w = 0.5;
    this.player.collider.h = 0.55;

    this.ground = [];
    for (var i = 0; i < sceneInfo.ground.length; ++i) {
        var tmpScale = {x: 1, y: 1};
        var tmpTexture = 0;
        if (sceneInfo.ground[i].scale)
            tmpScale = sceneInfo.ground[i].scale;
        if (sceneInfo.ground[i].texture)
            tmpTexture = sceneInfo.ground[i].texture;
        this.addObjectToScene(this.ground, new GameObject(textureManager.ground[tmpTexture]), sceneInfo.ground[i].pos, tmpScale);
    }
};

SceneManager.prototype.addObjectToScene = function (objectPool, newObject, position, scale) {
    objectPool.push(newObject);
    objectPool[objectPool.length - 1].setScale(scale.x, scale.y);
    objectPool[objectPool.length - 1].setPosition(position.x, position.y - (0.5 - scale.y / 2));
};

//Clears the scene, sets the perspective and moves the camera
SceneManager.prototype.prepare = function (fovy, aspect, near, far) {
    GL.clear(GL.COLOR_BUFFER_BIT);

    mat4.perspective(pMatrix, fovy, aspect, near, far);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [-this.cameraX, -this.cameraY, 0]);
};

SceneManager.prototype.render = function () {
    this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    for (var i = 0; i < scene.ground.length; ++i) {
        this.ground[i].draw();
    }
    this.player.draw();
};

SceneManager.prototype.update = function () {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
        this.elapsed = timeNow - this.lastTime;

        this.player.update();
    }
    this.lastTime = timeNow;

    //Check for death
    if (this.player.position.y < -4) {
        this.player.position.x = 0;
        this.player.position.y = 0;
        this.player.rigidBody.isGrounded = false;
        this.player.rigidBody.speedY = 0;
    }
};