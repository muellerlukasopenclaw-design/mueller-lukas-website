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
  // Detect theme and set colors
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark' || 
                     (!document.body.getAttribute('data-theme') && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Color palette based on theme
  const colors = isDarkMode ? {
    primary: 'rgba(0, 212, 255, 0.95)',
    secondary: 'rgba(0, 220, 255, 0.9)',
    tertiary: 'rgba(0, 215, 255, 0.85)',
    quaternary: 'rgba(0, 212, 255, 0.8)',
    light: 'rgba(0, 200, 255, 0.75)'
  } : {
    // Light mode: darker navy/cyan for better contrast
    primary: 'rgba(0, 100, 150, 0.95)',
    secondary: 'rgba(0, 120, 160, 0.9)',
    tertiary: 'rgba(0, 110, 150, 0.85)',
    quaternary: 'rgba(0, 100, 140, 0.8)',
    light: 'rgba(0, 90, 130, 0.75)'
  };
  
  const techWords = [
    // Core Programming (PHP focus)
    { text: 'PHP', size: 30, weight: 1.8, color: colors.primary },
    { text: 'JavaScript', size: 26, weight: 1.5, color: colors.secondary },
    { text: 'Python', size: 22, weight: 1.3, color: colors.tertiary },
    { text: 'Bash', size: 18, weight: 1.2, color: colors.quaternary },
    { text: 'PowerShell', size: 18, weight: 1.15, color: colors.quaternary },
    { text: 'SQL', size: 22, weight: 1.3, color: colors.tertiary },
    { text: 'JSON', size: 17, weight: 1.1, color: colors.light },
    { text: 'XML', size: 17, weight: 1.1, color: colors.light },
    { text: 'HTML', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'CSS', size: 19, weight: 1.2, color: colors.quaternary },
    
    // DevOps & Containers
    { text: 'DevOps', size: 28, weight: 1.7, color: 'rgba(0, 180, 220, 0.95)' },
    { text: 'Docker', size: 25, weight: 1.5, color: colors.secondary },
    { text: 'Kubernetes', size: 23, weight: 1.4, color: colors.tertiary },
    { text: 'CI/CD', size: 24, weight: 1.45, color: colors.secondary },
    { text: 'GitLab', size: 21, weight: 1.3, color: colors.tertiary },
    { text: 'GitHub', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Jenkins', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Git', size: 22, weight: 1.35, color: colors.tertiary },
    
    // Cloud Platforms
    { text: 'Cloud', size: 25, weight: 1.5, color: colors.secondary },
    { text: 'AWS', size: 22, weight: 1.35, color: colors.tertiary },
    { text: 'Azure', size: 21, weight: 1.3, color: colors.tertiary },
    { text: 'IaC', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Terraform', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Ansible', size: 20, weight: 1.25, color: colors.quaternary },
    
    // Databases
    { text: 'MySQL', size: 21, weight: 1.3, color: colors.tertiary },
    { text: 'PostgreSQL', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Redis', size: 18, weight: 1.15, color: colors.quaternary },
    { text: 'Elasticsearch', size: 18, weight: 1.15, color: colors.light },
    
    // Monitoring & Observability
    { text: 'Monitoring', size: 22, weight: 1.35, color: colors.tertiary },
    { text: 'Grafana', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Prometheus', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'ELK Stack', size: 18, weight: 1.15, color: colors.light },
    
    // Security
    { text: 'Security', size: 24, weight: 1.45, color: colors.secondary },
    { text: 'ISO 27001', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Firewall', size: 18, weight: 1.15, color: colors.light },
    { text: 'VPN', size: 18, weight: 1.15, color: colors.light },
    { text: 'SSL/TLS', size: 18, weight: 1.15, color: colors.light },
    { text: 'Compliance', size: 18, weight: 1.15, color: colors.light },
    
    // Methodologies & Frameworks
    { text: 'Agile', size: 23, weight: 1.4, color: colors.tertiary },
    { text: 'Scrum', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Kanban', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'ITIL', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'DevSecOps', size: 19, weight: 1.2, color: colors.quaternary },
    
    // Project Management Tools
    { text: 'Jira', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Confluence', size: 18, weight: 1.15, color: colors.light },
    { text: 'ServiceNow', size: 18, weight: 1.15, color: colors.light },
    
    // Web Servers & Infrastructure
    { text: 'Nginx', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Apache', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Load Balancing', size: 17, weight: 1.1, color: colors.light },
    
    // Operating Systems
    { text: 'Linux', size: 25, weight: 1.5, color: colors.secondary },
    { text: 'Ubuntu', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Debian', size: 18, weight: 1.15, color: colors.quaternary },
    { text: 'Windows Server', size: 18, weight: 1.15, color: colors.light },
    
    // APIs & Integration
    { text: 'REST API', size: 21, weight: 1.3, color: colors.tertiary },
    { text: 'Microservices', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'API', size: 19, weight: 1.2, color: colors.quaternary },
    
    // Architecture & Design
    { text: 'Architecture', size: 22, weight: 1.35, color: colors.tertiary },
    { text: 'Infrastructure', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Scalability', size: 18, weight: 1.15, color: colors.light },
    { text: 'High Availability', size: 18, weight: 1.15, color: colors.light },
    { text: 'Disaster Recovery', size: 17, weight: 1.1, color: colors.light },
    { text: 'Backup', size: 18, weight: 1.15, color: colors.light },
    
    // Leadership & Soft Skills
    { text: 'Leadership', size: 26, weight: 1.55, color: colors.primary },
    { text: 'Team Management', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Strategy', size: 23, weight: 1.4, color: colors.secondary },
    { text: 'IT Strategy', size: 21, weight: 1.3, color: colors.tertiary },
    { text: 'Governance', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Budgeting', size: 18, weight: 1.15, color: colors.light },
    { text: 'Innovation', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Digital Transformation', size: 19, weight: 1.2, color: colors.quaternary },
    
    // Additional Skills
    { text: 'Automation', size: 22, weight: 1.35, color: colors.tertiary },
    { text: 'Scripting', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Configuration', size: 17, weight: 1.1, color: colors.light },
    { text: 'Optimization', size: 18, weight: 1.15, color: colors.light },
    { text: 'Performance', size: 18, weight: 1.15, color: colors.light },
    { text: 'Troubleshooting', size: 17, weight: 1.1, color: colors.light },
    
    // Network & Communication
    { text: 'TCP/IP', size: 18, weight: 1.15, color: colors.light },
    { text: 'DNS', size: 18, weight: 1.15, color: colors.light },
    { text: 'LDAP', size: 17, weight: 1.1, color: colors.light },
    { text: 'SSO', size: 17, weight: 1.1, color: colors.light },
    { text: 'Active Directory', size: 17, weight: 1.1, color: colors.light },
    
    // Version Control & Collaboration
    { text: 'Version Control', size: 19, weight: 1.2, color: colors.quaternary },
    { text: 'Code Review', size: 17, weight: 1.1, color: colors.light },
    { text: 'Documentation', size: 18, weight: 1.15, color: colors.light },
    
    // Virtualization
    { text: 'VMware', size: 18, weight: 1.15, color: colors.light },
    { text: 'vSphere', size: 17, weight: 1.1, color: colors.light },
    { text: 'Proxmox', size: 17, weight: 1.1, color: colors.light },
    { text: 'Hyper-V', size: 17, weight: 1.1, color: colors.light },
    
    // Testing & QA
    { text: 'Testing', size: 18, weight: 1.15, color: colors.light },
    
    // Business & Management
    { text: 'Project Management', size: 20, weight: 1.25, color: colors.quaternary },
    { text: 'Stakeholder', size: 17, weight: 1.1, color: colors.light },
    { text: 'Vendor Management', size: 17, weight: 1.1, color: colors.light },
    { text: 'Risk Management', size: 17, weight: 1.1, color: colors.light }
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