"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { Loader2, AlertTriangle, File, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const ACCOUNTING_STANDARD_OPTIONS = ["IFRS", "GAPSME"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [accountingStandard, setAccountingStandard] = useState("GAPSME");
  
  const router = useRouter();
  const { credits, deductCredit } = useAuth();

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const queryParams = new URLSearchParams({
        countryCode: "MT",
        companyType: "PRIVATE",
        accountingStandard,
        regulator: "MFSA",
      }).toString();

      const response = await api.post(`/api/v1/upload?${queryParams}`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      deductCredit();
      const uploadId = data.id || data.uploadId || data.upload_id || data._id || (data.data && data.data.id);

      if (uploadId) {
        router.push(`/processing/${uploadId}`);
      } else if (typeof data === 'string' && data.length > 5) {
        router.push(`/processing/${data}`);
      }
    },
    onError: (error) => {
      console.error("Upload failed", error);
      toast.error("Upload failed. Please try again.");
    },
  });

  const handleUpload = () => {
    if (credits <= 0) {
      toast.error("You have used all your free credits.");
      return;
    }
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <PortalLayout title="Upload Statement" description="Upload a financial document for AI analysis">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="audit-card w-full p-8 border-dashed border-2 bg-sky-50/20"
        >
          <div className="max-w-lg mx-auto space-y-8">
            {/* Metadata Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Accounting Standard</label>
              <select 
                value={accountingStandard}
                onChange={(e) => setAccountingStandard(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                {ACCOUNTING_STANDARD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Upload Area */}
            <div className="text-center w-full">
              {!file ? (
                <div className="bg-white border-2 border-dashed border-sky-100 rounded-2xl p-10 relative hover:bg-sky-50/50 transition-colors group">
                   <div className="mb-4 flex justify-center">
                       <div className="relative">
                         <UploadCloud className="w-16 h-16 text-blue-300 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold bg-white rounded-md px-1 mt-1 group-hover:scale-110 transition-transform">
                           ↑
                         </div>
                       </div>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Select Financial Statements</h3>
                   
                   <div className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full [&>*]:h-full">
                      <Dropzone onFileSelect={setFile} selectedFile={null} onClear={() => {}} />
                   </div>
                   
                   <p className="text-sm font-medium text-slate-500 mt-2">
                     Drag & Drop files here or <span className="text-blue-600 font-bold">Browse</span>
                   </p>
                </div>
              ) : (
                <div className="bg-white border rounded-2xl p-8">
                   <div className="mb-6 flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                         <File className="w-8 h-8 text-blue-500" />
                       </div>
                       <span className="text-base font-semibold text-slate-700 max-w-full truncate px-4">{file.name}</span>
                       <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                   </div>
                   
                   <div className="flex justify-center gap-3 w-full">
                       <button 
                         onClick={() => setFile(null)}
                         className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                         disabled={uploadMutation.isPending}
                       >
                         Cancel
                       </button>
                       <button 
                         onClick={handleUpload}
                         disabled={uploadMutation.isPending || credits <= 0}
                         className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {uploadMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload Document"}
                       </button>
                   </div>
                </div>
              )}
            </div>

            {credits <= 0 && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                You have used all your free credits.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PortalLayout>
  );
}