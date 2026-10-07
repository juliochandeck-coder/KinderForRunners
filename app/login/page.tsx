import ClearCache from "./clear-cache";
import logo from "@/generator/logo.json";

const styles = `
.k-wrap{min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:radial-gradient(120% 90% at 85% 0%,#ef5026 0%,#3a1208 45%,#0b0503 100%);font-family:Barlow,system-ui,sans-serif;color:#fff;box-sizing:border-box}
.k-card{width:100%;max-width:380px;display:flex;flex-direction:column;gap:18px}
.k-card h1{font-family:"Bebas Neue",Impact,sans-serif;font-weight:400;font-size:64px;line-height:.85;margin:0;letter-spacing:.01em}
.k-logo{width:150px;height:auto;display:block}
.k-card p{margin:0;color:#e9d8d2;font-size:15px}
.k-card label{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#f1c9bc}
.k-card input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:13px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.35);color:#fff}
.k-card input:focus{outline:2px solid #ef5026;outline-offset:1px}
.k-card button{font:inherit;font-weight:700;font-size:16px;padding:13px;border:0;border-radius:8px;background:#ef5026;color:#fff;cursor:pointer}
.k-card button:focus-visible{outline:2px solid #fff;outline-offset:2px}
.k-err{background:rgba(255,255,255,.12);border-left:3px solid #ef5026;padding:10px 12px;border-radius:4px;font-size:14px}
`;

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const msg = e === "1" ? "Clave incorrecta. Intenta de nuevo." : e === "link" ? "Ese enlace de acceso no es válido. Pídele uno nuevo a Julio." : e === "config" ? "Falta configurar AUTH_SECRET y APP_USERS en Netlify." : null;
  return (
    <main className="k-wrap">
      <style>{styles}</style>
      <ClearCache />
      <form className="k-card" method="post" action="/api/login">
        <svg className="k-logo" viewBox="0 32 1078 1014" role="img" aria-label="Kinder for Runners">{(logo as string[]).map((d, i) => <path key={i} fill="#ef5026" d={d} />)}</svg>
        <h1>WORKOUTS</h1>
        <p>Generador privado de Kinder for Runners. Abre tu enlace de acceso personal y no tendrás que escribir nada; si no lo tienes a mano, usa tu clave.</p>
        {msg && <div className="k-err" role="alert">{msg}</div>}
        <label htmlFor="password">Clave</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
