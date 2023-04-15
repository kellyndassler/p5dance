let img1, img2, img3;
let imgWidth = 100;
let imgHeight = 100;

//(move the image down until it hits the bottom of the canvas at a slow speed. when it hits the bottom of the canvas, move the image up until it returns to the starting point.) do this three times. (then rotate the image 15 degrees. move y position of the image up by 10 pixels. then rotate the image in the opposite direction 15 degrees.) do this three times. then rotate the image 360 degrees. then rotate it -780 degrees. do this three times.

function preload() {
    img1 = loadImage('./assets/CatsDanceAvatar_Itai.png');
    img2 = loadImage('./assets/jesse_virus.webp');
    img3 = loadImage('./assets/rachel_snake.png');
    img4 = loadImage('./assets/sara_gears.png');
    img5 = loadImage('./assets/serena_robot2.png');
    img6 = loadImage('./assets/sam_plug.png');
    img7 = loadImage('./assets/kellyn_spinning_wheel_of_death.jpeg');
}


class ImageObject {
    constructor(img, x, y, speed, rotationSpeed) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
        this.angle = 0;
        this.movementCount = 0;
        this.movementDirection = 1;
        this.speedMultiplier = 1;
    }

    update() {
        // move the image up and down
        this.y += this.speed;
        if (this.y > height || this.y < 0) {
            this.speed *= -1;
        }

        // rotate the image in place
        this.angle += this.rotationSpeed;
        if (this.angle >= 360) {
            this.angle = 0;
        }

        // move the image left and right
        if (this === image4) {
            if (this.movementCount >= 6) {
                // rotate the image by 90 degrees after 6 left-right movements
                this.angle += 90;
                this.movementCount = 0;
                this.speedMultiplier = 1;
            } else {
                this.x += this.speed * this.movementDirection * this.speedMultiplier;
                if (this.x <= 0 || this.x >= width) {
                    this.movementCount++;
                    this.movementDirection *= -1;
                    this.speedMultiplier += 0.2;
                }
            }
        }

        // move the image down
        if (this === image6) {
            if (this.movementCount <= 3) {
                this.y += this.speed;
                if (this.y > height || this.y < 0) {
                    this.speed *= -1;
                }
                this.angle += 360;
                this.movementCount = 0;
            } else {
                if (this.x <= 0 || this.x >= width) {
                    this.angle -= 780;
                    this.movementCount++;
                }
            }
        }

    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(radians(this.angle));
        imageMode(CENTER);
        image(this.img, 0, 0);
        pop();
    }

    checkCollision(other) {
        let distance = dist(this.x, this.y, other.x, other.y);
        return distance <= (this.image.width * this.size + other.image.width * other.size) / 2;
    }

    jitter() {
        // zigzag movement for image3
        if (this === image3) {
            if (this.x <= 0 || this.x >= width) {
                this.speed *= -1;
            }
            this.x += this.speed;
            this.y += this.speed * 0.5;
        } else { // random jitter movement for image1 and image2
            this.x += random(-5, 5);
            this.y += random(-5, 5);
            if (this.x < 0) {
                this.x = width;
            } else if (this.x > width) {
                this.x = 0;
            }
            if (this.y < 0) {
                this.y = height;
            } else if (this.y > height) {
                this.y = 0;
            }
        }

        // reduce the movement speed of image4 when colliding with image2
        if (this === image4 && dist(this.x, this.y, image2.x, image2.y) < imgWidth) {
            this.speed = 0;
            this.speedMultiplier = 0;
        }
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.speed = random(1, 5);
        this.rotationSpeed = random(0.5, 1);
        this.angle = 0;
        this.movementCount = 0;
        this.movementDirection = 1;
        this.speedMultiplier = 1;
    }
}

class Line {
    constructor() {
        this.x1 = random(width);
        this.y1 = random(height);
        this.x2 = random(width);
        this.y2 = random(height);
        this.color = color(random(255), random(255), random(255));
        this.thickness = random(1, 5);
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.thickness);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}


class WavyMovingImage {
    constructor(img) {
        this.img = img;
        this.x = random(width);
        this.y = random(height);
        this.speed = 1;
        this.angle = 0;
        this.amplitude = 50;
        this.frequency = 0.05;
    }

    move() {
        this.x += this.speed;
        this.angle += this.frequency;
        this.y = map(sin(this.angle), -1, 1, this.y - this.amplitude, this.y + this.amplitude);

        if (this.x > width) {
            this.x = 0;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.img, 0, 0);
        pop();
    }

    collidesWithLine(line) {
        let d = dist(this.x, this.y, line.x1, line.y1) + dist(this.x, this.y, line.x2, line.y2);
        let lineLength = dist(line.x1, line.y1, line.x2, line.y2);
        let tolerance = 5;
        return (d >= lineLength - tolerance && d <= lineLength + tolerance);
    }

    turn(degrees) {
        this.angle += radians(degrees);
    }
}

let image1, image2, image3, image4, image5, image6, image7;
let lines = [];

function setup() {
    createCanvas(1100, 700);

    for (let i = 0; i < 20; i++) {
        lines.push(new Line());
    }

    //play with this to size or resize
    img1.resize(imgWidth, imgHeight);
    img2.resize(imgWidth, imgHeight);
    img3.resize(imgWidth, imgHeight);
    img4.resize(imgWidth, imgHeight);
    img5.resize(imgWidth, imgHeight);
    img6.resize(imgWidth, imgHeight);
    img7.resize(imgWidth, imgHeight);

    image1 = new ImageObject(img1, random(width), random(height), random(1, 5), random(0.5, 1));
    image2 = new ImageObject(img2, random(width), random(height), random(1, 5), random(0.5, 1));
    image3 = new ImageObject(img3, random(width), random(height), random(1, 5), 0);
    image4 = new ImageObject(img4, random(width), random(height), random(1, 5), random(0.5, 1));
    image5 = new WavyMovingImage(img5);
    image6 = new ImageObject(img6, random(width), random(height), random(1, 5), random(0.5, 1));
    image7 = new ImageObject(img7, random(width), random(height), random(1, 5), random(0.5, 1))
}

function draw() {
    background(220);

    // Draw lines
    for (let i = 0; i < lines.length; i++) {
        lines[i].draw();
    }

    image1.jitter();
    image1.update();
    image1.display();

    image2.jitter();
    image2.update();
    image2.display();

    image3.jitter();
    image3.update();
    image3.display();

    image4.jitter();
    image4.update();
    image4.display();

    image5.move();
    image5.display();


    image6.update();
    image6.display();
    image6.jitter();


    image7.update();
    image7.display();
    image7.jitter();

    // reset image1 and image2 if they go offscreen
    if (image1.x > width || image1.x < 0 || image1.y > height || image1.y < 0) {
        image1.reset();
    }
    if (image2.x > width || image2.x < 0 || image2.y > height || image2.y < 0) {
        image2.reset();
    }
    // reset the third image if it goes off screen
    if (image3.x < -imgWidth / 2 || image3.x > width + imgWidth / 2 || image3.y < -imgHeight / 2 || image3.y > height + imgHeight / 2) {
        image3.reset();
    }

    // check for collisions with lines
    for (let i = 0; i < lines.length; i++) {
        if (image5.collidesWithLine(lines[i])) {
            image5.turn(180);
            break;
        }
    }
}

function mouseClicked() {
    image1.reset();
    image2.reset();
    image3.reset();
    image4.reset();
    image5.reset();
    image6.reset();
}
