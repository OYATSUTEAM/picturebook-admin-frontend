// ----------------------------------------------------------------------

export type IFileFilterValue = string | string[] | Date | null;

export type IFileFilters = {
  name: string;
  type: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  publishOptions: {
    value: string;
    label: string;
  }[];
  description: string;
  audioFiles: IFileManager[] | null;
  pdfFile: IPDFManager ;
  url: string;
  publish: string;
  price: number;
  totalFiles?: number;
  shared: IFileManager[] | [];
  modifiedAt: Date | number ;
  onChangePublish: (newValue: string) => void;

};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  modifiedAt: Date | number | string;
};



export type IPDFManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  url: string;
  preview: string;
  relativePath:string;
  modifiedAt: Date | number | string;
};

// export type IFile = IFileManager | IFolderManager;
export type IFile = IFolderManager;
