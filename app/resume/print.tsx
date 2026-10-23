"use client";

export default function PrintButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button type="button" onClick={() => window.print()}
      className="inline-flex items-center gap-2 hover:text-zinc-50 transition-colors">
      {icon} Save as PDF
    </button>
  );
}
