

export type PackItem = {
  id: string;
  text: string;
  done?: boolean; 
};

export type Packlist = {
  id: string;     
  title: string;
  items: PackItem[];
};

export type PacklistTemplate = {
  id: string;      
  title: string;
  items: PackItem[];
};
