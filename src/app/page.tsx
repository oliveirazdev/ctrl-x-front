import { ApiHealth } from "@/features/system/api-health";
import Link from "next/link";
import ui from "@/components/ui/ui.module.css";
import styles from "./page.module.css";
export default function HomePage() {
 return <div className={styles.content}>
 <section className={styles.introduction} aria-labelledby="titulo">
 <p className={ui.eyebrow}>Um espaço para cuidar</p><h1 id="titulo">Seu cuidado,<br />acompanhado de perto.</h1>
 <p className={styles.intro}>Cada etapa importa. Acesse seu espaço no Ctrl X e acompanhe a construção do seu histórico de saúde.</p>
 <div className={styles.actions}><Link className={ui.button} href="/login">Acessar meu espaço <span aria-hidden="true">→</span></Link><Link className={[ui.button, ui.secondary].join(" ")} href="/register">Criar minha conta</Link></div>
 <p className={styles.note}>Para pacientes e profissionais de saúde.</p></section>
 <aside className={styles.journey} aria-labelledby="continuidade"><p className={ui.eyebrow}>Saúde em continuidade</p><h2 id="continuidade">Pessoas no centro.<br />Cuidado em conexão.</h2>
 <ol className={styles.steps}>
 <li><span className={styles.stepNumber}>01</span><div><h3>Seu próprio espaço</h3><p>Acesso individual, com identificação do seu perfil.</p></div></li>
 <li><span className={styles.stepNumber}>02</span><div><h3>Uma relação de cuidado</h3><p>áreas distintas para pacientes e profissionais.</p></div></li>
 <li><span className={styles.stepNumber}>03</span><div><h3>Um histórico em construção</h3><p>Estamos preparando as próximas etapas do acompanhamento.</p></div></li>
 </ol></aside>
 <section className={styles.connection} aria-labelledby="conexao"><div><p className={ui.eyebrow}>Disponibilidade</p><h2 id="conexao">Conexão com o serviço</h2></div><ApiHealth /></section>
 </div>;
}
