
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Enhanced Video Player Functionality with Audio Simulation
class VideoPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 25 * 60 + 40; // 25:40 in seconds
        this.volume = 0.8;
        this.playbackRate = 1;
        this.progressInterval = null;
        this.audioContext = null;
        this.speechSynthesis = window.speechSynthesis;
        this.currentVoice = null;
        this.isMuted = false;
        this.currentSpeaking = null;
        this.isCurrentlySpeaking = false;
        this.lastNarrationTime = 0;
        this.codeTypingInterval = null;
        this.codeTypingTimeout = null;
        this.currentCodeLine = 0;
        this.currentCodeChar = 0;
        this.codeSnippets = [];
        this.codeRestartTimes = [];
        this.init();
    }

    init() {
        this.initAudio();
        this.bindEvents();
        this.updateTimeDisplay();
        this.setupVoices();
        this.createVideoBackground();
        this.startCodeTypingEffect();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    setupVoices() {
        if (this.speechSynthesis) {
            // Wait for voices to load
            if (this.speechSynthesis.getVoices().length === 0) {
                this.speechSynthesis.addEventListener('voiceschanged', () => {
                    this.selectBestVoice();
                });
            } else {
                this.selectBestVoice();
            }
        }
    }

    selectBestVoice() {
        const voices = this.speechSynthesis.getVoices();
        // Prefer English voices, female voice for tutorial
        this.currentVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Female')
        ) || voices.find(voice => 
            voice.lang.includes('en')
        ) || voices[0];
    }

    createVideoBackground() {
        const videoScreen = document.querySelector('.video-screen');
        
        // Add typing code overlay
        const typingOverlay = document.createElement('div');
        typingOverlay.className = 'typing-code-overlay';
        typingOverlay.innerHTML = `
            <div class="code-line" id="code-line-0"></div>
            <div class="code-line" id="code-line-1"></div>
            <div class="code-line" id="code-line-2"></div>
            <div class="code-line" id="code-line-3"></div>
            <div class="code-line" id="code-line-4"></div>
            <div class="code-line" id="code-line-5"></div>
            <div class="code-line" id="code-line-6"></div>
            <div class="code-line" id="code-line-7"></div>
        `;
        
        // Add floating design elements
        const floatingElements = document.createElement('div');
        floatingElements.className = 'floating-elements';
        floatingElements.innerHTML = `
            <div class="floating-icon"><i class="fas fa-palette"></i></div>
            <div class="floating-icon"><i class="fas fa-paint-brush"></i></div>
            <div class="floating-icon"><i class="fas fa-vector-square"></i></div>
            <div class="floating-icon"><i class="fas fa-layer-group"></i></div>
            <div class="floating-icon"><i class="fas fa-eye"></i></div>
        `;
        
        // Add glitch effect
        const glitchEffect = document.createElement('div');
        glitchEffect.className = 'video-glitch-effect';
        
        videoScreen.appendChild(typingOverlay);
        videoScreen.appendChild(floatingElements);
        videoScreen.appendChild(glitchEffect);
    }

    startCodeTypingEffect() {
        this.codeSnippets = [
            "// UI Design Tutorial - Getting Started",
            "const designPrinciples = {",
            "  colors: ['#667eea', '#764ba2'],",
            "  typography: 'Inter, sans-serif',",
            "  spacing: '8px, 16px, 24px',",
            "  layout: 'responsive-grid'",
            "};",
            "// Creating beautiful interfaces..."
        ];

        this.currentCodeLine = 0;
        this.currentCodeChar = 0;
        this.codeTypingSpeed = 80; // Base typing speed in ms
        
        // Only start typing if video is playing
        if (this.isPlaying) {
            this.typeCodeLine();
        }
        
        // Sync with video progress - restart typing based on chapters
        this.codeRestartTimes = [0, 135, 330, 645, 980, 1270]; // Chapter start times
    }

    typeCodeLine() {
        // Stop typing if video is not playing
        if (!this.isPlaying) {
            if (this.codeTypingTimeout) {
                clearTimeout(this.codeTypingTimeout);
                this.codeTypingTimeout = null;
            }
            return;
        }

        // Faster typing when playing
        this.codeTypingSpeed = 60;

        if (this.currentCodeLine >= this.codeSnippets.length) {
            this.currentCodeLine = 0;
            this.clearAllCodeLines();
        }

        const lineElement = document.getElementById(`code-line-${this.currentCodeLine}`);
        if (!lineElement) return;

        const currentSnippet = this.codeSnippets[this.currentCodeLine];
        
        if (this.currentCodeChar <= currentSnippet.length) {
            lineElement.textContent = currentSnippet.substring(0, this.currentCodeChar);
            this.currentCodeChar++;
            
            // Dynamic typing speed based on content
            let speed = this.codeTypingSpeed;
            if (currentSnippet[this.currentCodeChar - 1] === ' ') {
                speed *= 0.5; // Faster on spaces
            } else if (currentSnippet[this.currentCodeChar - 1] === ';') {
                speed *= 2; // Slower on semicolons
            }
            
            this.codeTypingTimeout = setTimeout(() => this.typeCodeLine(), speed);
        } else {
            // Line complete
            lineElement.classList.add('complete');
            this.currentCodeChar = 0;
            this.currentCodeLine++;
            
            // Pause before next line
            this.codeTypingTimeout = setTimeout(() => this.typeCodeLine(), 600);
        }
    }

    clearAllCodeLines() {
        for (let i = 0; i < this.codeSnippets.length; i++) {
            const lineElement = document.getElementById(`code-line-${i}`);
            if (lineElement) {
                lineElement.textContent = '';
                lineElement.classList.remove('complete');
            }
        }
    }

    syncCodeTypingWithVideo() {
        // Only sync code typing when video is playing
        if (!this.isPlaying) return;
        
        // Sync code typing with current video time
        if (this.codeRestartTimes.some(time => Math.abs(this.currentTime - time) < 2)) {
            this.clearAllCodeLines();
            this.currentCodeLine = 0;
            this.currentCodeChar = 0;
            
            // Clear existing timeout
            if (this.codeTypingTimeout) {
                clearTimeout(this.codeTypingTimeout);
                this.codeTypingTimeout = null;
            }
            
            // Restart typing with slight delay
            setTimeout(() => this.typeCodeLine(), 500);
        }
    }

    updateVideoBackground() {
        const videoScreen = document.querySelector('.video-screen');
        
        if (this.isPlaying) {
            // Smooth color transitions based on video progress
            const progress = this.currentTime / this.duration;
            const hue1 = (240 + progress * 60) % 360; // Blue to purple range
            const hue2 = (280 + progress * 40) % 360; // Purple to pink range
            const hue3 = (200 + progress * 80) % 360; // Cyan to blue range
            
            videoScreen.style.background = `
                linear-gradient(135deg, 
                    hsl(${hue1}, 45%, 18%) 0%, 
                    hsl(${hue2}, 55%, 12%) 35%, 
                    hsl(${hue3}, 50%, 20%) 70%,
                    hsl(${hue1}, 40%, 15%) 100%
                )
            `;
            
            // Subtle breathing effect
            const breathe = Math.sin(this.currentTime * 0.3) * 0.05 + 1.05;
            const pulse = Math.sin(this.currentTime * 0.8) * 0.03 + 0.97;
            videoScreen.style.filter = `brightness(${pulse}) contrast(${breathe}) saturate(1.1)`;
            
            // Add dynamic overlay opacity
            const beforeElement = videoScreen.querySelector('::before');
            const opacity = Math.sin(this.currentTime * 0.4) * 0.2 + 0.6;
            videoScreen.style.setProperty('--overlay-opacity', opacity);
        } else {
            // Calmer gradient when paused
            videoScreen.style.background = `
                linear-gradient(135deg, 
                    hsl(240, 35%, 15%) 0%, 
                    hsl(260, 40%, 10%) 50%, 
                    hsl(220, 45%, 18%) 100%
                )
            `;
            videoScreen.style.filter = 'brightness(0.9) contrast(1) saturate(0.8)';
            videoScreen.style.setProperty('--overlay-opacity', 0.3);
        }
    }

    bindEvents() {
        // Play button click
        document.querySelector('.play-button-large').addEventListener('click', () => {
            this.togglePlay();
        });

        // Control play/pause button
        document.querySelector('.play-pause').addEventListener('click', () => {
            this.togglePlay();
        });

        // Progress bar click
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            this.seekTo(e);
        });

        // Volume control
        document.querySelector('.volume-slider').addEventListener('click', (e) => {
            this.adjustVolume(e);
        });

        // Volume mute/unmute
        document.querySelector('.volume-control button').addEventListener('click', () => {
            this.toggleMute();
        });

        // Speed control
        document.querySelector('.speed-btn').addEventListener('click', () => {
            this.changeSpeed();
        });

        // Chapter clicks
        document.querySelectorAll('.chapter-item').forEach(chapter => {
            chapter.addEventListener('click', () => {
                this.jumpToChapter(chapter);
            });
        });

        // Like button
        document.querySelector('.like-btn').addEventListener('click', () => {
            this.toggleLike();
        });

        // Share button
        document.querySelector('.share-btn').addEventListener('click', () => {
            this.shareVideo();
        });

        // Save button
        document.querySelector('.save-btn').addEventListener('click', () => {
            this.saveVideo();
        });

        // Fullscreen button
        document.querySelector('.fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playButton = document.querySelector('.play-button-large i');
        const controlButton = document.querySelector('.play-pause i');
        
        if (this.isPlaying) {
            playButton.className = 'fas fa-pause';
            controlButton.className = 'fas fa-pause';
            this.startProgress();
            this.playSound('play');
            this.updateVideoBackground(); // Start dynamic background
            this.speakContent('Welcome to the UI Design Tutorial for Beginners. Let\'s start learning!');
            
            // Start code typing when video starts
            if (!this.codeTypingTimeout) {
                this.typeCodeLine();
            }
            
            showNotification('▶️ Video playing - UI Design Tutorial', 'info');
        } else {
            playButton.className = 'fas fa-play';
            controlButton.className = 'fas fa-play';
            this.stopProgress();
            this.playSound('pause');
            this.stopSpeaking();
            this.updateVideoBackground(); // Reset background
            
            // Stop code typing when video pauses
            if (this.codeTypingTimeout) {
                clearTimeout(this.codeTypingTimeout);
                this.codeTypingTimeout = null;
            }
            
            showNotification('⏸️ Video paused', 'info');
        }
    }

    startProgress() {
        this.progressInterval = setInterval(() => {
            if (this.currentTime < this.duration) {
                this.currentTime += 1;
                this.updateProgressBar();
                this.updateTimeDisplay();
                this.updateActiveChapter();
                this.updateVideoBackground(); // Update background animation
                this.syncCodeTypingWithVideo(); // Sync code typing with video progress
                
                // Only trigger narration if we're not currently speaking
                if (!this.isCurrentlySpeaking) {
                    this.simulateNarration();
                }
            } else {
                this.stopProgress();
                this.isPlaying = false;
                this.currentTime = 0;
                document.querySelector('.play-button-large i').className = 'fas fa-replay';
                this.updateVideoBackground(); // Reset background
                
                // Clear any ongoing effects
                this.stopSpeaking();
                if (this.codeTypingTimeout) {
                    clearTimeout(this.codeTypingTimeout);
                }
                
                setTimeout(() => {
                    this.speakWithSubtitles('Congratulations! You\'ve completed the UI Design Tutorial. Check out our resources below to continue your learning journey.', 6);
                }, 500);
                showNotification('🎉 Tutorial completed! Check out our resources below.', 'success');
            }
        }, 1000 / this.playbackRate);
    }

    simulateNarration() {
        // Enhanced narration with subtitle effects and better timing
        const narrativePoints = {
            5: { text: 'Welcome to the complete UI Design Tutorial for Beginners!', duration: 4 },
            12: { text: 'In this comprehensive course, we\'ll cover all essential design principles.', duration: 5 },
            20: { text: 'By the end, you\'ll be able to create beautiful, functional interfaces.', duration: 4 },
            30: { text: 'Let\'s start with the fundamentals. What exactly is UI Design?', duration: 5 },
            40: { text: 'UI stands for User Interface - the visual elements users interact with.', duration: 5 },
            50: { text: 'Good UI design makes apps and websites easy and enjoyable to use.', duration: 4 },
            60: { text: 'Now, let\'s explore the key principles that make designs successful.', duration: 5 },
            
            135: { text: 'Chapter 2: Understanding UI Design in depth.', duration: 3 },
            145: { text: 'UI design is about creating interfaces that are both beautiful and functional.', duration: 5 },
            155: { text: 'It\'s the bridge between users and technology.', duration: 4 },
            165: { text: 'A well-designed interface feels intuitive and natural to use.', duration: 4 },
            175: { text: 'Users should never have to think about how to use your interface.', duration: 5 },
            
            330: { text: 'Chapter 3: Color Theory - The foundation of visual design.', duration: 4 },
            340: { text: 'Colors evoke emotions and guide user attention.', duration: 4 },
            350: { text: 'Understanding the color wheel helps create harmonious schemes.', duration: 5 },
            360: { text: 'Primary colors are red, blue, and yellow.', duration: 3 },
            370: { text: 'Secondary colors are created by mixing primaries.', duration: 4 },
            380: { text: 'Complementary colors create strong contrast and visual impact.', duration: 5 },
            390: { text: 'Analogous colors create harmony and are pleasing to the eye.', duration: 4 },
            
            645: { text: 'Chapter 4: Typography - The art of arranging text.', duration: 4 },
            655: { text: 'Typography can make or break your design.', duration: 3 },
            665: { text: 'Choose fonts that match your brand personality.', duration: 4 },
            675: { text: 'Sans-serif fonts are modern and clean for digital interfaces.', duration: 5 },
            685: { text: 'Serif fonts are traditional and great for readability.', duration: 4 },
            695: { text: 'Font pairing is an art - stick to 2-3 fonts maximum.', duration: 4 },
            705: { text: 'Hierarchy helps users scan and understand content quickly.', duration: 5 },
            
            980: { text: 'Chapter 5: Layout and Spacing - Creating visual hierarchy.', duration: 4 },
            990: { text: 'Proper spacing, also called white space, gives designs room to breathe.', duration: 5 },
            1000: { text: 'Grid systems help create consistent and balanced layouts.', duration: 4 },
            1010: { text: 'The rule of thirds creates more interesting compositions.', duration: 4 },
            1020: { text: 'Alignment creates order and professional appearance.', duration: 4 },
            1030: { text: 'Proximity groups related elements together visually.', duration: 4 },
            
            1270: { text: 'Chapter 6: Design Tools and Workflow optimization.', duration: 4 },
            1280: { text: 'The right tools can significantly speed up your workflow.', duration: 4 },
            1290: { text: 'Figma is perfect for beginners and collaboration.', duration: 4 },
            1300: { text: 'Start with wireframes before diving into visual design.', duration: 4 },
            1310: { text: 'Always design for mobile first, then scale up.', duration: 4 },
            1320: { text: 'Test your designs with real users whenever possible.', duration: 4 },
            1330: { text: 'Practice is key - start with simple projects first.', duration: 4 }
        };

        const currentNarrative = narrativePoints[this.currentTime];
        
        // Check if we should start new narration (avoid overlapping)
        if (currentNarrative && this.isPlaying && !this.isMuted && 
            !this.isCurrentlySpeaking && this.lastNarrationTime !== this.currentTime) {
            
            this.lastNarrationTime = this.currentTime;
            this.speakWithSubtitles(currentNarrative.text, currentNarrative.duration);
        }
    }

    speakWithSubtitles(text, duration) {
        // Mark as currently speaking
        this.isCurrentlySpeaking = true;
        
        // Create subtitle effect
        this.showSubtitle(text, duration);
        
        // Speak the content with proper callback
        this.speakContent(text, 0.9, () => {
            this.isCurrentlySpeaking = false;
        });
    }

    showSubtitle(text, duration) {
        // Remove existing subtitle and clear any ongoing typing
        const existingSubtitle = document.querySelector('.video-subtitle');
        if (existingSubtitle) {
            if (existingSubtitle.typeInterval) {
                clearInterval(existingSubtitle.typeInterval);
            }
            if (existingSubtitle.hideTimeout) {
                clearTimeout(existingSubtitle.hideTimeout);
            }
            existingSubtitle.remove();
        }

        // Create subtitle element
        const subtitle = document.createElement('div');
        subtitle.className = 'video-subtitle';
        subtitle.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            max-width: 85%;
            text-align: center;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s ease;
            line-height: 1.5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: 'Inter', sans-serif;
        `;

        const videoScreen = document.querySelector('.video-screen');
        videoScreen.appendChild(subtitle);

        // Typing effect with better timing
        this.typeText(subtitle, text, duration);
    }

    typeText(element, text, duration) {
        element.style.opacity = '1';
        element.textContent = '';
        
        // Calculate realistic typing speed
        const totalTypingTime = Math.min(duration * 0.4, 2.5); // Max 40% of duration or 2.5s
        const typingSpeed = Math.max(40, (totalTypingTime * 1000) / text.length);
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < text.length && this.isPlaying && !this.isMuted) {
                element.textContent += text[index];
                index++;
            } else if (index >= text.length || !this.isPlaying) {
                clearInterval(typeInterval);
                element.typeInterval = null;
                
                // Calculate remaining display time
                const typingDuration = index * typingSpeed / 1000;
                const remainingTime = Math.max(0.5, duration - typingDuration);
                
                // Keep subtitle visible for remaining duration
                element.hideTimeout = setTimeout(() => {
                    if (element.parentNode) {
                        element.style.opacity = '0';
                        setTimeout(() => {
                            if (element.parentNode) {
                                element.remove();
                            }
                        }, 300);
                    }
                }, remainingTime * 1000);
            }
        }, typingSpeed);

        // Store interval to clear if needed
        element.typeInterval = typeInterval;
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    updateProgressBar() {
        const progressPercent = (this.currentTime / this.duration) * 100;
        document.querySelector('.progress-fill').style.width = progressPercent + '%';
        document.querySelector('.progress-handle').style.left = progressPercent + '%';
    }

    updateTimeDisplay() {
        const currentFormatted = this.formatTime(this.currentTime);
        const durationFormatted = this.formatTime(this.duration);
        document.querySelector('.time-display').textContent = `${currentFormatted} / ${durationFormatted}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    seekTo(e) {
        const progressBar = e.target.closest('.progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.currentTime = Math.floor(this.duration * percentage);
        this.updateProgressBar();
        this.updateTimeDisplay();
        this.updateActiveChapter();
        this.playSound('seek');
        
        // Announce the current section
        const chapterTitle = this.getCurrentChapterTitle();
        if (chapterTitle) {
            this.speakContent(`Jumped to ${chapterTitle}`, 1.2);
        }
        
        showNotification(`⏭️ Jumped to ${this.formatTime(this.currentTime)}`, 'info');
    }

    getCurrentChapterTitle() {
        const chapters = [
            { time: 0, title: 'Introduction and Welcome' },
            { time: 135, title: 'What is UI Design?' },
            { time: 330, title: 'Color Theory Fundamentals' },
            { time: 645, title: 'Typography and Font Selection' },
            { time: 980, title: 'Layout and Spacing Principles' },
            { time: 1270, title: 'Design Tools and Workflow' }
        ];

        let currentChapter = chapters[0];
        for (let chapter of chapters) {
            if (this.currentTime >= chapter.time) {
                currentChapter = chapter;
            }
        }
        return currentChapter.title;
    }

    adjustVolume(e) {
        const slider = e.target.closest('.volume-slider');
        const rect = slider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        this.volume = Math.max(0, Math.min(1, clickX / rect.width));
        document.querySelector('.volume-fill').style.width = (this.volume * 100) + '%';
        
        this.updateVolumeIcon();
        this.playSound('volume');
        showNotification(`🔊 Volume: ${Math.round(this.volume * 100)}%`, 'info');
    }

    updateVolumeIcon() {
        const volumeIcon = document.querySelector('.volume-control i');
        if (this.isMuted || this.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumeIcon();
        
        if (this.isMuted) {
            this.stopSpeaking();
            showNotification('🔇 Audio muted', 'info');
        } else {
            showNotification('🔊 Audio unmuted', 'info');
        }
        
        this.playSound('mute');
    }

    playSound(type) {
        if (!this.audioContext || this.isMuted || this.volume === 0) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Different sounds for different actions
            switch(type) {
                case 'play':
                    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
                    break;
                case 'pause':
                    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.1);
                    break;
                case 'volume':
                    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    break;
                case 'seek':
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
                    break;
                case 'mute':
                    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                    break;
                default:
                    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
            }
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio playback failed:', e);
        }
    }

    speakContent(text, rate = 1, onEndCallback = null) {
        if (!this.speechSynthesis || this.isMuted || this.volume === 0) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Only stop if not already speaking the same content
        if (this.currentSpeaking && this.currentSpeaking.text !== text) {
            this.stopSpeaking();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.currentVoice) {
            utterance.voice = this.currentVoice;
        }
        utterance.rate = Math.max(0.6, Math.min(1.8, rate * this.playbackRate)); // Better rate range
        utterance.volume = this.volume;
        utterance.pitch = 1;
        
        // Enhanced speech event handling
        utterance.onstart = () => {
            this.currentSpeaking = utterance;
            this.isCurrentlySpeaking = true;
        };
        
        utterance.onend = () => {
            this.currentSpeaking = null;
            this.isCurrentlySpeaking = false;
            if (onEndCallback) onEndCallback();
        };
        
        utterance.onerror = () => {
            this.currentSpeaking = null;
            this.isCurrentlySpeaking = false;
            if (onEndCallback) onEndCallback();
        };
        
        utterance.onpause = () => {
            this.isCurrentlySpeaking = false;
        };
        
        utterance.onresume = () => {
            this.isCurrentlySpeaking = true;
        };
        
        this.speechSynthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        
        // Clear any active typing effects
        const subtitles = document.querySelectorAll('.video-subtitle');
        subtitles.forEach(subtitle => {
            if (subtitle.typeInterval) {
                clearInterval(subtitle.typeInterval);
            }
            subtitle.remove();
        });
        
        this.currentSpeaking = null;
    }

    changeSpeed() {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(this.playbackRate);
        this.playbackRate = speeds[(currentIndex + 1) % speeds.length];
        document.querySelector('.speed-btn').textContent = this.playbackRate + 'x';
        
        this.playSound('volume');
        this.speakContent(`Playback speed changed to ${this.playbackRate} times`, 1.5);
        showNotification(`⚡ Playback speed: ${this.playbackRate}x`, 'info');
    }

    jumpToChapter(chapterElement) {
        // Remove active class from all chapters
        document.querySelectorAll('.chapter-item').forEach(ch => ch.classList.remove('active'));
        
        // Add active class to clicked chapter
        chapterElement.classList.add('active');
        
        // Get chapter time and convert to seconds
        const timeText = chapterElement.dataset.time;
        const [mins, secs] = timeText.split(':').map(Number);
        this.currentTime = mins * 60 + secs;
        
        this.updateProgressBar();
        this.updateTimeDisplay();
        this.playSound('seek');
        
        const chapterTitle = chapterElement.querySelector('.chapter-title').textContent;
        
        // Speak chapter introduction
        const chapterIntros = {
            'Introduction & Welcome': 'Welcome to our comprehensive UI design tutorial! Let\'s begin your journey into the world of user interface design.',
            'What is UI Design?': 'Now let\'s explore what UI design really means and why it\'s so important in today\'s digital world.',
            'Color Theory Fundamentals': 'Time to dive into color theory - the foundation of great visual design. We\'ll learn how colors work together.',
            'Typography & Font Selection': 'Typography is crucial for readability and brand identity. Let\'s learn how to choose and pair fonts effectively.',
            'Layout & Spacing Principles': 'Good spacing and layout create visual hierarchy and improve user experience. Let\'s master these principles.',
            'Design Tools & Workflow': 'Finally, let\'s explore the tools and workflows that will make you an efficient UI designer.'
        };
        
        const intro = chapterIntros[chapterTitle] || `Now starting: ${chapterTitle}`;
        this.speakContent(intro);
        
        showNotification(`📚 Jumped to: ${chapterTitle}`, 'success');
        
        // Auto-play if not already playing
        if (!this.isPlaying) {
            this.togglePlay();
        }
    }

    updateActiveChapter() {
        const chapters = [
            { time: 0, element: document.querySelectorAll('.chapter-item')[0] },
            { time: 135, element: document.querySelectorAll('.chapter-item')[1] }, // 2:15
            { time: 330, element: document.querySelectorAll('.chapter-item')[2] }, // 5:30
            { time: 645, element: document.querySelectorAll('.chapter-item')[3] }, // 10:45
            { time: 980, element: document.querySelectorAll('.chapter-item')[4] }, // 16:20
            { time: 1270, element: document.querySelectorAll('.chapter-item')[5] } // 21:10
        ];

        let activeChapter = chapters[0];
        for (let chapter of chapters) {
            if (this.currentTime >= chapter.time) {
                activeChapter = chapter;
            }
        }

        // Update active chapter
        document.querySelectorAll('.chapter-item').forEach(ch => ch.classList.remove('active'));
        activeChapter.element.classList.add('active');
    }

    toggleLike() {
        const likeBtn = document.querySelector('.like-btn');
        const isLiked = likeBtn.classList.contains('liked');
        
        if (isLiked) {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('span').textContent = '2.1K';
            showNotification('👍 Like removed', 'info');
        } else {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('span').textContent = '2.2K';
            showNotification('❤️ Thanks for liking this tutorial!', 'success');
        }
    }

    shareVideo() {
        const currentTimeFormatted = this.formatTime(this.currentTime);
        const shareText = `Check out this amazing UI Design Tutorial! Currently at ${currentTimeFormatted}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'UI Design Tutorial for Beginners',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
            showNotification('🔗 Link copied to clipboard!', 'success');
        }
    }

    saveVideo() {
        const saveBtn = document.querySelector('.save-btn');
        const isSaved = saveBtn.style.color === 'rgb(102, 126, 234)';
        
        if (isSaved) {
            saveBtn.style.color = '';
            showNotification('📌 Removed from saved tutorials', 'info');
        } else {
            saveBtn.style.color = '#667eea';
            showNotification('💾 Tutorial saved for later!', 'success');
        }
    }

    toggleFullscreen() {
        const videoScreen = document.querySelector('.video-screen');
        if (!document.fullscreenElement) {
            videoScreen.requestFullscreen().then(() => {
                document.querySelector('.fullscreen-btn i').className = 'fas fa-compress';
                showNotification('📺 Entered fullscreen mode', 'info');
            });
        } else {
            document.exitFullscreen().then(() => {
                document.querySelector('.fullscreen-btn i').className = 'fas fa-expand';
                showNotification('📺 Exited fullscreen mode', 'info');
            });
        }
    }
}

// Initialize video player
const videoPlayer = new VideoPlayer();

// Download button handlers with real functionality
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', function() {
        const resourceType = this.parentElement.querySelector('h3').textContent;
        
        if (resourceType === 'Design Templates') {
            downloadFile('ui-templates.zip', createTemplateContent());
        } else if (resourceType === 'Design Guide') {
            downloadFile('ui-design-guide.pdf', createGuideContent());
        } else if (resourceType === 'Tool Recommendations') {
            showToolsList();
        }
    });
});

// Create and download files
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification(`${filename} downloaded successfully!`, 'success');
}

function createTemplateContent() {
    return `UI Design Templates Package
=====================================

This package includes:
1. Mobile App Wireframes (iOS & Android)
2. Website Landing Page Templates
3. Dashboard UI Components
4. E-commerce Product Cards
5. Social Media Post Templates

File formats: Figma, Sketch, Adobe XD
License: Free for personal and commercial use

Instructions:
- Import files into your design tool
- Customize colors, fonts, and content
- Use as starting point for your projects

Happy designing!
`;
}

function createGuideContent() {
    return `UI Design Guide for Beginners
===================================

Table of Contents:
1. Introduction to UI Design
2. Color Theory Fundamentals
3. Typography Best Practices
4. Layout and Spacing Principles
5. Design Systems and Components
6. Responsive Design Guidelines
7. Accessibility in UI Design
8. Popular Design Tools
9. Design Process and Workflow
10. Resources and Further Learning

Chapter 1: Introduction to UI Design
------------------------------------
User Interface (UI) design is the process of making interfaces in software or computerized devices with a focus on looks or style...

Chapter 2: Color Theory Fundamentals
------------------------------------
Color is one of the most powerful tools in a designer's toolkit. Understanding how colors work together...

[Content continues...]

For the complete guide with images and examples, visit our website or contact us for the full PDF version.
`;
}

function showToolsList() {
    const toolsWindow = window.open('', '_blank', 'width=600,height=800');
    toolsWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Recommended Design Tools</title>
            <style>
                body { font-family: Inter, sans-serif; padding: 20px; line-height: 1.6; }
                h1 { color: #667eea; }
                .tool { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; }
                .tool h3 { margin: 0 0 10px 0; color: #1a202c; }
                .price { color: #667eea; font-weight: bold; }
                a { color: #667eea; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>🎨 Recommended Design Tools for Beginners</h1>
            
            <div class="tool">
                <h3>Figma</h3>
                <p>Best overall tool for UI/UX design. Browser-based, collaborative, and perfect for beginners.</p>
                <p class="price">Free tier available</p>
                <a href="https://figma.com" target="_blank">Visit Figma →</a>
            </div>
            
            <div class="tool">
                <h3>Canva</h3>
                <p>Great for quick designs and social media graphics. Very beginner-friendly.</p>
                <p class="price">Free with premium options</p>
                <a href="https://canva.com" target="_blank">Visit Canva →</a>
            </div>
            
            <div class="tool">
                <h3>Adobe XD</h3>
                <p>Professional prototyping tool with great design capabilities.</p>
                <p class="price">Free starter plan</p>
                <a href="https://adobe.com/products/xd.html" target="_blank">Visit Adobe XD →</a>
            </div>
            
            <div class="tool">
                <h3>Sketch</h3>
                <p>Mac-only design tool, popular among professionals.</p>
                <p class="price">$99/year</p>
                <a href="https://sketch.com" target="_blank">Visit Sketch →</a>
            </div>
            
            <div class="tool">
                <h3>Framer</h3>
                <p>Advanced prototyping with real code components.</p>
                <p class="price">Free tier available</p>
                <a href="https://framer.com" target="_blank">Visit Framer →</a>
            </div>
            
            <h2>🎨 Color Palette Tools</h2>
            <div class="tool">
                <h3>Coolors.co</h3>
                <p>Generate beautiful color palettes instantly.</p>
                <a href="https://coolors.co" target="_blank">Visit Coolors →</a>
            </div>
            
            <h2>📝 Typography Tools</h2>
            <div class="tool">
                <h3>Google Fonts</h3>
                <p>Free web fonts for your projects.</p>
                <a href="https://fonts.google.com" target="_blank">Visit Google Fonts →</a>
            </div>
            
            <h2>📷 Stock Images</h2>
            <div class="tool">
                <h3>Unsplash</h3>
                <p>High-quality free stock photos.</p>
                <a href="https://unsplash.com" target="_blank">Visit Unsplash →</a>
            </div>
        </body>
        </html>
    `);
}

// Contact form handler with real functionality
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    if (name && email && message) {
        // Simulate sending email (in real app, you'd send to a backend)
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Save to localStorage (simulating database)
            const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.push({
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.topic-card, .resource-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Mobile menu functionality (if you want to add a hamburger menu later)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add some interactive hover effects
document.querySelectorAll('.topic-card, .resource-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Play button animation
document.querySelector('.play-button').addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) rotate(5deg)';
});

document.querySelector('.play-button').addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
});

// Social media links functionality
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        let url = '';
        let platform = '';
        
        if (icon.classList.contains('fa-youtube')) {
            url = 'https://youtube.com';
            platform = 'YouTube';
        } else if (icon.classList.contains('fa-twitter')) {
            url = 'https://twitter.com';
            platform = 'Twitter';
        } else if (icon.classList.contains('fa-instagram')) {
            url = 'https://instagram.com';
            platform = 'Instagram';
        } else if (icon.classList.contains('fa-linkedin')) {
            url = 'https://linkedin.com';
            platform = 'LinkedIn';
        }
        
        if (url) {
            const userChoice = confirm(`Visit our ${platform} page? This will open in a new tab.`);
            if (userChoice) {
                window.open(url, '_blank');
            }
        }
    });
});

// Add search functionality to the page
function addSearchFeature() {
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div id="search-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 15px; width: 80%; max-width: 500px;">
                <h3 style="margin-bottom: 20px; color: #1a202c;">Search Tutorial Content</h3>
                <input type="text" id="search-input" placeholder="Search for topics, tools, or concepts..." style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; font-size: 16px;">
                <div id="search-results" style="max-height: 200px; overflow-y: auto; margin-bottom: 20px;"></div>
                <button onclick="closeSearch()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(searchContainer);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!document.getElementById('search-overlay')) {
            addSearchFeature();
        }
        document.getElementById('search-overlay').style.display = 'block';
        document.getElementById('search-input').focus();
    }
    
    // Escape to close search
    if (e.key === 'Escape') {
        const overlay = document.getElementById('search-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
});

function closeSearch() {
    document.getElementById('search-overlay').style.display = 'none';
}

// Add loading animation for page
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('UI Design Tutorial website loaded successfully!');
    showNotification('Welcome! Press Ctrl+K to search tutorial content.', 'info');
});
