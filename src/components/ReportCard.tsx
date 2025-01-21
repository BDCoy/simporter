import { Report } from "@/types";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import Link from "next/link";

// ReportCard Component Props
interface ReportCardProps {
  report: Report;
  handleFollow: (authorName: string) => void;
  isFollowing: boolean;
}

// Placeholder Thumbnail Component
const PlaceholderThumbnail = ({
  index,
  title,
}: {
  index: number;
  title: string;
}) => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-red-500",
  ];

  return (
    <div
      className={`aspect-[4/3] ${
        colors[index % colors.length]
      } relative flex items-center justify-center`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
        <span className="text-lg font-semibold mb-2">Slide {index + 1}</span>
        <span className="text-sm opacity-75">{title}</span>
      </div>
    </div>
  );
};

// ReportCard Component
const ReportCard = ({ report, handleFollow, isFollowing }: ReportCardProps) => {
  return (
    <Link href={`/reports/${report.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative rounded-t-lg overflow-hidden">
          <PlaceholderThumbnail index={report.id} title={report.title} />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{report.title}</h3>
          <p className="text-sm text-gray-500">{report.date}</p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">{report.likes}</span>
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{report.shares}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleFollow(report.author.name);
              }}
              className="ml-auto text-sm px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
