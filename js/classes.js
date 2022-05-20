class Sprite {
  //  Function, fired when you create a new object for the class, defines propites of Sprite, properties are inside an object to prevent having them pass in a specific order
  constructor({
    position,
    imageSrc,
    scale = 1,
    totalFrames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    // Adds scale property to maintain everything in scale realative to each other
    this.scale = scale;
    this.currentFrame = 0;
    // Sets the ammount of frames for the animation of an image
    this.totalFrames = totalFrames;
    // Check how many frames have we gone through, increases over time
    this.elapsedFrames = 0;
    // Check how many frames should we go through before changing elapsedFrames
    this.holdFrames = 12;
    // Handels problems with the image size and allows to position the images where we want
    this.offset = offset;
  }
  // Defines what the Spirte looks like
  draw() {
    canCon.drawImage(
      this.image,
      // Sets the current frame (position) of an image according to the ammount of frames and its width
      this.currentFrame * (this.image.width / this.totalFrames),
      0,
      this.image.width / this.totalFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      // Sets the actual width of the image according to the amount of frames and the scale of said image
      (this.image.width / this.totalFrames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.holdFrames === 0) {
      // Adds a frame to allow sprites to loop, -1 allows the background to remain still
      if (this.currentFrame < this.totalFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  // Changes or updates the properties to allow things to move
  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  //  Function, fired when you create a new object for the class, defines propites of Sprite, properties are inside an object to prevent having them pass in a specific order
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    totalFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    // Calls the constructor function of the parent class
    super({
      position,
      imageSrc,
      scale,
      totalFrames,
      offset,
    });
    // Defines the direction where things are moving when inside the animation loop
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    // Tracks the last key that was pressed to prevent code firtsness? issues
    this.lastPressedKey = "";

    // Defines the properties of the attack
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    // Adds color to each sprite, mainly for dev purposes
    this.color = color;

    this.isAttacking = false;

    // Adds the propertie of health, reduced when theres an attack
    this.health = 100;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.holdFrames = 12;
    // Defines the sprite to use depending on the action
    this.sprites = sprites;
    // Defines the death propertie
    this.death = false;

    // Loops through each object within sprites, declare as const so the value changes
    for (const sprite in this.sprites) {
      // Grabs the main object thats been loop through and adds a new property
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  // Defines what the Spirte looks like

  // Changes or updates the properties to allow things to move
  update() {
    this.draw();
    if (!this.death) this.animateFrames();
    //Tracks the position of the player and enemy and sets the attackbox relative to them, offset changes the position of the attackbox
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //// Draw rectangles to visualize attackboxes
    // canCon.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;
    // Gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 70) {
      this.velocity.y = 0;
      this.position.y = 356;
      // Adds the gravity value to make things 'fall' to the ground
    } else this.velocity.y += gravity;
  }

  // Defines the properties of the attack
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    // Stops the attack after a certain time
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 2000);
  }

  // Defines what happend when a hit is detected
  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  // Changes between all diferent sprites
  switchSprite(sprite) {
    // Declares the player death and stops any other animation from being called
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.totalFrames - 1)
        this.death = true;
      return;
    }

    // overwrites all animations with attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.totalFrames - 1
    )
      return;

    // overwrites all animations when a hit is taken
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.totalFrames - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.totalFrames = this.sprites.idle.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.totalFrames = this.sprites.run.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "runBack":
        if (this.image !== this.sprites.runBack.image) {
          this.image = this.sprites.runBack.image;
          this.totalFrames = this.sprites.runBack.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.totalFrames = this.sprites.jump.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.totalFrames = this.sprites.fall.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.totalFrames = this.sprites.attack1.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.totalFrames = this.sprites.takeHit.totalFrames;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.totalFrames = this.sprites.death.totalFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
