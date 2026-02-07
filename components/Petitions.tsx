import React from "react";
import { ExternalLink } from "lucide-react";

export const Petitions = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Petitions | Peticiones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PetitionLink
          title="Cancelacion Contrato Luma Puerto Rico"
          url="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
        />
        <PetitionLink
          title="Protejamos las tierras de Puerto Rico"
          url="https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land?recruiter=1185529629&recruited_by_id=6b94ac90-8375-11eb-9f2b-69cd1d0deb8b&utm_source=share_petition&utm_medium=copylink&utm_campaign=petition_dashboard"
        />
        <PetitionLink
          title="Rebuild PR's Power Grid with Renewables, not Fossil Fuels"
          url="https://www.change.org/p/fema-rebuild-puerto-rico-s-power-grid-with-renewables-not-fossil-fuels"
        />
      </div>
      <div className="mt-4 text-center">
        <a
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.change.org/"
        >
          Explore more on Change.org
        </a>
      </div>
    </div>
  );
};

const PetitionLink = ({ title, url }: { title: string; url: string }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={url}
    className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-xs transition-all group"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
    </div>
  </a>
);

export default Petitions;
