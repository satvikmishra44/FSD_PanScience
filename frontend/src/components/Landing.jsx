import Orb from "./backgrounds/Orb";
import { useNavigate } from "react-router-dom";

function Landing() {
    // const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-black overflow-hidden relative">

            <div className="w-full h-full absolute top-0 left-0 overflow-hidden pointer-events-auto">
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={false}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none text-white text-center px-4">
                <p className="geist font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                    PanManager
                </p>

                <p className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-300">
                    Managing Tasks Which Really Matter
                </p>

                <button
                    className="mt-8 cursor-pointer rounded-lg border border-zinc-600 bg-zinc-950 px-5 py-2 text-sm pointer-events-auto sm:text-base md:text-lg font-medium text-slate-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    // onClick={() => navigate('/docs')}
                >
                    <span className="text-slate-300/85">& Harness AI</span>
                </button>
            </div>
        </div>
    );
}

export default Landing;
