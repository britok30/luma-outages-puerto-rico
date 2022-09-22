import React from "react";
import Head from "next/head";

export const Seo = () => {
  const pageTitle = "Power Outages in Puerto Rico | Apagones en Puerto Rico";
  const pageDesc =
    "Apagon Puerto Rico tracks, records, and aggregates power outages across Puerto Rico. ApogonPuertoRico rastrea, registra y agrega cortes de energía en todo Puerto Rico.";
  const canonicalUrl = "https://apagonpuertorico.com";
  const twitterHandle = "@britoszn";

  return (
    <Head>
      <title>{pageTitle}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <meta content="Brito" name="author" />
      <meta name="theme-color" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={pageDesc} key="desc" />
      <meta
        name="keywords"
        content="Puerto Rico, el apagon, apagones, power outages, luma, hurricane, puerto rico"
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} key="ogdesc" />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://www.apagonpuertorico.com/"
        key="ogurl"
      />
      <meta
        property="og:image"
        content="https://www.apagonpuertorico.com/pr.jpg"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta key="twitter:site" name="twitter:site" content={twitterHandle} />
      <meta
        key="twitter:creator"
        name="twitter:creator"
        content={twitterHandle}
      />
      <meta
        name="twitter:image"
        content="https://www.apagonpuertorico.com/pr.jpg"
      />
      <link rel="canonical" key="canonical" href={canonicalUrl} />
    </Head>
  );
};
