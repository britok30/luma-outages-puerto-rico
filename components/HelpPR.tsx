import React from "react";

const HelpPR = () => {
  return (
    <div className="mt-10 flex flex-col text-md items-center">
      <h2 className="text-2xl md:text-4xl mb-4 text-blue-500 text-center">
        Help Puerto Rico | Ayuda a Puerto Rico
      </h2>
      <div className="w-full md:w-2/3 lg:w-1/3 text-left space-y-6">
        <HelpItem
          title="Foundation for Puerto Rico"
          href="https://www.foundationforpuertorico.org/"
          descriptionEs="promueve la resiliencia económica y el crecimiento, proporcionando recursos y entrenamiento para ayudar a las comunidades a reconstruirse de manera sostenible."
          descriptionEn="promotes economic resilience and growth by providing resources and training to help communities rebuild sustainably."
        />

        <HelpItem
          title="Friends of Puerto Rico"
          href="https://www.friendsofpuertorico.org/"
          descriptionEs="se enfoca en el empoderamiento económico, apoyando iniciativas empresariales con un enfoque en la juventud y las mujeres."
          descriptionEn="focuses on economic empowerment, supporting entrepreneurial initiatives with a focus on youth and women."
        />

        <HelpItem
          title="PRxPR Relief and Rebuild Fund"
          href="https://www.prxpr.org/"
          descriptionEs="un fondo de ayuda que canaliza el 100% de las donaciones hacia áreas críticas como la seguridad alimentaria, agua potable y energía renovable."
          descriptionEn="a relief fund that directs 100% of donations to essential areas like food security, clean water, and renewable energy."
        />

        <HelpItem
          title="United Way of Puerto Rico"
          href="https://www.unitedwaypr.org/"
          descriptionEs="apoya el desarrollo comunitario a través de salud, estabilidad financiera y educación, conectando a las personas con recursos esenciales."
          descriptionEn="supports community development through health, financial stability, and education, connecting individuals to essential resources."
        />

        <HelpItem
          title="CAP Foundation (Fundación CAP)"
          href="https://www.fundacioncap.org/"
          descriptionEs="brinda apoyo vital a pacientes jóvenes de cáncer en el Hospital Pediátrico de Puerto Rico, incluyendo equipos médicos y ayuda económica."
          descriptionEn="provides critical support for young cancer patients at Puerto Rico’s Pediatric Hospital, including medical equipment and financial aid."
        />

        <HelpItem
          title="Together Puerto Rico"
          href="https://www.togetherpuertorico.com/"
          descriptionEs="ofrece suministros esenciales como filtros de agua y linternas solares, además de una respuesta coordinada durante desastres naturales."
          descriptionEn="provides essential supplies like water filters and solar lanterns and coordinates disaster response efforts during natural disasters."
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
  <div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-lg underline text-red-500 mb-4"
    >
      {title}
    </a>
    <p className="text-gray-600 mb-2">{descriptionEn}</p>
    <p className="text-gray-600 italic">{descriptionEs}</p>
  </div>
);

export default HelpPR;
