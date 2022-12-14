import React from 'react';

export const Petitions = () => {
    return (
        <div className="mt-10 flex flex-col">
            <h2 className="text-2xl md:text-4xl mb-5 text-blue-500">
                Petitions | Peticiones <br />
                <a
                    className="underline text-xl md:text-2xl"
                    target="_blank"
                    rel="no_referrer"
                    href="https://www.change.org/"
                >
                    via Change
                </a>
            </h2>
            <a
                target="_blank"
                rel="no_referrer"
                className="font-bold text-red-400 underline mb-5 text-md"
                href="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
            >
                Cancelacion Contrato Luma Puerto Rico
            </a>{' '}
            <a
                target="_blank"
                rel="no_referrer"
                className="underline font-bold text-red-400 text-md"
                href="https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land?recruiter=1185529629&recruited_by_id=6b94ac90-8375-11eb-9f2b-69cd1d0deb8b&utm_source=share_petition&utm_medium=copylink&utm_campaign=petition_dashboard"
            >
                Protejamos las tierras de Puerto Rico
            </a>{' '}
        </div>
    );
};
