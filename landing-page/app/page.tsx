"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles, Zap, Rocket } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Templates", href: "/templates" },
  { label: "Community", href: "/community" },
  { label: "Create Game", href: "/lab" },
];

const onboardingSteps = [
  {
    title: "1. Tell Us Your Idea",
    description: "Describe your dream game in simple words. Who's the hero? What's the adventure? No tech skills needed!",
    icon: "💭",
  },
  {
    title: "2. Pick Your Style",
    description: "Choose whether your game feels fun and bright, dark and challenging, or epic and heroic.",
    icon: "🎨",
  },
  {
    title: "3. Play & Share",
    description: "In minutes, you'll have a real game to play! Share it with friends or the whole world.",
    icon: "🚀",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:bg-[#010409] text-slate-900 dark:text-slate-100">
      {/* Light mode gradients */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(167,139,250,0.15),transparent_50%)]" />
      </div>
      
      {/* Dark mode gradients */}
      <div className="pointer-events-none absolute inset-0 dark:block hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(1,4,9,0.95),rgba(2,6,23,0.9))]" />
      </div>

      <div className="relative z-10 flex flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-slate-700 dark:text-slate-300 md:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
          <section id="hero" className="grid gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="success" className="w-fit border-emerald-500/50 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 shadow-sm">
                  Create Your Own Game
                </Badge>
              </motion.div>
              <div className="space-y-6">
                <motion.h1 
                  className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.5rem]"
                  variants={fadeInUp}
                >
                  Turn Your Ideas Into Real Games
                </motion.h1>
                <motion.p 
                  className="max-w-2xl text-lg text-slate-700 dark:text-slate-300"
                  variants={fadeInUp}
                >
                  Ever dreamed of making your own video game? Now you can! Just describe what you want, 
                  and watch it come to life. <span className="font-semibold text-emerald-600 dark:text-emerald-400">No coding. No experience needed.</span>
                </motion.p>
                <motion.div 
                  className="rounded-2xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-slate-950/40 p-5 text-sm text-slate-700 dark:text-slate-300 shadow-lg shadow-slate-200/50 dark:shadow-none"
                  variants={fadeInUp}
                >
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3">✨ It&apos;s as easy as 1-2-3:</p>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                      <span className="text-slate-900 dark:text-white">Tell us about your game idea in plain words</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center">2</span>
                      <span className="text-slate-900 dark:text-white">Choose your hero, enemies, and game style</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                      <span className="text-slate-900 dark:text-white">Click &quot;Build&quot; and play your game!</span>
                    </li>
                  </ol>
                </motion.div>
              </div>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeInUp}
              >
                <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" asChild>
                    <Link href="/lab">
                      Create Your Game <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold" asChild>
                    <Link href="/community">
                      Browse Community Games
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                id="builder"
                className="relative overflow-hidden border border-slate-200 dark:border-slate-800/70 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-[#161b22] dark:via-[#0d1117] dark:to-[#020711] shadow-2xl shadow-blue-200/30 dark:shadow-none"
              >
              <CardContent className="mt-6 space-y-5">
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Try the Demo</p>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">
                    Play this example to see what you can create. Your game will look and play just like this!
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-black/60 p-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-900/80 bg-slate-100 dark:bg-black">
                    <iframe
                      src="/demo-game/index.html"
                      title="JG Engine sample game"
                      loading="lazy"
                      className="h-full w-full"
                      allow="fullscreen *; autoplay *; gamepad *; xr-spatial-tracking"
                    />
                  </div>
                </div>
                <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="w-full border-2 border-emerald-500 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 font-semibold" asChild>
                    <Link href="/demo-game/index.html" target="_blank">
                      Open demo in a new tab
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>
          </section>

          <section id="how-it-works" className="space-y-8 py-12">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-slate-950/40 px-8 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                  How It Works
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Creating your game is simple - just describe what you want and we&apos;ll handle the rest.
                </p>
              </div>
              <motion.div 
                className="mt-8 grid gap-6 md:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                {onboardingSteps.map((step) => (
                  <motion.div
                    key={step.title}
                    variants={fadeInUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-lg hover:shadow-slate-300/50 dark:hover:shadow-none transition-shadow h-full">
                      <CardContent className="space-y-3 p-6">
                        <span className="text-4xl">{step.icon}</span>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="space-y-8 py-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Choose Your Plan
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Start for free, upgrade when you need more. All plans include access to our AI game builder.
              </p>
            </div>
            <motion.div 
              className="grid gap-6 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {/* Free Tier */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Card className="border-gray-300 dark:border-gray-500/50 bg-white dark:bg-slate-950/50 hover:border-gray-400 dark:hover:border-gray-500/70 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-300 font-medium">
                    {SUBSCRIPTION_LIMITS.free.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold" variant="outline" asChild>
                      <Link href="/auth/sign-up">Get Started Free</Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Pro Tier */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Card className="border-blue-400 dark:border-blue-500/50 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:to-slate-950/50 hover:border-blue-500 dark:hover:border-blue-500/70 transition-all shadow-xl shadow-blue-200/50 dark:shadow-none h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <Zap className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">$5</span>
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-300 font-medium">
                    {SUBSCRIPTION_LIMITS.pro.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md" asChild>
                      <Link href="/pricing">Upgrade to Pro</Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Premium Tier */}
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Card className="border-purple-400 dark:border-purple-500/50 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:to-slate-950/50 hover:border-purple-500 dark:hover:border-purple-500/70 transition-all relative shadow-xl shadow-purple-200/50 dark:shadow-none h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <CardHeader className="text-center pb-4 pt-6">
                  <div className="flex justify-center mb-3">
                    <Rocket className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">$15</span>
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-300 font-medium">
                    {SUBSCRIPTION_LIMITS.premium.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md" asChild>
                      <Link href="/pricing">Upgrade to Premium</Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
            <div className="text-center">
              <Link href="/pricing" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
                View detailed pricing comparison →
              </Link>
            </div>
          </section>

        <section className="space-y-8 py-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Made for Everyone 🎮
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Whether you&apos;re 8 or 80, you can make a game here. No coding, no downloads, no complicated stuff. 
              If you can describe your idea, you can create it!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                ✓ Free to start
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                ✓ Works in your browser
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-500/10 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
                ✓ Share with anyone
              </div>
            </div>
          </div>
        </section>

          <section className="rounded-3xl border border-slate-200 dark:border-slate-800/70 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-[#0d1117] dark:via-[#05070c] dark:to-black p-10 text-center shadow-2xl shadow-blue-200/30 dark:shadow-none">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Ready to Make Something Amazing? 🎮
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Join thousands of creators who&apos;ve already made their dream games. It only takes a few minutes to get started!
              </p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg text-lg px-8" asChild>
                <Link href="/auth/sign-up">
                  Start Creating — It&apos;s Free! 🚀
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold" asChild>
                <Link href="/lab">Try Without Signing Up</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              No credit card needed • Takes less than 2 minutes
            </p>
          </section>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 backdrop-blur-sm dark:bg-slate-950/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-slate-700 dark:text-slate-300">
              Built in Kentucky
            </div>
            <div className="flex items-center gap-2">
              © {new Date().getFullYear()} JugGames
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
