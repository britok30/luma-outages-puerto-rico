import React from "react";

const HelpPR = () => {
  return (
    <div className="mt-10 flex flex-col text-lg justify-center items-center">
      <h2 className="text-2xl mb-2 text-red-400">
        Help Puerto Rico / Ayuda a Puerto Rico
      </h2>
      <div className="w-full md:w-2/3 text-left">
        <p className="mb-4">
          <a
            className="text-blue-500"
            href="https://www.instagram.com/p/Ciq7t-BsgI0/"
          >
            Brigada Solidaria del Oeste
          </a>{" "}
          recolecta donaciones de emergencia elementos esenciales que incluyen
          tabletas de purificación de agua, lámparas solares, agua filtros y
          botiquines de primeros auxilios.{" "}
        </p>
        <p className="mb-4">
          <a
            className="text-blue-500"
            href="http://www.puertoricancivicclub.org/"
          >
            Puerto Rican Civic Club
          </a>{" "}
          esta recaudando fondos para luces solares y generadores de gas.{" "}
        </p>
        <p className="mb-4">
          <a className="text-blue-500" href="https://en.tallersalud.com/">
            Taller Salud
          </a>
          , una organización sin fines de lucro, dirigida por mujeres con sede
          en Loíza, Puerto Rico, está aceptando donaciones de alimentos no
          perecederos, recipientes desechables, galones de agua, pañales para
          adultos y bebés, y más. El grupo también acepta donaciones en efectivo
          a través de PayPal y algunos elementos esenciales de socorro en casos
          de desastre, incluidos filtros de agua y linternas solares.
        </p>
        <p className="mb-4">
          <a className="text-blue-500" href="https://en.tallersalud.com/">
            Comedores Sociales de Puerto Rico
          </a>{" "}
          es un comedor comunitario con programas que combaten la inseguridad
          alimentaria en la isla.
        </p>
      </div>
    </div>
  );
};

export default HelpPR;
