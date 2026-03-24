import { ExternalLink, BookIcon } from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const HeroSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfoFromNotion.queryOptions());
  const heroSection = data.heroSection;
  const [taglineArray, setTaglineArray] = useState<string[]>([])
  const [ripples, setRipples] = useState<number[]>([])
  const router = useRouter()
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (heroSection.tagline) {
      setTaglineArray(heroSection.tagline.split(" "))
    }
  }, [heroSection.tagline])

  /* ── 3D scene mouse interactivity ── */
  const animate = useCallback(() => {
    const lerp = isHovering.current ? 0.08 : 0.04;
    current.current.x += (target.current.x - current.current.x) * lerp;
    current.current.y += (target.current.y - current.current.y) * lerp;

    const { x, y } = current.current;

    if (tiltRef.current) {
      tiltRef.current.style.transform =
        `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
    }

    if (sceneRef.current) {
      sceneRef.current.style.setProperty('--sphere-tx', `${x * 15}px`);
      sceneRef.current.style.setProperty('--sphere-ty', `${y * 15}px`);
      sceneRef.current.style.setProperty('--glow-tx', `${x * 25}px`);
      sceneRef.current.style.setProperty('--glow-ty', `${y * 25}px`);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    isHovering.current = true;
    target.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    target.current = { x: 0, y: 0 };
  }, []);

  const handleClick = useCallback(() => {
    const id = Date.now();
    setRipples(prev => [...prev, id]);
    setTimeout(() => setRipples(prev => prev.filter(r => r !== id)), 800);
  }, []);
  return (
    <section className="w-full relative overflow-hidden">
      {/* Decorative gradient blobs — full width, behind content */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#61DAFB]/10 to-[#D247BF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-[#D247BF]/8 to-[#61DAFB]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="container grid xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10 relative">

        <AnimatedSection className="text-center lg:text-start space-y-6">
          <main className="text-2xl md:text-3xl lg:text-5xl text-left leading-tight font-cyberdyne">
            <h1 className="inline-block">
              <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                {taglineArray.slice(0, Math.ceil(taglineArray.length / 3)).join(" ")}
              </span>{" "}
              <span>
                {taglineArray
                  .slice(Math.ceil(taglineArray.length / 3), Math.ceil((2 * taglineArray.length) / 3))
                  .join(" ")}
              </span>{" "}
              <span className="bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                {taglineArray.slice(Math.ceil((2 * taglineArray.length) / 3)).join(" ")}
              </span>
            </h1>
          </main>


          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            {heroSection.description}
          </p>

          <div className="flex items-center  gap-2 flex-wrap justify-center lg:justify-start">
            <div>
              <Button
                className="flex items-center gap-2"
                variant="outline"
                onClick={() => router.push('/doc')}
              ><BookIcon size={20} /> Documentation
              </Button>
            </div>
            <Button
              className="flex items-center gap-2"
              variant="outline"
              onClick={() => router.push('/blog')}
            > <BookIcon size={20} />
              Read the Blogs
            </Button>

            {heroSection.appointmentLink && <a
              rel="noreferrer noopener"
              href={heroSection.appointmentLink}
              target="_blank"
              className={`w-full md:w-1/3 text-lg flex items-center gap-1 text-white border-0 hover:opacity-90 hover:shadow-lg hover:shadow-[#03a3d7]/25 transition-all duration-300 ${buttonVariants({
                variant: "default",
              })}`}
            >
              <div>Book an Appointment</div>
              <ExternalLink size={16} />
            </a>}

          </div>
        </AnimatedSection>

        {/* 3D Animation — right side (interactive, xl only) */}
        <div className="hidden xl:flex items-center justify-center z-10">
          <div
            ref={sceneRef}
            className="hero-3d-scene"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <div ref={tiltRef} className="hero-3d-tilt">
              {/* Outer glow backdrop */}
              <div className="hero-orb-glow" />
              {/* Central sphere */}
              <div className="hero-orb-sphere" />
              {/* Ring 1 — tightest, fastest */}
              <div className="hero-orb-ring hero-orb-ring-1" />
              {/* Ring 2 — mid */}
              <div className="hero-orb-ring hero-orb-ring-2" />
              {/* Ring 3 — widest, slowest */}
              <div className="hero-orb-ring hero-orb-ring-3" />
              {/* Orbiting dot on ring 1 */}
              <div className="hero-orbit-track hero-orbit-track-1">
                <div className="hero-orbit-dot" />
              </div>
              {/* Orbiting dot on ring 2 */}
              <div className="hero-orbit-track hero-orbit-track-2">
                <div className="hero-orbit-dot hero-orbit-dot-2" />
              </div>
              {/* Orbiting dot on ring 3 */}
              <div className="hero-orbit-track hero-orbit-track-3">
                <div className="hero-orbit-dot hero-orbit-dot-3" />
              </div>
              {/* Click ripples */}
              {ripples.map(id => (
                <div key={id} className="hero-click-ripple" />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/tablet fallback — simplified orbital graphic (below xl) */}
        <AnimatedSection className="flex xl:hidden items-center justify-center" delay={0.3}>
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Glow background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#61DAFB]/20 to-[#D247BF]/20 blur-2xl animate-pulse" />
            {/* Ring 3 */}
            <div className="absolute inset-0 rounded-full border border-[#F596D3]/30 animate-[spin_12s_linear_infinite]" />
            {/* Ring 2 */}
            <div className="absolute inset-6 md:inset-8 rounded-full border border-[#D247BF]/40 animate-[spin_8s_linear_infinite_reverse]" />
            {/* Ring 1 */}
            <div className="absolute inset-12 md:inset-16 rounded-full border-2 border-[#03a3d7]/50 animate-[spin_5s_linear_infinite]" />
            {/* Center sphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#61DAFB] via-[#1fc0f1] to-[#D247BF] shadow-[0_0_30px_8px_rgba(3,163,215,0.4),0_0_60px_20px_rgba(210,71,191,0.2)]" />
            {/* Orbiting dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#61DAFB] shadow-[0_0_8px_rgba(3,163,215,0.8)] animate-[spin_5s_linear_infinite]" style={{ transformOrigin: '50% 160px' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#D247BF] shadow-[0_0_8px_rgba(210,71,191,0.8)] animate-[spin_8s_linear_infinite_reverse]" style={{ transformOrigin: '50% -120px' }} />
          </div>
        </AnimatedSection>

        {/* Shadow effect */}
        <div className="shadow"></div>
      </div>
    </section>
  );
};

export default HeroSection;
