/**
 * Performance monitoring utilities for Light Drift
 * Tracks FPS and memory usage for optimization purposes
 */

class PerformanceMonitor {
  constructor() {
    this.frames = 0;
    this.lastTime = Date.now();
    this.fps = 0;
    this.maxLanterns = 200;
  }

  update() {
    this.frames++;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / deltaTime);
      this.frames = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }

  getFPS() {
    return this.fps;
  }

  getMaxLanterns() {
    return this.maxLanterns;
  }

  // Adjust max lanterns based on performance
  optimizeBasedOnPerformance() {
    if (this.fps < 30 && this.maxLanterns > 50) {
      this.maxLanterns -= 10;
      console.warn(`Performance: Reducing max lanterns to ${this.maxLanterns}`);
    } else if (this.fps > 55 && this.maxLanterns < 300) {
      this.maxLanterns += 5;
    }
  }
}

export default new PerformanceMonitor();
