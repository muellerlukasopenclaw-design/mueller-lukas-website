/**
 * Lukas Müller - Interactive Word Cloud
 * Canvas-based animated tech stack visualization
 * Mouse parallax effect
 */

class WordCloud {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.words = options.words || [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    // Animation settings
    this.parallaxStrength = options.parallaxStrength || 0.02;
    this.floatSpeed = options.floatSpeed || 0.3;
    this.floatAmplitude = options.floatAmplitude || 15;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createWordObjects();
    this.bindEvents();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }
  
  createWordObjects() {
    this.wordObjects = this.words.map((word, index) => ({
      text: word.text,
      x: this.centerX + (Math.random() - 0.5) * this.canvas.width * 0.8,
      y: this.centerY + (Math.random() - 0.5) * this.canvas.height * 0.6,
      baseX: 0,
      baseY: 0,
      size: word.size || 16,
      color: word.color || 'rgba(0, 212, 255, 0.6)',
      speed: (Math.random() * 0.5 + 0.5) * this.floatSpeed,
      phase: Math.random() * Math.PI * 2,
      weight: word.weight || 1
    }));
    
    // Store base positions
    this.wordObjects.forEach(word => {
      word.baseX = word.x;
      word.baseY = word.y;
    });
  }
  
  bindEvents() {
    // Mouse tracking with smooth interpolation
    document.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.targetMouseX = (e.clientX - rect.left - this.centerX) * this.parallaxStrength;
      this.targetMouseY = (e.clientY - rect.top - this.centerY) * this.parallaxStrength;
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.targetMouseX = (e.touches[0].clientX - rect.left - this.centerX) * this.parallaxStrength;
        this.targetMouseY = (e.touches[0].clientY - rect.top - this.centerY) * this.parallaxStrength;
      }
    }, { passive: true });
    
    window.addEventListener('resize', () => this.resize());
  }
  
  animate() {
    // Smooth mouse interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw words
    const time = Date.now() * 0.001;
    
    this.wordObjects.forEach((word, index) => {
      // Floating animation
      const floatY = Math.sin(time * word.speed + word.phase) * this.floatAmplitude;
      const floatX = Math.cos(time * word.speed * 0.7 + word.phase) * (this.floatAmplitude * 0.5);
      
      // Parallax effect (inverse for depth)
      const parallaxX = -this.mouseX * word.weight;
      const parallaxY = -this.mouseY * word.weight;
      
      // Calculate final position
      const x = word.baseX + floatX + parallaxX;
      const y = word.baseY + floatY + parallaxY;
      
      // Keep within bounds
      word.x = Math.max(word.size, Math.min(this.canvas.width - word.size, x));
      word.y = Math.max(word.size, Math.min(this.canvas.height - word.size, y));
      
      // Draw word
      this.drawWord(word);
    });
    
    requestAnimationFrame(() => this.animate());
  }
  
  drawWord(word) {
    this.ctx.save();
    
    // Glow effect
    this.ctx.shadowColor = word.color;
    this.ctx.shadowBlur = 10;
    
    // Text
    this.ctx.font = `${word.weight > 1.2 ? 'bold' : 'normal'} ${word.size}px Inter, sans-serif`;
    this.ctx.fillStyle = word.color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Slight rotation based on position for dynamic feel
    const rotation = (word.x - this.centerX) * 0.0005;
    this.ctx.translate(word.x, word.y);
    this.ctx.rotate(rotation);
    this.ctx.fillText(word.text, 0, 0);
    
    this.ctx.restore();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const techWords = [
    { text: 'PHP', size: 28, weight: 1.5, color: 'rgba(0, 212, 255, 0.9)' },
    { text: 'JavaScript', size: 24, weight: 1.4, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Docker', size: 22, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'DevOps', size: 26, weight: 1.6, color: 'rgba(0, 230, 255, 0.95)' },
    { text: 'Git', size: 20, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Linux', size: 21, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'CI/CD', size: 23, weight: 1.35, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Cloud', size: 25, weight: 1.45, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'Kubernetes', size: 19, weight: 1.15, color: 'rgba(0, 212, 255, 0.75)' },
    { text: 'API', size: 22, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'SQL', size: 20, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'AWS', size: 21, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Security', size: 20, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Agile', size: 19, weight: 1.15, color: 'rgba(0, 212, 255, 0.75)' },
    { text: 'Leadership', size: 24, weight: 1.4, color: 'rgba(0, 230, 255, 0.95)' }
  ];
  
  // Initialize word cloud if canvas exists
  if (document.getElementById('wordcloud-canvas')) {
    new WordCloud('wordcloud-canvas', {
      words: techWords,
      parallaxStrength: 0.03,
      floatSpeed: 0.4,
      floatAmplitude: 20
    });
  }
});
