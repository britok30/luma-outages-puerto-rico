import type { Lang } from "./lang";
import type { Outage } from "./types";

export interface FaqItem {
  q: string;
  a: string;
}

const fmt = (n: number) => n.toLocaleString("en-US");

/** FAQ copy in both languages; the first answer is filled with live numbers when available. */
export const getFaq = (lang: Lang, outage?: Outage | null): FaqItem[] => {
  const t = outage?.totals;
  const live =
    t && typeof t.totalClientsWithoutService === "number"
      ? lang === "es"
        ? `Ahora mismo LUMA reporta ${fmt(t.totalClientsWithoutService)} clientes sin servicio (${t.totalPercentageWithoutService}% de ${fmt(t.totalClients)}). `
        : `Right now LUMA reports ${fmt(t.totalClientsWithoutService)} customers without service (${t.totalPercentageWithoutService}% of ${fmt(t.totalClients)}). `
      : "";

  if (lang === "es") {
    return [
      {
        q: "¿Hay apagón en Puerto Rico hoy?",
        a: `${live}Esta página muestra el estado en vivo de la red de LUMA: total de clientes sin luz, desglose por las siete regiones y un mapa. Se actualiza cada 5 minutos.`,
      },
      {
        q: "¿Qué es un relevo de carga?",
        a: "Un relevo de carga es un apagón rotativo que LUMA aplica cuando la generación disponible no alcanza para cubrir la demanda. Para evitar un colapso total del sistema, se desconectan sectores por turnos, normalmente de una a tres horas. Aquí se muestran como \"por relevo de carga\", separados de las averías y del mantenimiento planificado.",
      },
      {
        q: "¿Cuántos clientes están sin luz en mi región?",
        a: "La sección \"Por región\" lista las siete regiones operativas de LUMA (Arecibo, Bayamón, Caguas, Carolina, Mayagüez, Ponce y San Juan) ordenadas por porcentaje de clientes sin servicio, y el mapa las colorea por severidad. LUMA no publica datos por municipio con conteo de clientes.",
      },
      {
        q: "¿Cada cuánto se actualizan los datos?",
        a: "LUMA actualiza su sistema cada pocos minutos; esta página consulta la API de LUMA cada 5 minutos y guarda cada actualización nueva para construir el historial. La hora que aparece bajo el número principal es la última marca de tiempo publicada por LUMA, en hora de Puerto Rico (AST).",
      },
      {
        q: "¿De dónde salen los datos?",
        a: "Los apagones vienen de la API pública que alimenta el mapa oficial de LUMA (miluma.lumapr.com). La demanda, la reserva y la generación por planta vienen de la página System Overview de LUMA. Los datos demográficos vienen del U.S. Census Bureau (ACS 1-year). Este sitio no está afiliado a LUMA ni al Gobierno de Puerto Rico.",
      },
      {
        q: "¿Cómo reporto un apagón a LUMA?",
        a: "Por la app Mi LUMA, en miluma.lumapr.com, o llamando al 1-844-888-5862 (LUMA). Para emergencias con cables caídos, llama al 911.",
      },
    ];
  }
  return [
    {
      q: "Is there a power outage in Puerto Rico today?",
      a: `${live}This page shows the live state of LUMA's grid: total customers without power, a breakdown by the seven regions, and a map. It refreshes every 5 minutes.`,
    },
    {
      q: "What is load shedding (relevo de carga)?",
      a: "Load shedding is a rolling blackout LUMA applies when available generation can't cover demand. To avoid a full system collapse, sectors are disconnected in turns, usually for one to three hours. Here they appear as \"from load shedding\", separate from faults and planned maintenance.",
    },
    {
      q: "How many customers are without power in my region?",
      a: "The \"By region\" section lists LUMA's seven operating regions (Arecibo, Bayamón, Caguas, Carolina, Mayagüez, Ponce, and San Juan) ordered by share of customers without service, and the map colors them by severity. LUMA doesn't publish customer counts by municipality.",
    },
    {
      q: "How often is the data updated?",
      a: "LUMA updates its system every few minutes; this page polls LUMA's API every 5 minutes and stores every new update to build the history. The time under the headline number is LUMA's latest published timestamp, in Puerto Rico time (AST).",
    },
    {
      q: "Where does the data come from?",
      a: "Outages come from the public API behind LUMA's official map (miluma.lumapr.com). Demand, reserve, and generation by plant come from LUMA's System Overview page. Demographics come from the U.S. Census Bureau (ACS 1-year). This site is not affiliated with LUMA or the Government of Puerto Rico.",
    },
    {
      q: "How do I report an outage to LUMA?",
      a: "Through the Mi LUMA app, at miluma.lumapr.com, or by calling 1-844-888-5862 (LUMA). For emergencies with downed lines, call 911.",
    },
  ];
};
