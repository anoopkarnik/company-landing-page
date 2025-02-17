export interface FeatureWithDescriptionProps {
    title: string;
    href?: string;
    description: string;
  }

export interface FeaturesProps {
featuresWithDescription: FeatureWithDescriptionProps[];
featureList: string[];
}

export interface FeatureSectionProps extends FeaturesProps {
    heading: string;
    description: string;
}