import React from "react";

export const Petitions = () => {
  return (
    <div className="mt-10 px-4 max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl mb-4 text-blue-500 text-center">
        Petitions | Peticiones
      </h2>
      <p className="text-lg md:text-xl text-gray-600 text-center mb-6">
        Show your support for Puerto Rico by signing these petitions to help
        bring about positive change.
      </p>
      <a
        className="underline text-lg md:text-xl text-blue-500 hover:text-blue-700 transition duration-200 mb-8 text-center"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.change.org/"
      >
        Explore more on Change.org
      </a>

      <div className="space-y-4 w-full">
        <PetitionLink
          title="Cancelacion Contrato Luma Puerto Rico"
          url="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
        />
        <PetitionLink
          title="Protejamos las tierras de Puerto Rico"
          url="https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land?recruiter=1185529629&recruited_by_id=6b94ac90-8375-11eb-9f2b-69cd1d0deb8b&utm_source=share_petition&utm_medium=copylink&utm_campaign=petition_dashboard"
        />
      </div>
    </div>
  );
};

const PetitionLink = ({ title, url }: { title: string; url: string }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={url}
    className="block font-semibold text-red-500 underline text-lg hover:text-red-700 transition duration-200 text-center"
  >
    {title}
  </a>
);

export default Petitions;
