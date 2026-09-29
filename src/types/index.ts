export type ActiveTab = 'home' | 'tools' | 'about' | 'contact' | 'privacy' | 'help';
export type ToolId = 'photo20kb' | 'signature10kb' | 'passport35x45' | 'aadharpdf';

export interface ExamPreset {
  name: string;
  category: string;
  maxPhotoKB: number;
  minPhotoKB: number;
  photoDimensions: string;
  photoAspect: number;
  maxSignKB: number;
  minSignKB: number;
  signDimensions: string;
  requiresNameDate: boolean;
  notes: string;
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    name: 'SSC (CGL, CHSL, MTS, GD, CPO)',
    category: 'Staff Selection Commission',
    maxPhotoKB: 50,
    minPhotoKB: 20,
    photoDimensions: '3.5cm x 4.5cm (200x230 px)',
    photoAspect: 3.5 / 4.5,
    maxSignKB: 20,
    minSignKB: 10,
    signDimensions: '4.0cm x 2.0cm (140x60 px)',
    requiresNameDate: true,
    notes: 'Photo must not be older than 3 months. White background preferred.',
  },
  {
    name: 'UPSC (Civil Services, NDA, CDS)',
    category: 'Union Public Service Commission',
    maxPhotoKB: 300,
    minPhotoKB: 20,
    photoDimensions: '350 x 350 px minimum',
    photoAspect: 1,
    maxSignKB: 300,
    minSignKB: 20,
    signDimensions: '350 x 350 px',
    requiresNameDate: true,
    notes: 'Candidate name and date of photo taken must be clearly inscribed.',
  },
  {
    name: 'Railway RRB (NTPC, Group D, ALP)',
    category: 'Railway Recruitment Board',
    maxPhotoKB: 50,
    minPhotoKB: 20,
    photoDimensions: '35mm x 45mm (320x240 px)',
    photoAspect: 3.5 / 4.5,
    maxSignKB: 20,
    minSignKB: 10,
    signDimensions: '140 x 60 px',
    requiresNameDate: false,
    notes: 'Plain light/white background. Spectacles/cap strictly disallowed.',
  },
  {
    name: 'IBPS (PO, Clerk, SO, RRB)',
    category: 'Banking Personnel Selection',
    maxPhotoKB: 50,
    minPhotoKB: 20,
    photoDimensions: '4.5cm x 3.5cm (200x230 px)',
    photoAspect: 3.5 / 4.5,
    maxSignKB: 20,
    minSignKB: 10,
    signDimensions: '140 x 60 px (Black ink)',
    requiresNameDate: false,
    notes: 'Black ink pen signature only. Capital letters signature rejected.',
  },
  {
    name: 'State PSCs (UPPSC, BPSC, MPPSC)',
    category: 'State Public Service',
    maxPhotoKB: 50,
    minPhotoKB: 20,
    photoDimensions: '3.5cm x 4.5cm',
    photoAspect: 3.5 / 4.5,
    maxSignKB: 20,
    minSignKB: 10,
    signDimensions: '3.5cm x 1.5cm',
    requiresNameDate: true,
    notes: 'Strict 20KB-50KB constraint for online portal upload.',
  },
  {
    name: 'NTA (NEET, JEE Main, CUET)',
    category: 'National Testing Agency',
    maxPhotoKB: 200,
    minPhotoKB: 10,
    photoDimensions: '3.5cm x 4.5cm (80% face coverage)',
    photoAspect: 3.5 / 4.5,
    maxSignKB: 30,
    minSignKB: 4,
    signDimensions: '3.5cm x 1.5cm (Running handwriting)',
    requiresNameDate: true,
    notes: 'White background with candidate name and date of photo printed.',
  },
];
