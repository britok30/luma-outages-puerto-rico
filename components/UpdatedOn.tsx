import React from 'react';
import { getCurrentDate } from '../utils';

export const UpdatedOn = () => {
    return (
        <div className="text-xs mt-5 flex justify-center space-x-3">
            <a
                className="underline"
                href="https://miluma.lumapr.com/outages/outageMap"
                target="_blank"
                rel="no_referrer"
            >
                Original Data Source
            </a>
            <p className="font-light">{getCurrentDate()}</p>
        </div>
    );
};
