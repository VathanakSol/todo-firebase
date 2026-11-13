import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The pictures shown when a link to the site is shared (Facebook, Telegram, Slack, X...).
// There are two, both made at build time: Khmer first, because apps that show only one
// picture use the first, and Khmer is the site's default language; then English.
const size = { width: 1200, height: 630 };

export function generateImageMetadata() {
  return [
    { id: "km", alt: "កត់ទុក — បញ្ជីកិច្ចការផ្ទាល់ខ្លួន។ ទុកកន្លែងសម្រាប់អ្វីដែលសំខាន់។", size, contentType: "image/png" },
    { id: "en", alt: "Kot Tuk — a personal task manager. Make space for what matters.", size, contentType: "image/png" },
  ];
}

// The image generator below cannot shape Khmer script, so the Khmer picture is a file
// drawn by a real browser. Its source, and how to regenerate it, is in assets/og/og-km.html.
const khmerImage = await readFile(join(process.cwd(), "assets/og/og-km.png"));

// The generator supports flexbox only, and every element with several children needs display: flex.
const tasks = [
  { text: "Plan the week", done: true, color: "#c77664" },
  { text: "Write the report", done: true, color: "#c59a46" },
  { text: "Call grandma", done: false, color: "#83a88a" },
];

function CheckMark({ size: markSize }: { size: number }) {
  return (
    <svg width={markSize} height={markSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default async function Image({ id }: { id: Promise<string | number> }) {
  if ((await id) === "km") return new Response(new Uint8Array(khmerImage), { headers: { "Content-Type": "image/png" } });

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", backgroundColor: "#f5f4ef", backgroundImage: "linear-gradient(135deg, #f5f4ef 0%, #e9f1e7 55%, #d9e7d8 100%)", color: "#253029" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, backgroundColor: "#345f4c" }}>
              <CheckMark size={38} />
            </div>
            <div style={{ display: "flex", marginLeft: 20, fontSize: 44, fontWeight: 700 }}>Kot Tuk</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 56, fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2.5 }}>
            <div style={{ display: "flex" }}>Make space for</div>
            <div style={{ display: "flex", color: "#5c8268" }}>what matters.</div>
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#6f8475" }}>A personal task manager. A little progress, every day.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 400, padding: 30, borderRadius: 32, backgroundColor: "white", border: "2px solid #e6e9e1", boxShadow: "0 40px 80px -40px rgba(38, 65, 46, 0.45)" }}>
          {tasks.map((task, index) => (
            <div key={task.text} style={{ display: "flex", alignItems: "center", padding: "22px 0", borderTop: index === 0 ? "none" : "2px solid #f0f2ed" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 20, backgroundColor: task.done ? "#527c5e" : "white", border: task.done ? "3px solid #527c5e" : "3px solid #c8d5c8" }}>
                {task.done ? <CheckMark size={22} /> : null}
              </div>
              <div style={{ display: "flex", flex: 1, marginLeft: 20, fontSize: 28, color: task.done ? "#90a094" : "#303d34", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</div>
              <div style={{ display: "flex", width: 16, height: 16, borderRadius: 8, backgroundColor: task.color }} />
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
