"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../app/globals.css";
import { STATS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const car = useRef<HTMLImageElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const textValueAdd = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const loadTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const headlineLetters = self.selector?.(
        ".headline-letter",
      ) as HTMLElement[];

      loadTl.from(headlineLetters, {
        opacity: 0,
        y: 30,
        stagger: 0.025,
        duration: 0.55,
      });
      loadTl.from(
        scrollHint.current,
        { opacity: 0, y: 10, duration: 0.5 },
        "-=0.2",
      );

      const roadLetters = self.selector?.(".value-letter") as HTMLElement[];
      const statCards = self.selector?.(".stat-card") as HTMLElement[];
      const carEl = car.current;
      const trailEl = trail.current;
      const trackEl = track.current;
      const valueAddEl = textValueAdd.current;

      if (!carEl || !trailEl || !trackEl || !valueAddEl) return;

      const valueRect = valueAddEl.getBoundingClientRect();
      const letterOffsets = roadLetters.map((letter) => letter.offsetLeft);
      const cardCenterXs = statCards.map((card) => {
        const rect = card.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const cardOpacityTo = statCards.map((card) =>
        gsap.quickTo(card, "opacity", { duration: 0.5, ease: "power2.out" }),
      );

      const roadWidth = window.innerWidth;
      const carWidth = carEl.clientWidth || 150;
      const endX = roadWidth - carWidth / 3;

      gsap.to(carEl, {
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: trackEl,
        },
        x: endX,
        ease: "none",
        onUpdate: function () {
          const carX = (gsap.getProperty(carEl, "x") as number) + carWidth / 5;

          roadLetters.forEach((letter, i) => {
            const letterX = valueRect.left + letterOffsets[i];
            letter.style.opacity = carX >= letterX ? "1" : "0";
          });

          const fadeWidth = 235;
          statCards.forEach((card, i) => {
            const center = cardCenterXs[i];
            const fadeInStart = center - fadeWidth;
            let opacity = 0;
            if (carX >= center) {
              opacity = 1;
            } else if (carX >= fadeInStart) {
              opacity = (carX - fadeInStart) / fadeWidth;
            }
            cardOpacityTo[i](Math.min(1, Math.max(0, opacity)));
          });

          gsap.set(trailEl, { width: carX });
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const headline = "WELCOME ITZFIZZ";

  return (
    <div ref={container} className="section">
      <div ref={track} className="track">
        <div className="hero-header">
          <h1 className="hero-headline">
            {headline.split("").map((char, i) =>
              char === " " ? (
                <span
                  key={i}
                  className="headline-letter"
                  style={{ display: "inline-block", width: "0.5em" }}
                >
                  &nbsp;
                </span>
              ) : (
                <span key={i} className="headline-letter">
                  {char}
                </span>
              ),
            )}
          </h1>

          <div className="stats-row">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={scrollHint} className="scroll-hint">
          <span>Scroll to explore</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <div className="road">
          <img
            ref={car}
            src={`${process.env.NODE_ENV === "production" ? "/scroll-animation" : ""}/McLaren 720S 2022 top view.png`}
            alt="McLaren supercar"
            className="car"
          />
          <div ref={trail} className="trail" />
          <div ref={textValueAdd} className="value-add">
            {"WELCOME ITZFIZZ".split("").map((char, i) =>
              char === " " ? (
                <span
                  key={i}
                  className="value-letter"
                  style={{ width: "0.5em", display: "inline-block" }}
                >
                  &nbsp;
                </span>
              ) : (
                <span key={i} className="value-letter">
                  {char}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
