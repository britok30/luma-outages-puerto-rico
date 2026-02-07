import React from "react";
import { ExternalLink } from "lucide-react";

const HelpPR = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Help Puerto Rico | Ayuda a Puerto Rico
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <HelpItem
          title="Foundation for Puerto Rico"
          href="https://www.foundationforpuertorico.org/"
          descriptionEs="promueve la resiliencia economica y el crecimiento, proporcionando recursos y entrenamiento para ayudar a las comunidades a reconstruirse de manera sostenible."
          descriptionEn="promotes economic resilience and growth by providing resources and training to help communities rebuild sustainably."
        />
        <HelpItem
          title="Friends of Puerto Rico"
          href="https://www.friendsofpuertorico.org/"
          descriptionEs="se enfoca en el empoderamiento economico, apoyando iniciativas empresariales con un enfoque en la juventud y las mujeres."
          descriptionEn="focuses on economic empowerment, supporting entrepreneurial initiatives with a focus on youth and women."
        />
        <HelpItem
          title="PRxPR Relief and Rebuild Fund"
          href="https://www.prxpr.org/"
          descriptionEs="un fondo de ayuda que canaliza el 100% de las donaciones hacia areas criticas como la seguridad alimentaria, agua potable y energia renovable."
          descriptionEn="a relief fund that directs 100% of donations to essential areas like food security, clean water, and renewable energy."
        />
        <HelpItem
          title="United Way of Puerto Rico"
          href="https://www.unitedwaypr.org/"
          descriptionEs="apoya el desarrollo comunitario a traves de salud, estabilidad financiera y educacion, conectando a las personas con recursos esenciales."
          descriptionEn="supports community development through health, financial stability, and education, connecting individuals to essential resources."
        />
        <HelpItem
          title="CAP Foundation (Fundacion CAP)"
          href="https://www.fundacioncap.org/"
          descriptionEs="brinda apoyo vital a pacientes jovenes de cancer en el Hospital Pediatrico de Puerto Rico, incluyendo equipos medicos y ayuda economica."
          descriptionEn="provides critical support for young cancer patients at Puerto Rico's Pediatric Hospital, including medical equipment and financial aid."
        />
        <HelpItem
          title="Together Puerto Rico"
          href="https://www.togetherpuertorico.com/"
          descriptionEs="ofrece suministros esenciales como filtros de agua y linternas solares, ademas de una respuesta coordinada durante desastres naturales."
          descriptionEn="provides essential supplies like water filters and solar lanterns and coordinates disaster response efforts during natural disasters."
        />
        <HelpItem
          title="Hispanic Federation"
          href="https://www.hispanicfederation.org/about-hispanic-federation/where-we-operate/puerto-rico/"
          descriptionEs="en Puerto Rico desde el Huracan Maria, reconstruye hogares, centros de salud y fincas, y coordina ayuda de emergencia."
          descriptionEn="on the ground since Hurricane Maria, rebuilds homes, health centers, and farms, and coordinates emergency relief."
        />
        <HelpItem
          title="SBP"
          href="https://www.sbpusa.org/puerto-rico/"
          descriptionEs="ha reconstruido mas hogares en Puerto Rico que cualquier otra organizacion, con construccion resistente a huracanes."
          descriptionEn="has rebuilt more homes in Puerto Rico than any other organization, with hurricane-resistant FORTIFIED construction."
        />
        <HelpItem
          title="All Hands and Hearts"
          href="https://allhandsandhearts.org/our-work/programs/puerto-rico-hurricane-relief"
          descriptionEs="restauro hogares e infraestructura comunitaria en Yabucoa y Barranquitas despues del Huracan Maria."
          descriptionEn="restored homes and community infrastructure in Yabucoa and Barranquitas after Hurricane Maria."
        />
        <HelpItem
          title="El Fondo Boricua"
          href="https://elfondoboricua.org/"
          descriptionEs="canaliza donaciones a organizaciones 501(c)(3) verificadas que realizan trabajo de ayuda en Puerto Rico."
          descriptionEn="routes donations to vetted 501(c)(3) nonprofits doing relief work across Puerto Rico."
        />
        <HelpItem
          title="Fundacion Comunitaria de PR"
          href="https://fcpr.org/"
          descriptionEs="mas de 35 anos en la isla, enfocada en energia renovable, agua potable, vivienda y educacion."
          descriptionEn="over 35 years on the island, focused on renewable energy, clean water, housing, and education."
        />
        <HelpItem
          title="Comedores Sociales de PR"
          href="https://www.comederossociales.org/"
          descriptionEs="cocinas comunitarias que luchan contra la inseguridad alimentaria en Puerto Rico, aceptan donaciones financieras."
          descriptionEn="community kitchens fighting food insecurity in Puerto Rico, accepting financial donations."
        />
      </div>
    </div>
  );
};

const HelpItem = ({
  title,
  href,
  descriptionEs,
  descriptionEn,
}: {
  title: string;
  href: string;
  descriptionEs: string;
  descriptionEn: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
    </div>
    <p className="text-sm text-gray-600 mb-1">{descriptionEn}</p>
    <p className="text-sm text-gray-400 italic">{descriptionEs}</p>
  </a>
);

export default HelpPR;
