import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TripsPage } from './pages/TripsPage';

function App() {
  return (
    <div className="min-h-screen bg-dark-950 font-sans text-zinc-200">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-x-hidden">
          {/* 
            For this MVP, we are directly rendering the TripsPage.
            In a full app, React Router would handle this switch.
          */}
          <TripsPage />
        </main>
      </div>
    </div>
  );
}

export default App;