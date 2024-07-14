
import "@/styles/globals.css";

interface SummarizationProps {
  recordedText: string;
  onReset: () => void;
}

const Summarization: React.FC<SummarizationProps> = ({ recordedText, onReset }) => {
  return (
    <>
      <h2 className="text-gradient text-xl text-bold mb-4 text-center p-2">今日どうだった？</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-400 mb-2 font-bold text-center">医師向け</h3>
          <textarea
            className="w-full h-40 border border-none rounded p-2 text-slate-900"
            defaultValue={recordedText}
          />
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-400 mb-2 font-bold text-center">患者向け</h3>
          <textarea
            className="w-full h-40 border border-none rounded p-2 text-slate-900"
            defaultValue={recordedText}
          />
          <button className="mt-2 font-semibold text-xs bg-green-400 hover:bg-green-500 text-white py-1 px-3  rounded">LINE送信</button>
        </div>
      </div>
      </>
  );
};

export default Summarization;
