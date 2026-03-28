import axios from 'axios';

// The production refactor uses a Next.js API route as a proxy
const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface KeywordReport {
  matched_keywords: string[];
  missing_keywords: string[];
  match_rate: string;
}

export interface ProductionOptimizeResponse {
  success: boolean;
  job_id: string;
  initial_score: number;
  optimized_score: number;
  improvement: number;
  pdf_url: string;
  tex_url: string;
  tex_source: string;
  page_count: number;
  is_multi_page: boolean;
  report: KeywordReport;
}

/**
 * Unified Production Optimizer call.
 * This sends the file and JD to our Next.js API route,
 * which proxies it to the FastAPI backend.
 */
export const unifiedOptimize = async (file: File, jdText: string): Promise<ProductionOptimizeResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jdText);

  // We call our internal Next.js API route (/api/optimize)
  const response = await apiClient.post('/optimize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * One-Page Refinement call.
 */
export const refineToOnePage = async (jobId: string): Promise<ProductionOptimizeResponse> => {
  const formData = new FormData();
  formData.append('job_id', jobId);

  const response = await apiClient.post('/refine', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Support for manual recompilation (editing the LaTeX directly).
 * This still calls the backend directly (or we can proxy it too).
 */
export const recompilePdf = async (tex_source: string) => {
    // For manual recompile, we still use the backend directly for now
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await axios.post(`${backendUrl}/compile-pdf/`, { tex_source });
    return {
      pdf_url: `${backendUrl}${response.data.pdf_url}`,
      tex_source: response.data.tex_source
    };
};
