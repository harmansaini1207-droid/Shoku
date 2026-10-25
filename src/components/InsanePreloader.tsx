'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface InsanePreloaderProps {
  onComplete: () => void;
}

export const InsanePreloader: React.FC<InsanePreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loader1Ref = useRef<HTMLDivElement>(null);
  const loader2Ref = useRef<HTMLDivElement>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleSkip = () => {
    if (isSkipped) return;
    setIsSkipped(true);
    gsap.killTweensOf([
      containerRef.current,
      counter1Ref.current,
      counter2Ref.current,
      counter3Ref.current,
      loaderRef.current,
      loader1Ref.current,
      loader2Ref.current
    ]);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const c1 = counter1Ref.current;
    const c2 = counter2Ref.current;
    const c3 = counter3Ref.current;
    const loader = loaderRef.current;
    const l1 = loader1Ref.current;
    const l2 = loader2Ref.current;
    const screen = containerRef.current;

    if (!c1 || !c2 || !c3 || !loader || !l1 || !l2 || !screen) return;

    const numHeight = 102;
    const dist3 = 30 * numHeight; // 30 steps
    const dist2 = 10 * numHeight; // 10 steps
    const dist1 = 1 * numHeight;  // 1 step (to '1')

    const tl = gsap.timeline({
      onComplete
    });

    // 1. Animate counters with generous, luxurious pacing
    tl.to(c3, {
      y: -dist3,
      duration: 4.8,
      ease: 'power2.inOut'
    }, 0);

    tl.to(c2, {
      y: -dist2,
      duration: 5.2,
      ease: 'power2.inOut'
    }, 0);

    tl.to(c1, {
      y: -dist1,
      duration: 1.6,
      ease: 'power2.inOut'
    }, 3.6);

    // 2. Animate dual loader bars (exact timing from script.js)
    tl.fromTo(l1, { width: 0 }, {
      width: 200,
      duration: 5.2,
      ease: 'power2.inOut'
    }, 0);

    tl.fromTo(l2, { width: 0 }, {
      width: 100,
      duration: 2.2,
      ease: 'power2.inOut'
    }, 1.8);

    // 3. Counter exit slide
    tl.to('.insane-digit', {
      top: '-150px',
      stagger: { amount: 0.25 },
      duration: 0.9,
      ease: 'power4.inOut'
    }, 5.2);

    // 4. Bar transformations (exact from zip script.js)
    tl.to(loader, {
      background: 'none',
      duration: 0.1
    }, 5.2);

    tl.to(l1, {
      rotate: 90,
      y: -50,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 5.2);

    tl.to(l2, {
      x: -75,
      y: 75,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 5.2);

    // 5. Epic zoom expansion revealing the website
    tl.to(loader, {
      scale: 45,
      rotate: 45,
      y: 500,
      x: 2000,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 5.9);

    tl.to(screen, {
      opacity: 0,
      duration: 0.6,
      ease: 'power1.inOut'
    }, 6.6);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // Static numbers array for counter 3 (0-9 three times, then 0 for 100)
  const nums3 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0
  ];

  return (
    <div
      ref={containerRef}
      className="loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        zIndex: 99999,
        pointerEvents: 'all',
        overflow: 'hidden'
      }}
    >
      {/* Skip button in corner */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '32px',
          right: '36px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          fontFamily: 'GT America Trial, sans-serif',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '2px',
          padding: '8px 20px',
          cursor: 'pointer',
          zIndex: 100001,
          transition: 'all 0.2s'
        }}
      >
        SKIP →
      </button>

      {/* Center Expanding Loader Bar (from Insane-PRELOADER-main) */}
      <div
        ref={loaderRef}
        className="loader"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '50px',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          backgroundColor: 'rgb(80, 80, 80)'
        }}
      >
        <div
          ref={loader1Ref}
          className="loader-1 bar"
          style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            width: '200px',
            height: '50px'
          }}
        />
        <div
          ref={loader2Ref}
          className="loader-2 bar"
          style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            width: '100px',
            height: '50px'
          }}
        />
      </div>

      {/* SHOKU Branding Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '13px',
          letterSpacing: '6px',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          fontWeight: 600
        }}>職人リンク</div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '11px',
          letterSpacing: '8px',
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
          marginTop: '4px'
        }}>S H O K U</div>
      </div>

      {/* Bottom Left Mechanical Triple-Digit Counter (from Insane-PRELOADER-main) */}
      <div
        className="counter"
        style={{
          position: 'fixed',
          left: '50px',
          bottom: '50px',
          display: 'flex',
          height: '100px',
          fontSize: '100px',
          lineHeight: '102px',
          clipPath: 'polygon(0 0, 100% 0, 100% 100px, 0 100px)',
          fontWeight: 400,
          fontFamily: 'Cinzel, "Times New Roman", serif'
        }}
      >
        {/* Counter 1: Hundreds Digit */}
        <div
          ref={counter1Ref}
          className="counter-1 insane-digit"
          style={{ position: 'relative', top: '-15px' }}
        >
          <div className="num" style={{ height: '102px' }}>0</div>
          <div className="num num1offset1" style={{ height: '102px', position: 'relative', right: '-25px' }}>
            1
          </div>
        </div>

        {/* Counter 2: Tens Digit */}
        <div
          ref={counter2Ref}
          className="counter-2 insane-digit"
          style={{ position: 'relative', top: '-15px' }}
        >
          <div className="num" style={{ height: '102px' }}>0</div>
          <div className="num num1offset2" style={{ height: '102px', position: 'relative', right: '-10px' }}>1</div>
          <div className="num" style={{ height: '102px' }}>2</div>
          <div className="num" style={{ height: '102px' }}>3</div>
          <div className="num" style={{ height: '102px' }}>4</div>
          <div className="num" style={{ height: '102px' }}>5</div>
          <div className="num" style={{ height: '102px' }}>6</div>
          <div className="num" style={{ height: '102px' }}>7</div>
          <div className="num" style={{ height: '102px' }}>8</div>
          <div className="num" style={{ height: '102px' }}>9</div>
          <div className="num" style={{ height: '102px' }}>0</div>
        </div>

        {/* Counter 3: Units Digit */}
        <div
          ref={counter3Ref}
          className="counter-3 insane-digit"
          style={{ position: 'relative', top: '-15px' }}
        >
          {nums3.map((n, idx) => (
            <div key={idx} className="num" style={{ height: '102px' }}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
