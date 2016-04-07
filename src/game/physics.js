var RigidBody = function (attachedTo, mass) {
    this.attachedTo = attachedTo;
    this.mass = mass;
    this.speed = new Vector(0.0, 0.0);
    this.force = new Vector(0.0, 0.0);
    this.isGrounded = false;
};

RigidBody.prototype.applyForce = function () {
    var elapsed = game.scene.elapsed;
    var gAcc = -0.00001;    // Kinda low? Maybe?
    var acc = new Vector(this.force.x / this.mass, this.force.y / this.mass);
    this.force.set(0, 0);    // Turn off forces

    this.speed.add(acc.x * elapsed, (gAcc + acc.y) * elapsed);

    // Vertical speed upper limitation
    var upperLimit = 0.005;
    if (this.speed.y > upperLimit)
        this.speed.y = upperLimit;

    this.attachedTo.position.add(this.speed.x * elapsed, this.speed.y * elapsed);
};

RigidBody.prototype.onGround = function () {
    this.isGrounded = true;
    this.resetSpeedAndForce();
};

RigidBody.prototype.resetSpeedAndForce = function () {
    this.speed.set(0.0, 0.0);
    this.force.set(0.0, 0.0);
};

var Collider = function (attachedTo, width, height) {
    this.attachedTo = attachedTo;
    this.w = width;
    this.h = height;
};

Collider.prototype.checkForCollision = function (other) {
    var actorPos = this.attachedTo.position.get();
    var otherPos = other.attachedTo.position.get();

    if (actorPos.x - this.w / 2 < otherPos.x + other.w / 2 &&
        actorPos.x + this.w / 2 > otherPos.x - other.w / 2 &&
        actorPos.y - this.h / 2 < otherPos.y + other.h / 2 &&
        actorPos.y + this.h / 2 > otherPos.y - other.h / 2) {

        var deltaX = actorPos.x - otherPos.x;
        var deltaY = actorPos.y - otherPos.y;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 0) {
                this.attachedTo.rigidBody.onGround();
                this.attachedTo.position.set(actorPos.x, otherPos.y + (other.h + this.h) / 2);
            } else {
                this.attachedTo.position.set(actorPos.x, otherPos.y - (other.h + this.h) / 2);
            }
        } else {
            if (deltaX > 0) {
                this.attachedTo.position.set(otherPos.x + (other.w + this.w) / 2, actorPos.y);
            } else {
                this.attachedTo.position.set(otherPos.x - (other.w + this.w) / 2, actorPos.y);
            }
        }
    }
};