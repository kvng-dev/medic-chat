import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const PageHeader = ({
  icon,
  title,
  backLink = "/",
  backLabel = "Back to Home",
}) => {
  return (
    <div className="flex flex-col justify-between mb-8 gap-12">
      <Link
        href={backLink}
        className="flex items-center text-muted-foreground hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backLabel}
      </Link>

      <div className="flex items-end gap-2">
        {icon && (
          <div className="text-emerald-400">
            {React.cloneElement(icon, {
              className: "h-10 md:h-12 w-10 md:w-12",
            })}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl  gradient-title">{title}</h1>
      </div>
    </div>
  );
};
export default PageHeader;
