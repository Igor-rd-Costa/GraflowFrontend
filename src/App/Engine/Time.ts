



export default class Time {
  private constructor() {};
  private static deltaTime = 0;

  private static lastFrameTime = 0;
  
  static Update() {
    const now = performance.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
  }

  static Delta(): number {
    return this.deltaTime;
  }

  static Now(): number {
    return performance.now();
  }
}