function Timer(duration, todo, args, start) {
  this.duration = duration;
  this.start = start;
  this.todo = todo;
  this.args = args;
  if (!start) this.start = Date.now();
  this.timey = null;
}

Timer.prototype.startTimer = function() {
  this.timey = setTimeout(this.todo, this.duration, ...this.args);
  return this;
};

Timer.prototype.stop = function() {
  clearTimeout(this.timey);
};

Timer.prototype.howLong = function() {
  return (this.start + this.duration) - Date.now();
};

Timer.prototype.hasPassed = function() {
  return this.howLong() < 0;
};

module.exports = Timer;