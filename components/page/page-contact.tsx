"use client";

import { faqs } from "@/lib/faq";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PageContact() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 py-4 px-4 sm:py-8 sm:px-6 lg:py-8 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* 왼쪽: FAQ */}
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="font-anyvid cursor-pointer rounded-lg border border-gray-200 px-4 py-4 hover:shadow-md transition-all duration-200 hover:border-brand/50"
            >
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <div className="flex items-center gap-3">
                    <Badge className="hidden sm:inline-flex text-xs shrink-0">
                      {faq.category}
                    </Badge>
                    <h3 className="text-sm text-muted-foreground transition-colors flex-1">
                      {faq.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
                  </div>
                </summary>

                <div className="pt-4 mt-4 border-t text-muted-foreground">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {faq.content}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* 오른쪽: 문의 폼 */}
        <div className="space-y-4 border border-gray-200 rounded-lg p-4"></div>
      </div>
    </div>
  );
}
