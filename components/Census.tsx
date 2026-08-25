"use client";

import type { CensusData } from "@/lib/types";
import { useLang, formatNumber, type Lang } from "@/lib/i18n";
import {
  BarList,
  BigStat,
  Container,
  Eyebrow,
  Source,
  Split,
  SplitBar,
  StatLedger,
  money,
} from "./Editorial";

/** Translations for category labels produced in lib/stats.ts. */
const LABELS: Record<string, { es: string; en: string }> = {
  "Under 18": { es: "Menores de 18", en: "Under 18" },
  "18 to 64": { es: "18 a 64", en: "18 to 64" },
  "65 and over": { es: "65 o más", en: "65 and over" },
  Male: { es: "Hombres", en: "Men" },
  Female: { es: "Mujeres", en: "Women" },
  "Less than 9th grade": { es: "Menos de 9no grado", en: "Less than 9th grade" },
  "High school graduate": { es: "Escuela superior", en: "High school graduate" },
  "Bachelor's degree": { es: "Bachillerato", en: "Bachelor's degree" },
  "Graduate / professional": { es: "Posgrado / profesional", en: "Graduate / professional" },
};
const label = (s: string, lang: Lang) => LABELS[s]?.[lang] ?? s;

const Aside = ({
  eyebrow,
  title,
  body,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone: "cream" | "ink" | "olive";
}) => (
  <>
    <Eyebrow className={tone === "cream" ? "text-moss" : "text-moss-2"}>{eyebrow}</Eyebrow>
    <h3 className="display text-4xl sm:text-5xl mt-6">{title}</h3>
    <p className={`mt-8 text-lg max-w-md ${tone === "cream" ? "text-ink/70" : "text-cream/70"}`}>
      {body}
    </p>
  </>
);

export const Census = ({ data }: { data: CensusData }) => {
  const { t, lang } = useLang();
  const { poverty, income, genderWage, employment, education, healthInsurance } = data;
  const year = poverty.year;
  const src = (table: string) =>
    `${t("Fuente", "Source")}: U.S. Census Bureau, ACS ${year} ${t("estimados de 1 año", "1-year estimates")}, ${t("tabla", "table")} ${table}.`;

  const gap = genderWage.femaleMedian - genderWage.maleMedian;
  const gapPct = genderWage.maleMedian
    ? Math.round((Math.abs(gap) / genderWage.maleMedian) * 1000) / 10
    : 0;

  return (
    <div id="census" className="scroll-mt-14">
      {/* Section opener */}
      <section className="bg-olive text-cream border-t border-olive-2">
        <Container className="py-20 lg:py-28">
          <Eyebrow className="text-moss-2">{t("Contexto", "Context")}</Eyebrow>
          <h2 className="display text-5xl sm:text-6xl lg:text-7xl mt-8 max-w-4xl">
            {t("Puerto Rico en cifras.", "Puerto Rico by the numbers.")}
          </h2>
          <p className="mt-8 text-xl text-cream/70 max-w-2xl">
            {t(
              "Los apagones no ocurren en un vacío. Estos datos del Censo de EE. UU. muestran la realidad económica de las comunidades que los viven.",
              "Outages don't happen in a vacuum. This U.S. Census data shows the economic reality of the communities living through them."
            )}
          </p>
        </Container>
      </section>

      {/* Poverty — cream */}
      <Split
        id="poverty"
        tone="cream"
        aside={
          <Aside
            tone="cream"
            eyebrow={t("Pobreza", "Poverty")}
            title={t("Cuatro de cada diez.", "Four in ten.")}
            body={t(
              "La tasa de pobreza en Puerto Rico es más del triple del promedio nacional de EE. UU. Los niños son los más afectados.",
              "Puerto Rico's poverty rate is more than triple the U.S. national average. Children are hit hardest."
            )}
          />
        }
      >
        <BigStat
          value={`${poverty.overallRate}%`}
          label={t("bajo el nivel de pobreza", "below the poverty line")}
          note={`${formatNumber(poverty.totalBelowPoverty)} ${t("de", "of")} ${formatNumber(poverty.totalPopulation)} ${t("personas", "people")}`}
          size="xl"
        />
        <div className="mt-14">
          <BarList
            max={100}
            items={poverty.groups.map((g) => ({
              label: label(g.label, lang),
              value: g.percentage,
              note: `${formatNumber(g.population)} ${t("personas", "people")}`,
            }))}
          />
        </div>
        <Source>{src("S1701")}</Source>
      </Split>

      {/* Income — ink */}
      <Split
        id="income"
        tone="ink"
        aside={
          <Aside
            tone="ink"
            eyebrow={t("Ingresos", "Income")}
            title={t("La mitad de los hogares vive con menos de esto.", "Half of households live on less than this.")}
            body={t(
              "El ingreso mediano por hogar en Puerto Rico es cerca de un tercio del de Estados Unidos. La distribución se concentra en los niveles más bajos.",
              "Puerto Rico's median household income is roughly a third of the U.S. figure. The distribution is concentrated at the bottom."
            )}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-0 sm:divide-x divide-ink-3">
          <BigStat value={money(income.medianIncome)} label={t("ingreso mediano", "median income")} muted="text-sky" size="lg" className="sm:pr-10" />
          <BigStat value={money(income.meanIncome)} label={t("ingreso promedio", "mean income")} muted="text-sky" size="lg" className="sm:pl-10" />
        </div>
        <p className="mt-6 text-sm text-moss-2">
          {formatNumber(income.totalHouseholds)} {t("hogares", "households")}
        </p>
        <div className="mt-14">
          <Eyebrow className="text-moss-2 mb-6">
            {t("Hogares por nivel de ingreso", "Households by income bracket")}
          </Eyebrow>
          <BarList
            max={100}
            items={income.brackets.map((b) => ({ label: b.label, value: b.percentage }))}
            track="bg-ink-3"
            fill="bg-sky"
            divider="border-ink-3"
            muted="text-sky"
          />
        </div>
        <Source>{src("S1901")}</Source>
      </Split>

      {/* Wages — cream */}
      <Split
        id="wages"
        tone="cream"
        aside={
          <Aside
            tone="cream"
            eyebrow={t("Brecha salarial", "Wage gap")}
            title={t("Lo que ganan hombres y mujeres.", "What men and women earn.")}
            body={t(
              "Ingresos medianos anuales de trabajadores a tiempo completo, todo el año.",
              "Median annual earnings for full-time, year-round workers."
            )}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-0 sm:divide-x divide-cream-3">
          <BigStat
            value={money(genderWage.maleMedian)}
            label={t("hombres", "men")}
            note={`${formatNumber(genderWage.maleWorkers)} ${t("trabajadores", "workers")}`}
            className="sm:pr-10"
          />
          <BigStat
            value={money(genderWage.femaleMedian)}
            label={t("mujeres", "women")}
            note={`${formatNumber(genderWage.femaleWorkers)} ${t("trabajadoras", "workers")}`}
            className="sm:pl-10"
          />
        </div>
        <div className="mt-14 border-t border-cream-3 pt-10">
          <BigStat
            value={`${gap >= 0 ? "+" : "−"}${money(Math.abs(gap))}`}
            label={
              gap >= 0
                ? t(`las mujeres ganan ${gapPct}% más`, `women earn ${gapPct}% more`)
                : t(`las mujeres ganan ${gapPct}% menos`, `women earn ${gapPct}% less`)
            }
            note={`${t("Mediana general", "Overall median")}: ${money(genderWage.overallMedian)}`}
            size="md"
          />
        </div>
        <Source>{src("B20017")}</Source>
      </Split>

      {/* Employment — olive */}
      <Split
        id="employment"
        tone="olive"
        aside={
          <Aside
            tone="olive"
            eyebrow={t("Empleo", "Employment")}
            title={t("Menos de la mitad participa.", "Fewer than half take part.")}
            body={t(
              `De ${formatNumber(employment.population16Plus)} personas de 16 años o más, la participación laboral sigue entre las más bajas de cualquier jurisdicción de EE. UU.`,
              `Of ${formatNumber(employment.population16Plus)} people aged 16 and over, labor force participation remains among the lowest of any U.S. jurisdiction.`
            )}
          />
        }
      >
        <StatLedger
          divider="divide-olive-2"
          muted="text-cream/60"
          items={[
            { value: `${employment.laborForceRate}%`, label: t("participación laboral", "labor force participation") },
            { value: `${employment.employmentRatio}%`, label: t("tasa de empleo", "employment-to-population ratio") },
            { value: `${employment.unemploymentRate}%`, label: t("desempleo", "unemployment") },
          ]}
        />
        <Source>{src("S2301")}</Source>
      </Split>

      {/* Education — cream */}
      <Split
        id="education"
        tone="cream"
        aside={
          <Aside
            tone="cream"
            eyebrow={t("Educación", "Education")}
            title={t("Nivel educativo alcanzado.", "Educational attainment.")}
            body={t(
              `Nivel más alto completado por ${formatNumber(education.population25Plus)} personas de 25 años o más.`,
              `Highest level completed by ${formatNumber(education.population25Plus)} people aged 25 and over.`
            )}
          />
        }
      >
        <BarList
          max={100}
          items={education.levels.map((l) => ({
            label: label(l.label, lang),
            value: l.percentage,
            note: `${formatNumber(l.count)} ${t("personas", "people")}`,
          }))}
        />
        <Source>{src("S1501")}</Source>
      </Split>

      {/* Health — ink */}
      <Split
        id="health"
        tone="ink"
        aside={
          <Aside
            tone="ink"
            eyebrow={t("Salud", "Health")}
            title={t("Cobertura de seguro médico.", "Health insurance coverage.")}
            body={t(
              "Población civil no institucionalizada con y sin seguro médico.",
              "Civilian noninstitutionalized population with and without health insurance."
            )}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-0 sm:divide-x divide-ink-3">
          <BigStat value={`${healthInsurance.insuredRate}%`} label={t("asegurados", "insured")} muted="text-sky" className="sm:pr-10" />
          <BigStat value={`${healthInsurance.uninsuredRate}%`} label={t("sin seguro", "uninsured")} muted="text-ember-2" className="sm:pl-10" />
        </div>
        <div className="mt-14">
          <SplitBar
            colorA="bg-sky"
            a={{ label: t("Asegurados", "Insured"), value: healthInsurance.insuredRate }}
            b={{ label: t("Sin seguro", "Uninsured"), value: healthInsurance.uninsuredRate }}
          />
        </div>
        <Source>{src("S2701")}</Source>
      </Split>
    </div>
  );
};
