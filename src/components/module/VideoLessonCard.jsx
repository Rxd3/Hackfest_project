import { Play, Youtube } from "lucide-react";
import { SectionCard } from "../ui/SectionCard";

export function VideoLessonCard({ video, moduleTitle }) {
  const embedUrl = video?.url?.includes("watch?v=") ? video.url.replace("watch?v=", "embed/") : "";

  return (
    <SectionCard>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-ink">Video Lesson</h2>
        <Youtube className="text-danger" size={24} />
      </div>
      <div className="mt-5 overflow-hidden rounded-[24px] bg-navy shadow-card">
        <div className="relative aspect-video">
          {embedUrl ? (
            <iframe
              title={video.title}
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(183,155,255,0.45),transparent_35%),radial-gradient(circle_at_72%_68%,rgba(236,255,50,0.35),transparent_30%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-navy shadow-soft">
                  <Play size={26} fill="currentColor" />
                </span>
                <p className="mt-5 px-5 text-lg font-extrabold">{moduleTitle || "Recommended video will appear here"}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-muted">
        {video ? `${video.title} by ${video.channel_title || "YouTube"}` : "Recommended videos load after YouTube API setup."}
      </p>
    </SectionCard>
  );
}
