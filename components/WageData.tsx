"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wages } from "@/lib/types";

export interface WageDataProps {
  wageData: Wages;
}

const WageData: React.FC<WageDataProps> = ({ wageData }) => {
  return (
    <div className="mt-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-blue-500 mb-8">
        Wage Distribution in Puerto Rico {wageData?.data[0]["ID Year"]}
      </h2>
      <p className="text-center text-gray-500 mb-6">
        This section presents an overview of wage distributions in Puerto Rico,
        broken down by income bins. Each card represents a population segment
        within a specified wage range.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {wageData.data.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle>Wage Bin: {item["Wage Bin"]}</CardTitle>
              <CardDescription>Year: {item.Year}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Total Population:{" "}
                <span className="font-medium">
                  {item["Total Population"].toLocaleString()}
                </span>
              </p>
              <p className="text-gray-600">
                Margin of Error (MOE):{" "}
                <span className="font-medium">
                  {item["Total Population MOE Appx"].toLocaleString()}
                </span>
              </p>
              <p className="text-gray-600">
                Record Count:{" "}
                <span className="font-medium">
                  {item["Record Count"].toLocaleString()}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Source</h4>
        <span className="text-xs inline-block mb-2">
          Name: {wageData?.source[0].annotations.dataset_name}
        </span>

        <span className="text-xs">
          Description: {wageData?.source[0].annotations.source_description}
        </span>
      </div>
    </div>
  );
};

export default WageData;
