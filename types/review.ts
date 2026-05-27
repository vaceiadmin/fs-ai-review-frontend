export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnnotationData {
  note: string;
  bbox: BBox;
}

export interface Location {
  page_no: number;
  annotation_data: AnnotationData[];
  url?: string;
}

export interface CorrectItem {
  id?: string;       // Canonical MongoDB ObjectId
  test_id?: string;  // Friendly label e.g. T1, T2 — enriched from test_cases collection by backend
  category?: string;
  name?: string;
  description?: string;
}

export interface CriticalError {
  id?: string;       // Canonical MongoDB ObjectId (set by backend sanitize_items)
  test_id?: string;  // Friendly label e.g. T1, T2 — enriched from test_cases collection by backend
  category?: string;
  name?: string;
  description?: string;
  result?: string;
  current?: string;
  expected?: string;
  reported_value?: number | string;
  expected_value?: number | string;
  difference?: number | string;
  location?: Location[];
}

export interface DisclosureBreach {
  id?: string;       // Canonical MongoDB ObjectId (set by backend sanitize_items)
  test_id?: string;  // Friendly label e.g. T1, T2 — enriched from test_cases collection by backend
  rule_id?: string;
  category?: string;
  name?: string;
  description?: string;
  result?: string;
  current?: string;
  expected?: string;
  location?: Location[];
}

export interface ReconciliationTable {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface SectionA {
  title: string;
  content?: string;
  items: CorrectItem[];
}

export interface SectionB {
  title: string;
  content?: string;
  items: CriticalError[];
}

export interface SectionC {
  title: string;
  content?: string;
  items: DisclosureBreach[];
}

export interface SectionD {
  title: string;
  content?: string;
  tables: Record<string, ReconciliationTable>;
}

export interface SectionE {
  verdict: string;
  executive_summary?: string;
  document_url?: string;
}

export type SectionFOverallStatus = "PASS" | "FAIL" | "INSUFFICIENT_DATA";

export interface SectionFCalculationStats {
  checks_run: number;
  checks_passed: number;
  checks_failed: number;
}

export type SectionFFindingSeverity = "critical" | "high" | "medium" | "warning" | "info" | "low";

export interface SectionFFinding {
  test_id: string;
  rule_id: string;
  severity: SectionFFindingSeverity;
  description: string;
  result: string;
  current: string;
  expected: string;
  reported_value: number | string;
  expected_value: number | string;
  difference: number | string;
  page_no?: number;
  location?: string;
  image_url?: string | null;
}

export interface SectionFCalculationStage {
  overall_status: SectionFOverallStatus;
  current_year?: string;
  stats: SectionFCalculationStats;
  findings: SectionFFinding[];
  explanation?: string;
}

export interface SectionFStages {
  extracted_fs_json?: Record<string, unknown>;
  classification?: Record<string, unknown>;
  calculation?: SectionFCalculationStage;
}

export interface SectionF {
  status: string;
  overall_status: SectionFOverallStatus;
  stages: SectionFStages;
}

export interface ReviewValidation {
  overall_status?: string;
  explanation?: string | null;
  findings?: SectionFFinding[];
}

export interface ReviewStatistics {
  checks_run?: number;
  checks_passed?: number;
  checks_failed?: number;
}

export interface ReviewResult {
  A: SectionA;
  B: SectionB;
  C: SectionC;
  D: SectionD;
  E: SectionE;
  F?: SectionF;
  validation?: ReviewValidation;
  statistics?: ReviewStatistics;
  passed_checks?: unknown[];
}

export interface TestResult {
  id: string;
  testCaseId: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  annotated_image_url?: string;
  extractedValues?: Record<string, unknown>;
}

export interface ReviewResponse {
  id: string;
  status: string;
  review_result: TestResult[];
  created_at: string;
}
