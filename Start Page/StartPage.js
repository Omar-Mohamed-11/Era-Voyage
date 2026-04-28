const eraData = [
    { 
        label: "THE DAWN OF CIVILIZATION",
        title: "WHISPERS<br>OF THE SANDS", 
        desc: "Thousands of years ago, the sands of Egypt hid secrets of magic, math, and the afterlife. Step into the shadows of the Great Temples to uncover the stories of the people who dreamt of eternity and achieved it.",
        btnText: "Uncover the Secrets",
        url: "egypt.html",
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
        url: "atlantis.html",
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
        url: "native.html",
        img: "media/native.png", 
        accent: "#ff5e00", 
        bg: "radial-gradient(circle at 75% 50%, rgba(255, 94, 0, 0.15) 0%, #050505 70%)",
        isFlipped: false 
    }
];

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

window.addEventListener('load', () => {
    const introTl = gsap.timeline();
    
    introTl.to("#i-logo", { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power3.out" 
    })
    .to("#i-subtext", { 
        opacity: 0.7, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out" 
    }, "-=0.8") 
    .to({}, { duration: 1 }) 
    .to("#intro-overlay", { 
        y: "-100%", 
        duration: 1.2, 
        ease: "expo.inOut" 
    })
    .set("#main-ui", { visibility: "visible" })
    .to("#main-ui", { 
        opacity: 1, 
        duration: 1 
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});