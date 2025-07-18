document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const params = new URLSearchParams(window.location.search);
    const herniaSide = params.get('side') || 'right';

    // --- Page Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // --- Guided Visualization ---
    const visualizationTextEl = document.getElementById('visualization-text');
    const playVisualizationBtn = document.getElementById('play-visualization');
    const vizAudio = document.getElementById('visualization-audio');
    let vizSpeech;

    const visualizationScript = [
        { text: "Take a deep breath in... and exhale completely. Find a comfortable position.", time: 0 },
        { text: `Bring your awareness to the ${herniaSide} side of your lower abdomen.`, time: 5 },
        { text: "Imagine a warm, healing light beginning to glow in this area. It is gentle, loving, and powerful.", time: 10 },
        { text: "This light is the essence of your body's innate intelligence.", time: 18 },
        { text: "See this light softly penetrating the tissues, muscles, and ligaments.", time: 24 },
        { text: "Visualize any weakened areas becoming stronger, knitted back together with threads of golden light.", time: 31 },
        { text: "Feel the abdominal wall becoming whole, integrated, and resilient.", time: 40 },
        { text: "The tissues are regenerating, becoming flexible and strong.", time: 48 },
        { text: "Your body knows exactly how to heal. Trust in this process.", time: 55 },
        { text: "Affirm to yourself: My body is healed, whole, and strong.", time: 61 },
        { text: "When you are ready, gently bring your awareness back to the room. Take this feeling of wholeness with you.", time: 68 }
    ];

    if ('speechSynthesis' in window) {
        vizSpeech = new SpeechSynthesisUtterance();
        vizSpeech.rate = 0.9;
        vizSpeech.pitch = 1.0;

        playVisualizationBtn.addEventListener('click', () => {
            playVisualizationBtn.disabled = true;
            let currentIndex = 0;

            function playNext() {
                if (currentIndex < visualizationScript.length) {
                    const currentLine = visualizationScript[currentIndex];
                    visualizationTextEl.textContent = currentLine.text;
                    vizSpeech.text = currentLine.text;
                    window.speechSynthesis.speak(vizSpeech);

                    vizSpeech.onend = () => {
                        currentIndex++;
                        if (currentIndex < visualizationScript.length) {
                             const nextLine = visualizationScript[currentIndex];
                             const delay = (nextLine.time - currentLine.time) * 1000;
                             setTimeout(playNext, delay > 0 ? delay : 500);
                        } else {
                             visualizationTextEl.textContent = "Session complete. Rest in this peaceful state.";
                             playVisualizationBtn.disabled = false;
                        }
                    };
                }
            }
            playNext();
        });

    } else {
        visualizationTextEl.textContent = "Your browser does not support speech synthesis. Please read the text manually.";
        playVisualizationBtn.style.display = 'none';
    }


    // --- Conscious Breathing ---
    const startBreathingBtn = document.getElementById('start-breathing');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingAudio = new Audio('breathing_guide.mp3');
    let breathingInterval;

    startBreathingBtn.addEventListener('click', () => {
        startBreathingBtn.disabled = true;
        breathingAudio.loop = true;
        breathingAudio.play();
        
        function animateBreathing() {
            breathingCircle.textContent = 'Breathe In';
            breathingCircle.style.transform = 'scale(1.5)';
            setTimeout(() => {
                breathingCircle.textContent = 'Breathe Out';
                breathingCircle.style.transform = 'scale(1)';
            }, 4000);
        }
        
        animateBreathing();
        breathingInterval = setInterval(animateBreathing, 8000);
    });
    
    // Stop breathing exercise when switching tabs
    document.querySelector('a[data-target="breathing"]').addEventListener('click', (e)=>{
       if(!e.target.classList.contains('active')){
           clearInterval(breathingInterval);
           breathingAudio.pause();
           breathingAudio.currentTime = 0;
           startBreathingBtn.disabled = false;
           breathingCircle.textContent = 'Ready?';
           breathingCircle.style.transform = 'scale(1)';
       }
    });


    // --- Affirmations ---
    const affirmationTextEl = document.getElementById('affirmation-text');
    const nextAffirmationBtn = document.getElementById('next-affirmation');
    const affirmations = [
        "My body heals itself with intelligence and love.",
        "I am whole, strong, and completely healed.",
        "Every cell in my body vibrates with health and energy.",
        "I release all tension and embrace restorative peace.",
        "My abdominal wall is strong, integrated, and fully functional.",
        "I trust the healing power within me."
    ];
    let currentAffirmation = -1;

    function showNextAffirmation() {
        currentAffirmation = (currentAffirmation + 1) % affirmations.length;
        affirmationTextEl.textContent = affirmations[currentAffirmation];
    }
    nextAffirmationBtn.addEventListener('click', showNextAffirmation);
    showNextAffirmation(); // Initial call
    
    // --- Energy Massage ---
    const handAnim = document.getElementById('hand-anim');
    const handX = herniaSide === 'left' ? '25%' : '60%';
    handAnim.style.left = handX;
    handAnim.style.bottom = '30%';
    handAnim.animate([
        { transform: 'rotate(0deg) translateY(-20px) rotate(0deg)' },
        { transform: 'rotate(360deg) translateY(-20px) rotate(-360deg)' }
    ], {
        duration: 5000,
        iterations: Infinity,
        easing: 'linear'
    });


    // --- Daily Log ---
    const logForm = document.getElementById('log-form');
    const logEntryInput = document.getElementById('log-entry');
    const logList = document.getElementById('log-list');
    let logHistory = JSON.parse(localStorage.getItem('herniaLog')) || [];

    function renderLog() {
        logList.innerHTML = '';
        if (logHistory.length === 0) {
            logList.innerHTML = '<li class="list-group-item">No entries yet.</li>';
            return;
        }
        logHistory.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<strong>${new Date(entry.date).toLocaleDateString()}</strong>: ${entry.text}`;
            logList.appendChild(li);
        });
    }

    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = logEntryInput.value.trim();
        if (text) {
            logHistory.unshift({ date: new Date().toISOString(), text });
            localStorage.setItem('herniaLog', JSON.stringify(logHistory));
            renderLog();
            logEntryInput.value = '';
        }
    });

    renderLog(); // Initial render
});

