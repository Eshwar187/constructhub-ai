import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ColorOption {
  name: string;
  brand: string;
  code: string;
  finish: string;
  cost_per_sqft: string;
}

interface RoomRecommendation {
  room_type: string;
  color_options: ColorOption[];
  techniques: string;
  maintenance: string;
}

interface PaintingRecommendationsProps {
  recommendations: {
    overall_theme: string;
    rooms: RoomRecommendation[];
    tips: string[];
  } | null;
}

const PaintingRecommendations: React.FC<PaintingRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations) {
    return null;
  }

  return (
    <div className="mt-8">
      <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Painting Recommendations</CardTitle>
          <CardDescription className="text-gray-300">
            AI-generated color, cost, and painting suggestions for your floor plan
          </CardDescription>
          <div className="mt-1 text-sm text-yellow-300">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Includes cost per square foot for each paint option
            </span>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="bg-purple-900/30 text-purple-200 border-purple-500/30">
              {recommendations.overall_theme}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {recommendations.rooms.map((room, index) => (
              <AccordionItem key={index} value={`room-${index}`} className="border-purple-500/20">
                <AccordionTrigger className="text-white hover:text-purple-300">
                  {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {room.color_options.map((option, optIndex) => (
                      <div key={optIndex} className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20"
                            style={{ backgroundColor: option.name.toLowerCase().includes('white') ? '#f8f8f8' :
                                    option.name.toLowerCase().includes('blue') ? '#a8c7fa' :
                                    option.name.toLowerCase().includes('green') ? '#a8e6cf' :
                                    option.name.toLowerCase().includes('pink') ? '#ffb6c1' :
                                    option.name.toLowerCase().includes('yellow') ? '#ffffb5' :
                                    option.name.toLowerCase().includes('gray') ? '#d3d3d3' :
                                    option.name.toLowerCase().includes('beige') ? '#f5f5dc' :
                                    option.name.toLowerCase().includes('brown') ? '#d2b48c' :
                                    option.name.toLowerCase().includes('lavender') ? '#e6e6fa' :
                                    option.name.toLowerCase().includes('cream') ? '#fffdd0' :
                                    option.name.toLowerCase().includes('taupe') ? '#b38b6d' : '#e0e0e0' }}
                          />
                          <h4 className="text-white font-medium">{option.name}</h4>
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p><span className="text-purple-300">Brand:</span> {option.brand}</p>
                          <p><span className="text-purple-300">Code:</span> {option.code}</p>
                          <p><span className="text-purple-300">Finish:</span> {option.finish}</p>
                          <p className="mt-2 font-medium text-base">
                            <span className="bg-purple-900/50 text-green-300 px-2 py-1 rounded-md">
                              <span className="text-yellow-300">Cost:</span> {option.cost_per_sqft}/sq.ft
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {room.techniques && (
                    <div className="mt-4">
                      <h4 className="text-purple-300 font-medium">Techniques</h4>
                      <p className="text-gray-300 text-sm">{room.techniques}</p>
                    </div>
                  )}
                  {room.maintenance && (
                    <div className="mt-2">
                      <h4 className="text-purple-300 font-medium">Maintenance</h4>
                      <p className="text-gray-300 text-sm">{room.maintenance}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}

            <AccordionItem value="tips" className="border-purple-500/20">
              <AccordionTrigger className="text-white hover:text-purple-300">
                General Painting Tips
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {recommendations.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaintingRecommendations;
