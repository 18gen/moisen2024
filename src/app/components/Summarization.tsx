import "@/styles/globals.css";
import SummarizeComponent from "./summarizeComponent";
import {Summaries} from "@/pages/api/summarize";

interface SummarizationProps {
  recordedText: string;
  summarizedText: Summaries;
  inputText: string;
  onReset: () => void;
}

const Summarization: React.FC<SummarizationProps> = ({ recordedText, summarizedText, inputText, onReset }) => {
  return (
    <>
      <h2 className="text-gradient text-xl text-bold mb-4 text-center p-2">「今日どうだった？」</h2>
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 bg-white p-4 rounded-2xl shadow w-full md:w-1/2">
          <h3 className="text-gray-400 mb-2 font-bold text-center">医師向け</h3>
          <textarea
            className="w-full h-40 border border-none rounded p-2 text-slate-900"
            defaultValue={summarizedText.forDoctor}
            readOnly
          />
        </div>
        <div className="flex-1 bg-white p-4 rounded-2xl shadow w-full md:w-1/2">
          <h3 className="text-gray-400 mb-2 font-bold text-center">患者向け</h3>
          <textarea
            className="w-full h-40 border border-none rounded p-2 text-slate-900"
            defaultValue={summarizedText.forPatientOrKeyPerson}
            readOnly
          />
        </div>
      </div>
    </>
  );
};

export default Summarization;
