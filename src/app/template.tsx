// Templates remount on every navigation (unlike layout.tsx, which persists),
// so this gives every route a fade/slide-in entrance without touching each
// page individually.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
