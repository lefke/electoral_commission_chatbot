import React from 'react';
import { Disclaimers } from './ui/Disclaimers';

export const SidebarContent: React.FC = () => (
  <div className="flex flex-col h-full justify-end">
    <h3 className="pt-3 text-gray-500">Disclaimer</h3>
    <Disclaimers />
    <p className="text-sm">
      Built by <a href="https://www.campaignlab.uk">Campaign Lab</a>
    </p>
  </div>
);
