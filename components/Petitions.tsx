import React from "react";

export const Petitions = () => {
  return (
    <div className="mt-10 flex flex-col">
      <h2 className="text-2xl md:text-4xl mb-2 text-blue-500">
        Petitions / Peticiones via{" "}
        <a
          className="underline"
          target="_blank"
          rel="no_referrer"
          href="https://www.change.org/"
        >
          @Change
        </a>
      </h2>
      <p className="text-gray-400 text-left text-md md:text-lg">
        <span className="font-bold text-white">
          Cancelacion Contrato Luma Puerto Rico
        </span>{" "}
        <a
          target="_blank"
          rel="no_referrer"
          className="hover:underline font-bold text-blue-500 mb-3 block text-xs md:text-sm"
          href="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
        >
          Source
        </a>
      </p>
      <p className="text-gray-400 text-left text-md md:text-lg">
        <span className="font-bold text-white">
          Protejamos las tierras de Puerto Rico
        </span>{" "}
        <a
          target="_blank"
          rel="no_referrer"
          className="hoverunderline font-bold text-blue-500 block text-xs md:text-sm"
          href="https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land?recruiter=1185529629&recruited_by_id=6b94ac90-8375-11eb-9f2b-69cd1d0deb8b&utm_source=share_petition&utm_medium=copylink&utm_campaign=petition_dashboard"
        >
          Source
        </a>
      </p>
    </div>
  );
};
