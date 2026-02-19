import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const posts = [
    {
        date: 'Feb 14, 2026',
        tag: 'Engineering',
        title: 'How our multi-agent pipeline classifies bugs at 94% accuracy',
        desc: 'A deep dive into the classification layer that sits between test runner output and fix generation.',
    },
    {
        date: 'Jan 28, 2026',
        tag: 'Product',
        title: 'Introducing autonomous branch healing for monorepos',
        desc: 'Handling complex dependency graphs in large-scale repositories with isolated fix branches.',
    },
    {
        date: 'Jan 10, 2026',
        tag: 'Research',
        title: 'Speed vs accuracy tradeoffs in agentic code patching',
        desc: 'Inside the benchmark suite we built to measure agent iteration efficiency across 2,000+ repos.',
    },
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-5">
                        Blog
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Latest from the <span className="text-gradient">team</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                        Engineering deep-dives, product updates, and research from the Autonomous DevOps Agent team.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-semibold text-primary tracking-widest uppercase bg-primary/10 border border-primary/20 rounded px-2 py-0.5">
                                    {post.tag}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground">{post.date}</span>
                            </div>
                            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                                {post.title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{post.desc}</p>
                            <div className="flex items-center gap-1.5 mt-auto pt-2">
                                <BookOpen className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-mono text-primary">Read more</span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
