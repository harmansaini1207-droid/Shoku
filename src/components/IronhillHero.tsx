'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
    
    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;
    
    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const CONFIG = {
  color: '#ebf5df',
  spread: 0.5,
  speed: 1
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
}

const HERO_STATEMENT =
  "Japan's master artisans carry knowledge no manual has ever captured — heat felt through steel, indigo judged by scent, paper read by sound. SHOKU exists to archive these vanishing skills, and connect them with the world's next generation of craftspeople.";

export const IronhillHero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = sectionRef.current;
    if (!canvas || !hero) return;

    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    // 2. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });

    function resize() {
      if (!hero || !canvas) return;
      const width = hero.offsetWidth;
      const height = hero.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(dpr);
      if (material) {
        material.uniforms.uResolution.value.set(width * dpr, height * dpr);
      }
    }

    const rgb = hexToRgb(CONFIG.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight)
        },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: CONFIG.spread }
      },
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    resize();
    window.addEventListener('resize', resize);

    let scrollProgress = 0;

    let animId: number;
    function animate() {
      material.uniforms.uProgress.value = scrollProgress;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animate();

    const updateScrollProgress = (currentScroll: number) => {
      if (!hero) return;
      const heroHeight = hero.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = Math.max(heroHeight - windowHeight, 1);
      scrollProgress = Math.min(Math.max((currentScroll / maxScroll) * CONFIG.speed, 0), 1.15);
    };

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      updateScrollProgress(scroll);
    });

    const onNativeScroll = () => {
      updateScrollProgress(window.scrollY);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    // 3. Kinetic Word Reveal Animation with ScrollTrigger
    const wordElements = wordsRef.current.filter(Boolean);
    wordElements.forEach((el) => {
      el.style.opacity = '0.1';
    });

    const contentTrigger = ScrollTrigger.create({
      trigger: '.hero__content',
      start: 'top 40%',
      end: 'bottom 90%',
      onUpdate: (self) => {
        const progress = self.progress;
        const totalWords = wordElements.length;

        for (let i = 0; i < totalWords; i++) {
          const wordEl = wordElements[i];
          const wordProgress = i / totalWords;
          const nextWordProgress = (i + 1) / totalWords;

          let opacity = 0.1;
          if (progress >= nextWordProgress) {
            opacity = 1.0;
          } else if (progress >= wordProgress) {
            const fade = (progress - wordProgress) / (nextWordProgress - wordProgress);
            opacity = 0.1 + fade * 0.9;
          }

          wordEl.style.opacity = opacity.toFixed(2);
        }
      }
    });

    // 4. Parallax twigs animation
    const twigLeftAnim = gsap.to('.hero__twig--left', {
      y: -600,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    const twigRightAnim = gsap.to('.hero__twig--right', {
      y: -950,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      resize();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onNativeScroll);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(animId);
      lenis.destroy();
      contentTrigger.kill();
      twigLeftAnim.kill();
      twigRightAnim.kill();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const words = HERO_STATEMENT.split(' ');

  return (
    <div data-anim-index className="index">
      <section ref={sectionRef} className="hero">
        <div className="hero__twigs">
          <img
            className="hero__twig hero__twig--left"
            src="/images/mask-1.webp"
            alt="Branch Left"
          />
          <img
            className="hero__twig hero__twig--right"
            src="/images/mask-2.webp"
            alt="Branch Right"
          />
        </div>

        <div className="hero__row">
          <img
            className="hero__bg"
            src="/images/hero-bg.webp"
            alt="Hero Background"
          />
          <canvas ref={canvasRef} className="hero-canvas"></canvas>
          <div className="hero__conteiner">
            <div className="hero__top">
              <h1>SHOKU</h1>
              <p>Craft Archive &amp; Succession Platform</p>
            </div>

            <div className="hero__content">
              <h2>
                {words.map((word, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) wordsRef.current[i] = el;
                    }}
                    style={{
                      display: 'inline-block',
                      marginRight: '0.28em',
                      opacity: 0.1,
                      willChange: 'opacity'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
