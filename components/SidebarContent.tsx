import React from 'react';
import { Disclaimers } from './ui/Disclaimers';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-full justify-between">
    <Title dark />
    <div>
      <h3 className="pt-3 text-white">Disclaimer</h3>
      <Disclaimers dark />
    </div>
  </div>
);

export const Title: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div
    className={`${
      dark ? 'text-white' : 'text-black'
    } flex flex-col pl-3 gap-0 lg:gap-3`}
  >
    <div className="pt-2">The (Unofficial) Electoral Commission Chatbot</div>
    <div className="text-xs pb-2">
      A{' '}
      <a
        className="hover:text-gray-300 italic"
        href="https://www.campaignlab.uk"
      >
        Campaign Lab
      </a>{' '}
      project
    </div>
  </div>
);
