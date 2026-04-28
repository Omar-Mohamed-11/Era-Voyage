const eraData = [
    { 
        label: "THE DAWN OF CIVILIZATION",
        title: "WHISPERS<br>OF THE SANDS", 
        desc: "Thousands of years ago, the sands of Egypt hid secrets of magic, math, and the afterlife. Step into the shadows of the Great Temples to uncover the stories of the people who dreamt of eternity and achieved it.",
        btnText: "Uncover the Secrets",
        url: "../Pharaohs-Page/pharaohs.html",
        img: "media/egypt.png", 
        accent: "#c5a059",
        bg: "radial-gradient(circle at 75% 50%, rgba(197, 160, 89, 0.2) 0%, #050505 70%)",
        isFlipped: false 
    },
    { 
        label: "THE SUNKEN METROPOLIS",
        title: "ECHOES<br>FROM THE ABYSS", 
        desc: "Beneath the weight of a thousand oceans lies a city forgotten by the sun. Once a beacon of advanced wisdom, it now rests in bioluminescent silence, guarding lost technology reclaimed by the sea.",
        btnText: "Descend into the Depths",
        url: "../Atlantis-Page/page.html",
        img: "media/atlantis.png", 
        accent: "#00f2ff", 
        bg: "radial-gradient(circle at 25% 50%, rgba(0, 242, 255, 0.18) 0%, #050505 70%)",
        isFlipped: true 
    },
    { 
        label: "THE ANCESTRAL SPIRIT",
        title: "VOICES<br>OF THE WILD EARTH", 
        desc: "Before the cities rose, the land spoke to those who listened. Guided by the migration of the winds and the stars, these nations built a legacy of harmony and resilience that is carved into the very bones of the continent.",
        btnText: "Walk the Ancient Path",
        url: "../NativeAmericans-Page/american.html",
        img: "media/native.png", 
        accent: "#ff5e00", 
        bg: "radial-gradient(circle at 75% 50%, rgba(255, 94, 0, 0.15) 0%, #050505 70%)",
        isFlipped: false 
    }
];

const bgAudio = new Audio('media/BG_Music.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.5;
let soundOn = false;

function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) {
        bgAudio.play();
        document.getElementById('wave1').style.display = 'block';
        document.getElementById('wave2').style.display = 'block';
    } else {
        bgAudio.pause();
        document.getElementById('wave1').style.display = 'none';
        document.getElementById('wave2').style.display = 'none';
    }
}

const clickSound = new Audio('media/Click.mp3');
clickSound.volume = 0.6;

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

let currentIdx = 0;
let isTransitioning = false;
const spacing = 180; 

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const loader = new THREE.TextureLoader();
const statues = [];

eraData.forEach((data, i) => {
    const group = new THREE.Group();
    loader.load(data.img, (tex) => {
        const aspect = tex.image.width / tex.image.height;
        const height = 75; 
        const width = height * aspect;
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
        group.add(mesh);
    });
    const xPos = i * spacing + (data.isFlipped ? -50 : 50);
    group.position.x = xPos; 
    statues.push(group);
    scene.add(group);
});

camera.position.z = 90;

function updateEra(dir) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIdx = (currentIdx + dir + eraData.length) % eraData.length;

    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentIdx));

    const tl = gsap.timeline({ onComplete: () => { isTransitioning = false; } });
    tl.to(camera.position, { x: currentIdx * spacing, duration: 2.2, ease: "expo.inOut" }, 0);
    tl.add(() => {
        document.getElementById('bg-overlay').style.background = eraData[currentIdx].bg;
        document.documentElement.style.setProperty('--accent', eraData[currentIdx].accent);
    }, 0.35);
    tl.to(".content", { opacity: 0, y: 30, duration: 0.4 }, 0.1);
    tl.add(() => {
        const contentBox = document.getElementById('content-box');
        contentBox.classList.toggle('flipped', eraData[currentIdx].isFlipped);
        document.getElementById('label').innerText = eraData[currentIdx].label;
        document.getElementById('title').innerHTML = eraData[currentIdx].title;
        document.getElementById('desc').innerHTML = eraData[currentIdx].desc;
        const linkBtn = document.getElementById('era-link');
        linkBtn.innerHTML = eraData[currentIdx].btnText;
        linkBtn.setAttribute('href', eraData[currentIdx].url);
    }, 0.7);
    tl.to(".content", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1.0);
}

document.getElementById('desc').innerHTML = eraData[0].desc;

function animate() {
    requestAnimationFrame(animate);
    statues.forEach((s, i) => { s.position.y = Math.sin(Date.now() * 0.001 + i) * 1.5; });
    renderer.render(scene, camera);
}
animate();

// INTRO — ERA FLASH SEQUENCE
window.addEventListener('load', () => {

    const ALL_BGS   = ['bg-egypt', 'bg-greece', 'bg-native', 'bg-gold'];
    const lbl       = document.getElementById('era-label');
    const cnt       = document.getElementById('flash-count');
    const finalLogo = document.getElementById('i-final-logo');
    const stripe    = document.getElementById('eraStripe');
    const subtext   = document.getElementById('i-subtext');

    function showBg(id) {
        ALL_BGS.forEach(b => document.getElementById(b).style.opacity = 0);
        if (id) document.getElementById(id).style.opacity = 1;
    }

    const sequence = [
        { bg: 'bg-egypt',  label: 'THE DAWN OF CIVILIZATION', year: '3100 BC', accent: eraData[0].accent, dur: 800 },
        { bg: 'bg-greece', label: 'THE SUNKEN METROPOLIS',     year: '800 BC',  accent: eraData[1].accent, dur: 800 },
        { bg: 'bg-native', label: 'THE ANCESTRAL SPIRIT',      year: '1200 AD', accent: eraData[2].accent, dur: 800 },
        // strobe pass 1
        { bg: 'bg-egypt',  label: '', year: '', accent: eraData[0].accent, dur: 200 },
        { bg: 'bg-greece', label: '', year: '', accent: eraData[1].accent, dur: 200 },
        { bg: 'bg-native', label: '', year: '', accent: eraData[2].accent, dur: 200 },
        // strobe pass 2 — faster
        { bg: 'bg-egypt',  label: '', year: '', accent: eraData[0].accent, dur: 110 },
        { bg: 'bg-greece', label: '', year: '', accent: eraData[1].accent, dur: 110 },
        { bg: 'bg-native', label: '', year: '', accent: eraData[2].accent, dur: 110 },
        // strobe pass 3 — fastest
        { bg: 'bg-egypt',  label: '', year: '', accent: eraData[0].accent, dur: 60  },
        { bg: 'bg-greece', label: '', year: '', accent: eraData[1].accent, dur: 60  },
        { bg: 'bg-native', label: '', year: '', accent: eraData[2].accent, dur: 60  },
        { bg: 'bg-egypt',  label: '', year: '', accent: eraData[0].accent, dur: 60  },
        // settle on gold
        { bg: 'bg-gold',   label: '', year: '', accent: eraData[0].accent, dur: 900 },
    ];

    let idx = 0;

    function step() {
        if (idx >= sequence.length) {
            showBg(null);
            lbl.style.opacity = 0;
            cnt.textContent = '';

            gsap.to(finalLogo, { opacity: 1, duration: 0.9, ease: "power2.out" });
            gsap.to(stripe,    { opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" });
            gsap.to(subtext,   { opacity: 0.8, duration: 0.8, delay: 0.9, ease: "power2.out" });

            // Hold on logo then slide overlay up and reveal main UI
            setTimeout(() => {
                gsap.timeline()
                    .to("#intro-overlay", {
                        y: "-100%",
                        duration: 2,
                        ease: "expo.inOut"
                    })
                    .set("#main-ui", { visibility: "visible" })
                    .to("#main-ui", { opacity: 1, duration: 2 });
            }, 1800);

            return;
        }

        const s = sequence[idx];
        showBg(s.bg);

        lbl.style.color      = s.accent;
        lbl.style.textShadow = `0 0 40px ${s.accent}99`;
        cnt.style.color      = `${s.accent}38`;
        cnt.style.textShadow = `0 0 80px ${s.accent}26`;

        lbl.textContent   = s.label;
        lbl.style.opacity = s.label ? '1' : '0';
        cnt.textContent   = s.year;

        idx++;
        setTimeout(step, s.dur);
    }

    // Brief black pause
gsap.to("#sound-btn", { opacity: 1, visibility: "visible", duration: 0.8, delay: 0.2 });

if (sessionStorage.getItem('introSeen')) {
    // Skip intro, go straight to main UI
    document.getElementById('intro-overlay').style.display = 'none';
    document.getElementById('main-ui').style.visibility = 'visible';
    document.getElementById('main-ui').style.opacity = '1';
} else {
    sessionStorage.setItem('introSeen', 'true');
    setTimeout(step, 100);
}
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});