class Timer {
  constructor(duration, todo, args, start) {
    this.duration = duration;
    this.start = start;
    this.todo = todo;
    this.args = args;
    if (!start) this.start = Date.now();
    this.timey = null;
  }

  startTimer() {
    this.timey = setTimeout(this.todo, this.duration, ...this.args);
    return this;
  }

  stop() {
    clearTimeout(this.timey);
  }

  howLong() {
    return (this.start + this.duration) - Date.now();
  }

  howPassed() {
    return this.howLong() < 0;
  }
}


module.exports = {};