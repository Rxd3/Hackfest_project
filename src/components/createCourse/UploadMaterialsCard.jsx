import { FileText, UploadCloud } from "lucide-react";
import { Button } from "../ui/Button";
import { CourseOptions } from "./CourseOptions";

export function UploadMaterialsCard({ onGenerate }) {
  return (
    <section className="soft-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-navy">
          <FileText size={21} />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-ink">Upload Course Materials</h2>
          <p className="mt-1 text-sm font-semibold text-muted">PDF, DOCX, PPTX, TXT, slides, or notes</p>
        </div>
      </div>

      <button
        type="button"
        className="focus-ring mt-6 flex min-h-[180px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-divider bg-gray-50 p-6 text-center transition hover:border-navy hover:bg-white"
      >
        <UploadCloud size={32} className="text-navy" />
        <span className="mt-4 block text-base font-extrabold text-ink">Drag & drop your files here</span>
        <span className="mt-1 block text-sm font-bold text-muted">or Browse Files</span>
      </button>

      <div className="mt-6">
        <CourseOptions />
      </div>

      <Button className="mt-7 w-full" onClick={onGenerate}>
        Generate Course
      </Button>
    </section>
  );
}
