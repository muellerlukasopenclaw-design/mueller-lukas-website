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
    // Core Programming (PHP focus)
    { text: 'PHP', size: 30, weight: 1.8, color: 'rgba(0, 230, 255, 0.95)' },
    { text: 'JavaScript', size: 26, weight: 1.5, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'Python', size: 22, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Bash', size: 18, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'PowerShell', size: 18, weight: 1.15, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'SQL', size: 22, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'JSON', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'XML', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'YAML', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'HTML', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'CSS', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    
    // DevOps & Containers
    { text: 'DevOps', size: 28, weight: 1.7, color: 'rgba(0, 235, 255, 0.95)' },
    { text: 'Docker', size: 25, weight: 1.5, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'Kubernetes', size: 23, weight: 1.4, color: 'rgba(0, 215, 255, 0.85)' },
    { text: 'CI/CD', size: 24, weight: 1.45, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'GitLab', size: 21, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'GitHub', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Jenkins', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Git', size: 22, weight: 1.35, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'ArgoCD', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Helm', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Cloud Platforms
    { text: 'Cloud', size: 25, weight: 1.5, color: 'rgba(0, 225, 255, 0.9)' },
    { text: 'AWS', size: 22, weight: 1.35, color: 'rgba(0, 215, 255, 0.85)' },
    { text: 'Azure', size: 21, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'GCP', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'IaC', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Terraform', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Ansible', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Pulumi', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Databases
    { text: 'MySQL', size: 21, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'PostgreSQL', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'MariaDB', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Redis', size: 18, weight: 1.15, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Elasticsearch', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'MongoDB', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'NoSQL', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Monitoring & Observability
    { text: 'Monitoring', size: 22, weight: 1.35, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Grafana', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Prometheus', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'ELK Stack', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Zabbix', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Nagios', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'PagerDuty', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Datadog', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Security
    { text: 'Security', size: 24, weight: 1.45, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'ISO 27001', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'SIEM', size: 18, weight: 1.15, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Firewall', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'VPN', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'SSL/TLS', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Penetration Testing', size: 16, weight: 1.0, color: 'rgba(0, 190, 255, 0.7)' },
    { text: 'Compliance', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Methodologies & Frameworks
    { text: 'Agile', size: 23, weight: 1.4, color: 'rgba(0, 215, 255, 0.85)' },
    { text: 'Scrum', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Kanban', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'ITIL', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'DevSecOps', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'SRE', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'FinOps', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Project Management Tools
    { text: 'Jira', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Confluence', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'ServiceNow', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'MS Project', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Web Servers & Infrastructure
    { text: 'Nginx', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Apache', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'HAProxy', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Traefik', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Load Balancing', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'CDN', size: 16, weight: 1.0, color: 'rgba(0, 190, 255, 0.7)' },
    
    // Operating Systems
    { text: 'Linux', size: 25, weight: 1.5, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'Ubuntu', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Debian', size: 18, weight: 1.15, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'CentOS', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'RHEL', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Windows Server', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    
    // APIs & Integration
    { text: 'REST API', size: 21, weight: 1.3, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'GraphQL', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'gRPC', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'SOAP', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Microservices', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Webhooks', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Architecture & Design
    { text: 'Architecture', size: 22, weight: 1.35, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Infrastructure', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Scalability', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'High Availability', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Disaster Recovery', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Backup', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Leadership & Soft Skills
    { text: 'Leadership', size: 26, weight: 1.55, color: 'rgba(0, 230, 255, 0.9)' },
    { text: 'Team Management', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Strategy', size: 23, weight: 1.4, color: 'rgba(0, 220, 255, 0.9)' },
    { text: 'IT Strategy', size: 21, weight: 1.3, color: 'rgba(0, 215, 255, 0.85)' },
    { text: 'Governance', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Budgeting', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Innovation', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Digital Transformation', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    
    // Additional Skills
    { text: 'Automation', size: 22, weight: 1.35, color: 'rgba(0, 212, 255, 0.85)' },
    { text: 'Scripting', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Configuration', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Optimization', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Performance', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Troubleshooting', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Network & Communication
    { text: 'TCP/IP', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'DNS', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'DHCP', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'LDAP', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'SSO', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Active Directory', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Version Control & Collaboration
    { text: 'Version Control', size: 19, weight: 1.2, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Code Review', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Documentation', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Virtualization
    { text: 'VMware', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'vSphere', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Proxmox', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'VirtualBox', size: 16, weight: 1.0, color: 'rgba(0, 190, 255, 0.7)' },
    { text: 'Hyper-V', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    
    // Testing & QA
    { text: 'Testing', size: 18, weight: 1.15, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Unit Testing', size: 16, weight: 1.0, color: 'rgba(0, 190, 255, 0.7)' },
    { text: 'Integration Testing', size: 16, weight: 1.0, color: 'rgba(0, 190, 255, 0.7)' },
    
    // Business & Management
    { text: 'Project Management', size: 20, weight: 1.25, color: 'rgba(0, 212, 255, 0.8)' },
    { text: 'Stakeholder', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Vendor Management', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' },
    { text: 'Risk Management', size: 17, weight: 1.1, color: 'rgba(0, 200, 255, 0.75)' }
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
