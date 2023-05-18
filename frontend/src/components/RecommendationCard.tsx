import React from "react";

interface RecommendationCardProps {
  name: string;
  tags: string[];
  description: string;
}

export default function RecommendationCard({
  name,
  tags,
  description,
}: RecommendationCardProps) {
  return (
    <div className="mt-3 border-2 border-primary bg-dark-lightest w-full rounded-lg p-3 flex items-center justify-between">
      <div className="flex flex-col md:flex-row">
        <h1 className="mr-5 text-xl font-semibold text-background mb-3 md:mb-0">
          {name}
        </h1>
        <div className="flex items-center flex-wrap">
          {tags.map((tag) => (
            <div className="bg-accent rounded-lg px-2 py-1 mx-1 mb-2 md:mb-0">
              <p className="text-background text-sm">{tag}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-background w-96">{description}</p>
    </div>
  );
}
