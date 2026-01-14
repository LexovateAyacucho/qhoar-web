import React from 'react';

export function MobileFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative mx-auto h-[750px] w-[370px] rounded-[3rem] border-8 border-gray-900 bg-gray-900 shadow-2xl">
            {/* Notch / Isla Dinámica */}
            <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black z-50"></div>

            {/* Botones laterales simulados */}
            <div className="absolute -right-[10px] top-24 h-16 w-[10px] rounded-r-lg bg-gray-800"></div>
            <div className="absolute -left-[10px] top-24 h-10 w-[10px] rounded-l-lg bg-gray-800"></div>
            <div className="absolute -left-[10px] top-40 h-16 w-[10px] rounded-l-lg bg-gray-800"></div>

            {/* Pantalla Real */}
            <div className="h-full w-full overflow-hidden rounded-[2.3rem] bg-white">
                <div className="h-full w-full overflow-y-auto scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
}