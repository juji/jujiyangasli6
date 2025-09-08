export class Ball {
  elm: HTMLDivElement;
  radius = 0;
  diameter = 0;
  x = 0;
  y = 0;
  color = "";
  speedX = 0;
  speedY = 0;
  accelX = 0;
  accelY = 0;

  leftBorder = 0;
  topBorder = 0;
  rightBorder = 0;
  bottomBorder = 0;

  // blur = 0
  maxSpeed = 999;
  turnAccelDelta = 0.09;
  // state = {}

  baseSpeed = 2;

  runFunc = {
    update: () => {},
    render: () => {},
  };

  box = {
    width: 720,
    height: 580,
  };

  constructor(
    elm: HTMLDivElement,
    color: string,
    {
      width,
      height,
    }: {
      width: number;
      height: number;
    },
  ) {
    this.elm = elm;

    this.box.width = width;
    this.box.height = height;

    this.baseSpeed = this.baseSpeed + (-0.6 + Math.random());

    this.setBorders();

    const radius = this.box.width * (0.3 + Math.random() * 0.4);
    this.radius = Math.round(radius + Math.random() * 100);

    this.x =
      (screen.width - this.box.width) / 2 + Math.random() * this.box.width;
    this.y =
      (screen.height - this.box.height) / 2 + Math.random() * this.box.height;
    this.color = color;

    this.speedX = this.baseSpeed * (Math.random() < 0.5 ? -1 : 1);
    this.speedY = this.baseSpeed * (Math.random() < 0.5 ? -1 : 1);

    this.elm.style.setProperty("--diameter", `${this.radius * 2}px`);
    this.elm.style.setProperty("--color", this.color);
    this.elm.style.setProperty("--pos-x", `${this.x}px`);
    this.elm.style.setProperty("--pos-y", `${this.y}px`);

    // do i want to save the state?
    // this.state = JSON.parse(JSON.stringify(this))
  }

  setBorders() {
    const screenSize = {
      width: screen.width,
      height: screen.height,
    };

    this.leftBorder = (screenSize.width - this.box.width) / 2;
    this.topBorder = (screenSize.height - this.box.height) / 2;
    this.rightBorder = (screenSize.width - this.box.width) / 2 + this.box.width;
    this.bottomBorder =
      (screenSize.height - this.box.height) / 2 + this.box.height;
  }

  onResize() {
    this.setBorders();
  }

  update() {
    if (this.x > this.rightBorder) {
      this.accelX -= this.turnAccelDelta;
    }

    if (this.x < this.leftBorder) {
      this.accelX += this.turnAccelDelta;
    }

    if (this.y > this.bottomBorder) {
      this.accelY -= this.turnAccelDelta;
    }

    if (this.y < this.topBorder) {
      this.accelY += this.turnAccelDelta;
    }

    this.x += this.speedX + this.accelX;
    this.y += this.speedY + this.accelY;
  }

  render() {
    this.elm.style.setProperty("--pos-x", `${this.x}px`);
    this.elm.style.setProperty("--pos-y", `${this.y}px`);
  }
}
