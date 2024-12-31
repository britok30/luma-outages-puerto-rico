"use client";

import { Poverty } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PovertyComponentProps {
  povertyData: Poverty;
}

const PovertyData: React.FC<PovertyComponentProps> = ({ povertyData }) => {
  return (
    <div className="mt-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-blue-500 mb-8">
        Poverty in Puerto Rico {povertyData?.data[0]?.["ID Year"]}
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Overview of poverty levels across various age groups in Puerto Rico by
        gender. The figures represent populations living below the poverty level
        within the past 12 months.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {povertyData?.data.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle>Age: {item.Age}</CardTitle>
              <CardDescription>Gender: {item.Gender}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Poverty Population:{" "}
                <span className="font-medium">
                  {item["Poverty Population"].toLocaleString()}
                </span>
              </p>
              <p className="text-gray-600">
                Margin of Error (MOE):{" "}
                <span className="font-medium">
                  {item["Poverty Population Moe"].toLocaleString()}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Source</h4>
        <span className="text-xs inline-block mb-2">
          Name: {povertyData?.source[0].annotations.dataset_name}
        </span>

        <span className="text-xs">
          Description: {povertyData?.source[0].annotations.source_description}
        </span>
      </div>
    </div>
  );
};

export default PovertyData;
