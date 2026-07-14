import React from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaIndustry, FaGlobe, FaCircleInfo } from "react-icons/fa6";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { isValidUrl } from "./profileUtils";

/**
 * Client-only company card: name, organization, industry, website and a
 * business description.
 *
 * @param {object} props
 * @param {object} props.client - Normalised `client` sub-document.
 * @param {() => void} [props.onEdit] - Opens the edit modal.
 */
const CompanyCard = ({ client = {}, onEdit }) => {
  const hasContent = client.company || client.businessDescription || client.industry || client.website || client.organization;

  return (
    <SectionCard title="Company" subtitle="About the business" icon={FaBuilding} onEdit={onEdit} id="company">
      {!hasContent ? (
        <EmptyState icon={FaBuilding} title="No company details added yet" message="Add your company profile to attract the right freelancers." />
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{client.company || "—"}</h3>
            {client.organization && (
              <p className="text-sm text-slate-500">{client.organization}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {client.industry && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <FaIndustry className="h-3.5 w-3.5" /> {client.industry}
              </span>
            )}
            {isValidUrl(client.website) && (
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <FaGlobe className="h-3.5 w-3.5" /> Website
              </a>
            )}
          </div>

          {client.businessDescription && (
            <p className="flex gap-2 text-[15px] leading-relaxed text-slate-600">
              <FaCircleInfo className="mt-1 h-4 w-4 shrink-0 text-indigo-400" />
              {client.businessDescription}
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
};

export default CompanyCard;
