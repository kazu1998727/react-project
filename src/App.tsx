import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";

const navGroups = [
  {
    items: [
      { id: "1", label: "こころ" },
      { id: "2", label: "吾輩は猫である" },
      { id: "3", label: "坊ちゃん" },
    ],
  },
];

type Page = {
  title: string;
  subtitle: string;
  group: string;
  cards: { tag: string; heading: string; body: string }[];
};

const pages: Record<string, Page> = {
  overview: {
    title: "Overview",
    subtitle: "A foundation for modern web applications, built with intention.",
    group: "Getting Started",
    cards: [
      {
        tag: "Introduction",
        heading: "What is this?",
        body: "A comprehensive framework designed for teams who care deeply about the craft of software. Built with intention, refined through use.",
      },
      {
        tag: "Philosophy",
        heading: "Core Philosophy",
        body: "Every decision has a reason. We favor explicit over implicit, composition over inheritance, and clarity over cleverness. The best code is the code that speaks for itself.",
      },
      {
        tag: "Audience",
        heading: "Who is it for?",
        body: "Teams building production applications who value long-term maintainability. If you've ever inherited a codebase and wished it was cleaner — this is for you.",
      },
    ],
  },
};

function getPage(id: string): Page {
  const page = pages[id];
  if (!page) {
    throw new Error(`Page not found: ${id}`);
  }
  return page;
}

export default function App() {
  const [activeId, setActiveId] = useState<string>("1");
  const page = getPage(activeId);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar
        navGroups={navGroups}
        activeId={activeId}
        onSelect={setActiveId}
      />

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Article */}
        <article className="w-full max-w-3xl mx-auto px-12 py-16 box-border">
          {/* Page title */}
          <div
            className="mb-14 pb-10"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h1
              className="m-0 mb-3 leading-tight"
              style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 400,
                color: "var(--text-h)",
                letterSpacing: "-1.2px",
              }}
            >
              {page.title}
            </h1>
          </div>

          {/* Content cards */}
          <div className="flex flex-col gap-5">
            {page.cards.map((card, i) => (
              <div
                key={`${activeId}-${i}`}
                className="card-animate rounded-xl p-7 transition-all duration-200 cursor-default"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  animationDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 3px var(--accent-bg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="text-xs font-medium uppercase mb-2.5"
                  style={{
                    letterSpacing: "1.4px",
                    color: "var(--accent)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {card.tag}
                </div>
                <h2
                  className="m-0 mb-3"
                  style={{
                    fontFamily: "var(--heading)",
                    fontSize: "22px",
                    fontWeight: 400,
                    color: "var(--text-h)",
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                  }}
                >
                  {card.heading}
                </h2>
                <p
                  className="m-0 text-sm"
                  style={{ color: "var(--text)", lineHeight: 1.75 }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
