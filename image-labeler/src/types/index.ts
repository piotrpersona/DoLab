export interface ImageMetadata {
  file_name: string;
  ground_truth: string;
}

export interface GroundTruth {
  gt_parse: Record<string, any>;
}

export interface AppState {
  currentImageIndex: number;
  images: string[];
  currentJson: string;
  metadata: ImageMetadata[];
} 