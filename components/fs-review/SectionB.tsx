"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { CriticalError, Location } from "@/types/review";
import { formatLabeledAmount } from "@/lib/formatNumber";
import { AlertTriangle } from "lucide-react";
import ReviewSection from "./ReviewSection";
import ImageAnnotation from "./ImageAnnotation";

export default function SectionB({ 
  items, 
  content, 
  onItemClick 
}: { 
  items: CriticalError[]; 
  content?: string;
  onItemClick?: (testId: string, location?: any) => void;
}) {
  return (
    <ReviewSection
      title="Critical Errors"
      titleColorClass="text-red-600"
      badgeColorClass="bg-red-600"
      count={items?.length || 0}
      content={content}
      items={items || []}
      emptyMessage="No critical errors found."
      emptyBgClass="bg-red-50/50"
      emptyBorderClass="border-red-100"
      renderItem={(err, idx) => (
        <AccordionItem 
          key={idx} 
          value={`Critical Errors-${idx}`}
          onClick={() => onItemClick?.(err.id || err.test_id || "", err.location?.[0])}
        >
          <AccordionTrigger>
            <div className="flex gap-3">
              <AlertTriangle className="text-red-500" size={18} />
              <div className="flex flex-col items-start text-left">
                <span className="group-hover:underline underline-offset-4">
                  {err.test_id
                    ? `${err.test_id} — ${err.name || err.result || ""}`
                    : err.name || err.result || `Unknown — ${(err.id || "").slice(0, 8)}`}
                </span>
              </div>
              {err.category && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded h-fit uppercase">
                  {err.category.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-sm space-y-4">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Description:</p>
              <p className="text-gray-600 leading-relaxed">{err.description}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-gray-800">Result:</p>
              
              {err.result && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-700 ">{err.result}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-bold text-red-800 text-xs uppercase tracking-wider mb-1">Current</p>
                  <p className="text-red-700">
                    {formatLabeledAmount("Found value", err.current, err.reported_value) ||
                      "No specific current value found."}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-1">Expected</p>
                  <p className="text-blue-700">
                    {formatLabeledAmount("Expected value", err.expected, err.expected_value) ||
                      "Standard requirement not met."}
                  </p>
                </div>
              </div>
            </div>

            {err.location && err.location.length > 0 && (
              <div className="mt-2 text-xs text-gray-500 italic">
                Related images are displayed on the right.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
    />
  );
}
