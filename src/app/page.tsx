import { ApiHealth } from "@/features/system/api-health";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.content}>
      <section aria-labelledby="titulo">
        <h1 id="titulo">Seu cuidado, acompanhado de perto.</h1>
        <p className={styles.intro}>
          O Ctrl X está sendo preparado para acompanhar sua saúde e reunir seu histórico de cuidados.
        </p>
      </section>
      <section className={styles.card} aria-labelledby="conexao">
        <h2 id="conexao">Conexão com o serviço</h2>
        <ApiHealth />
      </section>
    </div>
  );
}
