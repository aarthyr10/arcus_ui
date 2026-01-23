import { Eye, FileText, RefreshCw, CheckCircle, Clock, XCircle, Upload } from "lucide-react";

interface UploadItemProps {
  id: string; // 👈 add this
  name: string;
  date: string;
  status: "uploaded" | "pending" | "processed" | "failed";
  // status: string;
  onView: (id: string) => void;
}

const UploadItem = ({ id, name, date, status, onView }: UploadItemProps) => {
  // Dynamic status configuration
  const statusConfig = {
    uploaded: {
      label: "Uploaded", color: "#3B82F6",
      icon: Upload
    },
    processed: { label: "Processed", color: "#05DF72", icon: CheckCircle },
    pending: { label: "Pending", color: "#F59E0B", icon: Clock },
    failed: { label: "Failed", color: "#EF4444", icon: XCircle },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-start gap-3 w-full max-w-[363px] min-h-[148px] px-4 pt-4 pb-3 bg-[var(--primary-card-upload-bg)] hover:bg-white transition-colors border border-[#9AD8FB] hover:border-white rounded-[16.4px]">
      {/* Top section */}
      <div className="flex gap-3 w-full">
        <FileText className="w-5 h-5 text-[var(--primary-btn-color)] mt-1 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-normal text-[#1F2937] truncate">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{date}</p>

          <span className="inline-flex items-center gap-1 mt-2 px-4 py-1 text-xs font-medium rounded-full bg-white/30 border backdrop-blur-sm" style={{ borderColor: config.color, color: config.color }}>
            <config.icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>
      </div>

      {/* Buttons row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-[8px] w-full">
        <button className="flex items-center justify-center gap-2 w-full sm:w-[161.5px] h-[32px] text-white rounded-[10px] text-sm font-medium bg-[var(--primary-btn-color)] hover:bg-[var(--primary-btn-color)] transition-colors"
          onClick={() => onView(id)}
        >
          <Eye className="w-4 h-4" />
          View
        </button>

        <button className="flex items-center justify-center gap-2 w-full sm:w-[161.5px] h-[32px] bg-white border border-[#d1d5db] rounded-[10px] text-sm font-medium text-gray-600 hover:bg-[#f9fafb] transition-colors">
          <RefreshCw className="w-4 h-4" />
          Reuse
        </button>
      </div>
    </div>
  );
};

export default UploadItem;