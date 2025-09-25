export type CategoryKey = 'rockies' | 'coasts' | 'shield';

export type CategoryDef = {
  key: CategoryKey;
  label: string;
};

export type LocationItem = {
  id: string;
  category: CategoryKey;
  title: string;
  region: string;     
  access: string;     
  coords: string;       
  description: string;  
  imageKey: string;     
};
