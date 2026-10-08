import { useEffect, useState } from "react";
import Seg from "./components/Seg.jsx";
import { Moon, Sun } from "./components/icons.jsx";
import Dinner from "./pages/Dinner.jsx";
import DesignSystem from "./pages/DesignSystem.jsx";

const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

function useTheme() {
  const [theme, setTheme] = useState(() => store.get("fridge-theme") || "Light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "Dark");
    store.set("fridge-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

const ROUTES = { "#/design-system": "design" };

function useRoute() {
  const read = () => ROUTES[location.hash] || "dinner";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return route;
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const route = useRoute();
  useEffect(() => {
    document.title = route === "design" ? "Fridge Design System" : "What's for dinner? · Fridge";
  }, [route]);

  const link = (href, name, active) => (
    <a href={href} aria-current={active ? "page" : undefined}
      className={`text-sm no-underline ${active ? "text-accent" : "text-inherit hover:text-accent"}`}>{name}</a>
  );

  return (
    <div className="min-h-screen bg-bg font-body text-[15px] leading-[1.55] text-ink transition-colors duration-200">
      <header className="nav flex-wrap gap-x-6 gap-y-2 px-4 py-3 md:px-8">
        <a href="#/" className="nav-brand flex items-baseline gap-3 text-inherit no-underline">
          <span className="text-2xl">Fridge</span>
          {route === "design" && <span className="font-body text-[11px] tracking-[.1em] text-accent-700 uppercase tnum">Design system · 0.1</span>}
        </a>
        <nav className="flex gap-5">
          {link("#/", "Dinner", route === "dinner")}
          {link("#/design-system", "Design system", route === "design")}
        </nav>
        <Seg name="fridge-theme" value={theme} onChange={setTheme}
          options={[{ value: "Light", label: "Light", icon: <Sun /> }, { value: "Dark", label: "Dark", icon: <Moon /> }]} />
      </header>
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-24 md:px-8">
        {route === "design" ? <DesignSystem /> : <Dinner />}
      </main>
    </div>
  );
}
