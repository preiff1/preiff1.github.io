document.addEventListener('DOMContentLoaded', function () {

    const element = document.getElementById('skip-button');
    element.classList.add('fade-in'); 

    
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');

    // for intro motion
    let mouseMoved = false;

    const pointer = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight,
    }
    const params = {
        pointsNumber: 40,
        widthFactor: .3,
        mouseThreshold: .6,
        spring: .4,
        friction: .5
    };

    const trail = new Array(params.pointsNumber);
    for (let i = 0; i < params.pointsNumber; i++) {
        trail[i] = {
            x: pointer.x,
            y: pointer.y,
            dx: 0,
            dy: 0,
        }
    }

    window.addEventListener("click", e => {
        updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener("mousemove", e => {
        mouseMoved = true;
        updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener("touchmove", e => {
        mouseMoved = true;
        updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });

    function updateMousePosition(eX, eY) {
        pointer.x = eX;
        pointer.y = eY;
    }

    setupCanvas();
    update(0);
    window.addEventListener("resize", setupCanvas);


    function update(t) {

        // for intro motion
        if (!mouseMoved) {
            pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
            pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';

        trail.forEach((p, pIdx) => {
            const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
            const spring = pIdx === 0 ? .4 * params.spring : params.spring;
            p.dx += (prev.x - p.x) * spring;
            p.dy += (prev.y - p.y) * spring;
            p.dx *= params.friction;
            p.dy *= params.friction;
            p.x += p.dx;
            p.y += p.dy;
        });

        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
            const xc = .5 * (trail[i].x + trail[i + 1].x);
            const yc = .5 * (trail[i].y + trail[i + 1].y);
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
            ctx.stroke();
        }
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        ctx.stroke();

        window.requestAnimationFrame(update);
    }

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function cancelAnimationAndHide() {
        const animations = document.querySelectorAll
            ('.drop-in-nav, .drop-in-title, .drop-in-subtitle');
        const skipButton = document.getElementById('skip-button');

        animations.forEach(anim => {
            anim.style.animation = 'none';
        });

        skipButton.style.opacity = '0'; // Fade out by changing opacity
        setTimeout(() => {
            skipButton.style.display = 'none'; // Hide after fade-out effect
        }, 500);
    }
    document.addEventListener('keydown', function (event) {
        let animationTimer; // Variable to store the setTimeout reference

        if (event.key === 'Enter') {
            clearTimeout(animationTimer); // Clear the timeout if Enter is pressed

            // Cancel animations and hide skip button on Enter press
            cancelAnimationAndHide();
        }
    });

    const timeoutDuration = 8100; // Adjust this value to the same duration used in the keydown event listener
    setTimeout(cancelAnimationAndHide, timeoutDuration);

});


