document.addEventListener("DOMContentLoaded", () => {

    // ===== AUDIO TOGGLE =====
    const audioBtn = document.getElementById("audio-btn");
    const audio = document.getElementById("brief-audio");

    if (audioBtn && audio) {
        audioBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                audioBtn.textContent = "⏹️";
            } else {
                audio.pause();
                audio.currentTime = 0;
                audioBtn.textContent = "🔊";
            }
            audio.onended = () => {
                audioBtn.textContent = "🔊";
            };
        });
    }

    
    // ===== MODAL DATA =====
    const modalData = {
        wisdom: {
            icon: "🦅",
            title: "Ancient Wisdom",
            body: `
                <p>The wisdom of Native American ancestors was not written in books — it was carried in the wind, woven into songs, and passed down through generations around the sacred fire.</p>
                <p>Elders were the living libraries of their nations. They memorized star maps, healing plants, migration patterns of animals, and the cycles of rain. Their knowledge preserved entire ecosystems.</p>
                <p>The Eagle — a symbol of clarity and divine connection — was believed to carry prayers directly to the Great Spirit. Warriors sought its feathers as a sign of spiritual strength and clear vision in battle and in life.</p>
                <p>This wisdom was not separate from daily life. Every hunt, every harvest, every birth was a sacred act understood in deep relationship with the living Earth.</p>
            `
        },
        flame: {
            icon: "🔥",
            title: "Eternal Flame",
            body: `
                <p>In many Native American traditions, fire was not simply a tool — it was a living being, a relative, a spiritual presence that connected the physical and spirit worlds.</p>
                <p>The council fire was the heart of the community. Decisions made around it carried the weight of all ancestors. No one spoke carelessly when the fire was witness.</p>
                <p>The Haudenosaunee (Iroquois) maintained a sacred fire for the Great League of Peace — a flame that was never allowed to die as long as the confederacy stood united. It burned for centuries.</p>
                <p>Even today, many ceremonies begin with the lighting of fire using ancient methods — two sticks, breath, and patience — as a reminder that warmth must be earned with intention.</p>
            `
        },
        dreams: {
            icon: "🌙",
            title: "Spirit Dreams",
            body: `
                <p>The Vision Quest was one of the most sacred rites of passage in many Plains tribes. A young person would venture alone into the wilderness — fasting, praying, and waiting for a vision that would reveal their life's purpose.</p>
                <p>Dreams were not dismissed as random noise. They were messages — from ancestors, from animal guides, from the Great Spirit itself. Entire decisions about war, medicine, and migration were guided by powerful dreams.</p>
                <p>The Lakota concept of "Wakan Tanka" — the Great Mystery — held that the invisible world was more real than the visible one. Every rock, river, and cloud held spirit. Every dream was a door.</p>
                <p>Dream catchers, woven from willow hoops and sinew, were hung above sleeping children to filter out harmful spirits and allow only good dreams to pass through to the sleeper below.</p>
            `
        },
        totem: {
            icon: "🐺",
            title: "Totem Path",
            body: `
                <p>Totem animals were not chosen — they chose you. Through dreams, encounters, or signs in nature, an individual or clan would discover their spiritual kin in the animal world.</p>
                <p>The Wolf represented loyalty, endurance, and the wisdom of the pack. Wolf clans were often tasked with protecting their communities and guiding those who were lost back to the path.</p>
                <p>The Bear carried healing medicine. Many tribes believed that the Bear taught humans which plants were safe to eat, and shamans who worked with bear medicine were among the most respected healers.</p>
                <p>Totem poles, carved from great cedar trees in the Pacific Northwest, were not objects of worship — they were genealogical records, each figure telling a chapter of a family's history carved into living wood for all generations to read.</p>
            `
        }
    };

    // ===== MODAL LOGIC =====
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    document.querySelectorAll('.card[data-modal]').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.modal;
            const data = modalData[key];
            if (!data) return;
            modalIcon.textContent = data.icon;
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.body;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ===== SCROLL REVEAL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .brief-container, .portal-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s ease-out";
        observer.observe(el);
    });

}); // نهاية DOMContentLoaded