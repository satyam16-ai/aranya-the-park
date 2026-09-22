import React from 'react';
import { ShieldCheck, Phone, MapPin } from 'lucide-react';
import { projectData } from '../../data/projectData';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#071510] text-[#C7CEC9] border-b border-[#C5A880]/20 text-[11px] font-sans py-2 px-4 sm:px-8 tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: MahaRERA Badge */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#C5A880] shrink-0" />
          <span className="text-stone-400">MahaRERA Reg. No.:</span>
          <a
            href={projectData.reraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DFCA9F] hover:text-white font-medium underline underline-offset-2 transition-colors"
          >
            {projectData.mahaRera}
          </a>
        </div>

        {/* Center: Location Pin */}
        <div className="hidden md:flex items-center gap-1.5 text-stone-400">
          <MapPin size={13} className="text-[#C5A880]" />
          <span>Behind Evershine Mall, Mindspace, Malad West</span>
        </div>

        {/* Right: Phone Direct & Joint Venture */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-stone-400">
            A Project by <strong className="text-white font-semibold">{projectData.jointVenture}</strong>
          </span>
          <a
            href={projectData.phoneRaw}
            className="flex items-center gap-1.5 text-[#DFCA9F] hover:text-white font-medium transition-colors"
          >
            <Phone size={12} className="text-[#C5A880]" />
            <span>{projectData.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
